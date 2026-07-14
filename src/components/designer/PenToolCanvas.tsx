import { useState, useEffect, useRef } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS } from "@/data/options";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export function PenToolCanvas() {
  const { config, activeTool, setActiveTool, addDecoration, update } = useDesigner();
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Reset drawing points when tool changes from pen
  useEffect(() => {
    if (activeTool !== "pen") {
      setPoints([]);
      setMousePos(null);
    }
  }, [activeTool]);

  // Keydown listener
  useEffect(() => {
    if (activeTool !== "pen") return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        finishPath(false);
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelPath();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTool, points]);

  if (activeTool !== "pen") return null;

  const color = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];

  function getMouseCoords(e: React.MouseEvent<SVGSVGElement> | React.PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.stopPropagation();
    const coords = getMouseCoords(e);
    if (!coords) return;

    // Check if clicking near the first point to close the path
    if (points.length >= 3) {
      const dist = Math.hypot(coords.x - points[0].x, coords.y - points[0].y);
      if (dist < 12) {
        finishPath(true);
        return;
      }
    }

    setPoints((prev) => [...prev, coords]);
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const coords = getMouseCoords(e);
    if (coords) {
      setMousePos(coords);
    }
  }

  function finishPath(close = false) {
    if (points.length < 2) {
      toast.error("Vektör oluşturmak için en az iki nokta yerleştirmelisiniz.");
      cancelPath();
      return;
    }

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Bounding Box
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const w = maxX - minX || 1;
    const h = maxY - minY || 1;
    const cx = minX + w / 2;
    const cy = minY + h / 2;

    const W = rect.width;
    const H = rect.height;

    // Precise floats relative to the canvas center to prevent rounding offsets
    const xPercent = ((cx - W / 2) / W) * 100;
    const yPercent = ((cy - H / 2) / H) * 100;

    // Enforce a minimum dimension to prevent division by zero or extreme aspect ratios
    const minDimension = 15;
    const wBounded = Math.max(minDimension, w);
    const hBounded = Math.max(minDimension, h);

    // Add padding around the bounding box to prevent stroke-width cropping at the edges of the SVG
    const padding = 12;
    const viewBoxW = wBounded + padding * 2;
    const viewBoxH = hBounded + padding * 2;
    const aspectRatio = viewBoxW / viewBoxH;

    // Size percent matches the padded width as a percentage of the canvas width
    const sizePct = (viewBoxW / W) * 100;

    // Shift points to be relative to the padded viewBox
    const dx = padding + (wBounded - w) / 2;
    const dy = padding + (hBounded - h) / 2;
    const localPoints = points.map((p) => ({
      x: dx + (p.x - minX),
      y: dy + (p.y - minY),
    }));

    // Build SVG path commands using local coordinates
    let pathD = `M ${localPoints[0].x.toFixed(1)} ${localPoints[0].y.toFixed(1)}`;
    for (let i = 1; i < localPoints.length; i++) {
      pathD += ` L ${localPoints[i].x.toFixed(1)} ${localPoints[i].y.toFixed(1)}`;
    }
    if (close) {
      pathD += " Z";
    }

    const strokeW = config.penStrokeWidth ?? 6;
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
      id: `pen-${Date.now()}`,
      source: "draw",
      svgMarkup,
      label: "Kalem Çizimi",
      colorId: config.colorId,
      x: xPercent,
      y: yPercent,
      rotation: 0,
      sizePct: sizePct,
      aspectRatio,
      strokeWidth: strokeW,
    });

    toast.success("Kalem vektörü eklendi.");
    setPoints([]);
    setMousePos(null);
    setActiveTool("select");
  }

  function cancelPath() {
    setPoints([]);
    setMousePos(null);
    setActiveTool("select");
  }

  // Generate real-time path d-attribute
  const currentPathD = (() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  })();

  const isFirstNodeHovered = hoveredIndex === 0 && points.length >= 3;

  return (
    <div className="absolute inset-0 z-40 h-full w-full pointer-events-auto bg-black/10">
      <svg
        ref={svgRef}
        onPointerDown={handlePointerDown}
        onMouseMove={handleMouseMove}
        className="h-full w-full cursor-crosshair touch-none select-none"
      >
        <rect width="100%" height="100%" fill="none" />

        {/* Render lines */}
        {points.length > 0 && (
          <path
            d={currentPathD}
            fill="none"
            stroke={color.hex}
            strokeWidth={config.penStrokeWidth ?? 6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: `drop-shadow(0 0 2px ${color.hex}) drop-shadow(0 0 6px ${color.glow})`,
            }}
          />
        )}

        {/* Rubber-band effect line to current cursor */}
        {points.length > 0 && mousePos && (
          <line
            x1={points[points.length - 1].x}
            y1={points[points.length - 1].y}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke={color.hex}
            strokeWidth={3}
            strokeDasharray="4 4"
            className="opacity-70 animate-pulse"
          />
        )}

        {/* Render Anchor points */}
        {points.map((p, i) => {
          const isFirst = i === 0;
          const canClose = isFirst && points.length >= 3;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={canClose ? 7 : 5}
                fill={canClose && hoveredIndex === 0 ? "#10b981" : "#ffffff"}
                stroke="#06b6d4"
                strokeWidth={2}
                className="transition-all duration-150"
              />
              {canClose && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={11}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={1}
                  className="animate-ping opacity-75"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating hints & controls */}
      <div className="absolute top-14 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/85 px-4 py-2 text-xs text-white backdrop-blur shadow-lg">
        <span className="font-medium">
          {points.length === 0 ? "Kalem Çizim Modu" : `Noktalar: ${points.length}`}
        </span>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-2">
          <span>Çizgi Kalınlığı:</span>
          <select
            value={config.penStrokeWidth ?? 6}
            onChange={(e) => update({ penStrokeWidth: parseInt(e.target.value) })}
            className="rounded bg-white/10 px-1 py-0.5 text-xs text-white border border-white/10 outline-none cursor-pointer"
          >
            <option value="2" className="bg-black text-white">
              2px (Çok İnce)
            </option>
            <option value="4" className="bg-black text-white">
              4px (İnce)
            </option>
            <option value="6" className="bg-black text-white">
              6px (Orta)
            </option>
            <option value="10" className="bg-black text-white">
              10px (Kalın)
            </option>
            <option value="14" className="bg-black text-white">
              14px (Çok Kalın)
            </option>
          </select>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-1">
          <button
            onClick={() => finishPath(false)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Çizimi Bitir"
            disabled={points.length < 2}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={cancelPath}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-transform hover:scale-105 active:scale-95"
            title="Çizimi İptal Et"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
