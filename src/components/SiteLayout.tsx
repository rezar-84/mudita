import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { t, useLocale, setLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "navHome" as const },
  { to: "/tasarla", key: "navDesign" as const },
  { to: "/galeri", key: "navGallery" as const },
  { to: "/yukle", key: "navUpload" as const },
  { to: "/hakkimizda", key: "navAbout" as const },
  { to: "/sss", key: "navFaq" as const },
  { to: "/iletisim", key: "navContact" as const },
] as const;

function LanguageSelector({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5 text-xs font-semibold",
        className,
      )}
    >
      <Globe className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {(["tr", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            "min-w-[2rem] rounded-full px-2 py-1 transition",
            locale === l
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useLocale(); // re-render on language change
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="Mudita Dekorasyon" className="h-9 w-auto" />
        </Link>
        <nav className="hidden min-w-0 items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium transition"
              activeOptions={{ exact: n.to === "/" }}
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector className="hidden sm:inline-flex" />
          <Link
            to="/tasarla"
            className="hidden rounded-full bg-gradient-neon px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:opacity-90 md:inline-block"
          >
            {t("ctaDesign")}
          </Link>
          <Link to="/sepet" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
            {t("navCart")}
          </Link>
          <button
            className="rounded-md border border-border p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                {t(n.key)}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">{t("language")}</span>
              <LanguageSelector />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  useLocale();
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img src={logo} alt="Mudita Dekorasyon" className="h-10 w-auto" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            El emeği, kalbi ve tasarım sevgisiyle üretilen neon tabelalar. 2021'den beri Türkiye'den dünyaya.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Keşfet</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/tasarla" className="hover:text-foreground">{t("ctaDesign")}</Link></li>
            <li><Link to="/galeri" className="hover:text-foreground">{t("navGallery")}</Link></li>
            <li><Link to="/yukle" className="hover:text-foreground">{t("ctaUploadLogo")}</Link></li>
            <li><Link to="/sss" className="hover:text-foreground">{t("navFaq")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">{t("navContact")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>WhatsApp · Hızlı sipariş</li>
            <li><Link to="/iletisim" className="hover:text-foreground">{t("navContact")}</Link></li>
            <li>{t("shippingTip")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Mudita Dekorasyon · Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
