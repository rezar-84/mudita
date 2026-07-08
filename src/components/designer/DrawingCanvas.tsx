import { useState, useRef } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS } from "@/data/options";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

// Ramer-Douglas-Peucker path simplification
type Pt = { x: number; y: number };
function simplifyPath(points: Pt[], tolerance: number): Pt[] {
  if (points.length <= 2) return points;

  let maxSqDist = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const d = getSquareSegmentDistance(points[i], points[0], points[end]);
    if (d > maxSqDist) {
      index = i;
      maxSqDist = d;
    }
  }

  if (maxSqDist > tolerance * tolerance) {
    const results1 = simplifyPath(points.slice(0, index + 1), tolerance);
    const results2 = simplifyPath(points.slice(index), tolerance);
    return results1.slice(0, results1.length - 1).concat(results2);
  }
  return [points[0], points[end]];
}

function getSquareSegmentDistance(
  p: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  let x = p1.x;
  let y = p1.y;
  let dx = p2.x - x;
  let dy = p2.y - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2.x;
      y = p2.y;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p.x - x;
  dy = p.y - y;
  return dx * dx + dy * dy;
}

// Cubic bezier smoothing algorithm (C1 continuity)
function getSvgPathFromPoints(points: Array<{ x: number; y: number }>, smoothing = 0.16) {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  const line = (pointA: { x: number; y: number }, pointB: { x: number; y: number }) => {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };

  const controlPoint = (
    current: { x: number; y: number },
    previous: { x: number; y: number },
    next: { x: number; y: number },
    reverse = false
  ) => {
    const p = previous || current;
    const n = next || current;
    const o = line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return [x, y];
  };

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const prev = points[i - 1];
    const prevPrev = points[i - 2] || prev;
    const next = points[i + 1] || p;
    const [cp1x, cp1y] = controlPoint(prev, prevPrev, p);
    const [cp2x, cp2y] = controlPoint(p, prev, next, true);
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d;
}

export function DrawingCanvas() {
  const { config, activeTool, setActiveTool, addDecoration, update } = useDesigner();
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);
  const isDrawingRef = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  if (activeTool !== "draw") return null;

  const color = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    isDrawingRef.current = true;
    e.stopPropagation();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    svgRef.current?.setPointerCapture(e.pointerId);

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([{ x, y }]);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawingRef.current) return;
    e.stopPropagation();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add point only if it moved slightly to avoid duplicate points
    const last = points[points.length - 1];
    if (!last || Math.hypot(x - last.x, y - last.y) > 2) {
      setPoints((prev) => [...prev, { x, y }]);
    }
  }

  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    e.stopPropagation();

    // Only process if we have enough points
    if (points.length > 2) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        // Use exact points for zero geometric distortion
        const simplified = points;

        // 2. Compute bounding box
        const xs = simplified.map((p) => p.x);
        const ys = simplified.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const w = maxX - minX;
        const h = maxY - minY;

        // Enforce a minimum dimension to prevent division by zero or extreme aspect ratios
        const minDimension = 15;
        const wBounded = Math.max(minDimension, w);
        const hBounded = Math.max(minDimension, h);

        // Add padding around the bounding box to prevent stroke-width cropping at the edges of the SVG
        const padding = 12;
        const viewBoxW = wBounded + padding * 2;
        const viewBoxH = hBounded + padding * 2;
        const aspectRatio = viewBoxW / viewBoxH;

        // Bounding box size and position relative to canvas container (including padding)
        const W = rect.width;
        const H = rect.height;

        // Center of the padded bounding box in canvas pixels
        const cx = minX + w / 2;
        const cy = minY + h / 2;

        // Precise floats relative to the canvas center to prevent rounding offsets
        const xPercent = ((cx - W / 2) / W) * 100;
        const yPercent = ((cy - H / 2) / H) * 100;

        // Size percent matches the padded width as a percentage of the canvas width
        const sizePct = (viewBoxW / W) * 100;

        // Shift points to be relative to the padded viewBox
        const dx = padding + (wBounded - w) / 2;
        const dy = padding + (hBounded - h) / 2;
        const localPoints = simplified.map((p) => ({
          x: dx + (p.x - minX),
          y: dy + (p.y - minY),
        }));

        // Generate smooth SVG path markup using local coordinates
        const pathD = getSvgPathFromPoints(localPoints, 0.16);

        if (pathD) {
          const strokeW = config.drawStrokeWidth ?? 6;
          const svgMarkup = `
            <svg viewBox="0 0 ${viewBoxW.toFixed(1)} ${viewBoxH.toFixed(1)}" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="${pathD}"
                fill="none"
                stroke="currentColor"
                stroke-width="${strokeW}"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          `.trim();

          addDecoration({
            id: `draw-${Date.now()}`,
            source: "draw",
            svgMarkup,
            label: "Serbest Çizim",
            colorId: config.colorId,
            x: xPercent,
            y: yPercent,
            rotation: 0,
            sizePct: sizePct,
            aspectRatio,
            strokeWidth: strokeW,
          });

          toast.success("Çiziminiz eklendi.");
        }
      }
    }

    setPoints([]);
  }

  return (
    <>
      <svg
        ref={svgRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-0 z-40 h-full w-full pointer-events-auto touch-none cursor-crosshair bg-black/10 transition-colors duration-200"
      >
        <rect width="100%" height="100%" fill="none" />
        {points.length > 0 && (
          <path
            d={getSvgPathFromPoints(points, 0.16)}
            fill="none"
            stroke={color.hex}
            strokeWidth={config.drawStrokeWidth ?? 6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
            style={{
              filter: `drop-shadow(0 0 3px ${color.hex}) drop-shadow(0 0 8px ${color.glow})`,
            }}
          />
        )}
      </svg>

      {/* Floating hints & controls */}
      <div className="absolute top-14 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/85 px-4 py-2 text-xs text-white backdrop-blur shadow-lg">
        <span className="font-medium">
          Serbest Çizim Modu
        </span>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-2">
          <span>Çizgi Kalınlığı:</span>
          <select
            value={config.drawStrokeWidth ?? 6}
            onChange={(e) => update({ drawStrokeWidth: parseInt(e.target.value) })}
            className="rounded bg-white/10 px-1 py-0.5 text-xs text-white border border-white/10 outline-none cursor-pointer"
          >
            <option value="2" className="bg-black text-white">2px (Çok İnce)</option>
            <option value="4" className="bg-black text-white">4px (İnce)</option>
            <option value="6" className="bg-black text-white">6px (Orta)</option>
            <option value="10" className="bg-black text-white">10px (Kalın)</option>
            <option value="14" className="bg-black text-white">14px (Çok Kalın)</option>
          </select>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTool("select")}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white transition-transform hover:scale-105 active:scale-95 animate-pulse"
            title="Çizimi Tamamla"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
