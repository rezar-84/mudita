import { useDesigner } from "@/components/configurator/DesignerContext";
import { ConfiguratorPanel } from "@/components/configurator/ConfiguratorPanel";
import { DecorationProperties } from "./DecorationProperties";
import { TextLayerProperties } from "./TextLayerProperties";
import { LayersPanel } from "./LayersPanel";
import { AlignmentControls } from "./AlignmentControls";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertiesPanel({
  open,
  onClose,
  onOpen,
}: {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  const { selection } = useDesigner();
  const isDecoration = selection.kind === "decoration";
  const isTextLayer = selection.kind === "textLayer";

  if (!open) {
    return (
      <div className="hidden border-l border-border bg-card/60 lg:flex">
        <Button
          variant="ghost"
          size="icon"
          className="m-1 h-8 w-8"
          onClick={onOpen}
          title="Paneli Aç"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-border bg-card",
        // Mobile: full-width below canvas, no internal scroll (page scrolls instead)
        "w-full max-w-full border-t",
        // Desktop: 360px sticky side panel with internal scroll
        "lg:w-[360px] lg:max-w-[360px] lg:shrink-0 lg:border-l lg:border-t-0",
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isDecoration
            ? "Süsleme"
            : isTextLayer
              ? "Metin Katmanı"
              : selection.kind === "text"
                ? "Metin / Tasarım"
                : "Sahne"}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-7 w-7 lg:inline-flex"
          onClick={onClose}
          title="Paneli Gizle"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn(
          "p-3 sm:p-4",
          // Page flow on mobile, internal scroll on lg+
          "lg:min-h-0 lg:flex-1 lg:overflow-auto",
        )}
      >
        {isDecoration ? (
          <div className="space-y-4">
            <AlignmentControls />
            <DecorationProperties />
            <div id="layers-section">
              <LayersPanel />
            </div>
          </div>
        ) : isTextLayer ? (
          <div className="space-y-4">
            <AlignmentControls />
            <TextLayerProperties />
            <div id="layers-section">
              <LayersPanel />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <ConfiguratorPanel />
            <AlignmentControls />
            <div id="layers-section">
              <LayersPanel />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
