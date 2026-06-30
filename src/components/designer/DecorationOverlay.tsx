import { useRef } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS } from "@/data/options";
import { DECORATIONS } from "@/data/decorations";
import { cn } from "@/lib/utils";
import { SelectionHandles } from "./SelectionHandles";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function DecorationOverlay() {
  const { config, selection, setSelection, updateDecoration, removeDecoration } =
    useDesigner();
  const decorations = config.decorations ?? [];
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

  if (!decorations.length) return null;

  function onPointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    if (e.shiftKey) {
      toggleSelect("decoration", id);
      return;
    }
    setSelection({ kind: "decoration", id });
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const d = decorations.find((x) => x.id === id);
    if (!d || d.locked) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      baseX: d.x,
      baseY: d.y,
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
    updateDecoration(s.id, {
      x: clamp(Math.round(s.baseX + dx), -45, 45),
      y: clamp(Math.round(s.baseY + dy), -45, 45),
    });
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  function toggleSelect(kind: "textLayer" | "decoration", id: string) {
    const cur = selection;
    let ids: string[] = [];
    let kinds: ("textLayer" | "decoration")[] = [];
    if (cur.kind === "multi") {
      ids = [...cur.ids];
      kinds = [...cur.kinds];
    } else if (cur.kind === "textLayer" || cur.kind === "decoration") {
      ids = [cur.id];
      kinds = [cur.kind];
    }
    const idx = ids.indexOf(id);
    if (idx >= 0) {
      ids.splice(idx, 1);
      kinds.splice(idx, 1);
    } else {
      ids.push(id);
      kinds.push(kind);
    }
    if (ids.length === 0) setSelection({ kind: "text" });
    else if (ids.length === 1) setSelection({ kind: kinds[0], id: ids[0] });
    else setSelection({ kind: "multi", ids, kinds });
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {decorations.map((d, idx) => {
        if (d.hidden) return null;
        const color = COLORS.find((c) => c.id === d.colorId) ?? COLORS[0];
        const preset = d.source === "preset" ? DECORATIONS.find((p) => p.id === d.presetId) : null;
        const isSelected = selection.kind === "decoration" && selection.id === d.id;
        const isLightOn = config.isLightOn ?? true;
        const brightness = (config.brightness ?? 100) / 100;
        const glow = color.glow;
        const g = (px: number) => Math.round(px * brightness);
        const glowFilter = isLightOn
          ? `drop-shadow(0 0 ${g(2)}px ${color.hex}) drop-shadow(0 0 ${g(6)}px ${glow}) drop-shadow(0 0 ${g(14)}px ${glow}) drop-shadow(0 0 ${g(28)}px ${glow})`
          : "none";

        return (
          <div
            key={d.id}
            onPointerDown={(e) => onPointerDown(e, d.id)}
            className={cn(
              "pointer-events-auto absolute touch-none select-none",
              d.locked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
            )}
            style={{
              left: `${50 + d.x}%`,
              top: `${50 + d.y}%`,
              width: `${d.sizePct}%`,
              aspectRatio: "1 / 1",
              transform: `translate(-50%, -50%) rotate(${d.rotation}deg) scale(${d.flipX ? -1 : 1}, ${d.flipY ? -1 : 1})`,
              color: isLightOn ? color.hex : "rgba(255,255,255,0.18)",
              filter: glowFilter,
              opacity: isLightOn ? Math.min(1, 0.65 + brightness * 0.4) : 0.6,
              transition: dragRef.current?.id === d.id ? "none" : "filter 150ms ease",
              zIndex: 10 + idx,
            }}
            aria-label={d.label || "Süsleme"}
          >
            {preset ? (
              <svg
                viewBox={preset.viewBox ?? "0 0 24 24"}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full"
                aria-hidden
              >
                <path d={preset.path} />
              </svg>
            ) : d.svgMarkup ? (
              <div
                className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: d.svgMarkup }}
              />
            ) : null}

            {isSelected && !d.locked && (
              <SelectionHandles
                canvasRef={containerRef}
                layerXPct={d.x}
                layerYPct={d.y}
                sizePct={d.sizePct}
                rotation={d.rotation}
                onClose={() => removeDecoration(d.id)}
                onResize={(s) => updateDecoration(d.id, { sizePct: s })}
                onRotate={(r) => updateDecoration(d.id, { rotation: r })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
