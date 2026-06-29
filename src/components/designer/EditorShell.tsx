import { useEffect, useState, type ReactNode } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { NeonPreview } from "@/components/configurator/NeonPreview";
import { ToolRail } from "./ToolRail";
import { EditorTopBar } from "./EditorTopBar";
import { PropertiesPanel } from "./PropertiesPanel";
import { DecorationPickerDialog } from "./DecorationPickerDialog";
import { cn } from "@/lib/utils";

/**
 * Figma / Inkscape-style editor shell:
 *  ┌──────────────────────────────────────────────┐
 *  │  Top bar: title · undo/redo · price · cart    │
 *  ├──┬───────────────────────────────────────┬───┤
 *  │T │                                       │ P │
 *  │o │              Canvas                   │ r │
 *  │o │       (NeonPreview + overlays)        │ o │
 *  │l │                                       │ p │
 *  │  │                                       │ . │
 *  └──┴───────────────────────────────────────┴───┘
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

  // Open decoration picker via a custom event from the tool rail (works in
  // both portal-fullscreen and inline page modes).
  useEffect(() => {
    const handler = () => setPickerOpen(true);
    window.addEventListener("mudita:open-decoration-picker", handler);
    return () => window.removeEventListener("mudita:open-decoration-picker", handler);
  }, []);

  // Keyboard shortcut: V = select text, ESC = deselect
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable))
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
        "flex w-full flex-col bg-background text-foreground",
        isFullscreen ? "fixed inset-0 z-[100] h-screen" : "h-[calc(100vh-4rem)] min-h-[640px] rounded-2xl border border-border shadow-soft overflow-hidden",
      )}
    >
      <EditorTopBar
        variant={variant}
        onExitFullscreen={onExitFullscreen}
        onTogglePanel={() => setRightOpen((v) => !v)}
        rightPanelOpen={rightOpen}
      />

      <div className="flex min-h-0 flex-1">
        <ToolRail onPickDecoration={() => setPickerOpen(true)} />

        {/* Canvas */}
        <div className="relative min-w-0 flex-1 overflow-auto bg-canvas/40">
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center p-4 sm:p-6">
            <div className="w-full">
              <NeonPreview />
            </div>
          </div>
        </div>

        {/* Right properties panel */}
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

export function CanvasArea({ children }: { children: ReactNode }) {
  return <div className="relative min-w-0 flex-1 overflow-auto bg-canvas/40">{children}</div>;
}
