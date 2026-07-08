import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "@/lib/cart";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ShoppingBag, Pencil } from "lucide-react";
import { FONTS, COLORS } from "@/data/options";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useServerFn } from "@tanstack/react-start";
import { createOrder } from "@/lib/orders.functions";
import { usePricingOverrides } from "@/hooks/usePricing";
import { toast } from "sonner";

export const Route = createFileRoute("/sepet")({
  head: () => ({
    meta: [
      { title: "Sepetim · MudiNeon" },
      { name: "description", content: "Sepetindeki neon tabela tasarımları." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const t = useT();
  const [items, setItems] = useState<CartItem[]>([]);
  const refresh = () => setItems(getCart());
  useEffect(() => { refresh(); }, []);
  const { user } = useAuth();
  const pricing = usePricingOverrides();
  const place = useServerFn(createOrder);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user, email]);

  const total = items.reduce((s, i) => s + i.price, 0);

  const placeOrder = async () => {
    if (!user) {
      navigate({ to: "/auth", search: { next: "/sepet" } });
      return;
    }
    if (!name || !email) {
      toast.error("Ad ve e-posta zorunlu.");
      return;
    }
    setBusy(true);
    try {
      const orderItems = items.map((it) => {
        const b = calculatePrice(it.config, pricing);
        return {
          config: it.config as unknown as Record<string, unknown>,
          price_try: Math.round(it.price),
          breakdown: b as unknown as Record<string, unknown>,
        };
      });
      const subtotal = orderItems.reduce((s, i) => s + i.price_try, 0);
      const shipping = pricing?.shipping_tr ?? 250;
      const { id } = await place({
        data: {
          subtotal_try: subtotal,
          shipping_try: shipping,
          total_try: subtotal + shipping,
          contact: { name, email, phone, address },
          notes,
          items: orderItems,
        },
      });
      clearCart();
      toast.success("Sipariş oluşturuldu");
      navigate({ to: "/hesap/siparisler" });
      void id;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sipariş oluşturulamadı");
    } finally {
      setBusy(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">{t("cartEmptyTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("cartEmptySubtitle")}</p>
        <Link to="/tasarla" className="mt-6 inline-block rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow">
          {t("cartStartDesigning")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("cartTitle")}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {items.map((it) => {
            const primary = (it.config.textLayers ?? []).find((l) => !l.hidden && l.text.trim());
            const primaryText = primary?.text ?? it.config.text ?? "";
            const font = FONTS.find((f) => f.id === (primary?.fontId ?? it.config.fontId))!;
            const color = COLORS.find((c) => c.id === (primary?.colorId ?? it.config.colorId))!;
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
                    {primaryText.split("\n")[0].slice(0, 6) || "Aa"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{primaryText.replace(/\n/g, " / ") || t("cartTextless")}</div>
                  <div className="text-sm text-muted-foreground">{font.label} · {color.label}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatTRY(it.price)}</div>
                  <div className="mt-1 flex items-center justify-end gap-3">
                    <Link
                      to={`/tasarla?editCartId=${it.id}` as "/tasarla"}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Pencil className="h-3 w-3" /> Düzenle
                    </Link>
                    <button
                      onClick={() => { removeFromCart(it.id); refresh(); }}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3 w-3" /> {t("cartRemoveBtn")}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold">{t("cartOrderSummary")}</h3>
          <div className="mt-3 flex justify-between text-sm text-muted-foreground">
            <span>{t("cartSubtotal")}</span>
            <span>{formatTRY(total)}</span>
          </div>
          <div className="mt-3 border-t border-border pt-3 flex justify-between text-base font-bold">
            <span>{t("cartTotal")}</span>
            <span>{formatTRY(total)}</span>
          </div>

          {user ? (
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="oname">Ad Soyad</Label>
                <Input id="oname" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="oemail">E-posta</Label>
                <Input id="oemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="ophone">Telefon</Label>
                <Input id="ophone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="oaddr">Adres</Label>
                <Input id="oaddr" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="onotes">Notlar</Label>
                <Input id="onotes" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <Button onClick={placeOrder} disabled={busy} className="mt-2 w-full bg-gradient-neon text-white shadow-glow">
                {busy ? "Gönderiliyor…" : "Siparişi Ver"}
              </Button>
            </div>
          ) : (
            <Link to="/auth" search={{ next: "/sepet" }} className="mt-4 block">
              <Button className="w-full bg-gradient-neon text-white shadow-glow">Siparişi tamamlamak için giriş yap</Button>
            </Link>
          )}
          <button onClick={() => { clearCart(); refresh(); }} className="mt-2 w-full text-xs text-muted-foreground hover:text-destructive">
            {t("cartClearBtn")}
          </button>
        </aside>
      </div>
    </div>
  );
}
