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
  background: "brick",
};

type Action =
  | { type: "set"; patch: Partial<NeonDesignConfig> }
  | { type: "replace"; cfg: NeonDesignConfig };

function reducer(state: NeonDesignConfig, action: Action): NeonDesignConfig {
  switch (action.type) {
    case "set":
      return { ...state, ...action.patch };
    case "replace":
      return action.cfg;
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

  // sync URL when config changes (debounced via animation frame)
  useEffect(() => {
    if (typeof window === "undefined") return;
    // no-op intentionally; share button writes URL on demand
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
