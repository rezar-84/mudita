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
    (dir: AlignDirection, reference: AlignReference = "page") => {
      // Resolve a layer (selection -> bounds in percent space). Main text has no
      // intrinsic size, so its half-extents are 0; layers use sizePct/2.
      const PAGE_HALF = 45; // canvas usable extent in % offset units
      const cur = configRef.current;

      type Bounds = { cx: number; cy: number; half: number } | null;
      const boundsOf = (sel: EditorSelection): Bounds => {
        if (sel.kind === "decoration") {
          const d = (cur.decorations ?? []).find((x) => x.id === sel.id);
          if (!d) return null;
          return { cx: d.x, cy: d.y, half: d.sizePct / 2 };
        }
        if (sel.kind === "textLayer") {
          const l = (cur.textLayers ?? []).find((x) => x.id === sel.id);
          if (!l) return null;
          return { cx: l.x, cy: l.y, half: l.sizePct / 2 };
        }
        if (sel.kind === "text") {
          return { cx: cur.positionX ?? 0, cy: cur.positionY ?? 0, half: 0 };
        }
        return null;
      };

      const sel = selection;

      // Expand multi-selection into a list of single-target selections.
      const targets: EditorSelection[] =
        sel.kind === "multi"
          ? sel.ids.map(
              (id, i) =>
                ({ kind: sel.kinds[i], id } as EditorSelection),
            )
          : [sel];

      // Resolve reference bounds once (shared across all targets).
      const resolveRef = (excludeIds: Set<string>): Bounds => {
        if (reference === "page") return { cx: 0, cy: 0, half: PAGE_HALF };
        if (reference === "biggest") {
          const all: Array<{ sel: EditorSelection; size: number }> = [
            ...(cur.decorations ?? []).map((d) => ({
              sel: { kind: "decoration", id: d.id } as EditorSelection,
              size: d.sizePct,
            })),
            ...(cur.textLayers ?? []).map((l) => ({
              sel: { kind: "textLayer", id: l.id } as EditorSelection,
              size: l.sizePct,
            })),
          ].filter((x) => ("id" in x.sel ? !excludeIds.has(x.sel.id) : true));
          if (!all.length) return { cx: 0, cy: 0, half: PAGE_HALF };
          all.sort((a, b) => b.size - a.size);
          return boundsOf(all[0].sel);
        }
        // first / last selected
        const hist = selHistoryRef.current.filter((s) => {
          if ("id" in s) return !excludeIds.has(s.id);
          return s.kind !== "multi";
        });
        const target = reference === "first" ? hist[0] : hist[hist.length - 1];
        return target ? boundsOf(target) : null;
      };

      const excludeIds = new Set<string>(
        targets.flatMap((t) => ("id" in t ? [t.id] : [])),
      );
      let refBounds = resolveRef(excludeIds) ?? { cx: 0, cy: 0, half: PAGE_HALF };
      // For multi-select with single-layer references, also fall back to page
      // if reference resolution produced no usable bounds.
      if (!refBounds) refBounds = { cx: 0, cy: 0, half: PAGE_HALF };

      const clamp = (n: number) => Math.max(-PAGE_HALF, Math.min(PAGE_HALF, n));

      // Apply alignment to each target.
      let nextCur = cur;
      for (const t of targets) {
        const b = boundsOf(t);
        if (!b) continue;
        let nextX: number | null = null;
        let nextY: number | null = null;
        switch (dir) {
          case "left":
            nextX = clamp(refBounds.cx - refBounds.half + b.half);
            break;
          case "centerH":
            nextX = clamp(refBounds.cx);
            break;
          case "right":
            nextX = clamp(refBounds.cx + refBounds.half - b.half);
            break;
          case "top":
            nextY = clamp(refBounds.cy - refBounds.half + b.half);
            break;
          case "centerV":
            nextY = clamp(refBounds.cy);
            break;
          case "bottom":
            nextY = clamp(refBounds.cy + refBounds.half - b.half);
            break;
        }

        if (t.kind === "decoration") {
          nextCur = {
            ...nextCur,
            decorations: (nextCur.decorations ?? []).map((d) =>
              d.id === t.id
                ? {
                    ...d,
                    ...(nextX !== null ? { x: nextX } : {}),
                    ...(nextY !== null ? { y: nextY } : {}),
                  }
                : d,
            ),
          };
        } else if (t.kind === "textLayer") {
          nextCur = {
            ...nextCur,
            textLayers: (nextCur.textLayers ?? []).map((l) =>
              l.id === t.id
                ? {
                    ...l,
                    ...(nextX !== null ? { x: nextX } : {}),
                    ...(nextY !== null ? { y: nextY } : {}),
                  }
                : l,
            ),
          };
        } else if (t.kind === "text") {
          nextCur = {
            ...nextCur,
            ...(nextX !== null ? { positionX: nextX } : {}),
            ...(nextY !== null ? { positionY: nextY } : {}),
          };
        }
      }
      commit(nextCur);
    },
    [selection, commit],
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
