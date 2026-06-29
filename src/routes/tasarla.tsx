import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DesignerProvider, useDesigner } from "@/components/configurator/DesignerContext";
import { NeonPreview } from "@/components/configurator/NeonPreview";
import { ConfiguratorPanel } from "@/components/configurator/ConfiguratorPanel";
import { PriceSummary } from "@/components/configurator/PriceSummary";
import { FullscreenDesigner } from "@/components/configurator/FullscreenDesigner";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Maximize2, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/tasarla")({
  head: () => ({
    meta: [
      { title: "Neon Tabelanı Tasarla · Mudita Dekorasyon" },
      { name: "description", content: "Kişiye özel LED neon tabelanı canlı önizleme ile tasarla. Anında TRY fiyat." },
      { property: "og:title", content: "Neon Tabelanı Tasarla · Mudita Dekorasyon" },
      { property: "og:description", content: "Yazını, fontunu, rengini ve ölçünü seç. Anında fiyat al." },
    ],
  }),
  component: DesignerPage,
});

function DesignerPage() {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setFullscreen((v) => !v);
    window.addEventListener("mudita:fullscreen-toggle", handler);
    return () => window.removeEventListener("mudita:fullscreen-toggle", handler);
  }, []);

  return (
    <DesignerProvider>
      <div className="mx-auto w-full max-w-7xl overflow-x-clip px-4 py-6 pb-28 md:py-10 lg:pb-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">{t("designerTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("livePreviewTip")} · {t("designerSubtitle")}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/40 px-3 py-1 text-xs text-foreground">
              ✅ {t("approvalTip")} · {t("shippingTip")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreen(true)}
            className="shrink-0"
          >
            <Maximize2 className="mr-1.5 h-3.5 w-3.5" /> Tam Ekran Tasarla
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
          {/* LEFT: preview + desktop summary */}
          <div className="order-1 min-w-0 space-y-4">
            <div className="space-y-4 lg:sticky lg:top-4 lg:z-10">
              <NeonPreview />
            </div>
            <div className="hidden lg:block">
              <PriceSummary />
            </div>
          </div>

          {/* RIGHT: config panel */}
          <div className="order-2 min-w-0 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
              <ConfiguratorPanel />
            </div>
            <div className="hidden md:block lg:hidden">
              <PriceSummary />
            </div>
          </div>
        </div>

        {/* Mobile sticky price bar */}
        <MobilePriceBar />

        {fullscreen && <FullscreenDesigner onExit={() => setFullscreen(false)} />}
      </div>
    </DesignerProvider>
  );
}

function MobilePriceBar() {
  const { config } = useDesigner();
  const breakdown = calculatePrice(config);
  const navigate = useNavigate();

  const onAdd = () => {
    addToCart(config, breakdown.total);
    toast.success(t("productAddedToCart"));
    setTimeout(() => navigate({ to: "/sepet" }), 400);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 shadow-soft backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("estimatedPrice")}
          </div>
          <div className="truncate text-lg font-bold tabular-nums">
            {formatTRY(breakdown.total)}
          </div>
        </div>
        <Button
          onClick={onAdd}
          className="shrink-0 bg-gradient-neon text-white shadow-glow hover:opacity-90"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> {t("ctaAddToCart")}
        </Button>
      </div>
    </div>
  );
}
