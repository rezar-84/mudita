import type { NeonDesignConfig } from "./types";

export function encodeConfig(cfg: NeonDesignConfig): string {
  const json = JSON.stringify(cfg);
  if (typeof window === "undefined") return Buffer.from(json).toString("base64");
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeConfig(s: string): NeonDesignConfig | null {
  try {
    const json =
      typeof window === "undefined"
        ? Buffer.from(s, "base64").toString("utf-8")
        : decodeURIComponent(escape(atob(s)));
    return JSON.parse(json) as NeonDesignConfig;
  } catch {
    return null;
  }
}
