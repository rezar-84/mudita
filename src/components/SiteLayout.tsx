import { Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { Menu, X, Globe, User, History, Package, Settings, LogIn, Shield, LogOut, ShoppingCart } from "lucide-react";
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

function LanguagePill({ className }: { className?: string }) {
  const t = useT();
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
            locale === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function LanguageDropdown() {
  const t = useT();
  const locale = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("language")}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition"
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="tabular-nums">{locale.toUpperCase()}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[7rem] bg-card border border-border">
        {(["tr", "en"] as Locale[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={cn(
              "cursor-pointer text-sm",
              locale === l && "bg-accent font-semibold text-foreground",
            )}
          >
            {l === "tr" ? "Türkçe" : "English"}
            <span className="ml-auto text-[10px] text-muted-foreground">{l.toUpperCase()}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const t = useT();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const locale = useLocale();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  if (loading) {
    return <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />;
  }

  if (!user) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition"
      >
        <LogIn className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("userMenuSignIn")}</span>
      </Link>
    );
  }

  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2 text-xs hover:bg-accent transition cursor-pointer focus:outline-none">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-neon text-[10px] font-semibold text-white">
            {initial}
          </span>
          <span className="hidden max-w-[9rem] truncate lg:inline">{user.email}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border border-border shadow-soft z-50">
        <DropdownMenuLabel className="flex items-center gap-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-neon text-sm font-semibold text-white">
            {initial}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">{user.email}</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              {isAdmin ? "Admin" : t("userMenuMyAccount")}
            </span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem asChild>
          <Link to="/hesap" className="flex w-full items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" /> <span>{t("userMenuMyAccount")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/hesap/tasarimlar" className="flex w-full items-center gap-2 cursor-pointer">
            <History className="h-4 w-4" /> <span>{t("userMenuMyDesigns")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/hesap/siparisler" className="flex w-full items-center gap-2 cursor-pointer">
            <Package className="h-4 w-4" /> <span>{t("userMenuMyOrders")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/hesap/profil" className="flex w-full items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" /> <span>{t("userMenuProfile")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <div className="flex items-center justify-between px-2 py-1.5 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Globe className="h-3.5 w-3.5" /> {t("userMenuLanguage")}
          </span>
          <div className="inline-flex items-center gap-0.5 rounded-full border border-border p-0.5">
            {(["tr", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                className={cn(
                  "min-w-[2rem] rounded-full px-2 py-0.5 font-semibold transition",
                  locale === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex w-full items-center gap-2 cursor-pointer text-neon-pink">
                <Shield className="h-4 w-4" /> <span>{t("userMenuAdmin")}</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={signOut}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" /> <span>{t("userMenuSignOut")}</span>
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
      {/* Utility topbar: compact — language dropdown, cart, user menu */}
      <div className="border-b border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-1 px-4 py-1">
          <LanguageDropdown />
          <span className="h-4 w-px bg-border/70" aria-hidden />
          <Link
            to="/sepet"
            aria-label={t("navCart")}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("navCart")}</span>
          </Link>
          <span className="h-4 w-px bg-border/70" aria-hidden />
          <UserMenu />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="MudiNeon" className="h-9 w-auto" />
        </Link>

        {/* Desktop nav only appears at XL to prevent mid-width crowding */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
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
          <Link
            to="/tasarla"
            className="hidden rounded-full bg-gradient-neon px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:opacity-90 xl:inline-block"
          >
            {t("ctaDesign")}
          </Link>

          <button
            className="rounded-md border border-border p-2 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("menuAria")}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>


      {open && (
        <nav className="border-t border-border bg-background xl:hidden">
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
            <Link
              to="/tasarla"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gradient-neon px-4 py-2 text-center text-sm font-medium text-white shadow-glow"
            >
              {t("ctaDesign")}
            </Link>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">{t("language")}</span>
              <LanguagePill />
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
