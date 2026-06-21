import { createFileRoute } from "@tanstack/react-router";
import { DesignerProvider, useDesigner } from "@/components/configurator/DesignerContext";
import { NeonPreview } from "@/components/configurator/NeonPreview";
import { ConfiguratorPanel } from "@/components/configurator/ConfiguratorPanel";
import { PriceSummary } from "@/components/configurator/PriceSummary";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
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
  return (
    <DesignerProvider>
      <div className="mx-auto max-w-7xl px-4 py-6 pb-28 md:py-10 lg:pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Neon Tabelanı Tasarla</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("livePreviewTip")} · Yazını gir, stilini seç, fiyat anında güncellenir.
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/40 px-3 py-1 text-xs text-foreground">
            ✅ {t("approvalTip")} · Türkiye geneli güvenli kargo
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          {/* LEFT: preview + desktop summary */}
          <div className="space-y-4 order-1">
            <div className="lg:sticky lg:top-4 lg:z-10 space-y-4">
              <NeonPreview />
            </div>
            <div className="hidden lg:block">
              <PriceSummary />
            </div>
          </div>

          {/* RIGHT: config panel */}
          <div className="space-y-4 order-2">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-soft">
              <ConfiguratorPanel />
            </div>
            <div className="hidden md:block lg:hidden">
              <PriceSummary />
            </div>
          </div>
        </div>

        {/* Mobile sticky price bar */}
        <MobilePriceBar />
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
    toast.success("Ürün sepete eklendi");
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
          <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
        </Button>
      </div>
    </div>
  );
}
