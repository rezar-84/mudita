import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Truck, ShieldCheck, Pencil, FileCheck2, Factory, PackageCheck, Heart, Home, Baby, GlassWater, Store, Scissors, Gamepad2, Briefcase, Plug, Package, Settings2, Palette, Wifi, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mudita Dekorasyon · Kişiye Özel LED Neon Tabela" },
      { name: "description", content: "Kişiye özel LED neon tabelanı kendin tasarla, anında fiyat gör. Tasarım onayıyla üretim, Türkiye geneli güvenli kargo." },
      { property: "og:title", content: "Mudita Dekorasyon · Kişiye Özel LED Neon Tabela" },
      { property: "og:description", content: "Yazını gir, rengini ve ölçünü seç, neon tabelanı tasarla. Üretime başlamadan tasarım onayı." },
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

const BENEFITS = [
  {
    icon: Heart,
    title: "Kişiye özel üretim",
    desc: "Yazı, font, renk, ölçü ve arka panel — tamamen size özel el emeği üretim.",
  },
  {
    icon: ShieldCheck,
    title: "Üretim öncesi tasarım onayı",
    desc: "Siparişin üretime girmeden önce dijital ön görselini sana gönderiyoruz. Onayın olmadan üretime başlamıyoruz.",
  },
  {
    icon: Truck,
    title: "Türkiye geneli güvenli kargo",
    desc: "Özel köpük ambalajla, kırılmadan kapına. 81 ile gönderim.",
  },
];

const STEPS = [
  { icon: Pencil, n: "1", t: "Tasarla", d: "Yazını yaz, fontunu ve rengini seç, ölçünü ayarla. Canlı önizleme ile sonucu gör." },
  { icon: FileCheck2, n: "2", t: "Teklif al veya sepete ekle", d: "Anında fiyatı gör. İstersen ücretsiz teklif al, istersen direkt sepete ekle." },
  { icon: ShieldCheck, n: "3", t: "Tasarım onayı ver", d: "Üretime başlamadan önce sana dijital ön görseli gönderiyoruz." },
  { icon: Factory, n: "4", t: "Üretim ve kargo", d: "Onayın sonrası el emeğiyle üretiyor, özenle paketleyip kapına gönderiyoruz." },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-preset-dark" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> El emeği · Türkiye'den
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Hayalindeki{" "}
                <span className="text-gradient-neon">neon tabelayı</span>{" "}
                kendin tasarla.
              </h1>
              <p className="mt-5 max-w-lg text-base text-white/70 sm:text-lg">
                Yazını yaz, fontunu ve rengini seç, ölçüyü ayarla — anında canlı önizleme ve TRY fiyat.
                Üretime başlamadan önce tasarım onayını alıyoruz.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/tasarla"
                  className="rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
                >
                  Neon Tabelanı Tasarla
                </Link>
                <Link
                  to="/yukle"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
                >
                  Logonu Yükle, Teklif Al
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Tasarım onayı</span>
                <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Türkiye geneli kargo</span>
                <span className="inline-flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" /> %100 el emeği</span>
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

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-neon text-white">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Nasıl Çalışır?</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Siparişten teslimata kadar her adım net ve şeffaf. Sürpriz yok, tasarım onayın olmadan üretim yok.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-2xl bg-card p-6 shadow-soft">
                <div className="mb-3 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-neon text-sm font-bold text-white">
                    {s.n}
                  </div>
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/tasarla"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow"
            >
              <PackageCheck className="h-4 w-4" /> Hemen Tasarla
            </Link>
            <Link
              to="/yukle"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold"
            >
              Logonu Yükle, Teklif Al
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY TEASER CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">İlhama mı ihtiyacın var?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Daha önce ürettiğimiz tasarımlara göz at, beğendiğin tarzı kendi yazınla canlandır.
        </p>
        <Link
          to="/galeri"
          className="mt-6 inline-block rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent"
        >
          Galeriyi Gör
        </Link>
      </section>
    </>
  );
}
