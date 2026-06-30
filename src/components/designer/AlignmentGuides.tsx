import { useDesigner } from "@/components/configurator/DesignerContext";

/**
 * Briefly renders the reference bounds + the alignment line used by the most
 * recent align/distribute action so users can confirm what their layers
 * snapped against.
 */
export function AlignmentGuides() {
  const { alignmentGuide } = useDesigner();
  if (!alignmentGuide) return null;
  const { dir, ref, reference } = alignmentGuide;

  // Coordinate mapping: layer x/y are percent offsets from center
  // (-45..45 ≈ canvas edges), CSS uses 50 + value.
  const left = 50 + (ref.cx - ref.half);
  const right = 50 + (ref.cx + ref.half);
  const top = 50 + (ref.cy - ref.half);
  const bottom = 50 + (ref.cy + ref.half);
  const cxPct = 50 + ref.cx;
  const cyPct = 50 + ref.cy;

  const isHorizontal = dir === "left" || dir === "centerH" || dir === "right";
  const lineXPct =
    dir === "left" ? left : dir === "right" ? right : cxPct;
  const lineYPct =
    dir === "top" ? top : dir === "bottom" ? bottom : cyPct;

  const guideColor = "rgb(34 211 238)"; // neon cyan
  const labelText =
    reference === "page"
      ? "Sayfa / Page"
      : reference === "biggest"
        ? "En büyük / Biggest"
        : reference === "first"
          ? "İlk seçilen / First"
          : "Son seçilen / Last";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[60] animate-in fade-in zoom-in-95 duration-150"
      style={{ animationFillMode: "forwards" }}
    >
      {/* Reference bounds outline — hide for "page" because it's the entire canvas */}
      {reference !== "page" && (
        <div
          className="absolute rounded-sm border border-dashed"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${right - left}%`,
            height: `${bottom - top}%`,
            borderColor: guideColor,
            boxShadow: `0 0 12px ${guideColor}55`,
          }}
        />
      )}

      {/* Alignment line */}
      {isHorizontal ? (
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: `${lineXPct}%`,
            width: 0,
            borderLeft: `1.5px dashed ${guideColor}`,
            boxShadow: `0 0 10px ${guideColor}aa`,
          }}
        />
      ) : (
        <div
          className="absolute left-0 right-0"
          style={{
            top: `${lineYPct}%`,
            height: 0,
            borderTop: `1.5px dashed ${guideColor}`,
            boxShadow: `0 0 10px ${guideColor}aa`,
          }}
        />
      )}

      {/* Reference label */}
      <div
        className="absolute rounded-md px-2 py-0.5 text-[10px] font-medium text-black"
        style={{
          left: isHorizontal ? `calc(${lineXPct}% + 6px)` : `${left}%`,
          top: isHorizontal ? `${top}%` : `calc(${lineYPct}% + 6px)`,
          background: guideColor,
        }}
      >
        {labelText}
      </div>
    </div>
  );
}
