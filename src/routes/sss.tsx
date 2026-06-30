import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useT, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/sss")({
  head: () => ({
    meta: [
      { title: "Sıkça Sorulan Sorular · LED Neon Tabela · Mudita Dekorasyon" },
      { name: "description", content: "Fiyat, üretim süresi, dış mekan kullanımı, kurulum, garanti, kargo ve tasarım onayı hakkında sık sorulan sorular." },
      { property: "og:title", content: "S.S.S. · Mudita Dekorasyon" },
      { property: "og:description", content: "Neon tabela üretimi ve sipariş süreci hakkında her şey." },
    ],
  }),
  component: FaqPage,
});

const FAQ_KEYS: Array<{ q: TKey; a: TKey }> = [
  { q: "faqQ1", a: "faqA1" },
  { q: "faqQ2", a: "faqA2" },
  { q: "faqQ3", a: "faqA3" },
  { q: "faqQ4", a: "faqA4" },
  { q: "faqQ5", a: "faqA5" },
  { q: "faqQ6", a: "faqA6" },
  { q: "faqQ7", a: "faqA7" },
  { q: "faqQ8", a: "faqA8" },
  { q: "faqQ9", a: "faqA9" },
  { q: "faqQ10", a: "faqA10" },
  { q: "faqQ11", a: "faqA11" },
];

function FaqPage() {
  const t = useT();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("faqTitle")}</h1>
      <p className="mt-2 text-muted-foreground">
        {t("faqSubtitleA")} <Link to="/iletisim" className="underline">{t("faqSubtitleLink")}</Link>.
      </p>
      <Accordion type="single" collapsible className="mt-8">
        {FAQ_KEYS.map((f, i) => (
          <AccordionItem key={i} value={`q-${i}`}>
            <AccordionTrigger className="text-left">{t(f.q)}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{t(f.a)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
        <h2 className="text-xl font-semibold">{t("faqStillUnsureTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("faqStillUnsureSub")}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link to="/tasarla" className="rounded-full bg-gradient-neon px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
            {t("ctaDesignNow")}
          </Link>
          <Link to="/yukle" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold">
            {t("ctaUploadLogo")}
          </Link>
        </div>
      </div>
    </div>
  );
}
