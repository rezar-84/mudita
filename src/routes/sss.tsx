import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const FAQ = [
  {
    q: "Fiyat nasıl belirleniyor?",
    a: "Fiyat; yazı uzunluğu, ölçü, yazı tipi karmaşıklığı, renk, arka panel ve montaj seçeneklerine göre belirlenir. /tasarla sayfasındaki konfigüratörden anında tahmini fiyatı görebilirsiniz.",
  },
  {
    q: "Üretim ne kadar sürer?",
    a: "Standart üretim süresi 7-10 iş günüdür. Acil üretim seçeneği ile 3-5 iş günü içinde gönderim yapabiliyoruz. Üretim, tasarım onayınız alındıktan sonra başlar.",
  },
  {
    q: "Dış mekanda kullanabilir miyim?",
    a: "Evet. IP65 dış mekan seçeneğini aktifleştirerek su ve toz korumalı üretim yapıyoruz. Çok ince/script fontlar dış mekan için önerilmez; kalın fontlar daha dayanıklıdır.",
  },
  {
    q: "Kurulum nasıl yapılıyor?",
    a: "Duvar montaj kiti, asma kiti veya stand seçeneklerinden birini seçebilirsiniz. Tabelalar fişe takılır takılmaz çalışır; özel elektrik tesisatına gerek yoktur.",
  },
  {
    q: "Garanti veriyor musunuz?",
    a: "Tüm ürünlerimiz 2 yıl üretim hatalarına karşı garantilidir. Kullandığımız LED neon şeritlerin ömrü 50.000 saatin üzerindedir.",
  },
  {
    q: "Kargo nereye gönderilir?",
    a: "Türkiye geneli 81 ile özel köpük ambalajla gönderim yapıyoruz. Yurt dışı için lütfen iletişime geçin.",
  },
  {
    q: "Tasarım onayı nasıl işliyor?",
    a: "Sipariş veya teklif sonrası, üretime başlamadan önce dijital ön görseli WhatsApp veya e-posta ile size gönderiyoruz. Renk, ölçü veya font değişiklikleri olursa birlikte revize ediyoruz. Onayınız olmadan üretime başlamıyoruz.",
  },
  {
    q: "Logo veya özel tasarım yaptırabilir miyim?",
    a: "Tabii! 'Logonu Yükle' sayfasından logo, çizim, referans fotoğraf veya marka tasarımınızı paylaşın, size özel teklif hazırlayalım.",
  },
  {
    q: "Hangi adaptör ile geliyor?",
    a: "Türkiye tipi (220V) adaptör standart olarak gönderilir. AB tipi adaptör opsiyoneldir.",
  },
  {
    q: "Renkler farklı görünüyor mu?",
    a: "Ekran ile gerçek neon ışığı arasında küçük farklar olabilir; canlı önizleme mümkün olduğunca yakındır. Tasarım onayında gerçek renk tonunu da paylaşıyoruz.",
  },
  {
    q: "İade ve değişim mümkün mü?",
    a: "Tüm ürünler kişiye özel üretildiği için iade kapsamı dışındadır. Üretim hatası, kargo hasarı veya onayladığınız tasarımdan farklı bir ürün gelmesi durumunda ücretsiz değişim sağlıyoruz.",
  },
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Sıkça Sorulan Sorular</h1>
      <p className="mt-2 text-muted-foreground">Aklınıza takılan sorular için hızlı cevaplar. Cevabını bulamadığınız bir konu varsa <Link to="/iletisim" className="underline">bize yazın</Link>.</p>
      <Accordion type="single" collapsible className="mt-8">
        {FAQ.map((f, i) => (
          <AccordionItem key={i} value={`q-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
        <h2 className="text-xl font-semibold">Hâlâ kararsız mısın?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tasarımını birlikte oluşturalım. Birkaç dakikada ücretsiz teklif alabilirsin.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link to="/tasarla" className="rounded-full bg-gradient-neon px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
            Hemen Tasarla
          </Link>
          <Link to="/yukle" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold">
            Logonu Yükle, Teklif Al
          </Link>
        </div>
      </div>
    </div>
  );
}
