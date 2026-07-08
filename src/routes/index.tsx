import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Truck, ShieldCheck, Pencil, FileCheck2, Factory, PackageCheck, Heart, Home, Baby, GlassWater, Store, Scissors, Gamepad2, Briefcase, Plug, Package, Settings2, Palette, Wifi, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MudiNeon · Kişiye Özel LED Neon Tabela" },
      { name: "description", content: "Kişiye özel LED neon tabelanı kendin tasarla, anında fiyat gör. Tasarım onayıyla üretim, Türkiye geneli güvenli kargo." },
      { property: "og:title", content: "MudiNeon · Kişiye Özel LED Neon Tabela" },
      { property: "og:description", content: "Yazını gir, rengini ve ölçünü seç, neon tabelanı tasarla. Üretime başlamadan tasarım onayı." },
    ],
  }),
  component: HomePage,
});

const SAMPLES = [
  { text: "MudiNeon", font: "'Pacifico', cursive", color: "#ff8ad1", glow: "#ff3eb5" },
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
      <section className="relative overflow-hidden [contain:paint]">
        <div className="absolute inset-0 bg-preset-dark" aria-hidden />

        {/* Animated neon glow orbs — lighter blur on mobile */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="hero-orb absolute -top-32 -left-20 h-72 w-72 rounded-full blur-2xl md:h-[28rem] md:w-[28rem] md:blur-3xl animate-hero-orb-1" style={{ background: "radial-gradient(circle, rgba(255,62,181,0.45), transparent 60%)" }} />
          <div className="hero-orb absolute top-1/3 -right-24 h-80 w-80 rounded-full blur-2xl md:h-[32rem] md:w-[32rem] md:blur-3xl animate-hero-orb-2" style={{ background: "radial-gradient(circle, rgba(30,144,255,0.45), transparent 60%)" }} />
          <div className="hero-orb absolute -bottom-24 left-1/3 hidden h-[26rem] w-[26rem] rounded-full blur-3xl md:block animate-hero-orb-3" style={{ background: "radial-gradient(circle, rgba(0,217,107,0.35), transparent 60%)" }} />
        </div>


        {/* Twinkling sparkle dots — fewer on mobile */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[
            { l: "12%", t: "22%", d: "0s", c: "#ff8ad1", m: true },
            { l: "78%", t: "18%", d: "1.2s", c: "#7ab8ff", m: true },
            { l: "32%", t: "70%", d: "2.4s", c: "#fff48a", m: false },
            { l: "62%", t: "82%", d: "0.6s", c: "#8fffb0", m: true },
            { l: "88%", t: "55%", d: "1.8s", c: "#ff8ad1", m: false },
            { l: "8%", t: "60%", d: "3s", c: "#7ab8ff", m: false },
          ].map((s, i) => (
            <span
              key={i}
              className={`absolute h-1.5 w-1.5 rounded-full animate-hero-twinkle ${s.m ? "" : "hidden md:block"}`}
              style={{
                left: s.l,
                top: s.t,
                backgroundColor: s.c,
                boxShadow: `0 0 6px ${s.c}`,
                animationDelay: s.d,
              }}
            />
          ))}
        </div>


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
            <div className="relative grid grid-cols-2 gap-4">
              {SAMPLES.map((s, i) => (
                <div
                  key={s.text}
                  className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur"
                >
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${s.glow}22, transparent 70%)`,
                    }}
                  />
                  <span
                    className="neon-text neon-mosaic relative text-3xl sm:text-4xl animate-neon-flicker"
                    style={{
                      fontFamily: s.font,
                      color: s.color,
                      ["--neon-color" as string]: s.color,
                      ["--neon-glow" as string]: s.glow,
                      animationDelay: `${i * 0.7}s`,
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

      {/* USE CASES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Her Mekana Uygun Neon</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Ev, kafe, mağaza, düğün — ilham al, kendi tasarımına geç.
          </p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {[
            { icon: Home, t: "Ev Dekorasyonu" },
            { icon: Baby, t: "Bebek Odası" },
            { icon: Heart, t: "Düğün & Nişan" },
            { icon: GlassWater, t: "Kafe & Restoran" },
            { icon: Scissors, t: "Güzellik Salonu" },
            { icon: Store, t: "Mağaza Vitrini" },
            { icon: Gamepad2, t: "Oyun Odası" },
            { icon: Briefcase, t: "Ofis & Stüdyo" },
          ].map((u) => (
            <div key={u.t} className="flex w-40 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-neon text-white">
                <u.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">{u.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Paketinde Neler Var?</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Her sipariş tam set olarak gelir — montaja hazır.
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {[
              { icon: Sparkles, t: "Kişiye özel LED neon tabela" },
              { icon: Palette, t: "Şeffaf akrilik arka panel" },
              { icon: Settings2, t: "Montaj aparatı" },
              { icon: Plug, t: "Güç adaptörü" },
              { icon: Wifi, t: "Dimmer / kumanda seçeneği" },
              { icon: FileCheck2, t: "Üretim öncesi tasarım onayı" },
              { icon: Package, t: "Güvenli paketleme" },
              { icon: Truck, t: "Türkiye geneli kargo" },
            ].map((i) => (
              <div key={i.t} className="flex w-56 shrink-0 items-start gap-3 rounded-2xl bg-card p-4 shadow-soft">
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-neon text-white">
                  <i.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium">{i.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { icon: FileCheck2, t: "Üretim Öncesi Tasarım Onayı" },
            { icon: Truck, t: "Türkiye Geneli Kargo" },
            { icon: ShieldCheck, t: "İç / Dış Mekan Seçenekleri" },
            { icon: Sparkles, t: "Güvenli LED Teknolojisi" },
            { icon: MessageCircle, t: "WhatsApp ile Hızlı Teklif" },
          ].map((b) => (
            <div key={b.t} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-xs font-medium shadow-soft">
              <b.icon className="h-4 w-4 shrink-0 text-foreground/80" />
              <span>{b.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SIZE GUIDE TEASER */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Hangi Ölçü Sana Uygun?</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Mekanına göre öneri rehberi.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { s: "40–60 cm", d: "Masa, raf, küçük odalar" },
              { s: "60–90 cm", d: "Ev dekorasyonu, hediye, oda duvarı" },
              { s: "90–120 cm", d: "Kafe, salon, ofis" },
              { s: "120 cm+", d: "Mağaza, vitrin, büyük duvar" },
            ].map((g) => (
              <div key={g.s} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <p className="text-lg font-bold">{g.s}</p>
                <p className="mt-1 text-sm text-muted-foreground">{g.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/tasarla" className="inline-block rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow">
              Ölçünü Birlikte Belirleyelim
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
