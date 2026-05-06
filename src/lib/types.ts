export type FontCategory = "script" | "handwritten" | "bold" | "modern" | "block" | "retro";

export interface FontOption {
  id: string;
  label: string;
  family: string;
  category: FontCategory;
  complexity: number; // pricing multiplier
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

export type BackgroundPreset = "brick" | "dark-room" | "wall" | "transparent";

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
