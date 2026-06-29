/**
 * Conservative SVG sanitiser for user uploads.
 * Strips scripts, event handlers, external references, foreign nodes, and
 * embedded raster <image> tags. Returns inline SVG markup safe to render
 * via dangerouslySetInnerHTML, or null if the input doesn't look like SVG.
 */
const ALLOWED_TAGS = new Set([
  "svg", "g", "path", "circle", "rect", "polygon", "polyline", "line",
  "ellipse", "defs", "title", "desc",
]);

const DISALLOWED_ATTR_PREFIXES = ["on"];
const DISALLOWED_ATTRS = new Set(["xlink:href", "href"]);

export interface SanitisedSvg {
  markup: string;
  bytes: number;
}

export function sanitiseSvg(input: string, maxBytes = 50_000): SanitisedSvg | null {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return null;
  if (!input || input.length > maxBytes * 4) return null;

  const trimmed = input.trim();
  if (!/<svg[\s>]/i.test(trimmed)) return null;

  const doc = new DOMParser().parseFromString(trimmed, "image/svg+xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) return null;

  const svg = doc.documentElement;
  if (!svg || svg.tagName.toLowerCase() !== "svg") return null;

  function walk(node: Element) {
    // Drop disallowed tags
    const tag = node.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      node.remove();
      return;
    }
    // Filter attributes
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value;
      if (DISALLOWED_ATTR_PREFIXES.some((p) => name.startsWith(p))) {
        node.removeAttribute(attr.name);
        continue;
      }
      if (DISALLOWED_ATTRS.has(name)) {
        node.removeAttribute(attr.name);
        continue;
      }
      if (/javascript:/i.test(value)) {
        node.removeAttribute(attr.name);
        continue;
      }
    }
    for (const child of Array.from(node.children)) walk(child);
  }
  walk(svg);

  // Ensure viewBox so we can scale freely
  if (!svg.getAttribute("viewBox")) {
    const w = svg.getAttribute("width") || "24";
    const h = svg.getAttribute("height") || "24";
    svg.setAttribute("viewBox", `0 0 ${parseFloat(w) || 24} ${parseFloat(h) || 24}`);
  }
  // Drop fixed width/height so CSS sizes it
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  // Force fill currentColor so the chosen neon color applies
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("stroke", "currentColor");

  const out = new XMLSerializer().serializeToString(svg);
  const bytes = new Blob([out]).size;
  if (bytes > maxBytes) return null;
  return { markup: out, bytes };
}
