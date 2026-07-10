import { type DecorationPreset } from "./decorations";

const modules = import.meta.glob(
  "../assets/objects/sport_emblems/soccer/turkey/*.svg",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

function formatEmblemLabel(filename: string): string {
  // e.g. "turkey_adana-demirspor.football-logos.cc.svg" -> "Adana Demirspor"
  let cleanName = filename
    .replace(/^turkey_/, "")
    .replace(/\.football-logos\.cc$/, "")
    .replace(/\.svg$/, "");

  const customMap: Record<string, string> = {
    "besiktas": "Beşiktaş JK",
    "fenerbahce": "Fenerbahçe SK",
    "galatasaray": "Galatasaray SK",
    "trabzonspor": "Trabzonspor",
    "basaksehir": "Başakşehir FK",
    "turkish-football-federation": "TFF",
    "turkey-national-team": "Türkiye Milli Takımı",
    "1st-lig": "Trendyol 1. Lig",
  };

  if (customMap[cleanName]) return customMap[cleanName];

  return cleanName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const SPORT_EMBLEMS: DecorationPreset[] = Object.entries(modules).map(
  ([path, rawMarkup]) => {
    const filename = path.split("/").pop() || "";
    const cleanId = filename
      .replace(/^turkey_/, "")
      .replace(/\.football-logos\.cc\.svg$/, "")
      .replace(/\.svg$/, "");

    const viewBoxMatch = rawMarkup.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : undefined;

    return {
      id: `emblem-${cleanId}`,
      label: formatEmblemLabel(filename),
      labelEn: formatEmblemLabel(filename),
      category: "sports",
      svgMarkup: rawMarkup,
      viewBox,
    };
  }
);
