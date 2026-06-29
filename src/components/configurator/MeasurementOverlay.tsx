import { useDesigner } from "./DesignerContext";
import { getDimensions } from "@/lib/pricing";

/**
 * Lightweight overlay using absolute-positioned divs (no SVG stretching).
 * Renders width/height ruler ticks, optional backboard outline, and optional
 * inner safe area. Visual-only — does not affect price or layout.
 */
export function MeasurementOverlay() {
  const { config } = useDesigner();
  const { width, height } = getDimensions(config);

  const showM = config.showMeasurements ?? false;
  const showB = config.showBackboardBounds ?? false;
  const showS = config.showSafeArea ?? false;

  if (!showM && !showB && !showS) return null;

  // Inner padded box that frames the sign within the preview canvas.
  const PAD = 8; // % from canvas edges
  const SAFE = 4; // % inset for safe area inside backboard

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* Backboard outline */}
      {showB && (
        <div
          className="absolute rounded-sm border border-dashed border-white/55"
          style={{
            top: `${PAD}%`,
            left: `${PAD}%`,
            right: `${PAD}%`,
            bottom: `${PAD}%`,
          }}
        />
      )}

      {/* Safe area */}
      {showS && (
        <div
          className="absolute rounded-sm border border-dashed border-neon-cyan/70"
          style={{
            top: `${PAD + SAFE}%`,
            left: `${PAD + SAFE}%`,
            right: `${PAD + SAFE}%`,
            bottom: `${PAD + SAFE}%`,
          }}
        />
      )}

      {/* Measurement: width ruler at bottom */}
      {showM && (
        <>
          <div
            className="absolute h-px bg-white/80"
            style={{ left: `${PAD}%`, right: `${PAD}%`, bottom: "14px" }}
          />
          {/* end ticks */}
          <div
            className="absolute w-px bg-white/80"
            style={{ left: `${PAD}%`, bottom: "10px", height: "8px" }}
          />
          <div
            className="absolute w-px bg-white/80"
            style={{ right: `${PAD}%`, bottom: "10px", height: "8px" }}
          />
          <div
            className="absolute -translate-x-1/2 rounded-md border border-white/15 bg-black/65 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white backdrop-blur"
            style={{ left: "50%", bottom: "20px" }}
          >
            {width} cm
          </div>

          {/* Measurement: height ruler on right */}
          <div
            className="absolute w-px bg-white/80"
            style={{ top: `${PAD}%`, bottom: `${PAD}%`, right: "14px" }}
          />
          <div
            className="absolute h-px bg-white/80"
            style={{ right: "10px", top: `${PAD}%`, width: "8px" }}
          />
          <div
            className="absolute h-px bg-white/80"
            style={{ right: "10px", bottom: `${PAD}%`, width: "8px" }}
          />
          <div
            className="absolute -translate-y-1/2 rounded-md border border-white/15 bg-black/65 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white backdrop-blur"
            style={{ right: "22px", top: "50%" }}
          >
            {height} cm
          </div>
        </>
      )}
    </div>
  );
}
