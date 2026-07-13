import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Building2, MessageCircle, Loader2 } from "lucide-react";
import { useT, type TKey } from "@/lib/i18n";
import { useServerFn } from "@tanstack/react-start";
import { getMyOrder, confirmPaidOrder } from "@/lib/orders.functions";
import { iyzicoInitCheckoutForm } from "@/lib/iyzico.functions";
import { formatTRY } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/odeme")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orderId: (search.orderId as string) || undefined,
      token: (search.token as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Ödeme · MudiNeon" },
      { name: "description", content: "Ödeme sayfanız." },
    ],
  }),
  component: CheckoutPage,
});

type Method = { name: string; descKey: TKey; icon: typeof CreditCard; soon: boolean; nameKey?: TKey };

const METHODS: Method[] = [
  { name: "iyzico", descKey: "payIyzicoDesc", icon: CreditCard, soon: false },
  { name: "PayTR", descKey: "payPaytrDesc", icon: CreditCard, soon: true },
  { name: "Param", descKey: "payParamDesc", icon: CreditCard, soon: true },
  { name: "Stripe", descKey: "payStripeDesc", icon: CreditCard, soon: true },
  { name: "", nameKey: "payBankName", descKey: "payBankDesc", icon: Building2, soon: true },
  { name: "", nameKey: "payWhatsappName", descKey: "payWhatsappDesc", icon: MessageCircle, soon: false },
];

function CheckoutPage() {
  const { orderId, token } = Route.useSearch();
  const t = useT();
  const navigate = useNavigate();

  const fetchOrder = useServerFn(getMyOrder);
  const verifyPayment = useServerFn(confirmPaidOrder);
  const initIyzico = useServerFn(iyzicoInitCheckoutForm);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  const [iyzicoFormContent, setIyzicoFormContent] = useState<string | null>(null);

  // 1. If redirected back from Iyzico with a payment verification token
  useEffect(() => {
    if (!token) return;
    setVerifying(true);
    verifyPayment({ data: { token } })
      .then((res) => {
        toast.success(t("orderPlaced") || "Ödemeniz başarıyla doğrulandı!");
        navigate({ to: "/hesap/siparisler" });
      })
      .catch((err) => {
        toast.error(err.message || "Ödeme doğrulanamadı.");
        setVerifying(false);
      });
  }, [token, navigate, t, verifyPayment]);

  // 2. Load order details if orderId is provided
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchOrder({ data: { id: orderId } })
      .then((res) => {
        setOrderInfo(res);
      })
      .catch((err) => {
        toast.error(err.message || "Sipariş bilgileri yüklenemedi.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId, fetchOrder]);

  // 3. Inject iyzico scripts if form HTML content is fetched
  useEffect(() => {
    if (!iyzicoFormContent) return;
    const container = document.getElementById("iyzico-form-container");
    if (!container) return;

    container.innerHTML = iyzicoFormContent;
    const scripts = container.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const s = document.createElement("script");
      s.type = "text/javascript";
      if (scripts[i].src) {
        s.src = scripts[i].src;
      } else {
        s.text = scripts[i].text;
      }
      document.body.appendChild(s);
    }
  }, [iyzicoFormContent]);

  // Initialize Iyzico Checkout Form
  const handleIyzicoCheckout = async () => {
    if (!orderInfo) return;
    setBusy(true);
    const contact = orderInfo.order.contact || {};
    try {
      const res = await initIyzico({
        data: {
          orderId: orderInfo.order.id,
          totalPrice: orderInfo.order.total_try,
          callbackUrl: `${window.location.origin}/odeme?orderId=${orderInfo.order.id}`,
          buyer: {
            id: orderInfo.order.user_id || "guest",
            name: contact.name?.split(" ")[0] || "Misafir",
            surname: contact.name?.split(" ").slice(1).join(" ") || "Kullanıcı",
            email: contact.email || "guest@mudineon.com",
            phone: contact.phone || "0000000000",
            address: contact.address_line1 || "Türkiye",
            city: contact.city || "Istanbul",
            country: contact.country || "Turkey",
            zipCode: contact.postal_code || "34000",
            ip: "127.0.0.1",
          },
          items: orderInfo.items.map((it: any) => ({
            id: it.id,
            name: it.config?.text || "Kişiselleştirilmiş Neon Tabela",
            price: it.price_try,
          })),
        },
      });
      setIyzicoFormContent(res.checkoutFormContent);
    } catch (err: any) {
      toast.error(err.message || "iyzico ödeme formu başlatılamadı.");
    } finally {
      setBusy(false);
    }
  };

  if (verifying) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-neon-pink" />
        <h1 className="mt-4 text-xl font-bold">Ödemeniz Doğrulanıyor</h1>
        <p className="mt-2 text-sm text-muted-foreground">Lütfen pencereyi kapatmayın, işleminiz tamamlanıyor...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sipariş Bulunamadı</h1>
        <p className="mt-2 text-muted-foreground">Lütfen sepet sayfasından tekrar deneyin.</p>
        <Link to="/sepet" className="mt-6 inline-block rounded-full bg-gradient-neon px-5 py-2.5 text-xs font-semibold text-white">
          Sepete Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t("checkoutTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("checkoutSubtitle")}</p>

      {/* Order Info Summary */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm">Sipariş Özeti</h3>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Sipariş No</span>
          <span className="font-mono text-foreground">{orderInfo.order.id}</span>
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Toplam Tutar</span>
          <span className="font-bold text-foreground text-sm">{formatTRY(orderInfo.order.total_try)}</span>
        </div>
      </div>

      <div id="iyzico-form-container" className="mt-8">
        {/* Iyzico responsive iframe will be injected here */}
      </div>

      {!iyzicoFormContent && (
        <ul className="mt-8 space-y-3">
          {METHODS.map((m) => (
            <li
              key={m.nameKey ?? m.name}
              className={`flex items-center gap-4 rounded-2xl border p-4 ${
                m.soon ? "border-border bg-card opacity-60" : "border-border bg-card hover:bg-accent"
              }`}
            >
              <m.icon className="h-5 w-5 text-neon-pink" />
              <div className="flex-1">
                <div className="font-medium">{m.nameKey ? t(m.nameKey) : m.name}</div>
                <div className="text-sm text-muted-foreground">{t(m.descKey)}</div>
              </div>
              {m.soon ? (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs">{t("checkoutSoon")}</span>
              ) : m.name === "iyzico" ? (
                <Button
                  onClick={handleIyzicoCheckout}
                  disabled={busy}
                  className="rounded-full bg-gradient-neon px-4 py-2 text-xs font-semibold text-white shadow-glow"
                >
                  {busy ? "Başlatılıyor..." : "Öde"}
                </Button>
              ) : (
                <a
                  href={`https://wa.me/?text=Merhaba%2C+siparis+numaram%3A+${orderInfo.order.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gradient-neon px-4 py-2 text-xs font-semibold text-white"
                >
                  {t("checkoutOpen")}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
        {t("checkoutFooter")}{" "}
        <Link to="/iletisim" className="font-medium text-foreground underline">{t("checkoutFooterLink")}</Link>{" "}
        {t("checkoutFooterOr")}
      </div>
    </div>
  );
}
