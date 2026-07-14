import { useRef } from "react";
import { X, RotateCw, Move } from "lucide-react";
import { useT } from "@/lib/i18n";

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
  layerXPct: number;
  layerYPct: number;
  sizePct: number;
  rotation: number;
  onClose: () => void;
  onResize: (nextSizePct: number) => void;
  onRotate: (nextDeg: number) => void;
}) {
  const t = useT();
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
    const ratio = dist / s.baseDist;
    const next = Math.max(5, Math.min(80, Math.round(s.baseSize * ratio)));
    void min;
    onResize(next);
  }
  function onResizeUp() {
    startRef.current = null;
  }

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
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-md border border-dashed border-neon-cyan/80"
        style={{ filter: "none", textShadow: "none" }}
      />

      <button
        type="button"
        title={t("delete")}
        aria-label={t("deleteLayer")}
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

      <button
        type="button"
        title={t("rotateDrag")}
        aria-label={t("rotate")}
        onPointerDown={onRotateDown}
        onPointerMove={onRotateMove}
        onPointerUp={onRotateUp}
        onPointerCancel={onRotateUp}
        className={`${handleBase} left-1/2 -top-8 h-6 w-6 -translate-x-1/2 cursor-grab active:cursor-grabbing`}
        style={{ filter: "none", textShadow: "none" }}
      >
        <RotateCw className="h-3.5 w-3.5" />
      </button>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-5 h-3 w-px bg-neon-cyan/70"
        style={{ filter: "none", textShadow: "none" }}
      />

      <button
        type="button"
        title={t("resizeDrag")}
        aria-label={t("resize")}
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
