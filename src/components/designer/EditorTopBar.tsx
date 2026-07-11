import { useDesigner } from "@/components/configurator/DesignerContext";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import { addToCart, updateCartItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Maximize2,
  Minimize2,
  PanelRight,
  PanelRightClose,
  ShoppingCart,
  Share2,
  Undo2,
  Redo2,
} from "lucide-react";
import { encodeConfig } from "@/lib/share";
import { useT } from "@/lib/i18n";

export function EditorTopBar({
  variant,
  onExitFullscreen,
  onTogglePanel,
  rightPanelOpen,
}: {
  variant: "page" | "fullscreen";
  onExitFullscreen?: () => void;
  onTogglePanel: () => void;
  rightPanelOpen: boolean;
}) {
  const t = useT();
  const { config, undo, redo, canUndo, canRedo, editCartId } = useDesigner();
  const navigate = useNavigate();
  const breakdown = calculatePrice(config);

  const onAdd = () => {
    if (editCartId) {
      updateCartItem(editCartId, config, breakdown.total);
      toast.success("Sepetteki tasarım güncellendi.");
    } else {
      addToCart(config, breakdown.total);
      toast.success(t("productAddedToCart"));
    }
    setTimeout(() => navigate({ to: "/sepet" }), 400);
  };

  const onShare = async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.pathname = "/tasarla";
    url.searchParams.set("d", encodeConfig(config));
    try {
      await navigator.clipboard.writeText(url.toString());
      toast.success(t("designLinkCopied"));
    } catch {
      toast.info(url.toString());
    }
  };

  const onFullscreen = () => {
    if (variant === "fullscreen") {
      onExitFullscreen?.();
    } else {
      window.dispatchEvent(new CustomEvent("mudita:fullscreen-toggle"));
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card/95 px-3 py-2 backdrop-blur sm:px-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{t("editorTitle")}</p>
        <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
          {(
            (config.textLayers ?? []).find((l) => !l.hidden && l.text.trim())?.text ??
            config.text ??
            ""
          ).trim() || t("editorUntitled")}
        </p>
      </div>

      <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={undo}
          disabled={!canUndo}
          title={t("undoLabel")}
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={redo}
          disabled={!canRedo}
          title={t("redoLabel")}
        >
          <Redo2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="hidden items-baseline gap-1.5 border-l border-border pl-3 sm:flex">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {t("price")}
        </span>
        <span className="text-base font-bold tabular-nums text-foreground">
          {formatTRY(breakdown.total)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onShare}
        title={t("share")}
        className="h-8 w-8 sm:w-auto sm:px-3"
      >
        <Share2 className="h-3.5 w-3.5 sm:mr-1.5" />
        <span className="hidden sm:inline">{t("share")}</span>
      </Button>

      <Button variant="outline" size="sm" onClick={onFullscreen} className="shrink-0">
        {variant === "fullscreen" ? (
          <Minimize2 className="h-3.5 w-3.5 sm:mr-1.5" />
        ) : (
          <Maximize2 className="h-3.5 w-3.5 sm:mr-1.5" />
        )}
        <span className="hidden sm:inline">
          {variant === "fullscreen" ? t("exitFullscreen") : t("fullscreen")}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePanel}
        title={rightPanelOpen ? t("panelHide") : t("panelShow")}
        className="hidden lg:inline-flex"
      >
        {rightPanelOpen ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelRight className="h-4 w-4" />
        )}
      </Button>

      <Button
        onClick={onAdd}
        className="shrink-0 bg-gradient-neon text-white shadow-glow hover:opacity-90"
        size="sm"
      >
        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("ctaAddToCart")} · </span>
        <span className="tabular-nums">{formatTRY(breakdown.total)}</span>
      </Button>
    </div>
  );
}
