import { Outlet, createRootRouteWithContext, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteLayout";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { useLocale } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MudiNeon · Kişiye Özel LED Neon Tabela" },
      { name: "description", content: "Kişiye özel LED neon tabela tasarla, anında fiyat al. Türkiye geneli kargo, el emeği üretim." },
      { name: "author", content: "MudiNeon" },
      { property: "og:title", content: "MudiNeon · Kişiye Özel LED Neon Tabela" },
      { property: "og:description", content: "Kişiye özel LED neon tabela tasarla, anında fiyat al. Türkiye geneli kargo, el emeği üretim." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mudineon.com" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "MudiNeon · Kişiye Özel LED Neon Tabela" },
      { name: "twitter:description", content: "Kişiye özel LED neon tabela tasarla, anında fiyat al. Türkiye geneli kargo, el emeği üretim." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://mudineon.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pacifico&family=Caveat:wght@400;700&family=Bungee&family=Montserrat:wght@500;700&family=Russo+One&family=Monoton&family=Lobster&family=Great+Vibes&family=Dancing+Script:wght@500;700&family=Playfair+Display:wght@600;800&family=Poppins:wght@500;700&family=Bebas+Neue&family=Quicksand:wght@500;700&family=Righteous&family=Satisfy&family=Sacramento&family=Comfortaa:wght@500;700&family=Abril+Fatface&family=Cinzel:wght@600;800&family=Permanent+Marker&family=Allura&family=Kaushan+Script&family=Yellowtail&family=Tangerine&family=Parisienne&family=Marck+Script&family=Anton&family=Black+Ops+One&family=Audiowide&family=Faster+One&family=Press+Start+2P&family=Alfa+Slab+One&family=Fredoka:wght@300..700&family=Bowlby+One&family=Staatliches&display=swap",
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
      <body className="overflow-x-hidden" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthStateSync() {
  const router = useRouter();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);
  return null;
}

function RootComponent() {
  useLocale();
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthStateSync />
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-x-clip">
          <Outlet />
        </main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
        <WhatsAppWidget />
      </div>
    </QueryClientProvider>
  );
}
