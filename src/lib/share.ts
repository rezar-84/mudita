import type { NeonDesignConfig } from "./types";

/**
 * Encode a design config to a URL-safe base64 string.
 * Strips heavy fields (customBackground data URL and any uploaded SVG markup
 * larger than ~2 KB) so share links stay sensible.
 */
export function encodeConfig(cfg: NeonDesignConfig): string {
  const { customBackground: _omitBg, decorations, ...rest } = cfg;
  const cleanDecorations = (decorations ?? []).map((d) => {
    if (d.source === "upload" && d.svgMarkup && d.svgMarkup.length > 2_000) {
      // Drop heavy uploaded SVGs from share links
      const { svgMarkup: _drop, ...keep } = d;
      return { ...keep, svgMarkup: undefined };
    }
    return d;
  });
  const payload = { ...rest, decorations: cleanDecorations };
  const json = JSON.stringify(payload);
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
