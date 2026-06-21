import { useDesigner } from "./DesignerContext";
import { cn } from "@/lib/utils";
import { BACKGROUNDS } from "@/data/options";
import { t } from "@/lib/i18n";

export function BackgroundToggle() {
  const { config, update } = useDesigner();
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {t("previewBackground")}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {BACKGROUNDS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => update({ background: o.id })}
            title={o.label}
            className={cn(
              "group relative overflow-hidden rounded-lg border-2 transition",
              config.background === o.id
                ? "border-foreground ring-2 ring-foreground/30"
                : "border-border hover:border-foreground/40",
            )}
          >
            <div className={cn("h-12 w-full", o.thumb)} aria-hidden />
            <div className="truncate bg-card px-1.5 py-1 text-[10px] font-medium text-foreground">
              {o.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
