import { useDesigner } from "./DesignerContext";
import { COLORS, FONTS } from "@/data/options";
import { getDimensions } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const BG_CLASS = {
  brick: "bg-preset-brick",
  "dark-room": "bg-preset-dark",
  wall: "bg-preset-wall",
  transparent: "bg-preset-transparent",
} as const;

export function NeonPreview() {
  const { config } = useDesigner();
  const font = FONTS.find((f) => f.id === config.fontId) ?? FONTS[0];
  const color = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];
  const { width, height } = getDimensions(config);

  const lines = config.text.split("\n");
  const longestLine = Math.max(1, ...lines.map((l) => l.length));
  // size text to roughly fill width
  const fontSize = Math.max(28, Math.min(140, (width * 4) / longestLine));

  const glow = color.glow;
  const fill = color.hex;
  const textShadow = [
    `0 0 4px ${fill}`,
    `0 0 10px ${glow}`,
    `0 0 22px ${glow}`,
    `0 0 42px ${glow}`,
    `0 0 80px ${glow}`,
  ].join(", ");

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border",
        BG_CLASS[config.background],
      )}
      style={{ aspectRatio: `${width}/${Math.max(height, 30)}`, minHeight: 280 }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-6 py-10">
        <div
          className={cn("text-center select-none", color.rgb ? "neon-rgb" : "neon-text")}
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
          {config.text || "Yazınız buraya"}
        </div>
      </div>

      <div className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs text-white backdrop-blur">
        {width} × {height} cm
      </div>
      {config.outdoor && (
        <div className="absolute top-3 right-3 rounded-md bg-neon-cyan/90 px-2 py-1 text-xs font-medium text-black">
          Dış Mekan / IP65
        </div>
      )}
    </div>
  );
}
