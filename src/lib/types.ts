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
  labelEn?: string;
  hex: string;
  glow: string;
  rgb?: boolean;
}

export type SizePresetId = "small" | "medium" | "large" | "custom";

export interface SizePreset {
  id: SizePresetId;
  label: string;
  labelEn?: string;
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
  labelEn?: string;
  priceMultiplier: number;
  flatAdd: number;
}

export type MountingType = "wall" | "hanging" | "stand";

export interface MountingOption {
  id: MountingType;
  label: string;
  labelEn?: string;
  price: number;
}

export interface AccessoryOption {
  id: string;
  label: string;
  labelEn?: string;
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

/** Decoration / SVG layer (preset icon or user-uploaded SVG). */
export interface Decoration {
  id: string;
  source: "preset" | "upload";
  /** Preset id from DECORATIONS table (when source === "preset"). */
  presetId?: string;
  /** Sanitised inline SVG markup (when source === "upload"). */
  svgMarkup?: string;
  /** Display label, e.g. preset label or "Yüklenen SVG". */
  label?: string;
  /** Color id from COLORS. */
  colorId: string;
  /** -45..45 percent offset from canvas centre. */
  x: number;
  y: number;
  /** -180..180 deg. */
  rotation: number;
  /** Size as % of canvas min-dim, 5..40. */
  sizePct: number;
  /** Mirror horizontally / vertically. */
  flipX?: boolean;
  flipY?: boolean;
  /** Glow intensity multiplier 60..140 (default 100). */
  glow?: number;
  hidden?: boolean;
  locked?: boolean;
}

/** Additional text layer on the canvas (multi-text support). */
export interface TextLayer {
  id: string;
  text: string;
  fontId: string;
  colorId: string;
  /** Font size as % of canvas width, 6..40. */
  sizePct: number;
  /** -45..45 percent offset from canvas centre. */
  x: number;
  y: number;
  /** -180..180 deg. */
  rotation: number;
  flipX?: boolean;
  flipY?: boolean;
  hidden?: boolean;
  locked?: boolean;
}

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
  /** Decoration / SVG layers on top of the text. */
  decorations?: Decoration[];
  /** Additional text layers (multi-text support). */
  textLayers?: TextLayer[];
  // Visual preview-only options (do not affect price)
  brightness?: number;   // 40 – 120, default 100
  flicker?: boolean;     // default true
  zoom?: number;         // 0.6 – 1.4, default 1
  isLightOn?: boolean;   // default true — turns glow off when false
  positionX?: number;    // -45..45 percent offset, default 0
  positionY?: number;    // -45..45 percent offset, default 0
  rotationDeg?: number;  // -15..15 deg, default 0
  realSizeMode?: boolean;// default false — show a cm ruler
  showMeasurements?: boolean;    // default false — width/height overlays
  showBackboardBounds?: boolean; // default false — backboard box overlay
  showSafeArea?: boolean;        // default false — inner safe-area guide
  showSizeBadge?: boolean;       // default true — toggles the W×H badge on the canvas
}

/** Editor selection: which object the properties panel edits. */
export type EditorSelection =
  | { kind: "canvas" }
  | { kind: "text" }
  | { kind: "textLayer"; id: string }
  | { kind: "decoration"; id: string };

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
