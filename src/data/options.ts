import type {
  FontOption,
  ColorOption,
  SizePreset,
  BackboardOption,
  MountingOption,
  AccessoryOption,
} from "@/lib/types";

export const FONTS: FontOption[] = [
  { id: "pacifico", label: "El Yazısı (Script)", family: "'Pacifico', cursive", category: "script", complexity: 1.25 },
  { id: "caveat", label: "Doğal El Yazısı", family: "'Caveat', cursive", category: "handwritten", complexity: 1.2 },
  { id: "bungee", label: "Kalın", family: "'Bungee', sans-serif", category: "bold", complexity: 1.1 },
  { id: "montserrat", label: "Modern", family: "'Montserrat', sans-serif", category: "modern", complexity: 1.0 },
  { id: "russo", label: "Blok", family: "'Russo One', sans-serif", category: "block", complexity: 1.05 },
  { id: "monoton", label: "Retro", family: "'Monoton', cursive", category: "retro", complexity: 1.15 },
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
