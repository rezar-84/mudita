import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteLayout";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Aradığınız sayfa bulunamadı.</p>
        <a href="/" className="mt-6 inline-block rounded-full bg-gradient-neon px-5 py-2 text-sm text-white shadow-glow">
          Ana sayfaya dön
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mudita Dekorasyon · Kişiye Özel LED Neon Tabela" },
      { name: "description", content: "Kişiye özel LED neon tabela tasarla, anında fiyat al. Türkiye geneli kargo, el emeği üretim." },
      { name: "author", content: "Mudita Dekorasyon" },
      { property: "og:title", content: "Mudita Dekorasyon · Kişiye Özel LED Neon Tabela" },
      { property: "og:description", content: "Kişiye özel LED neon tabela tasarla, anında fiyat al. Türkiye geneli kargo, el emeği üretim." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Mudita Dekorasyon · Kişiye Özel LED Neon Tabela" },
      { name: "twitter:description", content: "Kişiye özel LED neon tabela tasarla, anında fiyat al. Türkiye geneli kargo, el emeği üretim." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/7d50e153-e1a7-4217-b9c9-517eff5016f5" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/7d50e153-e1a7-4217-b9c9-517eff5016f5" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pacifico&family=Caveat:wght@400;700&family=Bungee&family=Montserrat:wght@500;700&family=Russo+One&family=Monoton&family=Lobster&family=Great+Vibes&family=Dancing+Script:wght@500;700&family=Playfair+Display:wght@600;800&family=Poppins:wght@500;700&family=Bebas+Neue&family=Quicksand:wght@500;700&family=Righteous&family=Satisfy&family=Sacramento&family=Comfortaa:wght@500;700&family=Abril+Fatface&family=Cinzel:wght@600;800&family=Permanent+Marker&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster richColors position="top-center" />
    </div>
  );
}
