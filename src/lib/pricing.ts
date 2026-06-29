import { FONTS, COLORS, SIZES, BACKBOARDS, MOUNTINGS } from "@/data/options";
import type { NeonDesignConfig, PriceBreakdown } from "./types";

const BASE_RATE_PER_CM2 = 1.6; // TRY per cm² baseline
const OUTDOOR_MULT = 1.25;
const RGB_MULT = 1.35;
const URGENT_MULT = 1.2;
const EXTRA_LINE_FEE = 250;
const ADAPTER_PRICE = { tr: 0, eu: 120 };
const SHIPPING_TR = 250;

const DECORATION_PRESET_BASE = 120;
const DECORATION_UPLOAD_BASE = 250;

export function getDimensions(cfg: NeonDesignConfig) {
  if (cfg.sizeId === "custom") {
    return {
      width: cfg.customWidth ?? 80,
      height: cfg.customHeight ?? 40,
    };
  }
  const s = SIZES.find((x) => x.id === cfg.sizeId)!;
  return { width: s.width, height: s.height };
}

export function calculatePrice(cfg: NeonDesignConfig): PriceBreakdown {
  const font = FONTS.find((f) => f.id === cfg.fontId) ?? FONTS[0];
  const color = COLORS.find((c) => c.id === cfg.colorId) ?? COLORS[0];
  const backboard = BACKBOARDS.find((b) => b.id === cfg.backboard) ?? BACKBOARDS[0];
  const mounting = MOUNTINGS.find((m) => m.id === cfg.mounting) ?? MOUNTINGS[0];

  const { width, height } = getDimensions(cfg);
  const area = Math.max(50, width * height);
  const lines = Math.max(1, cfg.text.split("\n").filter(Boolean).length);

  const items: { label: string; amount: number }[] = [];

  let base = area * BASE_RATE_PER_CM2;
  base = base * font.complexity;
  items.push({ label: `Taban (${width}×${height} cm)`, amount: Math.round(base) });

  if (lines > 1) {
    const extra = (lines - 1) * EXTRA_LINE_FEE;
    items.push({ label: `Ek satır (${lines - 1})`, amount: extra });
  }

  if (color.rgb) {
    const add = base * (RGB_MULT - 1);
    items.push({ label: "RGB / Çok renkli", amount: Math.round(add) });
  }

  if (cfg.outdoor) {
    const add = base * (OUTDOOR_MULT - 1);
    items.push({ label: "Dış mekan / IP korumalı", amount: Math.round(add) });
  }

  const backboardAdd = base * (backboard.priceMultiplier - 1) + backboard.flatAdd;
  if (backboardAdd > 0) {
    items.push({ label: `Arka panel: ${backboard.label}`, amount: Math.round(backboardAdd) });
  }

  items.push({ label: `Montaj: ${mounting.label}`, amount: mounting.price });

  if (cfg.dimmer) items.push({ label: "Uzaktan kumandalı dimmer", amount: 300 });
  if (ADAPTER_PRICE[cfg.adapter] > 0)
    items.push({ label: "AB tipi adaptör", amount: ADAPTER_PRICE[cfg.adapter] });

  // Decoration layers
  const decorations = cfg.decorations ?? [];
  if (decorations.length) {
    let presetCount = 0;
    let uploadCount = 0;
    let total = 0;
    for (const d of decorations) {
      const ratio = Math.max(5, Math.min(40, d.sizePct)) / 100;
      const cm2 = area * ratio * ratio;
      const sizeAdd = cm2 * BASE_RATE_PER_CM2 * 0.6;
      if (d.source === "preset") {
        presetCount++;
        total += DECORATION_PRESET_BASE + sizeAdd;
      } else {
        uploadCount++;
        total += DECORATION_UPLOAD_BASE + sizeAdd;
      }
    }
    const label = presetCount && uploadCount
      ? `Süslemeler (${presetCount}+${uploadCount} SVG)`
      : presetCount
        ? `Süslemeler (${presetCount} adet)`
        : `SVG süsleme (${uploadCount} adet)`;
    items.push({ label, amount: Math.round(total) });
  }

  // Additional text layers (multi-text)
  const textLayers = (cfg.textLayers ?? []).filter((l) => !l.hidden && l.text.trim().length);
  if (textLayers.length) {
    let total = 0;
    for (const l of textLayers) {
      const ratio = Math.max(6, Math.min(40, l.sizePct)) / 100;
      const cm2 = area * ratio * ratio * 1.4; // text uses more tubing per area
      const chars = Math.max(1, l.text.trim().length);
      total += cm2 * BASE_RATE_PER_CM2 * 0.7 + chars * 18;
    }
    items.push({
      label: `Ek metin katmanları (${textLayers.length})`,
      amount: Math.round(total),
    });
  }



  const subtotalBeforeUrgent = items.reduce((s, i) => s + i.amount, 0);
  let subtotal = subtotalBeforeUrgent;
  if (cfg.urgent) {
    const add = Math.round(subtotalBeforeUrgent * (URGENT_MULT - 1));
    items.push({ label: "Acil üretim", amount: add });
    subtotal += add;
  }

  const shipping = SHIPPING_TR;
  const total = subtotal + shipping;

  return {
    items,
    subtotal,
    shipping,
    total,
    productionDays: cfg.urgent ? "3-5 iş günü" : "7-10 iş günü",
  };
}

export function formatTRY(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}
