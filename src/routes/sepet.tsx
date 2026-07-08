import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "@/lib/cart";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, ShoppingBag, Pencil } from "lucide-react";
import { FONTS, COLORS } from "@/data/options";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useServerFn } from "@tanstack/react-start";
import { createOrder } from "@/lib/orders.functions";
import { usePricingOverrides } from "@/hooks/usePricing";
import { supabase } from "@/integrations/supabase/client";
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

type StoredAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  line?: string; // legacy
};

function CartPage() {
  const t = useT();
  const [items, setItems] = useState<CartItem[]>([]);
  const refresh = () => setItems(getCart());
  useEffect(() => {
    refresh();
  }, []);
  const { user } = useAuth();
  const pricing = usePricingOverrides();
  const place = useServerFn(createOrder);
  const navigate = useNavigate();

  // Contact / billing form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("TR");
  const [taxId, setTaxId] = useState("");
  const [notes, setNotes] = useState("");
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [busy, setBusy] = useState(false);

  // Prefill from Supabase profile
  useEffect(() => {
    if (!user) return;
    setEmail((e) => e || user.email || "");
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, phone, address")
        .eq("id", user.id)
        .maybeSingle();
      if (!data) return;
      setName((n) => n || (data.display_name ?? ""));
      setPhone((p) => p || (data.phone ?? ""));
      const a = (data.address ?? {}) as StoredAddress;
      setAddr1((v) => v || (a.line1 ?? a.line ?? ""));
      setAddr2((v) => v || (a.line2 ?? ""));
      setCity((v) => v || (a.city ?? ""));
      setDistrict((v) => v || (a.district ?? ""));
      setPostal((v) => v || (a.postal_code ?? ""));
      setCountry((v) => v && v !== "TR" ? v : (a.country ?? "TR"));
      setTaxId((v) => v || (a.tax_id ?? ""));
    })();
  }, [user]);

  const total = items.reduce((s, i) => s + i.price, 0);

  const placeOrder = async () => {
    if (!user) {
      navigate({ to: "/auth", search: { next: "/sepet" } });
      return;
    }
    if (!name.trim() || !email.trim() || !addr1.trim() || !city.trim() || !phone.trim()) {
      toast.error(t("checkoutMissingRequired"));
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
      const contact = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address_line1: addr1.trim(),
        address_line2: addr2.trim() || undefined,
        city: city.trim(),
        district: district.trim() || undefined,
        postal_code: postal.trim() || undefined,
        country: (country.trim() || "TR").toUpperCase(),
        tax_id: taxId.trim() || undefined,
      };
      await place({
        data: {
          subtotal_try: subtotal,
          shipping_try: shipping,
          total_try: subtotal + shipping,
          contact,
          notes,
          items: orderItems,
        },
      });
      if (saveToProfile) {
        await supabase.from("profiles").upsert({
          id: user.id,
          display_name: contact.name,
          phone: contact.phone,
          address: {
            line1: contact.address_line1,
            line2: contact.address_line2,
            city: contact.city,
            district: contact.district,
            postal_code: contact.postal_code,
            country: contact.country,
            tax_id: contact.tax_id,
          },
        });
      }
      clearCart();
      toast.success(t("orderPlaced"));
      navigate({ to: "/hesap/siparisler" });
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
        <Link
          to="/tasarla"
          className="mt-6 inline-block rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          {t("cartStartDesigning")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("cartTitle")}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
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
                  <div className="font-medium truncate">
                    {primaryText.replace(/\n/g, " / ") || t("cartTextless")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {font.label} · {color.label}
                  </div>
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
                      onClick={() => {
                        removeFromCart(it.id);
                        refresh();
                      }}
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
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{t("shippingTurkey")}</span>
            <span>{formatTRY(pricing?.shipping_tr ?? 250)}</span>
          </div>
          <div className="mt-3 border-t border-border pt-3 flex justify-between text-base font-bold">
            <span>{t("cartTotal")}</span>
            <span>{formatTRY(total + (pricing?.shipping_tr ?? 250))}</span>
          </div>

          {user ? (
            <div className="mt-6 space-y-6">
              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("checkoutContactHeader")}
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="oname">{t("billFullName")} *</Label>
                  <Input id="oname" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="oemail">{t("billEmail")} *</Label>
                    <Input id="oemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ophone">{t("billPhone")} *</Label>
                    <Input id="ophone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("checkoutShippingHeader")}
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="oaddr1">{t("billAddressLine1")} *</Label>
                  <Input id="oaddr1" value={addr1} onChange={(e) => setAddr1(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oaddr2">{t("billAddressLine2")}</Label>
                  <Input id="oaddr2" value={addr2} onChange={(e) => setAddr2(e.target.value)} />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ocity">{t("billCity")} *</Label>
                    <Input id="ocity" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odist">{t("billDistrict")}</Label>
                    <Input id="odist" value={district} onChange={(e) => setDistrict(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="opostal">{t("billPostalCode")}</Label>
                    <Input id="opostal" value={postal} onChange={(e) => setPostal(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ocountry">{t("billCountry")}</Label>
                    <Input id="ocountry" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("checkoutInvoiceHeader")}
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="otax">{t("billTaxId")}</Label>
                  <Input id="otax" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onotes">{t("billNotes")}</Label>
                  <Input id="onotes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </section>

              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={saveToProfile}
                  onCheckedChange={(v) => setSaveToProfile(v === true)}
                  className="mt-0.5"
                />
                <span>{t("billSaveToProfile")}</span>
              </label>

              <Button
                onClick={placeOrder}
                disabled={busy}
                className="w-full bg-gradient-neon text-white shadow-glow"
              >
                {busy ? t("placingOrder") : t("placeOrderCta")}
              </Button>
            </div>
          ) : (
            <Link to="/auth" search={{ next: "/sepet" }} className="mt-4 block">
              <Button className="w-full bg-gradient-neon text-white shadow-glow">
                {t("checkoutSignInFirst")}
              </Button>
            </Link>
          )}
          <button
            onClick={() => {
              clearCart();
              refresh();
            }}
            className="mt-3 w-full text-xs text-muted-foreground hover:text-destructive"
          >
            {t("cartClearBtn")}
          </button>
        </aside>
      </div>
    </div>
  );
}
