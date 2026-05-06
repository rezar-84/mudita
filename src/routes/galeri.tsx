import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/galeri")({
  head: () => ({
    meta: [
      { title: "İlham Galerisi · Mudita Dekorasyon" },
      { name: "description", content: "Daha önce ürettiğimiz neon tabelalardan ilham al, kendi tasarımını yap." },
      { property: "og:title", content: "İlham Galerisi · Mudita Dekorasyon" },
      { property: "og:description", content: "Düğün, ofis, ev ve hediye için neon tabela örnekleri." },
    ],
  }),
  component: GalleryPage,
});

const ITEMS = [
  { text: "Aşk", font: "'Pacifico', cursive", color: "#ff8ad1", glow: "#ff3eb5", cat: "Düğün" },
  { text: "Open", font: "'Bungee', sans-serif", color: "#ff4d6d", glow: "#ff003c", cat: "İşletme" },
  { text: "Hello", font: "'Monoton', cursive", color: "#7ab8ff", glow: "#1e90ff", cat: "Ev" },
  { text: "Bar", font: "'Russo One', sans-serif", color: "#fff48a", glow: "#ffd400", cat: "İşletme" },
  { text: "Smile", font: "'Caveat', cursive", color: "#8fffb0", glow: "#00d96b", cat: "Hediye" },
  { text: "Forever", font: "'Pacifico', cursive", color: "#ffb27a", glow: "#ff7a00", cat: "Düğün" },
  { text: "Dream", font: "'Montserrat', sans-serif", color: "#cba0ff", glow: "#8a2be2", cat: "Ev" },
  { text: "Coffee", font: "'Caveat', cursive", color: "#ffd56b", glow: "#ffaa00", cat: "İşletme" },
];

function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">İlham Galerisi</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Daha önce ürettiğimiz tasarımlar — beğendiğin tarzı seç, kendi yazınla aynısını yap.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it, i) => (
          <div
            key={i}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-preset-dark"
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <span
                className="neon-text text-5xl"
                style={{
                  fontFamily: it.font,
                  color: it.color,
                  textShadow: `0 0 4px ${it.color}, 0 0 14px ${it.glow}, 0 0 28px ${it.glow}, 0 0 60px ${it.glow}`,
                }}
              >
                {it.text}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {it.cat}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/tasarla"
          className="inline-block rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Kendi Tasarımını Yap
        </Link>
      </div>
    </div>
  );
}
