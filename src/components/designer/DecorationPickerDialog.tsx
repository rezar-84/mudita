import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DECORATIONS, DECORATION_CATEGORY_LABEL, type DecorationPreset } from "@/data/decorations";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const CATEGORIES = ["all", ...new Set(DECORATIONS.map((d) => d.category))] as const;
type Cat = (typeof CATEGORIES)[number];

export function DecorationPickerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { config, addDecoration } = useDesigner();
  const t = useT();
  const [cat, setCat] = useState<Cat>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DECORATIONS.filter((d) => {
      if (cat !== "all" && d.category !== cat) return false;
      if (q && !d.label.toLowerCase().includes(q) && !d.id.includes(q)) return false;
      return true;
    });
  }, [cat, query]);

  function onPick(preset: DecorationPreset) {
    addDecoration({
      id: `preset-${preset.id}-${Date.now()}`,
      source: "preset",
      presetId: preset.id,
      label: preset.label,
      colorId: config.colorId,
      x: 0,
      y: 0,
      rotation: 0,
      sizePct: 18,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[210] max-h-[85vh] w-[min(720px,96vw)] max-w-none overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle>{t("decoPickerTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 border-b border-border bg-card/60 px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("decoPickerSearchPlaceholder")}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  cat === c
                    ? "border-foreground bg-accent text-foreground"
                    : "border-border text-muted-foreground hover:bg-accent/40",
                )}
              >
                {c === "all" ? t("decoPickerAll") : DECORATION_CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto p-4">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {filtered.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onPick(d)}
                className="group flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-border bg-secondary/40 p-2 text-center transition hover:border-neon-cyan/60 hover:bg-secondary"
                title={d.label}
              >
                <svg
                  viewBox={d.viewBox ?? "0 0 24 24"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-9 w-9 text-foreground transition group-hover:text-neon-cyan"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(0,255,255,0.0)) drop-shadow(0 0 0 transparent)",
                  }}
                  aria-hidden
                >
                  <path d={d.path} />
                </svg>
                <span className="line-clamp-1 text-[11px] text-muted-foreground">
                  {d.label}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                {t("noResults")}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-card/80 px-4 py-3 text-xs text-muted-foreground">
          {t("decoPickerFooterA")}<strong className="text-foreground">{t("toolSvgUpload")}</strong>{t("decoPickerFooterB")}
        </div>
      </DialogContent>
    </Dialog>
  );
}
