import { useDesigner } from "@/components/configurator/DesignerContext";
import { ConfiguratorPanel } from "@/components/configurator/ConfiguratorPanel";
import { DecorationProperties } from "./DecorationProperties";
import { TextLayerProperties } from "./TextLayerProperties";
import { LayersPanel } from "./LayersPanel";
import { AlignmentControls } from "./AlignmentControls";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function PropertiesPanel({ open, onClose, onOpen }: { open: boolean; onClose: () => void; onOpen: () => void; }) {
  const t = useT();
  const { selection } = useDesigner();
  const isDecoration = selection.kind === "decoration";
  const isTextLayer = selection.kind === "textLayer";

  if (!open) {
    return (
      <div className="hidden border-l border-border bg-card/60 lg:flex">
        <Button variant="ghost" size="icon" className="m-1 h-8 w-8" onClick={onOpen} title={t("panelOpen")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <aside className={cn("flex flex-col border-border bg-card", "w-full max-w-full border-t", "lg:w-[360px] lg:max-w-[360px] lg:shrink-0 lg:border-l lg:border-t-0")}>
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isDecoration ? t("decoration") : isTextLayer ? t("textLayerPanel") : t("tabScene")}
        </p>
        <Button variant="ghost" size="icon" className="hidden h-7 w-7 lg:inline-flex" onClick={onClose} title={t("panelHide")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className={cn("p-3 sm:p-4", "lg:min-h-0 lg:flex-1 lg:overflow-auto")}>
        {isDecoration ? (
          <div className="space-y-4">
            <AlignmentControls />
            <DecorationProperties />
            <div id="layers-section"><LayersPanel /></div>
          </div>
        ) : isTextLayer ? (
          <div className="space-y-4">
            <AlignmentControls />
            <TextLayerProperties />
            <div id="layers-section"><LayersPanel /></div>
          </div>
        ) : (
          <div className="space-y-5">
            <ConfiguratorPanel />
            <AlignmentControls />
            <div id="layers-section"><LayersPanel /></div>
          </div>
        )}
      </div>
    </aside>
  );
}
