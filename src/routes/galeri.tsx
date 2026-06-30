import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { encodeConfig } from "@/lib/share";
import type { NeonDesignConfig } from "@/lib/types";
import { defaultConfig } from "@/components/configurator/DesignerContext";
import { useT, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/galeri")({
  head: () => ({
    meta: [
      { title: "İlham Galerisi · Neon Tabela Örnekleri · Mudita Dekorasyon" },
      { name: "description", content: "Ev, ofis, kafe, düğün, bebek odası, logo ve mağaza için ürettiğimiz neon tabelalardan ilham al ve kendi tasarımını yap." },
      { property: "og:title", content: "Neon Tabela İlham Galerisi · Mudita Dekorasyon" },
      { property: "og:description", content: "Kategoriye göre filtrele, beğendiğin tarzın benzerini birkaç tıkla tasarla." },
    ],
  }),
  component: GalleryPage,
});

type Category = "Tümü" | "Ev" | "Ofis" | "Kafe" | "Düğün" | "Bebek Odası" | "Logo" | "Mağaza";

const categoryKeys: Record<Category, string> = {
  "Tümü": "categoryAll",
  "Ev": "categoryHome",
  "Ofis": "categoryOffice",
  "Kafe": "categoryCafe",
  "Düğün": "categoryWedding",
  "Bebek Odası": "categoryBaby",
  "Logo": "categoryLogo",
  "Mağaza": "categoryShop"
};

interface Item {
  text: string;
  fontId: NeonDesignConfig["fontId"];
  fontFamily: string;
  colorId: NeonDesignConfig["colorId"];
  color: string;
  glow: string;
  cat: Exclude<Category, "Tümü">;
  title: string;
  useCase: string;
}

const ITEMS: Item[] = [
  { text: "Aşk", fontId: "pacifico", fontFamily: "'Pacifico', cursive", colorId: "pink", color: "#ff8ad1", glow: "#ff3eb5", cat: "Düğün", title: "Düğün Arkası Aşk", useCase: "Nikah masası arkası, fotoğraf köşesi" },
  { text: "Forever", fontId: "pacifico", fontFamily: "'Pacifico', cursive", colorId: "orange", color: "#ffb27a", glow: "#ff7a00", cat: "Düğün", title: "Forever — Söz / Nişan", useCase: "Söz, nişan ve kına gecesi" },
  { text: "Open", fontId: "bungee", fontFamily: "'Bungee', sans-serif", colorId: "red", color: "#ff4d6d", glow: "#ff003c", cat: "Mağaza", title: "Open · Vitrin Tabelası", useCase: "Mağaza ve butik vitrini" },
  { text: "Coffee", fontId: "caveat", fontFamily: "'Caveat', cursive", colorId: "yellow", color: "#ffd56b", glow: "#ffaa00", cat: "Kafe", title: "Coffee · Sıcak Köşe", useCase: "Kafe ve kahve dükkanı" },
  { text: "Bar", fontId: "russo", fontFamily: "'Russo One', sans-serif", colorId: "yellow", color: "#fff48a", glow: "#ffd400", cat: "Kafe", title: "Bar · Gece Atmosferi", useCase: "Bar, restoran, lounge" },
  { text: "Hello", fontId: "monoton", fontFamily: "'Monoton', cursive", colorId: "blue", color: "#7ab8ff", glow: "#1e90ff", cat: "Ev", title: "Hello · Giriş Duvarı", useCase: "Antre ve oturma odası" },
  { text: "Dream", fontId: "montserrat", fontFamily: "'Montserrat', sans-serif", colorId: "purple", color: "#cba0ff", glow: "#8a2be2", cat: "Ev", title: "Dream · Yatak Odası", useCase: "Yatak odası başucu" },
  { text: "Baby", fontId: "caveat", fontFamily: "'Caveat', cursive", colorId: "pink", color: "#ff8ad1", glow: "#ff3eb5", cat: "Bebek Odası", title: "Baby · Bebek Odası", useCase: "Bebek odası dekorasyonu" },
  { text: "Defne", fontId: "pacifico", fontFamily: "'Pacifico', cursive", colorId: "warm-white", color: "#fff1c1", glow: "#ffd56b", cat: "Bebek Odası", title: "İsme Özel Bebek Tabelası", useCase: "Bebeğin ismi ile özel hediye" },
  { text: "Work", fontId: "montserrat", fontFamily: "'Montserrat', sans-serif", colorId: "cool-white", color: "#eaf6ff", glow: "#9ed8ff", cat: "Ofis", title: "Work · Modern Ofis", useCase: "Ofis ve toplantı odası" },
  { text: "Ideas", fontId: "bungee", fontFamily: "'Bungee', sans-serif", colorId: "green", color: "#8fffb0", glow: "#00d96b", cat: "Ofis", title: "Ideas · Çalışma Köşesi", useCase: "Ajans ve yaratıcı ofis" },
  { text: "Mudita", fontId: "pacifico", fontFamily: "'Pacifico', cursive", colorId: "pink", color: "#ff8ad1", glow: "#ff3eb5", cat: "Logo", title: "Marka Logosu Neon", useCase: "Marka logonuzun neon versiyonu" },
];

const CATEGORIES: Category[] = ["Tümü", "Ev", "Ofis", "Kafe", "Düğün", "Bebek Odası", "Logo", "Mağaza"];

function buildDesignUrl(item: Item): string {
  const cfg: NeonDesignConfig = {
    ...defaultConfig,
    text: item.text,
    fontId: item.fontId,
    colorId: item.colorId,
  };
  return `/tasarla?d=${encodeConfig(cfg)}`;
}

function GalleryPage() {
  const t = useT();
  const [active, setActive] = useState<Category>("Tümü");
  const filtered = useMemo(
    () => (active === "Tümü" ? ITEMS : ITEMS.filter((i) => i.cat === active)),
    [active],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">{t("galleryTitle")}</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          {t("gallerySubtitle")}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition",
              active === c
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:border-foreground/40",
            )}
          >
            {t(categoryKeys[c] as TKey)}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-preset-dark">
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <span
                  className="neon-text text-5xl"
                  style={{
                    fontFamily: it.fontFamily,
                    color: it.color,
                    textShadow: `0 0 4px ${it.color}, 0 0 14px ${it.glow}, 0 0 28px ${it.glow}, 0 0 60px ${it.glow}`,
                  }}
                >
                  {it.text}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                {it.cat}
              </div>
            </div>
            <div className="space-y-2 p-4">
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-xs text-muted-foreground">{it.useCase}</p>
              <a
                href={buildDesignUrl(it)}
                className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-gradient-neon px-4 py-2 text-xs font-semibold text-white shadow-glow"
              >
                Benzerini Tasarla
              </a>

            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/tasarla"
          className="inline-block rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Sıfırdan Tasarla
        </Link>
      </div>
    </div>
  );
}
