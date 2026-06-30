import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { useT } from "@/lib/i18n";

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
  const t = useT();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <img src={logo} alt={t("brand")} className="mb-8 h-14 w-auto" />
      <h1 className="text-3xl font-bold sm:text-4xl">{t("aboutTitle")}</h1>
      <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>{t("aboutP1")}</p>
        <p>{t("aboutP2")}</p>
        <p>{t("aboutP3")}</p>
        <p>
          {t("aboutP4")}{" "}
          <span className="text-gradient-neon font-semibold">✨</span>
        </p>
      </div>
    </div>
  );
}
