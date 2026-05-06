import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hakkımızda · Mudita Dekorasyon" },
      { name: "description", content: "İki kız kardeşin 2021'de evinde başlayan, dünyaya açılan el emeği dekorasyon hikayesi." },
      { property: "og:title", content: "Mudita Dekorasyon Hikayesi" },
      { property: "og:description", content: "El emeği, samimiyet ve tasarım sevgisiyle." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <img src={logo} alt="Mudita Dekorasyon" className="mb-8 h-14 w-auto" />
      <h1 className="text-3xl font-bold sm:text-4xl">Mudita Dekorasyon Kimdir?</h1>
      <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>
          Merhaba! Biz iki kız kardeş olarak 2021 yılında evimizin bir köşesinde başladık bu yolculuğa.
          Amacımız basitti: el emeğimizi, tasarım sevgimizi ve kalbimizi koyduğumuz ürünlerle hem evimize ek
          gelir sağlamak hem de insanların yaşam alanlarına küçük mutluluklar katmak.
        </p>
        <p>
          Tamamen el yapımı ürünlerden oluşan koleksiyonumuz, zamanla sadece yakın çevremizin değil, dünyanın
          dört bir yanındaki dekorasyon severlerin ilgisini çekti. Derken ne oldu? Bir sabah baktık ki küçük
          işletmemiz büyümüş, tescilli bir markaya dönüşmüşüz ve artık dünya çapında gönderim yapan kocaman
          bir aileyiz.
        </p>
        <p>
          Müşteri memnuniyetini her şeyin önünde tuttuk, çünkü bizce bir ürünü güzel yapan sadece görüntüsü
          değil, arkasındaki samimiyet ve hizmettir. Her koleksiyonumuzda günün trendlerini takip ederek,
          modern ve özgün tasarımlar sunmaya çalışıyoruz. Ev dekorasyonunda modaya ayak uydururken, kendi
          tarzımızı da unutmadan!
        </p>
        <p>
          Her paketimizin içinde biraz sevgi, biraz emek, bolca da biz varız. Bu yüzden ürünlerimiz sadece
          bir dekorasyon objesi değil, aynı zamanda size bizden gelen küçük bir selam{" "}
          <span className="text-gradient-neon font-semibold">✨</span>
        </p>
      </div>
    </div>
  );
}
