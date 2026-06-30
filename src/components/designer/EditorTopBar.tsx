import { useDesigner } from "@/components/configurator/DesignerContext";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import { addToCart } from "@/lib/cart";
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
import { useDesigner as useDesignerHook } from "@/components/configurator/DesignerContext";

/**
 * Compact top bar — title on the left, price + primary action on the right.
 * Inspired by Figma's top toolbar; non-essential extras live in popovers/menus
 * to keep this row breathable.
 */
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
  const { config } = useDesigner();
  const { undo, redo, canUndo, canRedo } = useDesignerHook();
  const navigate = useNavigate();
  const breakdown = calculatePrice(config);

  const onAdd = () => {
    addToCart(config, breakdown.total);
    toast.success("Ürün sepete eklendi");
    setTimeout(() => navigate({ to: "/sepet" }), 400);
  };

  const onShare = async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.pathname = "/tasarla";
    url.searchParams.set("d", encodeConfig(config));
    try {
      await navigator.clipboard.writeText(url.toString());
      toast.success("Tasarım linki panoya kopyalandı");
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
        <p className="truncate text-sm font-semibold leading-tight">Tasarım Editörü</p>
        <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
          {config.text.trim() || "İsimsiz tasarım"} · {config.fontId}
        </p>
      </div>

      <div className="hidden items-baseline gap-1.5 px-2 sm:flex">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Fiyat</span>
        <span className="text-base font-bold tabular-nums text-foreground">
          {formatTRY(breakdown.total)}
        </span>
      </div>

      <Button variant="ghost" size="sm" onClick={onShare} className="hidden sm:inline-flex">
        <Share2 className="mr-1.5 h-3.5 w-3.5" />
        Paylaş
      </Button>

      <Button variant="outline" size="sm" onClick={onFullscreen} className="shrink-0">
        {variant === "fullscreen" ? (
          <Minimize2 className="h-3.5 w-3.5 sm:mr-1.5" />
        ) : (
          <Maximize2 className="h-3.5 w-3.5 sm:mr-1.5" />
        )}
        <span className="hidden sm:inline">
          {variant === "fullscreen" ? "Çık" : "Tam Ekran"}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePanel}
        title={rightPanelOpen ? "Paneli Gizle" : "Paneli Göster"}
        className="hidden lg:inline-flex"
      >
        {rightPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
      </Button>

      <Button
        onClick={onAdd}
        className="shrink-0 bg-gradient-neon text-white shadow-glow hover:opacity-90"
        size="sm"
      >
        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
        <span className="hidden sm:inline">Sepete Ekle · </span>
        <span className="tabular-nums">{formatTRY(breakdown.total)}</span>
      </Button>
    </div>
  );
}
