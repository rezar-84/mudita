import type {
  FontOption,
  ColorOption,
  SizePreset,
  BackboardOption,
  MountingOption,
  AccessoryOption,
  FontCategory,
} from "@/lib/types";

export const FONT_CATEGORY_LABEL: Record<FontCategory, string> = {
  script: "Script",
  handwritten: "El Yazısı",
  modern: "Modern",
  bold: "Kalın",
  block: "Blok",
  retro: "Retro",
  elegant: "Zarif",
  minimal: "Minimal",
  playful: "Eğlenceli",
  "logo-style": "Logo Tarzı",
};

export const FONT_CATEGORY_ORDER: FontCategory[] = [
  "script",
  "handwritten",
  "elegant",
  "modern",
  "minimal",
  "bold",
  "block",
  "playful",
  "retro",
  "logo-style",
];

export const FONTS: FontOption[] = [
  // Script
  { id: "pacifico", label: "Pacifico", family: "'Pacifico', cursive", category: "script", complexity: 1.25, badges: ["popular"] },
  { id: "lobster", label: "Lobster", family: "'Lobster', cursive", category: "script", complexity: 1.2, badges: ["popular"] },
  { id: "great-vibes", label: "Great Vibes", family: "'Great Vibes', cursive", category: "script", complexity: 1.3, badges: ["premium"] },
  { id: "satisfy", label: "Satisfy", family: "'Satisfy', cursive", category: "script", complexity: 1.22 },
  { id: "sacramento", label: "Sacramento", family: "'Sacramento', cursive", category: "script", complexity: 1.25 },

  // Handwritten
  { id: "caveat", label: "Caveat", family: "'Caveat', cursive", category: "handwritten", complexity: 1.18 },
  { id: "dancing-script", label: "Dancing Script", family: "'Dancing Script', cursive", category: "handwritten", complexity: 1.2 },

  // Elegant
  { id: "playfair", label: "Playfair Display", family: "'Playfair Display', serif", category: "elegant", complexity: 1.15, badges: ["logo"] },

  // Modern
  { id: "montserrat", label: "Montserrat", family: "'Montserrat', sans-serif", category: "modern", complexity: 1.0, badges: ["popular"] },
  { id: "poppins", label: "Poppins", family: "'Poppins', sans-serif", category: "modern", complexity: 1.0 },

  // Minimal
  { id: "quicksand", label: "Quicksand", family: "'Quicksand', sans-serif", category: "minimal", complexity: 1.0 },

  // Bold
  { id: "bungee", label: "Bungee", family: "'Bungee', sans-serif", category: "bold", complexity: 1.1 },

  // Block
  { id: "russo", label: "Russo One", family: "'Russo One', sans-serif", category: "block", complexity: 1.05, badges: ["logo"] },
  { id: "bebas-neue", label: "Bebas Neue", family: "'Bebas Neue', sans-serif", category: "block", complexity: 1.05, badges: ["popular", "logo"] },

  // Playful
  { id: "righteous", label: "Righteous", family: "'Righteous', sans-serif", category: "playful", complexity: 1.1, badges: ["logo"] },

  // Retro
  { id: "monoton", label: "Monoton", family: "'Monoton', cursive", category: "retro", complexity: 1.2, badges: ["premium"] },
];

export const COLORS: ColorOption[] = [
  { id: "warm-white", label: "Sıcak Beyaz", hex: "#fff1c1", glow: "#ffd56b" },
  { id: "cool-white", label: "Soğuk Beyaz", hex: "#eaf6ff", glow: "#9ed8ff" },
  { id: "red", label: "Kırmızı", hex: "#ff4d6d", glow: "#ff003c" },
  { id: "pink", label: "Pembe", hex: "#ff8ad1", glow: "#ff3eb5" },
  { id: "blue", label: "Mavi", hex: "#7ab8ff", glow: "#1e90ff" },
  { id: "green", label: "Yeşil", hex: "#8fffb0", glow: "#00d96b" },
  { id: "yellow", label: "Sarı", hex: "#fff48a", glow: "#ffd400" },
  { id: "orange", label: "Turuncu", hex: "#ffb27a", glow: "#ff7a00" },
  { id: "purple", label: "Mor", hex: "#cba0ff", glow: "#8a2be2" },
  { id: "rgb", label: "RGB / Çok Renkli", hex: "#ffffff", glow: "#ff00ff", rgb: true },
];

export const SIZES: SizePreset[] = [
  { id: "small", label: "Küçük (50 cm)", width: 50, height: 25 },
  { id: "medium", label: "Orta (80 cm)", width: 80, height: 40 },
  { id: "large", label: "Büyük (120 cm)", width: 120, height: 60 },
  { id: "custom", label: "Özel Ölçü", width: 80, height: 40 },
];

export const BACKBOARDS: BackboardOption[] = [
  { id: "transparent", label: "Şeffaf Akrilik", priceMultiplier: 1.0, flatAdd: 0 },
  { id: "cut-to-shape", label: "Şekle Göre Kesim", priceMultiplier: 1.15, flatAdd: 250 },
  { id: "rectangle", label: "Dikdörtgen", priceMultiplier: 1.0, flatAdd: 150 },
  { id: "cut-to-letter", label: "Harfe Göre Kesim", priceMultiplier: 1.3, flatAdd: 400 },
  { id: "black", label: "Siyah Akrilik", priceMultiplier: 1.05, flatAdd: 200 },
  { id: "white", label: "Beyaz Akrilik", priceMultiplier: 1.05, flatAdd: 200 },
  { id: "mirror-gold", label: "Ayna Altın", priceMultiplier: 1.25, flatAdd: 500 },
  { id: "mirror-silver", label: "Ayna Gümüş", priceMultiplier: 1.25, flatAdd: 500 },
];

export const MOUNTINGS: MountingOption[] = [
  { id: "wall", label: "Duvar Montaj Kiti", price: 150 },
  { id: "hanging", label: "Asma Kiti", price: 200 },
  { id: "stand", label: "Stand / Ayak", price: 350 },
];

export const ACCESSORIES: AccessoryOption[] = [
  { id: "dimmer", label: "Uzaktan Kumandalı Dimmer", price: 300 },
];

export const BACKGROUNDS: { id: import("@/lib/types").BackgroundPreset; label: string; thumb: string }[] = [
  { id: "dark-room", label: "Koyu Oda", thumb: "bg-preset-dark" },
  { id: "brick", label: "Tuğla Duvar", thumb: "bg-preset-brick" },
  { id: "concrete", label: "Beton Duvar", thumb: "bg-preset-concrete" },
  { id: "white-wall", label: "Beyaz Duvar", thumb: "bg-preset-white-wall" },
  { id: "wall", label: "Koyu Duvar", thumb: "bg-preset-wall" },
  { id: "light-wall", label: "Açık Duvar", thumb: "bg-preset-light-wall" },
  { id: "salon", label: "Salon", thumb: "bg-preset-salon" },
  { id: "cafe", label: "Kafe", thumb: "bg-preset-cafe" },
  { id: "store", label: "Mağaza", thumb: "bg-preset-store" },
  { id: "wood", label: "Ahşap Panel", thumb: "bg-preset-wood" },
  { id: "transparent", label: "Şeffaf", thumb: "bg-preset-transparent" },
  { id: "checker", label: "Dama Şeffaflık", thumb: "bg-preset-checker" },
];
