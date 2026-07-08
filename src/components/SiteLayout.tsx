import { Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { Menu, X, Globe, User, History, Package, Settings, LogIn, Shield, LogOut } from "lucide-react";
import { useState } from "react";
import { useT, useLocale, setLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const t = useT();
  const locale = useLocale();
  return (
    <div role="group" aria-label={t("language")} className={cn("inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5 text-xs font-semibold", className)}>
      <Globe className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {(["tr", "en"] as Locale[]).map((l) => (
        <button key={l} type="button" onClick={() => setLocale(l)} aria-pressed={locale === l} className={cn("min-w-[2rem] rounded-full px-2 py-1 transition", locale === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-md border border-border p-2 text-sm hover:bg-accent transition cursor-pointer flex items-center gap-1.5 focus:outline-none">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">Hesabım</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border border-border shadow-soft z-50">
        <DropdownMenuLabel className="font-semibold text-foreground">Kullanıcı Paneli</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem disabled className="opacity-70 flex items-center gap-2 text-foreground focus:bg-accent cursor-not-allowed">
          <LogIn className="h-4 w-4" />
          <span>Giriş Yap / Kayıt Ol</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1 uppercase tracking-wider">Tasarımlar & Siparişler</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/tasarla" className="w-full flex items-center gap-2 cursor-pointer text-foreground focus:bg-accent">
            <History className="h-4 w-4" />
            <span>Önceki Tasarımlarım</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="opacity-70 flex items-center gap-2 text-foreground focus:bg-accent cursor-not-allowed">
          <Package className="h-4 w-4" />
          <span>Siparişlerim</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem disabled className="opacity-70 flex items-center gap-2 text-foreground focus:bg-accent cursor-not-allowed">
          <Settings className="h-4 w-4" />
          <span>Hesap Ayarları</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="MudiNeon" className="h-9 w-auto" />
        </Link>
        <nav className="hidden min-w-0 items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }} className="rounded-md px-3 py-2 text-sm font-medium transition" activeOptions={{ exact: n.to === "/" }}>
              {t(n.key)}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector className="hidden sm:inline-flex" />
          <Link to="/tasarla" className="hidden rounded-full bg-gradient-neon px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:opacity-90 md:inline-block">
            {t("ctaDesign")}
          </Link>
          <Link to="/sepet" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
            {t("navCart")}
          </Link>
          <UserMenu />
          <button className="rounded-md border border-border p-2 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={t("menuAria")}>
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">
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
  const t = useT();
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img src={logo} alt="MudiNeon" className="h-10 w-auto" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("footerTagline")}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">{t("footerExplore")}</h4>
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
            <li>{t("footerWhatsappQuick")}</li>
            <li><Link to="/iletisim" className="hover:text-foreground">{t("navContact")}</Link></li>
            <li>{t("shippingTip")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MudiNeon · {t("footerRights")}
      </div>
    </footer>
  );
}
