import { useRef } from "react";
import { X, RotateCw, Move } from "lucide-react";

/**
 * Reusable on-canvas selection handles for a layer.
 *
 * - Close (×): top-right corner — calls onClose
 * - Rotate: above top-center — drag to set rotation
 * - Resize: bottom-right corner — drag to set sizePct (relative to canvas min-dim)
 *
 * The handles are rendered inside the layer's transformed box, so they
 * rotate/flip with it visually. The drag math, however, is computed against
 * the layer's centre in viewport coords (via canvasRef) so it stays correct
 * regardless of rotation.
 */
export function SelectionHandles({
  canvasRef,
  layerXPct,
  layerYPct,
  sizePct,
  rotation,
  onClose,
  onResize,
  onRotate,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  layerXPct: number; // -45..45
  layerYPct: number; // -45..45
  sizePct: number; // 5..40 (used to clamp during resize)
  rotation: number;
  onClose: () => void;
  onResize: (nextSizePct: number) => void;
  onRotate: (nextDeg: number) => void;
}) {
  const startRef = useRef<{ cx: number; cy: number; baseDist: number; baseSize: number } | null>(
    null,
  );
  const rotStartRef = useRef<{ cx: number; cy: number; baseAng: number; baseRot: number } | null>(
    null,
  );

  function layerCentre() {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { cx: 0, cy: 0, w: 1, h: 1 };
    const cx = rect.left + rect.width * (0.5 + layerXPct / 100);
    const cy = rect.top + rect.height * (0.5 + layerYPct / 100);
    return { cx, cy, w: rect.width, h: rect.height };
  }

  // RESIZE
  function onResizeDown(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    const { cx, cy } = layerCentre();
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    startRef.current = { cx, cy, baseDist: dist || 1, baseSize: sizePct };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onResizeMove(e: React.PointerEvent) {
    const s = startRef.current;
    if (!s) return;
    e.stopPropagation();
    const { w, h } = layerCentre();
    const min = Math.min(w, h) || 1;
    const dist = Math.hypot(e.clientX - s.cx, e.clientY - s.cy);
    // Map distance ratio onto sizePct space. Diagonal of a sizePct box is roughly sizePct% * sqrt(2).
    const ratio = dist / s.baseDist;
    const next = Math.max(5, Math.min(80, Math.round(s.baseSize * ratio)));
    // Use min for stable feel across aspect ratios
    void min;
    onResize(next);
  }
  function onResizeUp() {
    startRef.current = null;
  }

  // ROTATE
  function onRotateDown(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    const { cx, cy } = layerCentre();
    const ang = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
    rotStartRef.current = { cx, cy, baseAng: ang, baseRot: rotation };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onRotateMove(e: React.PointerEvent) {
    const s = rotStartRef.current;
    if (!s) return;
    e.stopPropagation();
    const ang = (Math.atan2(e.clientY - s.cy, e.clientX - s.cx) * 180) / Math.PI;
    let next = Math.round(s.baseRot + (ang - s.baseAng));
    // normalise -180..180
    next = ((((next + 180) % 360) + 360) % 360) - 180;
    onRotate(next);
  }
  function onRotateUp() {
    rotStartRef.current = null;
  }

  const handleBase =
    "pointer-events-auto absolute z-20 grid place-items-center rounded-full border border-white/60 bg-neon-cyan text-black shadow-soft";

  return (
    <>
      {/* Selection outline */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-md border border-dashed border-neon-cyan/80"
        style={{ filter: "none", textShadow: "none" }}
      />

      {/* Close */}
      <button
        type="button"
        title="Sil"
        aria-label="Katmanı sil"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={`${handleBase} -right-3 -top-3 h-6 w-6 bg-red-500 text-white`}
        style={{ filter: "none", textShadow: "none" }}
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Rotate */}
      <button
        type="button"
        title="Döndür (sürükle)"
        aria-label="Döndür"
        onPointerDown={onRotateDown}
        onPointerMove={onRotateMove}
        onPointerUp={onRotateUp}
        onPointerCancel={onRotateUp}
        className={`${handleBase} left-1/2 -top-8 h-6 w-6 -translate-x-1/2 cursor-grab active:cursor-grabbing`}
        style={{ filter: "none", textShadow: "none" }}
      >
        <RotateCw className="h-3.5 w-3.5" />
      </button>
      {/* Connector line from rotate handle to box */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-5 h-3 w-px bg-neon-cyan/70"
        style={{ filter: "none", textShadow: "none" }}
      />

      {/* Resize (bottom-right) */}
      <button
        type="button"
        title="Yeniden boyutlandır (sürükle)"
        aria-label="Yeniden boyutlandır"
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeUp}
        onPointerCancel={onResizeUp}
        className={`${handleBase} -bottom-3 -right-3 h-6 w-6 cursor-nwse-resize`}
        style={{ filter: "none", textShadow: "none" }}
      >
        <Move className="h-3 w-3 rotate-45" />
      </button>
    </>
  );
}
