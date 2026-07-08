import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DesignerProvider,
  useDesigner,
} from "@/components/configurator/DesignerContext";
import { EditorShell } from "@/components/designer/EditorShell";
import { FullscreenDesigner } from "@/components/configurator/FullscreenDesigner";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { t } from "@/lib/i18n";
import { usePricingOverrides } from "@/hooks/usePricing";

export const Route = createFileRoute("/tasarla")({
  head: () => ({
    meta: [
      { title: "Neon Tabelanı Tasarla · MudiNeon" },
      { name: "description", content: "Figma tarzı editörle kişiye özel LED neon tabelanı tasarla. Anında TRY fiyat." },
      { property: "og:title", content: "Neon Tabelanı Tasarla · MudiNeon" },
      { property: "og:description", content: "Yazını, fontunu, rengini ve süslemelerini seç. Anında fiyat al." },
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
      <div className="mx-auto w-full max-w-[1400px] overflow-x-clip px-3 py-4 pb-28 sm:px-4 md:py-6 lg:pb-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold sm:text-2xl">{t("designerTitle")}</h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {t("designerSubtitle")} · ✅ {t("approvalTip")}
            </p>
          </div>
        </div>

        <EditorShell variant="page" />

        <MobilePriceBar />

        {fullscreen && <FullscreenDesigner onExit={() => setFullscreen(false)} />}
      </div>
    </DesignerProvider>
  );
}

function MobilePriceBar() {
  const { config } = useDesigner();
  const pricing = usePricingOverrides();
  const breakdown = calculatePrice(config, pricing);
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
