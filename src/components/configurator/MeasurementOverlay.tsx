import { useDesigner } from "./DesignerContext";
import { getDimensions } from "@/lib/pricing";

/**
 * Subtle SVG overlay rendering width/height measurement lines,
 * an optional backboard bounding box, and an optional safe-area guide.
 * Purely visual — does not affect price.
 */
export function MeasurementOverlay() {
  const { config } = useDesigner();
  const { width, height } = getDimensions(config);

  const showM = config.showMeasurements ?? false;
  const showB = config.showBackboardBounds ?? false;
  const showS = config.showSafeArea ?? false;

  if (!showM && !showB && !showS) return null;

  // Approximate area the neon "fits" — keep it as a percent box relative to canvas.
  // The actual on-canvas text scales with the parent, so this overlay just
  // sits inside a padded inner box that visually frames the sign.
  const PAD = 8; // percent margin from canvas edges
  const inner = { x: PAD, y: PAD, w: 100 - 2 * PAD, h: 100 - 2 * PAD };
  const safePad = 4; // additional inner safe-area inset (percent)

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Backboard outline */}
      {showB && (
        <rect
          x={inner.x}
          y={inner.y}
          width={inner.w}
          height={inner.h}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={0.35}
          strokeDasharray="0.8 0.8"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {/* Safe area */}
      {showS && (
        <rect
          x={inner.x + safePad}
          y={inner.y + safePad}
          width={inner.w - 2 * safePad}
          height={inner.h - 2 * safePad}
          fill="none"
          stroke="rgba(0,229,255,0.7)"
          strokeWidth={0.3}
          strokeDasharray="0.5 0.6"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {/* Measurement lines */}
      {showM && (
        <>
          {/* Width — bottom */}
          <line
            x1={inner.x}
            y1={100 - 3}
            x2={inner.x + inner.w}
            y2={100 - 3}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={0.3}
            vectorEffect="non-scaling-stroke"
          />
          <line x1={inner.x} y1={100 - 4.2} x2={inner.x} y2={100 - 1.8} stroke="rgba(255,255,255,0.85)" strokeWidth={0.3} vectorEffect="non-scaling-stroke" />
          <line x1={inner.x + inner.w} y1={100 - 4.2} x2={inner.x + inner.w} y2={100 - 1.8} stroke="rgba(255,255,255,0.85)" strokeWidth={0.3} vectorEffect="non-scaling-stroke" />
          {/* Height — right */}
          <line
            x1={100 - 3}
            y1={inner.y}
            x2={100 - 3}
            y2={inner.y + inner.h}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={0.3}
            vectorEffect="non-scaling-stroke"
          />
          <line x1={100 - 4.2} y1={inner.y} x2={100 - 1.8} y2={inner.y} stroke="rgba(255,255,255,0.85)" strokeWidth={0.3} vectorEffect="non-scaling-stroke" />
          <line x1={100 - 4.2} y1={inner.y + inner.h} x2={100 - 1.8} y2={inner.y + inner.h} stroke="rgba(255,255,255,0.85)" strokeWidth={0.3} vectorEffect="non-scaling-stroke" />
        </>
      )}
      {/* Labels as foreignObject so text isn't squished by preserveAspectRatio=none */}
      {showM && (
        <>
          <foreignObject x={inner.x + inner.w / 2 - 10} y={100 - 8} width={20} height={5}>
            <div
              style={{
                fontSize: "10px",
                color: "white",
                background: "rgba(0,0,0,0.55)",
                padding: "1px 6px",
                borderRadius: 4,
                textAlign: "center",
                backdropFilter: "blur(4px)",
                width: "fit-content",
                margin: "0 auto",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {width} cm
            </div>
          </foreignObject>
          <foreignObject x={100 - 10} y={inner.y + inner.h / 2 - 2.5} width={9} height={5}>
            <div
              style={{
                fontSize: "10px",
                color: "white",
                background: "rgba(0,0,0,0.55)",
                padding: "1px 5px",
                borderRadius: 4,
                textAlign: "center",
                backdropFilter: "blur(4px)",
                width: "fit-content",
                marginLeft: "auto",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {height} cm
            </div>
          </foreignObject>
        </>
      )}
    </svg>
  );
}
