import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import type { NeonDesignConfig } from "@/lib/types";
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
};

type Action =
  | { type: "set"; patch: Partial<NeonDesignConfig> }
  | { type: "replace"; cfg: NeonDesignConfig };

function reducer(state: NeonDesignConfig, action: Action): NeonDesignConfig {
  switch (action.type) {
    case "set":
      return { ...state, ...action.patch };
    case "replace":
      // Merge with defaults so older shared URLs missing fields still work
      return { ...defaultConfig, ...action.cfg };
  }
}

interface Ctx {
  config: NeonDesignConfig;
  update: (patch: Partial<NeonDesignConfig>) => void;
  replace: (cfg: NeonDesignConfig) => void;
}

const DesignerCtx = createContext<Ctx | null>(null);

export function DesignerProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(reducer, defaultConfig, (init) => {
    if (typeof window === "undefined") return init;
    const params = new URLSearchParams(window.location.search);
    const d = params.get("d");
    if (d) {
      const decoded = decodeConfig(d);
      if (decoded) return { ...init, ...decoded };
    }
    return init;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
  }, [config]);

  return (
    <DesignerCtx.Provider
      value={{
        config,
        update: (patch) => dispatch({ type: "set", patch }),
        replace: (cfg) => dispatch({ type: "replace", cfg }),
      }}
    >
      {children}
    </DesignerCtx.Provider>
  );
}

export function useDesigner() {
  const ctx = useContext(DesignerCtx);
  if (!ctx) throw new Error("useDesigner must be used inside DesignerProvider");
  return ctx;
}
