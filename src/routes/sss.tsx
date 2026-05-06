import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/sss")({
  head: () => ({
    meta: [
      { title: "Sıkça Sorulan Sorular · Mudita Dekorasyon" },
      { name: "description", content: "LED neon tabela üretimi, kargo, iade ve özel tasarım hakkında sık sorulan sorular." },
      { property: "og:title", content: "S.S.S. · Mudita Dekorasyon" },
      { property: "og:description", content: "Neon tabela üretimi ve sipariş süreci hakkında her şey." },
    ],
  }),
  component: FaqPage,
});

const FAQ = [
  { q: "Üretim ne kadar sürer?", a: "Standart üretim süresi 7-10 iş günüdür. Acil üretim seçeneği ile 3-5 iş günü içinde teslim edilebilir." },
  { q: "Kargo nereye gönderilir?", a: "Türkiye geneli özel kargolama yapıyoruz. Yurt dışı gönderim için lütfen iletişime geçin." },
  { q: "LED neon tabela ne kadar dayanıklı?", a: "Kullandığımız LED neon şeritler 50.000 saat üzerinde ömre sahiptir. İç mekanda yıllarca sorunsuz kullanılır." },
  { q: "Dış mekanda kullanabilir miyim?", a: "Evet — IP65 dış mekan seçeneğini aktifleştirerek su ve toza dayanıklı üretim talep edebilirsiniz." },
  { q: "Logo veya özel tasarım yaptırabilir miyim?", a: "Tabii! 'Görsel Yükle' sayfasından logonuzu veya çiziminizi paylaşın, size özel teklif hazırlayalım." },
  { q: "Garanti veriyor musunuz?", a: "Tüm ürünlerimiz 2 yıl üretim hatalarına karşı garantilidir." },
  { q: "Hangi adaptör ile geliyor?", a: "Türkiye tipi (220V) adaptör standart olarak gönderilir. AB tipi adaptör opsiyoneldir." },
  { q: "Renkler farklı görünüyor mu?", a: "Ekran ile gerçek neon ışığı arasında küçük farklar olabilir; canlı önizleme mümkün olduğunca yakındır." },
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Sıkça Sorulan Sorular</h1>
      <p className="mt-2 text-muted-foreground">Aklınıza takılan sorular için hızlı cevaplar.</p>
      <Accordion type="single" collapsible className="mt-8">
        {FAQ.map((f, i) => (
          <AccordionItem key={i} value={`q-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
