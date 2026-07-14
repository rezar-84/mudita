import { useRef } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS } from "@/data/options";
import { DECORATIONS } from "@/data/decorations";
import { SPORT_EMBLEMS } from "@/data/sportEmblems";
import { cn } from "@/lib/utils";
import { SelectionHandles } from "./SelectionHandles";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function DecorationOverlay() {
  const { config, selection, setSelection, updateDecoration, removeDecoration, zIndexFor } =
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
    if (ids.length === 0) setSelection({ kind: "canvas" });
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
      {decorations.map((d) => {
        if (d.hidden) return null;
        const color = COLORS.find((c) => c.id === d.colorId) ?? COLORS[0];

        // Import SPORT_EMBLEMS inside or use the static map
        const preset =
          d.source === "preset"
            ? DECORATIONS.find((p) => p.id === d.presetId) ||
              SPORT_EMBLEMS.find((p) => p.id === d.presetId)
            : null;

        const isSelected = selection.kind === "decoration" && selection.id === d.id;
        const isMulti = selection.kind === "multi" && selection.ids.includes(d.id);
        const isLightOn = config.isLightOn ?? true;
        const brightness = (config.brightness ?? 100) / 100;
        const glow = color.glow;
        const g = (px: number) => Math.round(px * brightness);
        const glowFilter = isLightOn
          ? `drop-shadow(0 0 ${g(2)}px ${color.hex}) drop-shadow(0 0 ${g(6)}px ${glow}) drop-shadow(0 0 ${g(14)}px ${glow}) drop-shadow(0 0 ${g(28)}px ${glow})`
          : "none";

        const ledEffect = config.ledEffect ?? "none";
        const ledClass =
          isLightOn && ledEffect !== "none"
            ? ledEffect === "blinking"
              ? "led-blinking"
              : ledEffect === "strobe"
                ? "led-strobe"
                : ledEffect === "fade"
                  ? "led-fade"
                  : ledEffect === "flashlight"
                    ? "led-flashlight"
                    : ""
            : "";

        const renderMode = d.renderMode || (preset?.category === "sports" ? "hybrid" : "glow-only");
        const svgData = d.svgMarkup || preset?.svgMarkup;
        const showPrint = svgData && (renderMode === "hybrid" || renderMode === "print-only");
        const showGlow = renderMode === "hybrid" || renderMode === "glow-only";

        const printStyle = {
          opacity: isLightOn ? 0.85 : 0.25,
          transition: "opacity 150ms ease",
        };

        const glowStyle = {
          filter: glowFilter,
          color: isLightOn ? color.hex : "rgba(255,255,255,0.18)",
          opacity: isLightOn ? Math.min(1, 0.65 + brightness * 0.4) : 0.6,
          transition: "filter 150ms ease",
        };

        return (
          <div
            key={d.id}
            onPointerDown={(e) => onPointerDown(e, d.id)}
            className={cn(
              "pointer-events-auto absolute touch-none select-none",
              d.locked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
              ledClass,
            )}
            style={{
              left: `${50 + d.x}%`,
              top: `${50 + d.y}%`,
              width: `${d.sizePct}%`,
              aspectRatio: `${d.aspectRatio ?? 1}`,
              transform: `translate(-50%, -50%) rotate(${d.rotation}deg) scale(${d.flipX ? -1 : 1}, ${d.flipY ? -1 : 1})`,
              zIndex: 10 + zIndexFor(d.id),
            }}
            aria-label={d.label || "Süsleme"}
          >
            <div className="relative h-full w-full">
              {/* 1. Print layer (native colors, no glow, dim when light is off) */}
              {showPrint && svgData && (
                <div
                  className="absolute inset-0 h-full w-full [&_svg]:h-full [&_svg]:w-full"
                  style={printStyle}
                  dangerouslySetInnerHTML={{ __html: svgData }}
                />
              )}

              {/* 2. Glow layer (neon colors and glow filter) */}
              {showGlow && (
                <div
                  style={glowStyle}
                  className={cn(
                    "absolute inset-0 h-full w-full [&_svg]:h-full [&_svg]:w-full",
                    renderMode === "hybrid" &&
                      "[&_svg_path]:!fill-none [&_svg_path]:!stroke-current [&_svg_path]:!stroke-[1.6px] [&_svg_rect]:!fill-none [&_svg_rect]:!stroke-current [&_svg_rect]:!stroke-[1.6px] [&_svg_circle]:!fill-none [&_svg_circle]:!stroke-current [&_svg_circle]:!stroke-[1.6px] [&_svg_polygon]:!fill-none [&_svg_polygon]:!stroke-current [&_svg_polygon]:!stroke-[1.6px] [&_svg_polyline]:!fill-none [&_svg_polyline]:!stroke-current [&_svg_polyline]:!stroke-[1.6px] [&_svg_line]:!fill-none [&_svg_line]:!stroke-current [&_svg_line]:!stroke-[1.6px] [&_svg_ellipse]:!fill-none [&_svg_ellipse]:!stroke-current [&_svg_ellipse]:!stroke-[1.6px]",
                  )}
                >
                  {preset && !preset.svgMarkup ? (
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
                      {preset.path && <path d={preset.path} />}
                    </svg>
                  ) : svgData ? (
                    <div
                      className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
                      dangerouslySetInnerHTML={{
                        __html: d.strokeWidth
                          ? svgData.replace(
                              /stroke-width="[^"]*"/g,
                              `stroke-width="${d.strokeWidth}"`,
                            )
                          : svgData,
                      }}
                    />
                  ) : null}
                </div>
              )}
            </div>

            {isMulti && (
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-2 rounded-md border border-dashed border-neon-cyan/70"
              />
            )}
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
