import { useDesigner } from "./DesignerContext";
import { FONTS, FONT_CATEGORY_LABEL, FONT_CATEGORY_ORDER } from "@/data/options";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { FontBadge, FontCategory } from "@/lib/types";

const BADGE_KEY: Record<FontBadge, "badgePopular" | "badgePremium" | "badgeLogo"> = {
  popular: "badgePopular",
  premium: "badgePremium",
  logo: "badgeLogo",
};

const BADGE_STYLE: Record<FontBadge, string> = {
  popular: "bg-neon-cyan/20 text-foreground border-neon-cyan/40",
  premium: "bg-gradient-neon text-white border-transparent",
  logo: "bg-accent/60 text-accent-foreground border-accent",
};

export function FontSelector() {
  const { config, update } = useDesigner();

  const grouped = FONT_CATEGORY_ORDER
    .map((cat) => ({ cat, fonts: FONTS.filter((f) => f.category === cat) }))
    .filter((g) => g.fonts.length > 0);

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">{t("fontMoodTip")}</p>
      {grouped.map(({ cat, fonts }) => (
        <FontGroup
          key={cat}
          category={cat}
          fonts={fonts}
          selectedId={config.fontId}
          onSelect={(id) => update({ fontId: id })}
        />
      ))}
    </div>
  );
}

function FontGroup({
  category,
  fonts,
  selectedId,
  onSelect,
}: {
  category: FontCategory;
  fonts: typeof FONTS;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {FONT_CATEGORY_LABEL[category]}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {fonts.map((f) => {
          const selected = selectedId === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelect(f.id)}
              className={cn(
                "group relative flex h-24 flex-col items-center justify-center overflow-hidden rounded-xl border bg-card p-2 text-center transition",
                selected
                  ? "border-foreground bg-accent/30 shadow-soft"
                  : "border-border hover:border-foreground/40",
              )}
            >
              <span
                className="block truncate text-xl leading-none"
                style={{ fontFamily: f.family }}
              >
                Mudita
              </span>
              <span className="mt-1 truncate text-[10px] text-muted-foreground">
                {f.label}
              </span>
              {f.badges && f.badges.length > 0 && (
                <div className="absolute left-1 top-1 flex flex-wrap gap-1">
                  {f.badges.map((b) => (
                    <span
                      key={b}
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 text-[9px] font-medium leading-none",
                        BADGE_STYLE[b],
                      )}
                    >
                      {t(BADGE_KEY[b])}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
