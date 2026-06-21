import { useDesigner } from "./DesignerContext";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const OPTS = [
  { id: "brick", labelKey: "bgBrick" },
  { id: "dark-room", labelKey: "bgDark" },
  { id: "wall", labelKey: "bgWall" },
  { id: "light-wall", labelKey: "bgLightWall" },
  { id: "transparent", labelKey: "bgTransparent" },
] as const;

export function BackgroundToggle() {
  const { config, update } = useDesigner();
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{t("background")}</p>
      <div className="flex flex-wrap gap-2">
        {OPTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => update({ background: o.id })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              config.background === o.id
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:border-foreground/40",
            )}
          >
            {t(o.labelKey as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>
    </div>
  );
}

