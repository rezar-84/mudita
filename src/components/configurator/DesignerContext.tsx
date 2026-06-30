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
import { toast } from "sonner";

const BASE_TEXT_ID = "base";

export const defaultConfig: NeonDesignConfig = {
  text: "",
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
  textLayers: [
    {
      id: BASE_TEXT_ID,
      text: "Mudita",
      fontId: "pacifico",
      colorId: "pink",
      sizePct: 22,
      x: 0,
      y: 0,
      rotation: 0,
    },
  ],
  brightness: 100,
  flicker: true,
  zoom: 1,
  isLightOn: true,
  realSizeMode: false,
  showMeasurements: false,
  showBackboardBounds: false,
  showSafeArea: false,
  showSizeBadge: true,
};

type Action =
  | { type: "replace"; cfg: NeonDesignConfig };

/** Migrate legacy share-URL or saved configs (which had a global `text`) into the layer model. */
function migrateConfig(cfg: NeonDesignConfig): NeonDesignConfig {
  const layers: TextLayer[] = cfg.textLayers ? [...cfg.textLayers] : [];
  const hasBase = layers.some((l) => l.id === BASE_TEXT_ID);
  const legacyText = (cfg.text ?? "").trim();
  if (!hasBase && legacyText) {
    layers.unshift({
      id: BASE_TEXT_ID,
      text: cfg.text ?? "",
      fontId: cfg.fontId ?? defaultConfig.fontId,
      colorId: cfg.colorId ?? defaultConfig.colorId,
      sizePct: 22,
      x: cfg.positionX ?? 0,
      y: cfg.positionY ?? 0,
      rotation: cfg.rotationDeg ?? 0,
    });
  }
  return {
    ...defaultConfig,
    ...cfg,
    text: "",
    decorations: cfg.decorations ?? [],
    textLayers: layers,
  };
}

function reducer(_state: NeonDesignConfig, action: Action): NeonDesignConfig {
  switch (action.type) {
    case "replace":
      return migrateConfig(action.cfg);
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

export type AlignmentGuide = {
  dir: AlignDirection;
  reference: AlignReference;
  ref: { cx: number; cy: number; half: number };
  ts: number;
};

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
  /** Delete currently selected layer(s), honoring the at-least-one-visible guard. */
  deleteSelection: () => void;
  resetDesign: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selection: EditorSelection;
  setSelection: (sel: EditorSelection) => void;
  /** Most recent alignment reference, briefly shown as a guideline overlay. Null when no overlay should render. */
  alignmentGuide: AlignmentGuide | null;
}

const DesignerCtx = createContext<Ctx | null>(null);

const MAX_HISTORY = 60;

export function DesignerProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(reducer, defaultConfig);
  const initialSel: EditorSelection = { kind: "textLayer", id: BASE_TEXT_ID };
  const [selection, setSelectionState] = useState<EditorSelection>(initialSel);
  // Ordered history of recent selections (oldest..newest), used for align references.
  const selHistoryRef = useRef<EditorSelection[]>([initialSel]);
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

  // Transient alignment guideline overlay.
  const [alignmentGuide, setAlignmentGuide] = useState<AlignmentGuide | null>(null);
  const alignGuideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashAlignmentGuide = useCallback((g: AlignmentGuide) => {
    setAlignmentGuide(g);
    if (alignGuideTimerRef.current) clearTimeout(alignGuideTimerRef.current);
    alignGuideTimerRef.current = setTimeout(() => setAlignmentGuide(null), 900);
  }, []);
  useEffect(() => () => {
    if (alignGuideTimerRef.current) clearTimeout(alignGuideTimerRef.current);
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

  /** Count of visible (non-hidden) layers, used to prevent zero-layer designs. */
  const visibleLayerCount = (cfg: NeonDesignConfig) =>
    (cfg.textLayers ?? []).filter((l) => !l.hidden).length +
    (cfg.decorations ?? []).filter((d) => !d.hidden).length;

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
      const cur = configRef.current;
      const filtered = (cur.decorations ?? []).filter((d) => d.id !== id);
      const nextCfg: NeonDesignConfig = { ...cur, decorations: filtered };
      if (visibleLayerCount(nextCfg) === 0) {
        toast.error("Tasarımda en az bir görünür katman olmalı.");
        return;
      }
      commit(nextCfg);
      setSelection({ kind: "canvas" });
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
      const cur = configRef.current;
      const filtered = (cur.textLayers ?? []).filter((l) => l.id !== id);
      const nextCfg: NeonDesignConfig = { ...cur, textLayers: filtered };
      if (visibleLayerCount(nextCfg) === 0) {
        toast.error("Tasarımda en az bir görünür katman olmalı.");
        return;
      }
      commit(nextCfg);
      setSelection({ kind: "canvas" });
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
        }
      }
      commit(nextCur);
      flashAlignmentGuide({ dir, reference, ref: refBounds, ts: Date.now() });
    },
    [selection, commit, flashAlignmentGuide],
  );

  const deleteSelection = useCallback(() => {
    const cur = configRef.current;
    const sel = selection;
    let ids: string[] = [];
    let kinds: ("decoration" | "textLayer")[] = [];
    if (sel.kind === "decoration" || sel.kind === "textLayer") {
      ids = [sel.id];
      kinds = [sel.kind];
    } else if (sel.kind === "multi") {
      ids = [...sel.ids];
      kinds = [...sel.kinds];
    } else {
      return;
    }
    const decoIds = new Set(ids.filter((_, i) => kinds[i] === "decoration"));
    const textIds = new Set(ids.filter((_, i) => kinds[i] === "textLayer"));
    const nextDecos = (cur.decorations ?? []).filter((d) => !decoIds.has(d.id));
    const nextTexts = (cur.textLayers ?? []).filter((l) => !textIds.has(l.id));
    const nextCfg: NeonDesignConfig = {
      ...cur,
      decorations: nextDecos,
      textLayers: nextTexts,
    };
    if (visibleLayerCount(nextCfg) === 0) {
      toast.error("Tasarımda en az bir görünür katman olmalı.");
      return;
    }
    commit(nextCfg);
    setSelection({ kind: "canvas" });
  }, [selection, commit, setSelection]);


  const resetDesign = useCallback(() => {
    commit({ ...defaultConfig });
    setSelection({ kind: "textLayer", id: BASE_TEXT_ID });
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
      } else if (e.key === "Delete" || e.key === "Backspace") {
        // Only act when a layer is selected; ignore on canvas/none to avoid
        // hijacking browser back navigation on Backspace.
        const sel = selection;
        if (
          sel.kind === "decoration" ||
          sel.kind === "textLayer" ||
          sel.kind === "multi"
        ) {
          e.preventDefault();
          deleteSelection();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, deleteSelection, selection]);

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
      deleteSelection,
      resetDesign,
      undo,
      redo,
      canUndo,
      canRedo,
      selection,
      setSelection,
      alignmentGuide,
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
      deleteSelection,
      resetDesign,
      undo,
      redo,
      selection,
      alignmentGuide,
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
