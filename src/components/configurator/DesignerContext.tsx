import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Decoration,
  EditorSelection,
  NeonDesignConfig,
  TextLayer,
} from "@/lib/types";
import { decodeConfig } from "@/lib/share";

export const defaultConfig: NeonDesignConfig = {
  text: "Mudita",
  fontId: "pacifico",
  colorId: "pink",
  sizeId: "medium",
  outdoor: false,
  backboard: "transparent",
  mounting: "wall",
  dimmer: false,
  adapter: "tr",
  urgent: false,
  notes: "",
  background: "dark-room",
  decorations: [],
  textLayers: [],
  brightness: 100,
  flicker: true,
  zoom: 1,
  isLightOn: true,
  positionX: 0,
  positionY: 0,
  rotationDeg: 0,
  realSizeMode: false,
  showMeasurements: false,
  showBackboardBounds: false,
  showSafeArea: false,
  showSizeBadge: true,
};

type Action =
  | { type: "replace"; cfg: NeonDesignConfig };

function reducer(_state: NeonDesignConfig, action: Action): NeonDesignConfig {
  switch (action.type) {
    case "replace":
      return {
        ...defaultConfig,
        ...action.cfg,
        decorations: action.cfg.decorations ?? [],
        textLayers: action.cfg.textLayers ?? [],
      };
  }
}

export type LayerKind = "decoration" | "textLayer";

export type AlignDirection =
  | "left"
  | "centerH"
  | "right"
  | "top"
  | "centerV"
  | "bottom";

export type AlignReference = "page" | "first" | "last" | "biggest";



interface Ctx {
  config: NeonDesignConfig;
  update: (patch: Partial<NeonDesignConfig>) => void;
  replace: (cfg: NeonDesignConfig) => void;
  addDecoration: (decoration: Decoration) => void;
  updateDecoration: (id: string, patch: Partial<Decoration>) => void;
  removeDecoration: (id: string) => void;
  addTextLayer: (layer: TextLayer) => void;
  updateTextLayer: (id: string, patch: Partial<TextLayer>) => void;
  removeTextLayer: (id: string) => void;
  /** Reorder layers within their own array. delta: +1 forward, -1 back, +Inf to front, -Inf to back. */
  reorder: (kind: LayerKind, id: string, delta: number) => void;
  alignSelected: (dir: AlignDirection, reference?: AlignReference) => void;
  resetDesign: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selection: EditorSelection;
  setSelection: (sel: EditorSelection) => void;
}

const DesignerCtx = createContext<Ctx | null>(null);

const MAX_HISTORY = 60;

export function DesignerProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(reducer, defaultConfig);
  const [selection, setSelectionState] = useState<EditorSelection>({ kind: "text" });
  // Ordered history of recent selections (oldest..newest), used for align references.
  const selHistoryRef = useRef<EditorSelection[]>([{ kind: "text" }]);
  const setSelection = useCallback((sel: EditorSelection) => {
    setSelectionState(sel);
    const last = selHistoryRef.current[selHistoryRef.current.length - 1];
    const same =
      last &&
      last.kind === sel.kind &&
      (("id" in last ? last.id : undefined) === ("id" in sel ? sel.id : undefined));
    if (!same) {
      selHistoryRef.current.push(sel);
      if (selHistoryRef.current.length > 12) selHistoryRef.current.shift();
    }
  }, []);


  // history of snapshots
  const pastRef = useRef<NeonDesignConfig[]>([]);
  const futureRef = useRef<NeonDesignConfig[]>([]);
  const configRef = useRef(config);
  const [historyTick, setHistoryTick] = useState(0);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const commit = useCallback((next: NeonDesignConfig) => {
    pastRef.current.push(configRef.current);
    if (pastRef.current.length > MAX_HISTORY) pastRef.current.shift();
    futureRef.current = [];
    dispatch({ type: "replace", cfg: next });
    setHistoryTick((t) => t + 1);
  }, []);

  // Load from share URL once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const d = params.get("d");
    if (!d) return;
    const decoded = decodeConfig(d);
    if (decoded) dispatch({ type: "replace", cfg: decoded });
  }, []);

  const update = useCallback(
    (patch: Partial<NeonDesignConfig>) => commit({ ...configRef.current, ...patch }),
    [commit],
  );
  const replace = useCallback((cfg: NeonDesignConfig) => commit(cfg), [commit]);

  const addDecoration = useCallback(
    (decoration: Decoration) => {
      const next: NeonDesignConfig = {
        ...configRef.current,
        decorations: [...(configRef.current.decorations ?? []), decoration],
      };
      commit(next);
      setSelection({ kind: "decoration", id: decoration.id });
    },
    [commit],
  );

  const updateDecoration = useCallback(
    (id: string, patch: Partial<Decoration>) => {
      const next = {
        ...configRef.current,
        decorations: (configRef.current.decorations ?? []).map((d) =>
          d.id === id ? { ...d, ...patch } : d,
        ),
      };
      commit(next);
    },
    [commit],
  );

  const removeDecoration = useCallback(
    (id: string) => {
      commit({
        ...configRef.current,
        decorations: (configRef.current.decorations ?? []).filter((d) => d.id !== id),
      });
      setSelection({ kind: "text" });
    },
    [commit],
  );

  const addTextLayer = useCallback(
    (layer: TextLayer) => {
      commit({
        ...configRef.current,
        textLayers: [...(configRef.current.textLayers ?? []), layer],
      });
      setSelection({ kind: "textLayer", id: layer.id });
    },
    [commit],
  );

  const updateTextLayer = useCallback(
    (id: string, patch: Partial<TextLayer>) => {
      commit({
        ...configRef.current,
        textLayers: (configRef.current.textLayers ?? []).map((l) =>
          l.id === id ? { ...l, ...patch } : l,
        ),
      });
    },
    [commit],
  );

  const removeTextLayer = useCallback(
    (id: string) => {
      commit({
        ...configRef.current,
        textLayers: (configRef.current.textLayers ?? []).filter((l) => l.id !== id),
      });
      setSelection({ kind: "text" });
    },
    [commit],
  );

  const reorder = useCallback(
    (kind: LayerKind, id: string, delta: number) => {
      const cur = configRef.current;
      const key: "decorations" | "textLayers" =
        kind === "decoration" ? "decorations" : "textLayers";
      const arr = [...((cur[key] ?? []) as Array<{ id: string }>)];
      const idx = arr.findIndex((x) => x.id === id);
      if (idx < 0) return;
      const [item] = arr.splice(idx, 1);
      let target: number;
      if (delta === Infinity) target = arr.length;
      else if (delta === -Infinity) target = 0;
      else target = Math.max(0, Math.min(arr.length, idx + delta));
      arr.splice(target, 0, item);
      commit({ ...cur, [key]: arr } as NeonDesignConfig);
    },
    [commit],
  );

  const alignSelected = useCallback(
    (dir: AlignDirection) => {
      // Align to PAGE (canvas centre). Single-selection model: snap selected layer
      // to page edges/center using its x/y percent offsets (range -45..45).
      const EDGE = 40; // a small inset from canvas edge
      const cur = configRef.current;
      const sel = selection;
      const apply = (x: number | null, y: number | null) => {
        if (sel.kind === "decoration") {
          updateDecoration(sel.id, {
            ...(x !== null ? { x } : {}),
            ...(y !== null ? { y } : {}),
          });
        } else if (sel.kind === "textLayer") {
          updateTextLayer(sel.id, {
            ...(x !== null ? { x } : {}),
            ...(y !== null ? { y } : {}),
          });
        } else {
          // main text uses positionX/Y
          update({
            ...(x !== null ? { positionX: x } : {}),
            ...(y !== null ? { positionY: y } : {}),
          });
        }
      };
      switch (dir) {
        case "left":
          apply(-EDGE, null);
          break;
        case "centerH":
          apply(0, null);
          break;
        case "right":
          apply(EDGE, null);
          break;
        case "top":
          apply(null, -EDGE);
          break;
        case "centerV":
          apply(null, 0);
          break;
        case "bottom":
          apply(null, EDGE);
          break;
      }
      // remember the rest of `cur` so eslint doesn't complain
      void cur;
    },
    [selection, update, updateDecoration, updateTextLayer],
  );

  const resetDesign = useCallback(() => {
    commit({ ...defaultConfig });
    setSelection({ kind: "text" });
  }, [commit]);

  const undo = useCallback(() => {
    const prev = pastRef.current.pop();
    if (!prev) return;
    futureRef.current.push(configRef.current);
    dispatch({ type: "replace", cfg: prev });
    setHistoryTick((t) => t + 1);
  }, []);

  const redo = useCallback(() => {
    const next = futureRef.current.pop();
    if (!next) return;
    pastRef.current.push(configRef.current);
    dispatch({ type: "replace", cfg: next });
    setHistoryTick((t) => t + 1);
  }, []);

  // Cmd/Ctrl+Z / Shift for redo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  const value = useMemo<Ctx>(
    () => ({
      config,
      update,
      replace,
      addDecoration,
      updateDecoration,
      removeDecoration,
      addTextLayer,
      updateTextLayer,
      removeTextLayer,
      reorder,
      alignSelected,
      resetDesign,
      undo,
      redo,
      canUndo,
      canRedo,
      selection,
      setSelection,
    }),
    // historyTick included so canUndo/canRedo refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      config,
      update,
      replace,
      addDecoration,
      updateDecoration,
      removeDecoration,
      addTextLayer,
      updateTextLayer,
      removeTextLayer,
      reorder,
      alignSelected,
      resetDesign,
      undo,
      redo,
      selection,
      historyTick,
    ],
  );

  return <DesignerCtx.Provider value={value}>{children}</DesignerCtx.Provider>;
}

export function useDesigner() {
  const ctx = useContext(DesignerCtx);
  if (!ctx) throw new Error("useDesigner must be used inside DesignerProvider");
  return ctx;
}
