import { useEffect, useRef, useState } from "react";
import { useDesigner } from "./DesignerContext";
import { COLORS, FONTS, BACKGROUNDS } from "@/data/options";
import { getDimensions } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import {
  Lightbulb,
  LightbulbOff,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { MeasurementOverlay } from "./MeasurementOverlay";
import { DecorationOverlay } from "@/components/designer/DecorationOverlay";
import { TextLayerOverlay } from "@/components/designer/TextLayerOverlay";

const BG_CLASS: Record<string, string> = Object.fromEntries(
  BACKGROUNDS.map((b) => [b.id, b.thumb]),
);

const LIGHT_BACKGROUNDS = new Set(["light-wall", "white-wall"]);

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function NeonPreview() {
  const { config, update, setSelection } = useDesigner();
  const font = FONTS.find((f) => f.id === config.fontId) ?? FONTS[0];
  const color = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];
  const { width, height } = getDimensions(config);

  const isEmpty = config.text.trim().length === 0;
  const displayText = isEmpty ? "Yazınız" : config.text;
  const lines = displayText.split("\n");
  const longestLine = Math.max(1, ...lines.map((l) => l.length));
  const fontSize = Math.max(28, Math.min(140, (width * 4) / longestLine));

  const brightness = (config.brightness ?? 100) / 100;
  const zoom = config.zoom ?? 1;
  const flicker = config.flicker ?? true;
  const isLightOn = config.isLightOn ?? true;
  const posX = config.positionX ?? 0;
  const posY = config.positionY ?? 0;
  const rotation = config.rotationDeg ?? 0;
  const realSize = config.realSizeMode ?? false;

  const glow = color.glow;
  const fill = color.hex;

  const g = (px: number) => Math.round(px * brightness);
  const textShadow = isLightOn
    ? [
        `0 0 2px ${fill}`,
        `0 0 ${g(6)}px ${fill}`,
        `0 0 ${g(14)}px ${glow}`,
        `0 0 ${g(30)}px ${glow}`,
        `0 0 ${g(60)}px ${glow}`,
        `0 0 ${g(100)}px ${glow}`,
      ].join(", ")
    : "none";

  const isLight = LIGHT_BACKGROUNDS.has(config.background);
  const hasCustomBg = !!config.customBackground;

  // Drag-to-move
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragState = useRef<{ startX: number; startY: number; baseX: number; baseY: number; w: number; h: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    // Click on bare canvas selects the text layer (deselects decoration)
    setSelection({ kind: "text" });
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: posX,
      baseY: posY,
      w: rect.width,
      h: rect.height,
    };
    setDragging(true);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const s = dragState.current;
    const dx = ((e.clientX - s.startX) / s.w) * 100;
    const dy = ((e.clientY - s.startY) / s.h) * 100;
    update({
      positionX: clamp(Math.round(s.baseX + dx), -45, 45),
      positionY: clamp(Math.round(s.baseY + dy), -45, 45),
    });
  }
  function onPointerUp() {
    dragState.current = null;
    setDragging(false);
  }

  // Real-size feel: try to render at ~1cm per CSS cm using device-cm hint
  const [cmPx, setCmPx] = useState<number>(37.8); // ~1cm @ 96dpi
  useEffect(() => {
    if (typeof window === "undefined") return;
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;width:1cm;height:1cm;";
    document.body.appendChild(probe);
    setCmPx(probe.getBoundingClientRect().width || 37.8);
    document.body.removeChild(probe);
  }, []);

  const previewStyle: React.CSSProperties = realSize
    ? {
        width: `${Math.min(width * cmPx, 1100)}px`,
        maxWidth: "100%",
        height: `${Math.min(height * cmPx, 700)}px`,
        minHeight: 280,
        maxHeight: "70vh",
      }
    : { aspectRatio: `${width}/${Math.max(height, 30)}`, minHeight: 280, maxHeight: "70vh" };

  return (
    <div className="w-full max-w-full space-y-2">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "relative w-full max-w-full overflow-hidden rounded-2xl border border-border shadow-soft touch-none select-none",
          dragging ? "cursor-grabbing" : "cursor-grab",
          !hasCustomBg && BG_CLASS[config.background],
        )}
        style={{
          ...previewStyle,
          ...(hasCustomBg && {
            backgroundImage: `url(${config.customBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
        }}
      >

        {/* Ambient glow halo on dark backgrounds — wall reflection */}
        {!isLight && isLightOn && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at ${50 + posX}% ${55 + posY}%, ${glow}${Math.round(brightness * 38).toString(16).padStart(2, "0")} 0%, transparent 62%)`,
              opacity: hasCustomBg ? 0.6 : 0.9,
              transition: "background 120ms linear",
            }}
            aria-hidden
          />
        )}

        {/* Night dim overlay when light is off */}
        {!isLightOn && (
          <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden />
        )}

        <div
          className="absolute inset-0 flex items-center justify-center px-6 py-10"
          style={{
            transform: `translate(${posX}%, ${posY}%) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center",
            transition: dragging ? "none" : "transform 120ms ease-out",
          }}
        >
          <div
            className={cn(
              "text-center select-none transition-opacity",
              isLightOn && color.rgb ? "neon-rgb" : isLightOn ? "neon-text" : "",
              (!flicker || !isLightOn) && "neon-no-flicker",
              isEmpty && "opacity-40",
            )}
            style={{
              fontFamily: font.family,
              fontSize: `${fontSize}px`,
              color: isLightOn ? fill : "rgba(255,255,255,0.18)",
              textShadow,
              filter: isLightOn ? `drop-shadow(0 0 ${g(18)}px ${glow})` : "none",
              opacity: isLightOn ? Math.min(1, 0.55 + brightness * 0.5) : 0.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {displayText}
          </div>
        </div>

        {/* Decoration / SVG layers */}
        <DecorationOverlay />

        {/* Additional text layers (multi-text) */}
        <TextLayerOverlay />

        {/* Measurement overlays (width/height/backboard/safe area) */}
        <MeasurementOverlay />

        {(config.showSizeBadge ?? true) && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            ≈ {width} × {height} cm {realSize && <span className="ml-1 opacity-70">· gerçek boyut</span>}
          </div>
        )}
        {config.outdoor && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-neon-cyan/90 px-2 py-1 text-xs font-medium text-black">
            Dış Mekan · IP65
          </div>
        )}
        {/* LEFT dock — essentials only: light + zoom + center */}
        <div
          className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-1.5 py-1 text-white shadow-soft backdrop-blur"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label={isLightOn ? t("lightOffAria") : t("lightOnAria")}
            title={isLightOn ? "Işığı Kapat" : "Işığı Aç"}
            onClick={() => update({ isLightOn: !isLightOn })}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition",
              isLightOn ? "bg-yellow-400/90 text-black hover:bg-yellow-300" : "bg-white/10 hover:bg-white/20",
            )}
          >
            {isLightOn ? <Lightbulb className="h-3.5 w-3.5" /> : <LightbulbOff className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isLightOn ? t("on") : t("off")}</span>
          </button>
          <div className="mx-0.5 h-5 w-px bg-white/15" aria-hidden />
          <button
            type="button"
            aria-label="Uzaklaştır"
            title="Uzaklaştır"
            onClick={() => update({ zoom: Math.max(0.6, Math.round(((config.zoom ?? 1) - 0.1) * 10) / 10) })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Yakınlaştır"
            title="Yakınlaştır"
            onClick={() => update({ zoom: Math.min(1.8, Math.round(((config.zoom ?? 1) + 0.1) * 10) / 10) })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("center")}
            title="Ortala"
            onClick={() => update({ positionX: 0, positionY: 0 })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            <Crosshair className="h-4 w-4" />
          </button>
        </div>

        {/* RIGHT dock — fullscreen + "more" popover for secondary actions */}
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-1.5 py-1 text-white shadow-soft backdrop-blur"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Tam Ekran"
            title="Tam Ekran"
            onClick={() => window.dispatchEvent(new CustomEvent("mudita:fullscreen-toggle"))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Daha fazla araç"
                title="Daha fazla"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-56 p-2"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => update({ showMeasurements: !(config.showMeasurements ?? false) })}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent",
                  (config.showMeasurements ?? false) && "bg-accent",
                )}
              >
                <Ruler className="h-4 w-4" />
                Ölçüleri {config.showMeasurements ? "Gizle" : "Göster"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const ids = BACKGROUNDS.map((b) => b.id);
                  const i = Math.max(0, ids.indexOf(config.background));
                  const next = ids[(i + 1) % ids.length];
                  update({ background: next, customBackground: undefined, customBackgroundName: undefined });
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
              >
                <ImageIcon className="h-4 w-4" />
                Arka Planı Değiştir
              </button>
              <button
                type="button"
                onClick={() =>
                  update({ positionX: 0, positionY: 0, rotationDeg: 0, zoom: 1, brightness: 100 })
                }
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
              >
                <RotateCcw className="h-4 w-4" />
                Görünümü Sıfırla
              </button>
              <button
                type="button"
                onClick={() => toast.info("Mockup indirme özelliği sonraki aşamada eklenecek.")}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
              >
                <Camera className="h-4 w-4" />
                Mockup Al
              </button>
            </PopoverContent>
          </Popover>
        </div>


        {isEmpty && (
          <div className="pointer-events-none absolute inset-x-0 bottom-12 text-center text-xs text-white/70">
            Sağdaki kutuya yazını yaz, önizleme canlansın ✨
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        💡 {t("dragTip")} {t("rotateTip")}
      </p>
    </div>
  );
}
