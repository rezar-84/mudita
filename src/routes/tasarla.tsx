import { createFileRoute } from "@tanstack/react-router";
import { DesignerProvider } from "@/components/configurator/DesignerContext";
import { NeonPreview } from "@/components/configurator/NeonPreview";
import { ConfiguratorPanel } from "@/components/configurator/ConfiguratorPanel";
import { PriceSummary } from "@/components/configurator/PriceSummary";
import { BackgroundToggle } from "@/components/configurator/BackgroundToggle";

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
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Neon Tabelanı Tasarla</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Yazını gir, stilini seç ve canlı önizlemede sonucu gör.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* LEFT: preview + summary on desktop */}
          <div className="space-y-4">
            <NeonPreview />
            <BackgroundToggle />
            <div className="hidden lg:block">
              <PriceSummary />
            </div>
          </div>

          {/* RIGHT: config panel */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <ConfiguratorPanel />
            </div>
            {/* mobile: summary below panel */}
            <div className="lg:hidden">
              <PriceSummary />
            </div>
          </div>
        </div>
      </div>
    </DesignerProvider>
  );
}
