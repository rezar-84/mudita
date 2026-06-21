export type FontCategory =
  | "script"
  | "handwritten"
  | "modern"
  | "bold"
  | "block"
  | "retro"
  | "elegant"
  | "minimal"
  | "playful"
  | "logo-style";

export type FontBadge = "popular" | "premium" | "logo";

export interface FontOption {
  id: string;
  label: string;
  family: string;
  category: FontCategory;
  complexity: number; // pricing multiplier
  badges?: FontBadge[];
  preview?: string; // sample word
}

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
  glow: string;
  rgb?: boolean;
}

export type SizePresetId = "small" | "medium" | "large" | "custom";

export interface SizePreset {
  id: SizePresetId;
  label: string;
  width: number; // cm
  height: number; // cm
}

export type BackboardType =
  | "transparent"
  | "cut-to-shape"
  | "rectangle"
  | "cut-to-letter"
  | "black"
  | "white"
  | "mirror-gold"
  | "mirror-silver";

export interface BackboardOption {
  id: BackboardType;
  label: string;
  priceMultiplier: number;
  flatAdd: number;
}

export type MountingType = "wall" | "hanging" | "stand";

export interface MountingOption {
  id: MountingType;
  label: string;
  price: number;
}

export interface AccessoryOption {
  id: string;
  label: string;
  price: number;
}

export type PowerAdapter = "tr" | "eu";

export type BackgroundPreset =
  | "dark-room"
  | "brick"
  | "concrete"
  | "white-wall"
  | "wall"
  | "light-wall"
  | "salon"
  | "cafe"
  | "store"
  | "wood"
  | "transparent"
  | "checker";

export interface NeonDesignConfig {
  text: string;
  fontId: string;
  colorId: string;
  sizeId: SizePresetId;
  customWidth?: number;
  customHeight?: number;
  outdoor: boolean;
  backboard: BackboardType;
  mounting: MountingType;
  dimmer: boolean;
  adapter: PowerAdapter;
  urgent: boolean;
  notes: string;
  background: BackgroundPreset;
  customBackground?: string; // user-uploaded image as data URL (overrides background preset)
  customBackgroundName?: string;
  // Visual preview-only options (do not affect price)
  brightness?: number; // 40 – 120, default 100
  flicker?: boolean;   // default true
  zoom?: number;       // 0.6 – 1.4, default 1
}

export interface PriceLineItem {
  label: string;
  amount: number;
}

export interface PriceBreakdown {
  items: PriceLineItem[];
  subtotal: number;
  shipping: number;
  total: number;
  productionDays: string;
}

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  notes: string;
  config: NeonDesignConfig;
}

export interface CartItem {
  id: string;
  config: NeonDesignConfig;
  price: number;
  createdAt: number;
}
