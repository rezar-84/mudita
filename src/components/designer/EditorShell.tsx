import { useEffect, useState } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { NeonPreview } from "@/components/configurator/NeonPreview";
import { ToolRail } from "./ToolRail";
import { EditorTopBar } from "./EditorTopBar";
import { PropertiesPanel } from "./PropertiesPanel";
import { DecorationPickerDialog } from "./DecorationPickerDialog";
import { cn } from "@/lib/utils";

/**
 * Figma / Inkscape-style editor shell.
 * Layout:
 *  - Top bar (full width)
 *  - Body (flex):
 *      Tool rail (horizontal scroll on mobile, vertical on lg+)
 *      Canvas
 *      Properties panel (stacked below on mobile, side panel on lg+)
 */
export function EditorShell({
  variant = "page",
  onExitFullscreen,
}: {
  variant?: "page" | "fullscreen";
  onExitFullscreen?: () => void;
}) {
  const { setSelection } = useDesigner();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);

  useEffect(() => {
    const handler = () => setPickerOpen(true);
    window.addEventListener("mudita:open-decoration-picker", handler);
    return () => window.removeEventListener("mudita:open-decoration-picker", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      if (e.key === "Escape") setSelection({ kind: "canvas" });
      if (e.key.toLowerCase() === "v") setSelection({ kind: "text" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSelection]);

  const isFullscreen = variant === "fullscreen";

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden bg-background text-foreground",
        isFullscreen
          ? "fixed inset-0 z-[100] h-screen"
          : "min-h-[640px] rounded-2xl border border-border shadow-soft lg:h-[calc(100vh-7rem)]",
      )}
    >
      <EditorTopBar
        variant={variant}
        onExitFullscreen={onExitFullscreen}
        onTogglePanel={() => setRightOpen((v) => !v)}
        rightPanelOpen={rightOpen}
      />

      {/* Body: stacks on mobile, splits on lg+ */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <ToolRail onPickDecoration={() => setPickerOpen(true)} />

        {/* Canvas */}
        <div className="relative min-h-[320px] min-w-0 flex-1 overflow-auto bg-canvas/40">
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center p-3 sm:p-5">
            <div className="w-full">
              <NeonPreview />
            </div>
          </div>
        </div>

        {/* Properties */}
        <PropertiesPanel
          open={rightOpen}
          onClose={() => setRightOpen(false)}
          onOpen={() => setRightOpen(true)}
        />
      </div>

      <DecorationPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}
