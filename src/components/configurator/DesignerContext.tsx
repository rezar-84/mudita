import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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
  | { type: "set"; patch: Partial<NeonDesignConfig> }
  | { type: "replace"; cfg: NeonDesignConfig }
  | { type: "addDecoration"; decoration: Decoration }
  | { type: "updateDecoration"; id: string; patch: Partial<Decoration> }
  | { type: "removeDecoration"; id: string }
  | { type: "addTextLayer"; layer: TextLayer }
  | { type: "updateTextLayer"; id: string; patch: Partial<TextLayer> }
  | { type: "removeTextLayer"; id: string };

function reducer(state: NeonDesignConfig, action: Action): NeonDesignConfig {
  switch (action.type) {
    case "set":
      return { ...state, ...action.patch };
    case "replace":
      return {
        ...defaultConfig,
        ...action.cfg,
        decorations: action.cfg.decorations ?? [],
        textLayers: action.cfg.textLayers ?? [],
      };
    case "addDecoration":
      return { ...state, decorations: [...(state.decorations ?? []), action.decoration] };
    case "updateDecoration":
      return {
        ...state,
        decorations: (state.decorations ?? []).map((d) =>
          d.id === action.id ? { ...d, ...action.patch } : d,
        ),
      };
    case "removeDecoration":
      return {
        ...state,
        decorations: (state.decorations ?? []).filter((d) => d.id !== action.id),
      };
    case "addTextLayer":
      return { ...state, textLayers: [...(state.textLayers ?? []), action.layer] };
    case "updateTextLayer":
      return {
        ...state,
        textLayers: (state.textLayers ?? []).map((l) =>
          l.id === action.id ? { ...l, ...action.patch } : l,
        ),
      };
    case "removeTextLayer":
      return {
        ...state,
        textLayers: (state.textLayers ?? []).filter((l) => l.id !== action.id),
      };
  }
}

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
  selection: EditorSelection;
  setSelection: (sel: EditorSelection) => void;
}

const DesignerCtx = createContext<Ctx | null>(null);

export function DesignerProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(reducer, defaultConfig);
  const [selection, setSelection] = useState<EditorSelection>({ kind: "text" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const d = params.get("d");
    if (!d) return;
    const decoded = decodeConfig(d);
    if (decoded) dispatch({ type: "replace", cfg: decoded });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback((patch: Partial<NeonDesignConfig>) => dispatch({ type: "set", patch }), []);
  const replace = useCallback((cfg: NeonDesignConfig) => dispatch({ type: "replace", cfg }), []);
  const addDecoration = useCallback((decoration: Decoration) => {
    dispatch({ type: "addDecoration", decoration });
    setSelection({ kind: "decoration", id: decoration.id });
  }, []);
  const updateDecoration = useCallback(
    (id: string, patch: Partial<Decoration>) => dispatch({ type: "updateDecoration", id, patch }),
    [],
  );
  const removeDecoration = useCallback((id: string) => {
    dispatch({ type: "removeDecoration", id });
    setSelection({ kind: "text" });
  }, []);
  const addTextLayer = useCallback((layer: TextLayer) => {
    dispatch({ type: "addTextLayer", layer });
    setSelection({ kind: "textLayer", id: layer.id });
  }, []);
  const updateTextLayer = useCallback(
    (id: string, patch: Partial<TextLayer>) => dispatch({ type: "updateTextLayer", id, patch }),
    [],
  );
  const removeTextLayer = useCallback((id: string) => {
    dispatch({ type: "removeTextLayer", id });
    setSelection({ kind: "text" });
  }, []);

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
      selection,
      setSelection,
    }),
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
      selection,
    ],
  );

  return <DesignerCtx.Provider value={value}>{children}</DesignerCtx.Provider>;
}

export function useDesigner() {
  const ctx = useContext(DesignerCtx);
  if (!ctx) throw new Error("useDesigner must be used inside DesignerProvider");
  return ctx;
}
