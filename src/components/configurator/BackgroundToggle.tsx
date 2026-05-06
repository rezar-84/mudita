import { useDesigner } from "./DesignerContext";
import { cn } from "@/lib/utils";

const OPTS = [
  { id: "brick", label: "Tuğla" },
  { id: "dark-room", label: "Karanlık" },
  { id: "wall", label: "Duvar" },
  { id: "transparent", label: "Şeffaf" },
] as const;

export function BackgroundToggle() {
  const { config, update } = useDesigner();
  return (
    <div className="flex flex-wrap gap-2">
      {OPTS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => update({ background: o.id })}
          className={cn(
            "rounded-full border px-3 py-1 text-xs transition",
            config.background === o.id
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card hover:border-foreground/40",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
