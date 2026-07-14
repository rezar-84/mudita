export interface DecorationPreset {
  id: string;
  label: string;
  labelEn?: string;
  category: "love" | "nature" | "food" | "music" | "weather" | "symbol" | "fun" | "sports";
  path?: string;
  viewBox?: string;
  /** Native SVG width / height, used to preserve the artwork's proportions. */
  aspectRatio?: number;
  svgMarkup?: string;
}

export const DECORATIONS: DecorationPreset[] = [
  {
    id: "heart",
    label: "Kalp",
    labelEn: "Heart",
    category: "love",
    path: "M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z",
  },
  {
    id: "star",
    label: "Yıldız",
    labelEn: "Star",
    category: "symbol",
    path: "M12 2 14.6 9 22 9.5l-5.7 4.6L18 22l-6-3.7L6 22l1.7-7.9L2 9.5 9.4 9z",
  },
  {
    id: "sparkle",
    label: "Parıltı",
    labelEn: "Sparkle",
    category: "symbol",
    path: "M12 2 13 10 21 11 13 12 12 21 11 12 3 11 12 3 11 10z",
  },
  {
    id: "crown",
    label: "Taç",
    labelEn: "Crown",
    category: "symbol",
    path: "M3 18h18l-1.5-9-4 3-3.5-6-3.5 6-4-3z",
  },
  {
    id: "lightning",
    label: "Şimşek",
    labelEn: "Lightning",
    category: "weather",
    path: "M13 2 4 14h6l-1 8 9-12h-6z",
  },
  {
    id: "sun",
    label: "Güneş",
    labelEn: "Sun",
    category: "weather",
    path: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5v3m0 14v3M2 12h3m14 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
  },
  {
    id: "moon",
    label: "Ay",
    labelEn: "Moon",
    category: "weather",
    path: "M20 14.5A8 8 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z",
  },
  {
    id: "cloud",
    label: "Bulut",
    labelEn: "Cloud",
    category: "weather",
    path: "M7 18a4 4 0 0 1-.4-7.9 6 6 0 0 1 11.6 1A4 4 0 0 1 17 18H7z",
  },
  {
    id: "music",
    label: "Müzik Notası",
    labelEn: "Music Note",
    category: "music",
    path: "M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z",
  },
  {
    id: "coffee",
    label: "Kahve",
    labelEn: "Coffee",
    category: "food",
    path: "M4 9h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9zm12 1h2a2 2 0 0 1 0 4h-2M8 2v3M12 2v3",
  },
  {
    id: "cocktail",
    label: "Kokteyl",
    labelEn: "Cocktail",
    category: "food",
    path: "M4 4h16l-8 9v6M8 19h8M2 4h20",
  },
  {
    id: "pizza",
    label: "Pizza",
    labelEn: "Pizza",
    category: "food",
    path: "M12 2 22 22H2L12 2zm0 7v.01M9 14v.01M14 16v.01",
  },
  {
    id: "camera",
    label: "Kamera",
    labelEn: "Camera",
    category: "fun",
    path: "M3 8h4l2-3h6l2 3h4v11H3V8zm9 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  },
  {
    id: "smile",
    label: "Gülen Yüz",
    labelEn: "Smile",
    category: "fun",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 10v.01M16 10v.01M8 15s1.5 2 4 2 4-2 4-2",
  },
  {
    id: "paw",
    label: "Pati",
    labelEn: "Paw",
    category: "nature",
    path: "M7 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm10 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM4 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm16 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-8 8c-3 0-5-2-5-4s2-4 5-4 5 2 5 4-2 4-5 4z",
  },
  {
    id: "flower",
    label: "Çiçek",
    labelEn: "Flower",
    category: "nature",
    path: "M12 7a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0-5v3m0 14v3m9-10h-3M5 12H2m15.5-7L15 7.5m-6 9-2.5 2.5m11 0L15 16.5m-6-9L6.5 5",
  },
  {
    id: "leaf",
    label: "Yaprak",
    labelEn: "Leaf",
    category: "nature",
    path: "M5 21c0-9 5-15 16-16-1 11-7 16-16 16zm0 0 8-8",
  },
  {
    id: "cactus",
    label: "Kaktüs",
    labelEn: "Cactus",
    category: "nature",
    path: "M10 22V6a3 3 0 0 1 6 0v8h2a2 2 0 0 0 2-2V8m-12 6H6a2 2 0 0 1-2-2V8",
  },
  {
    id: "ring",
    label: "Yüzük",
    labelEn: "Ring",
    category: "love",
    path: "M12 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM9 7l3-5 3 5",
  },
  { id: "arrow", label: "Ok", labelEn: "Arrow", category: "symbol", path: "M3 12h16m-6-6 6 6-6 6" },
  {
    id: "lips",
    label: "Dudaklar",
    labelEn: "Lips",
    category: "love",
    path: "M2 12s4-5 10-5 10 5 10 5-4 5-10 5S2 12 2 12zm10-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  },
  {
    id: "eye",
    label: "Göz",
    labelEn: "Eye",
    category: "fun",
    path: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
  {
    id: "infinity",
    label: "Sonsuzluk",
    labelEn: "Infinity",
    category: "symbol",
    path: "M6 12a4 4 0 1 1 4 4c-2 0-3-1.5-4-3s-2-3-4-3a4 4 0 1 0 0 8c2 0 3-1.5 4-3",
  },
  {
    id: "anchor",
    label: "Çapa",
    labelEn: "Anchor",
    category: "symbol",
    path: "M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 4v14M5 14a7 7 0 0 0 14 0M7 12H4m16 0h-3",
  },
];

export const DECORATION_CATEGORY_LABEL: Record<DecorationPreset["category"], string> = {
  love: "Aşk",
  nature: "Doğa",
  food: "Yiyecek",
  music: "Müzik",
  weather: "Hava",
  symbol: "Sembol",
  fun: "Eğlence",
  sports: "Spor Kulüpleri",
};

export const DECORATION_CATEGORY_LABEL_EN: Record<DecorationPreset["category"], string> = {
  love: "Love",
  nature: "Nature",
  food: "Food",
  music: "Music",
  weather: "Weather",
  symbol: "Symbol",
  fun: "Fun",
  sports: "Sports Clubs",
};
