import { useDesigner } from "@/components/configurator/DesignerContext";
import { ConfiguratorPanel } from "@/components/configurator/ConfiguratorPanel";
import { DecorationProperties } from "./DecorationProperties";
import { TextLayerProperties } from "./TextLayerProperties";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Contextual right inspector. Switches between:
 *  - Decoration properties (when a decoration layer is selected)
 *  - Full configurator (text/style/size/scene/extras) for canvas/text mode
 *
 * On lg+ the panel can be collapsed via the top bar.
 * On mobile it's a full-width bottom drawer using vh constraints.
 */
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
        "flex flex-col border-l border-border bg-card",
        // Mobile: fixed bottom sheet via wrapping; here we just make it work side-by-side at md+
        "w-full max-w-full lg:w-[360px] lg:max-w-[360px] lg:shrink-0",
        // On small screens, stack below canvas — the parent flex is row, so on mobile we hide canvas above? Instead, make the panel scroll inside its own container.
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isDecoration ? "Süsleme" : selection.kind === "text" ? "Metin / Tasarım" : "Sahne"}
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
      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
        {isDecoration ? <DecorationProperties /> : <ConfiguratorPanel />}
      </div>
    </aside>
  );
}
