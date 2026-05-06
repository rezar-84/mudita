import { useDesigner } from "./DesignerContext";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, FileText, Share2 } from "lucide-react";
import { useState } from "react";
import { encodeConfig } from "@/lib/share";
import { toast } from "sonner";
import { QuoteDialog } from "./QuoteDialog";
import { addToCart } from "@/lib/cart";
import { useNavigate } from "@tanstack/react-router";
import { FONTS, COLORS, BACKBOARDS } from "@/data/options";

export function PriceSummary() {
  const { config } = useDesigner();
  const breakdown = calculatePrice(config);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const navigate = useNavigate();

  const font = FONTS.find((f) => f.id === config.fontId)!;
  const color = COLORS.find((c) => c.id === config.colorId)!;
  const backboard = BACKBOARDS.find((b) => b.id === config.backboard)!;

  const buildShareUrl = () => {
    const url = new URL(window.location.href);
    url.pathname = "/tasarla";
    url.searchParams.set("d", encodeConfig(config));
    return url.toString();
  };

  const onShare = async () => {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Tasarım linki panoya kopyalandı");
    } catch {
      toast.info(url);
    }
  };

  const onWhatsapp = () => {
    const lines = [
      "Merhaba Mudita Dekorasyon, neon tabela teklifi almak istiyorum.",
      `Yazı: ${config.text.replace(/\n/g, " / ")}`,
      `Yazı tipi: ${font.label}`,
      `Renk: ${color.label}`,
      `Ölçü: ${breakdown.items[0].label}`,
      `Arka panel: ${backboard.label}`,
      `Tahmini fiyat: ${formatTRY(breakdown.total)}`,
      `Tasarım: ${buildShareUrl()}`,
    ];
    const url = `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank");
  };

  const onAddCart = () => {
    addToCart(config, breakdown.total);
    toast.success("Ürün sepete eklendi");
    setTimeout(() => navigate({ to: "/sepet" }), 400);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Tahmini Fiyat</h3>
        <button onClick={onShare} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <Share2 className="h-3.5 w-3.5" /> Paylaş
        </button>
      </div>

      <ul className="mb-3 space-y-1.5 text-sm">
        {breakdown.items.map((it, i) => (
          <li key={i} className="flex justify-between gap-3 text-muted-foreground">
            <span className="truncate">{it.label}</span>
            <span className="shrink-0 tabular-nums">{formatTRY(it.amount)}</span>
          </li>
        ))}
        <li className="flex justify-between border-t border-border pt-2 text-foreground">
          <span>Kargo (Türkiye)</span>
          <span className="tabular-nums">{formatTRY(breakdown.shipping)}</span>
        </li>
      </ul>

      <div className="mb-4 rounded-lg bg-secondary p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm">Toplam</span>
          <span className="text-2xl font-bold tabular-nums">{formatTRY(breakdown.total)}</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Üretim süresi: {breakdown.productionDays}
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={onAddCart} className="w-full bg-gradient-neon text-white shadow-glow hover:opacity-90">
          <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
        </Button>
        <Button onClick={() => setQuoteOpen(true)} variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" /> Teklif Al
        </Button>
        <Button onClick={onWhatsapp} variant="secondary" className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp ile Gönder
        </Button>
      </div>

      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} price={breakdown.total} />
    </div>
  );
}
