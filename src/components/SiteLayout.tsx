import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/tasarla", label: "Tasarla" },
  { to: "/galeri", label: "Galeri" },
  { to: "/yukle", label: "Görsel Yükle" },
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/sss", label: "S.S.S." },
  { to: "/iletisim", label: "İletişim" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Mudita Dekorasyon" className="h-9 w-auto" />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium transition"
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/tasarla"
            className="hidden rounded-full bg-gradient-neon px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:opacity-90 sm:inline-block"
          >
            Neon Tabelanı Tasarla
          </Link>
          <Link to="/sepet" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
            Sepet
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
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
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
            <li><Link to="/tasarla" className="hover:text-foreground">Neon Tabelanı Tasarla</Link></li>
            <li><Link to="/galeri" className="hover:text-foreground">İlham Galerisi</Link></li>
            <li><Link to="/yukle" className="hover:text-foreground">Logo / Görsel ile Teklif</Link></li>
            <li><Link to="/sss" className="hover:text-foreground">S.S.S.</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">İletişim</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>WhatsApp · Hızlı sipariş</li>
            <li><Link to="/iletisim" className="hover:text-foreground">Teklif & İletişim Formu</Link></li>
            <li>Türkiye geneli kargo</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Mudita Dekorasyon · Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
