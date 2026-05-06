import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Building2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/odeme")({
  head: () => ({
    meta: [
      { title: "Ödeme · Mudita Dekorasyon" },
      { name: "description", content: "Ödeme yöntemleri yakında aktif olacak. Şimdilik teklif veya WhatsApp ile sipariş verebilirsiniz." },
    ],
  }),
  component: CheckoutPage,
});

const METHODS = [
  { name: "iyzico", desc: "Kredi/banka kartı (yakında)", icon: CreditCard, soon: true },
  { name: "PayTR", desc: "Tüm kart tipleri (yakında)", icon: CreditCard, soon: true },
  { name: "Param", desc: "Türk bankaları (yakında)", icon: CreditCard, soon: true },
  { name: "Stripe", desc: "Uluslararası (yakında)", icon: CreditCard, soon: true },
  { name: "Banka Havalesi / EFT", desc: "Manuel onay ile sipariş", icon: Building2, soon: true },
  { name: "WhatsApp ile Sipariş", desc: "Hemen mesaj gönderin, manuel sipariş alalım", icon: MessageCircle, soon: false },
];

function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Ödeme</h1>
      <p className="mt-2 text-muted-foreground">
        Online ödeme entegrasyonu yakında aktif olacak. Şimdilik WhatsApp ile manuel sipariş verebilir veya teklif talep edebilirsiniz.
      </p>

      <ul className="mt-8 space-y-3">
        {METHODS.map((m) => (
          <li
            key={m.name}
            className={`flex items-center gap-4 rounded-2xl border p-4 ${
              m.soon ? "border-border bg-card opacity-60" : "border-border bg-card hover:bg-accent"
            }`}
          >
            <m.icon className="h-5 w-5 text-neon-pink" />
            <div className="flex-1">
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-muted-foreground">{m.desc}</div>
            </div>
            {m.soon ? (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs">Yakında</span>
            ) : (
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-neon px-4 py-2 text-xs font-semibold text-white"
              >
                Aç
              </a>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
        Online ödeme aktif olana kadar siparişinizi <Link to="/iletisim" className="font-medium text-foreground underline">iletişim formu</Link> veya WhatsApp üzerinden tamamlayabilirsiniz.
      </div>
    </div>
  );
}
