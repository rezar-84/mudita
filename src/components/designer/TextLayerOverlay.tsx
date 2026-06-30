import { useRef } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS, FONTS } from "@/data/options";
import { cn } from "@/lib/utils";
import { SelectionHandles } from "./SelectionHandles";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function TextLayerOverlay() {
  const { config, selection, setSelection, updateTextLayer, removeTextLayer } =
    useDesigner();
  const layers = config.textLayers ?? [];
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    w: number;
    h: number;
  } | null>(null);

  if (!layers.length) return null;

  function onPointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    setSelection({ kind: "textLayer", id });
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const l = layers.find((x) => x.id === id);
    if (!l || l.locked) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      baseX: l.x,
      baseY: l.y,
      w: rect.width,
      h: rect.height,
    };
  }
  function onPointerMove(e: React.PointerEvent) {
    const s = dragRef.current;
    if (!s) return;
    e.stopPropagation();
    const dx = ((e.clientX - s.startX) / s.w) * 100;
    const dy = ((e.clientY - s.startY) / s.h) * 100;
    updateTextLayer(s.id, {
      x: clamp(Math.round(s.baseX + dx), -45, 45),
      y: clamp(Math.round(s.baseY + dy), -45, 45),
    });
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  const isLightOn = config.isLightOn ?? true;
  const brightness = (config.brightness ?? 100) / 100;
  const flicker = config.flicker ?? true;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      style={{ containerType: "inline-size" }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {layers.map((l, idx) => {
        if (l.hidden) return null;
        const color = COLORS.find((c) => c.id === l.colorId) ?? COLORS[0];
        const font = FONTS.find((f) => f.id === l.fontId) ?? FONTS[0];
        const isSelected = selection.kind === "textLayer" && selection.id === l.id;
        const g = (px: number) => Math.round(px * brightness);
        const textShadow = isLightOn
          ? [
              `0 0 2px ${color.hex}`,
              `0 0 ${g(6)}px ${color.hex}`,
              `0 0 ${g(14)}px ${color.glow}`,
              `0 0 ${g(28)}px ${color.glow}`,
              `0 0 ${g(50)}px ${color.glow}`,
            ].join(", ")
          : "none";
        const scaleX = l.flipX ? -1 : 1;
        const scaleY = l.flipY ? -1 : 1;
        return (
          <div
            key={l.id}
            onPointerDown={(e) => onPointerDown(e, l.id)}
            className={cn(
              "pointer-events-auto absolute touch-none select-none",
              l.locked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
              isLightOn && color.rgb ? "neon-rgb" : isLightOn ? "neon-text" : "",
              (!flicker || !isLightOn) && "neon-no-flicker",
            )}
            style={{
              left: `${50 + l.x}%`,
              top: `${50 + l.y}%`,
              transform: `translate(-50%, -50%) rotate(${l.rotation}deg) scale(${scaleX}, ${scaleY})`,
              fontFamily: font.family,
              fontSize: `clamp(18px, ${l.sizePct}cqw, 260px)`,
              color: isLightOn ? color.hex : "rgba(255,255,255,0.18)",
              textShadow,
              whiteSpace: "pre",
              lineHeight: 1.05,
              opacity: isLightOn ? Math.min(1, 0.55 + brightness * 0.5) : 0.6,
              zIndex: 30 + idx,
            }}
            aria-label={l.text || "Metin katmanı"}
          >
            {l.text || "Yazı"}
            {isSelected && !l.locked && (
              <SelectionHandles
                canvasRef={containerRef}
                layerXPct={l.x}
                layerYPct={l.y}
                sizePct={l.sizePct}
                rotation={l.rotation}
                onClose={() => removeTextLayer(l.id)}
                onResize={(s) => updateTextLayer(l.id, { sizePct: Math.min(40, s) })}
                onRotate={(r) => updateTextLayer(l.id, { rotation: r })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
