import { useEffect } from "react";
import { createPortal } from "react-dom";
import { EditorShell } from "@/components/designer/EditorShell";

/**
 * Fullscreen wrapper around the EditorShell.
 * Locks body scroll, handles ESC to exit. The shell itself already provides
 * the top bar, tool rail, canvas, and contextual properties panel.
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
    <EditorShell variant="fullscreen" onExitFullscreen={onExit} />,
    document.body,
  );
}
