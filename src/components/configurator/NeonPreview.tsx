import { useEffect, useRef, useState } from "react";
import { useDesigner } from "./DesignerContext";
import { COLORS, BACKGROUNDS } from "@/data/options";
import { getDimensions } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
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
import { AlignmentGuides } from "@/components/designer/AlignmentGuides";
import { DrawingCanvas } from "@/components/designer/DrawingCanvas";
import { PenToolCanvas } from "@/components/designer/PenToolCanvas";

const BG_CLASS: Record<string, string> = Object.fromEntries(
  BACKGROUNDS.map((b) => [b.id, b.thumb]),
);

const LIGHT_BACKGROUNDS = new Set(["light-wall", "white-wall"]);

export function NeonPreview() {
  const t = useT();
  const { config, update, setSelection } = useDesigner();
  const { width, height } = getDimensions(config);

  const brightness = (config.brightness ?? 100) / 100;
  const zoom = config.zoom ?? 1;
  const isLightOn = config.isLightOn ?? true;
  const realSize = config.realSizeMode ?? false;

  const isLight = LIGHT_BACKGROUNDS.has(config.background);
  const hasCustomBg = !!config.customBackground;

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Aggregate ambient glow from every visible layer (text + decoration).
  // Each layer contributes one radial gradient centered at its (x,y) using its own colour.
  const ambientGradient = (() => {
    if (!isLightOn || isLight) return null;
    type Spot = { x: number; y: number; size: number; glow: string };
    const spots: Spot[] = [];
    for (const l of config.textLayers ?? []) {
      if (l.hidden || !l.text.trim()) continue;
      const col = COLORS.find((c) => c.id === l.colorId) ?? COLORS[0];
      spots.push({ x: l.x, y: l.y, size: Math.max(14, l.sizePct ?? 18), glow: col.glow });
    }
    for (const d of config.decorations ?? []) {
      if (d.hidden) continue;
      const col = COLORS.find((c) => c.id === d.colorId) ?? COLORS[0];
      spots.push({ x: d.x, y: d.y, size: Math.max(10, d.sizePct ?? 18), glow: col.glow });
    }
    if (!spots.length) return null;
    const alphaHex = Math.round(brightness * 38).toString(16).padStart(2, "0");
    return spots
      .map((s) => {
        // Spread ~ proportional to layer size so bigger layers glow wider.
        const spread = Math.min(85, 30 + s.size * 1.6);
        return `radial-gradient(circle at ${50 + s.x}% ${55 + s.y}%, ${s.glow}${alphaHex} 0%, transparent ${spread}%)`;
      })
      .join(", ");
  })();

  return (
    <div className="w-full max-w-full space-y-2">
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          // Clicking empty canvas clears selection (each layer overlay stops propagation).
          if (e.target === e.currentTarget) setSelection({ kind: "canvas" });
        }}
        className={cn(
          "relative w-full max-w-full overflow-hidden rounded-2xl border border-border shadow-soft select-none",
          !hasCustomBg && BG_CLASS[config.background],
        )}
        style={{
          ...previewStyle,
          ...(hasCustomBg && {
            backgroundImage: `url(${config.customBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          transition: "transform 120ms ease-out",
        }}
      >
        {/* Ambient glow halo — aggregated from every visible layer */}
        {ambientGradient && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: ambientGradient,
              opacity: hasCustomBg ? 0.55 : 0.85,
              transition: "background-image 160ms linear",
              mixBlendMode: "screen",
            }}
            aria-hidden
          />
        )}

        {/* Night dim overlay when light is off */}
        {!isLightOn && (
          <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden />
        )}

        {/* Decoration / SVG layers */}
        <DecorationOverlay />

        {/* Freehand drawing canvas */}
        <DrawingCanvas />

        {/* Vector pen tool canvas */}
        <PenToolCanvas />

        {/* All text layers (including the seeded base "MudiNeon" layer) */}
        <TextLayerOverlay />

        {/* Measurement overlays (width/height/backboard/safe area) */}
        <MeasurementOverlay />
        <AlignmentGuides />

        {(config.showSizeBadge ?? true) && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            ≈ {width} × {height} cm {realSize && <span className="ml-1 opacity-70">· {t("realSizeLabel")}</span>}
          </div>
        )}
        {config.outdoor && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-neon-cyan/90 px-2 py-1 text-xs font-medium text-black">
            {t("outdoorBadge")}
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
            title={isLightOn ? t("lightOffTitle") : t("lightOnTitle")}
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
            aria-label={t("zoomOut")}
            title={t("zoomOut")}
            onClick={() => update({ zoom: Math.max(0.6, Math.round(((config.zoom ?? 1) - 0.1) * 10) / 10) })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("zoomIn")}
            title={t("zoomIn")}
            onClick={() => update({ zoom: Math.min(1.8, Math.round(((config.zoom ?? 1) + 0.1) * 10) / 10) })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("center")}
            title={t("center")}
            onClick={() => update({ zoom: 1 })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            <Crosshair className="h-4 w-4" />
          </button>
        </div>

        {/* RIGHT dock — fullscreen */}
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-1.5 py-1 text-white shadow-soft backdrop-blur"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label={t("fullscreen")}
            title={t("fullscreen")}
            onClick={() => window.dispatchEvent(new CustomEvent("mudita:fullscreen-toggle"))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        💡 {t("dragTip")} {t("rotateTip")}
      </p>
    </div>
  );
}
