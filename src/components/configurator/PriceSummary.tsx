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
      "Merhaba Mudita Dekorasyon 👋",
      "Aşağıdaki neon tabela tasarımı için fiyat teklifi ve üretim süresi öğrenmek istiyorum.",
      "",
      `✍️ Yazı: ${config.text.replace(/\n/g, " / ") || "(henüz girilmedi)"}`,
      `🔤 Yazı tipi: ${font.label}`,
      `🎨 Renk: ${color.label}`,
      `📐 Ölçü: ${breakdown.items[0].label}`,
      `🖼️ Arka panel: ${backboard.label}`,
      `💡 Kullanım: ${config.outdoor ? "Dış mekan (IP65)" : "İç mekan"}`,
      `💰 Tahmini fiyat: ${formatTRY(breakdown.total)}`,
      "",
      `🔗 Canlı tasarım: ${buildShareUrl()}`,
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
      <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Tahmini Fiyat
      </div>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <span className="text-3xl font-bold tabular-nums">{formatTRY(breakdown.total)}</span>
        <span className="text-xs text-muted-foreground">KDV dahil · kargo dahil</span>
      </div>

      <ul className="mb-4 space-y-1.5 border-t border-border pt-3 text-sm">
        {breakdown.items.map((it, i) => (
          <li key={i} className="flex justify-between gap-3 text-muted-foreground">
            <span className="truncate">{it.label}</span>
            <span className="shrink-0 tabular-nums">{formatTRY(it.amount)}</span>
          </li>
        ))}
        <li className="flex justify-between text-muted-foreground">
          <span>Kargo (Türkiye)</span>
          <span className="tabular-nums">{formatTRY(breakdown.shipping)}</span>
        </li>
      </ul>

      <div className="mb-4 rounded-lg bg-secondary/60 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Üretim süresi</span>
          <span className="font-medium text-foreground">{breakdown.productionDays}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={onAddCart} className="w-full bg-gradient-neon text-white shadow-glow hover:opacity-90">
          <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
        </Button>
        <Button onClick={() => setQuoteOpen(true)} variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" /> Ücretsiz Teklif Al
        </Button>
        <Button onClick={onWhatsapp} variant="secondary" className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp’tan Gönder
        </Button>
        <Button onClick={onShare} variant="ghost" className="w-full">
          <Share2 className="mr-2 h-4 w-4" /> Tasarımı Paylaş
        </Button>
      </div>

      <p className="mt-4 rounded-lg border border-border bg-accent/30 p-3 text-xs leading-relaxed text-muted-foreground">
        ✅ Üretime başlamadan önce <span className="font-medium text-foreground">tasarım onayınızı</span> alıyoruz.
        Renk, ölçü veya font değiştirmek istersen birlikte revize ederiz.
      </p>

      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} price={breakdown.total} />
    </div>
  );
}

