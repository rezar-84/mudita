import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Palette, Truck, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mudita Dekorasyon · Kişiye Özel LED Neon Tabela" },
      { name: "description", content: "Kişiye özel LED neon tabelanı kendin tasarla, anında fiyat gör. Türkiye geneli kargo." },
      { property: "og:title", content: "Mudita Dekorasyon · Kişiye Özel LED Neon Tabela" },
      { property: "og:description", content: "Yazını gir, rengini ve ölçünü seç, neon tabelanı tasarla." },
    ],
  }),
  component: HomePage,
});

const SAMPLES = [
  { text: "Mudita", font: "'Pacifico', cursive", color: "#ff8ad1", glow: "#ff3eb5" },
  { text: "Sevgi", font: "'Monoton', cursive", color: "#7ab8ff", glow: "#1e90ff" },
  { text: "Hayal", font: "'Bungee', sans-serif", color: "#fff48a", glow: "#ffd400" },
  { text: "Mutluluk", font: "'Caveat', cursive", color: "#8fffb0", glow: "#00d96b" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-preset-dark" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> El emeği · Türkiye'den
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Hayalindeki{" "}
                <span className="text-gradient-neon">neon tabelayı</span>
                <br />
                kendin tasarla.
              </h1>
              <p className="mt-5 max-w-lg text-base text-white/70 sm:text-lg">
                Yazını yaz, fontunu ve rengini seç, ölçüyü ayarla — anında canlı önizleme ve TRY fiyat.
                Mudita Dekorasyon kalitesiyle özenle üretilir, kapına kadar gelir.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/tasarla"
                  className="rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
                >
                  Neon Tabelanı Tasarla
                </Link>
                <Link
                  to="/galeri"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
                >
                  İlham Galerisini Gör
                </Link>
              </div>
            </div>

            {/* Hero neon mosaic */}
            <div className="grid grid-cols-2 gap-4">
              {SAMPLES.map((s) => (
                <div
                  key={s.text}
                  className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur"
                >
                  <span
                    className="neon-text text-3xl sm:text-4xl"
                    style={{
                      fontFamily: s.font,
                      color: s.color,
                      textShadow: `0 0 4px ${s.color}, 0 0 14px ${s.glow}, 0 0 28px ${s.glow}, 0 0 60px ${s.glow}`,
                    }}
                  >
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Palette, title: "Sınırsız Özelleştirme", desc: "6 yazı tipi, 10 renk, çoklu satır ve özel ölçü." },
            { icon: Sparkles, title: "Anında Önizleme", desc: "Yazını yazarken canlı neon ışıltıyı gör." },
            { icon: Truck, title: "Türkiye Kargo", desc: "Özenle paketlenmiş, kapına kadar teslim." },
            { icon: Heart, title: "El Emeği", desc: "İki kız kardeşin kalbiyle ürettiği, tescilli marka." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <f.icon className="h-6 w-6 text-neon-pink" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">3 Adımda Neon Tabelan Hazır</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "Tasarla", d: "Yazını gir, font ve renk seç, ölçüyü ayarla." },
              { n: "2", t: "Onayla", d: "Anında fiyatı gör, sepete ekle veya teklif al." },
              { n: "3", t: "Teslim Al", d: "El emeğiyle üretelim, kapına gönderelim." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-card p-8 shadow-soft">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-neon text-sm font-bold text-white">
                  {s.n}
                </div>
                <h3 className="text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/tasarla"
              className="inline-block rounded-full bg-gradient-neon px-8 py-3 text-sm font-semibold text-white shadow-glow"
            >
              Hemen Tasarlamaya Başla
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
