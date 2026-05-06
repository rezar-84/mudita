import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "@/lib/cart";
import { formatTRY } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import { FONTS, COLORS } from "@/data/options";

export const Route = createFileRoute("/sepet")({
  head: () => ({
    meta: [
      { title: "Sepetim · Mudita Dekorasyon" },
      { name: "description", content: "Sepetindeki neon tabela tasarımları." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const refresh = () => setItems(getCart());
  useEffect(() => { refresh(); }, []);

  const total = items.reduce((s, i) => s + i.price, 0);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Sepetiniz boş</h1>
        <p className="mt-2 text-muted-foreground">Hadi ilk neon tabelanızı tasarlayın.</p>
        <Link to="/tasarla" className="mt-6 inline-block rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow">
          Tasarlamaya Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Sepetim</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-3">
          {items.map((it) => {
            const font = FONTS.find((f) => f.id === it.config.fontId)!;
            const color = COLORS.find((c) => c.id === it.config.colorId)!;
            return (
              <li key={it.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-preset-dark">
                  <span
                    className="neon-text text-lg"
                    style={{
                      fontFamily: font.family,
                      color: color.hex,
                      textShadow: `0 0 4px ${color.hex}, 0 0 10px ${color.glow}, 0 0 20px ${color.glow}`,
                    }}
                  >
                    {it.config.text.split("\n")[0].slice(0, 6) || "Aa"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.config.text.replace(/\n/g, " / ") || "Yazısız"}</div>
                  <div className="text-sm text-muted-foreground">{font.label} · {color.label}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatTRY(it.price)}</div>
                  <button
                    onClick={() => { removeFromCart(it.id); refresh(); }}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" /> Kaldır
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold">Sipariş Özeti</h3>
          <div className="mt-3 flex justify-between text-sm text-muted-foreground">
            <span>Ara toplam</span>
            <span>{formatTRY(total)}</span>
          </div>
          <div className="mt-3 border-t border-border pt-3 flex justify-between text-base font-bold">
            <span>Toplam</span>
            <span>{formatTRY(total)}</span>
          </div>
          <Link to="/odeme" className="mt-4 block">
            <Button className="w-full bg-gradient-neon text-white shadow-glow">Ödemeye Geç</Button>
          </Link>
          <button onClick={() => { clearCart(); refresh(); }} className="mt-2 w-full text-xs text-muted-foreground hover:text-destructive">
            Sepeti boşalt
          </button>
        </aside>
      </div>
    </div>
  );
}
