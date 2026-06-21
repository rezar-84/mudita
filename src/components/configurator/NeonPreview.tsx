import { useDesigner } from "./DesignerContext";
import { COLORS, FONTS, BACKGROUNDS } from "@/data/options";
import { getDimensions } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const BG_CLASS: Record<string, string> = Object.fromEntries(
  BACKGROUNDS.map((b) => [b.id, b.thumb]),
);

const LIGHT_BACKGROUNDS = new Set(["light-wall", "white-wall"]);

export function NeonPreview() {
  const { config } = useDesigner();
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

  const glow = color.glow;
  const fill = color.hex;

  // Brightness scales glow opacity by shrinking shadow radii slightly + opacity
  const g = (px: number) => Math.round(px * brightness);
  const textShadow = [
    `0 0 2px ${fill}`,
    `0 0 ${g(6)}px ${fill}`,
    `0 0 ${g(14)}px ${glow}`,
    `0 0 ${g(30)}px ${glow}`,
    `0 0 ${g(60)}px ${glow}`,
    `0 0 ${g(100)}px ${glow}`,
  ].join(", ");

  const isLight = LIGHT_BACKGROUNDS.has(config.background);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border shadow-soft",
        BG_CLASS[config.background],
      )}
      style={{ aspectRatio: `${width}/${Math.max(height, 30)}`, minHeight: 280 }}
    >
      {/* Ambient glow halo on dark backgrounds — wall reflection */}
      {!isLight && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 55%, ${glow}${Math.round(brightness * 38).toString(16).padStart(2, "0")} 0%, transparent 62%)`,
            opacity: 0.9,
          }}
          aria-hidden
        />
      )}

      <div
        className="absolute inset-0 flex items-center justify-center px-6 py-10"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
      >
        <div
          className={cn(
            "text-center select-none transition-opacity",
            color.rgb ? "neon-rgb" : "neon-text",
            !flicker && "neon-no-flicker",
            isEmpty && "opacity-40",
          )}
          style={{
            fontFamily: font.family,
            fontSize: `${fontSize}px`,
            color: fill,
            textShadow,
            filter: `drop-shadow(0 0 ${g(18)}px ${glow})`,
            opacity: Math.min(1, 0.55 + brightness * 0.5),
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {displayText}
        </div>
      </div>

      <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
        ≈ {width} × {height} cm
      </div>
      {config.outdoor && (
        <div className="absolute top-3 right-3 rounded-md bg-neon-cyan/90 px-2 py-1 text-xs font-medium text-black">
          Dış Mekan · IP65
        </div>
      )}
      {isEmpty && (
        <div className="absolute inset-x-0 bottom-12 text-center text-xs text-white/70">
          Sağdaki kutuya yazını yaz, önizleme canlansın ✨
        </div>
      )}
    </div>
  );
}
