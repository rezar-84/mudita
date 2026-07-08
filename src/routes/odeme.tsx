import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Building2, MessageCircle } from "lucide-react";
import { useT, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/odeme")({
  head: () => ({
    meta: [
      { title: "Ödeme · MudiNeon" },
      { name: "description", content: "Ödeme yöntemleri yakında aktif olacak. Şimdilik teklif veya WhatsApp ile sipariş verebilirsiniz." },
    ],
  }),
  component: CheckoutPage,
});

type Method = { name: string; descKey: TKey; icon: typeof CreditCard; soon: boolean; nameKey?: TKey };

const METHODS: Method[] = [
  { name: "iyzico", descKey: "payIyzicoDesc", icon: CreditCard, soon: true },
  { name: "PayTR", descKey: "payPaytrDesc", icon: CreditCard, soon: true },
  { name: "Param", descKey: "payParamDesc", icon: CreditCard, soon: true },
  { name: "Stripe", descKey: "payStripeDesc", icon: CreditCard, soon: true },
  { name: "", nameKey: "payBankName", descKey: "payBankDesc", icon: Building2, soon: true },
  { name: "", nameKey: "payWhatsappName", descKey: "payWhatsappDesc", icon: MessageCircle, soon: false },
];

function CheckoutPage() {
  const t = useT();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t("checkoutTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("checkoutSubtitle")}</p>

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
            ) : (
              <a
                href="https://wa.me/"
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

      <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
        {t("checkoutFooter")}{" "}
        <Link to="/iletisim" className="font-medium text-foreground underline">{t("checkoutFooterLink")}</Link>{" "}
        {t("checkoutFooterOr")}
      </div>
    </div>
  );
}
