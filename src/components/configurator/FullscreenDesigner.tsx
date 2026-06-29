import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeonPreview } from "./NeonPreview";
import { ConfiguratorPanel } from "./ConfiguratorPanel";
import { PriceSummary } from "./PriceSummary";

/**
 * In-page fullscreen overlay for the neon designer.
 * No navigation, no body scroll while open, ESC to exit.
 */
export function FullscreenDesigner({ onExit }: { onExit: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onExit]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-2 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Tam Ekran Tasarla</p>
          <p className="hidden text-[11px] text-muted-foreground sm:block">
            ESC tuşuyla tam ekrandan çıkabilirsin.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onExit} className="shrink-0">
          <Minimize2 className="mr-1.5 h-3.5 w-3.5" /> Tam Ekrandan Çık
        </Button>
      </div>

      {/* body */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* preview */}
        <div className="min-h-0 overflow-auto bg-canvas/40 p-4 lg:p-6">
          <div className="mx-auto flex h-full max-w-5xl items-center">
            <div className="w-full">
              <NeonPreview />
            </div>
          </div>
        </div>
        {/* drawer */}
        <aside className="flex min-h-0 flex-col border-t border-border bg-card lg:border-l lg:border-t-0">
          <div className="min-h-0 flex-1 overflow-auto p-4">
            <ConfiguratorPanel />
          </div>
          <div className="border-t border-border p-3">
            <PriceSummary />
          </div>
        </aside>
      </div>
    </div>,
    document.body,
  );
}
