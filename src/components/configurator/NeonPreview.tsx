import { useDesigner } from "./DesignerContext";
import { COLORS, FONTS } from "@/data/options";
import { getDimensions } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const BG_CLASS: Record<string, string> = {
  brick: "bg-preset-brick",
  "dark-room": "bg-preset-dark",
  wall: "bg-preset-wall",
  "light-wall": "bg-preset-light-wall",
  transparent: "bg-preset-transparent",
};

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

  const glow = color.glow;
  const fill = color.hex;
  // Layered glow for more realism
  const textShadow = [
    `0 0 2px ${fill}`,
    `0 0 6px ${fill}`,
    `0 0 14px ${glow}`,
    `0 0 30px ${glow}`,
    `0 0 60px ${glow}`,
    `0 0 100px ${glow}`,
  ].join(", ");

  const isLight = config.background === "light-wall";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border shadow-soft",
        BG_CLASS[config.background],
      )}
      style={{ aspectRatio: `${width}/${Math.max(height, 30)}`, minHeight: 280 }}
    >
      {/* Ambient glow halo on dark backgrounds */}
      {!isLight && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glow}22 0%, transparent 60%)`,
          }}
          aria-hidden
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center px-6 py-10">
        <div
          className={cn(
            "text-center select-none transition-opacity",
            color.rgb ? "neon-rgb" : "neon-text",
            isEmpty && "opacity-40",
          )}
          style={{
            fontFamily: font.family,
            fontSize: `${fontSize}px`,
            color: fill,
            textShadow,
            filter: `drop-shadow(0 0 18px ${glow})`,
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

