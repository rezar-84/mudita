import { useSyncExternalStore } from "react";

type Dict = Record<string, string>;

const tr: Dict = {
  brand: "Mudita Dekorasyon",
  brandTagline: "El emeğiyle, kalbimizle üretiyoruz",
  navHome: "Ana Sayfa",
  navDesign: "Tasarla",
  navGallery: "Galeri",
  navUpload: "Görsel Yükle",
  navAbout: "Hakkımızda",
  navFaq: "S.S.S.",
  navContact: "İletişim",
  navCart: "Sepet",

  // CTAs
  ctaDesign: "Neon Tabelanı Tasarla",
  ctaDesignNow: "Hemen Tasarla",
  ctaFreeQuote: "Ücretsiz Teklif Al",
  ctaUploadLogo: "Logonu Yükle, Teklif Al",
  ctaWhatsapp: "WhatsApp’tan Gönder",
  ctaAddToCart: "Sepete Ekle",
  ctaShareDesign: "Tasarımı Paylaş",
  ctaSimilar: "Benzerini Tasarla",

  // Trust
  trustApproval: "Üretime başlamadan önce tasarım onayınızı alıyoruz.",
  trustIndoorOutdoor: "İç ve dış mekana uygun seçenekler sunuyoruz.",
  trustShipping: "Türkiye geneli güvenli kargo ile gönderiyoruz.",
  trustCustom: "Ölçü, renk ve arka panel seçenekleriyle tamamen size özel üretim yapıyoruz.",

  // Configurator labels
  enterText: "Yazını Gir",
  fontType: "Yazı Tipi",
  pickColor: "Renk Seç",
  size: "Ölçü",
  backboard: "Arka Panel",
  mounting: "Montaj Seçenekleri",
  accessories: "Aksesuarlar",
  notes: "Özel Notlar",
  estimatedPrice: "Tahmini Fiyat",
  productionTime: "Üretim Süresi",
  shipping: "Kargo",
  total: "Toplam",
  outdoor: "Dış Mekan (IP Korumalı)",
  indoor: "İç Mekan",
  dimmer: "Uzaktan Kumandalı Dimmer",
  urgent: "Acil Üretim",
  adapter: "Güç Adaptörü",

  // Designer page
  designerTitle: "Neon Tabelanı Tasarla",
  designerSubtitle: "Yazını gir, stilini seç, fiyat anında güncellenir.",
  tabText: "Yazı",
  tabStyle: "Stil",
  tabSize: "Ölçü",
  tabScene: "Sahne",
  tabExtras: "Ekstra",
  emptyHint: "Tasarımına başlamak için aşağıdaki kutuya yazını gir.",
  textPlaceholder: "Mudita",
  textCharsHint: "karakter · Enter ile yeni satır",
  width: "Genişlik",
  height: "Yükseklik",
  outdoorIP65: "Dış Mekan (IP65)",
  outdoorIP65Desc: "Su geçirmez üretim, +%25",
  on: "Açık",
  off: "Kapalı",
  selected: "Seçili",
  urgentLabel: "Acil Üretim (3-5 gün)",
  adapterTR: "Türkiye Tipi",
  adapterEU: "AB Tipi (+₺120)",
  notesPlaceholder: "Özel istekleriniz...",
  dimmerDesc: "Parlaklığı ve titreşim modunu uzaktan kumandayla ayarla.",
  dimmerSimNote: "✨ Dimmer simülasyonu: aşağıdaki ayarlar uzaktan kumandayla gerçek hayatta da yapılabilir.",
  flickerDesc: "Hafif neon titreşim efekti",
  realSizeLabel: "gerçek boyut",
  outdoorBadge: "Dış Mekan · IP65",
  emptyPreviewHint: "Sağdaki kutuya yazını yaz, önizleme canlansın ✨",
  zoomIn: "Yakınlaştır",
  zoomOut: "Uzaklaştır",
  lightOnAria: "Işığı aç",
  lightOffAria: "Işığı kapat",

  // Preview / Backgrounds
  previewBackground: "Önizleme Arka Planı",
  brightness: "Parlaklık",
  flicker: "Titreme Efekti",
  zoom: "Yakınlaştır",
  realSizePreview: "Gerçek Boyut Hissi",
  lightOn: "Neon Işığı",
  rotate: "Döndür",
  reset: "Sıfırla",
  center: "Ortala",
  resetView: "Görünümü Sıfırla",
  dragTip: "Tabelayı duvarda konumlandırmak için sürükleyebilirsin.",
  lightTip: "Işığı kapatıp açarak gündüz/gece etkisini görebilirsin.",
  rotateTip: "Döndürme ve yakınlaştırma sadece önizleme içindir, fiyatı değiştirmez.",

  // Helper copy
  livePreviewTip: "Tasarımını canlı olarak gör",
  tryBgTip: "Neon etkisini arka planda dene",
  fontMoodTip: "Yazı tipini seç, ışığın havasını değiştir",
  approvalTip: "Üretim öncesi tasarım onayı alırsın",
  logoSuitableTip: "Bu yazı tipi logo ve marka tabelaları için uygundur",
  shippingTip: "Türkiye geneli güvenli kargo",
  productAddedToCart: "Ürün sepete eklendi",

  // Font badges
  badgePopular: "Popüler",
  badgePremium: "Premium",
  badgeLogo: "Logo İçin Uygun",

  // Warnings
  warningSmall: "Yazı çok küçük olabilir, üretim zorlaşır. Daha büyük ölçü öneririz.",
  warningOutdoorScript: "İnce/script yazı tipi dış mekanda dayanıksız olabilir, kalın bir font öneririz.",
  warningLongText: "Yazı uzun — okunaklık için ölçüyü büyütmeyi düşünebilirsin.",
  warningComplexFont: "Bu yazı tipi karmaşık; üretim biraz daha uzun sürebilir.",
  warningEmptyText: "Tasarımına başlamak için yukarıdaki kutuya yazını gir.",

  // Hero / Home
  heroBadge: "El emeği · Türkiye'den",
  heroTitleA: "Hayalindeki",
  heroTitleHighlight: "neon tabelayı",
  heroTitleB: "kendin tasarla.",
  heroSubtitle: "Yazını yaz, fontunu ve rengini seç, ölçüyü ayarla — anında canlı önizleme ve TRY fiyat. Üretime başlamadan önce tasarım onayını alıyoruz.",
  heroTrustApproval: "Tasarım onayı",
  heroTrustShipping: "Türkiye geneli kargo",
  heroTrustHandmade: "%100 el emeği",

  // Language
  language: "Dil",
};

const en: Dict = {
  brand: "Mudita Decor",
  brandTagline: "Handcrafted with love",
  navHome: "Home",
  navDesign: "Design",
  navGallery: "Gallery",
  navUpload: "Upload Image",
  navAbout: "About",
  navFaq: "FAQ",
  navContact: "Contact",
  navCart: "Cart",

  ctaDesign: "Design Your Neon Sign",
  ctaDesignNow: "Start Designing",
  ctaFreeQuote: "Get a Free Quote",
  ctaUploadLogo: "Upload Logo, Get Quote",
  ctaWhatsapp: "Send via WhatsApp",
  ctaAddToCart: "Add to Cart",
  ctaShareDesign: "Share Design",
  ctaSimilar: "Design Similar",

  trustApproval: "We send you a design proof before production starts.",
  trustIndoorOutdoor: "Indoor and outdoor options available.",
  trustShipping: "Safe shipping across Türkiye.",
  trustCustom: "Fully custom: size, color, and backboard tailored to you.",

  enterText: "Enter Your Text",
  fontType: "Font",
  pickColor: "Pick a Color",
  size: "Size",
  backboard: "Backboard",
  mounting: "Mounting Options",
  accessories: "Accessories",
  notes: "Special Notes",
  estimatedPrice: "Estimated Price",
  productionTime: "Production Time",
  shipping: "Shipping",
  total: "Total",
  outdoor: "Outdoor (IP-rated)",
  indoor: "Indoor",
  dimmer: "Remote Dimmer",
  urgent: "Rush Production",
  adapter: "Power Adapter",

  designerTitle: "Design Your Neon Sign",
  designerSubtitle: "Type your text, pick a style, price updates instantly.",
  tabText: "Text",
  tabStyle: "Style",
  tabSize: "Size",
  tabScene: "Scene",
  tabExtras: "Extras",
  emptyHint: "Type your text in the box below to start designing.",
  textPlaceholder: "Mudita",
  textCharsHint: "characters · Enter for a new line",
  width: "Width",
  height: "Height",
  outdoorIP65: "Outdoor (IP65)",
  outdoorIP65Desc: "Waterproof build, +25%",
  on: "On",
  off: "Off",
  selected: "Selected",
  urgentLabel: "Rush Production (3-5 days)",
  adapterTR: "TR Plug",
  adapterEU: "EU Plug (+₺120)",
  notesPlaceholder: "Your special requests...",
  dimmerDesc: "Adjust brightness and flicker mode with a remote.",
  dimmerSimNote: "✨ Dimmer simulation: these settings can be replicated in real life with the remote.",
  flickerDesc: "Subtle neon flicker effect",
  realSizeLabel: "real size",
  outdoorBadge: "Outdoor · IP65",
  emptyPreviewHint: "Type your text on the right — see the preview come alive ✨",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  lightOnAria: "Turn light on",
  lightOffAria: "Turn light off",

  previewBackground: "Preview Background",
  brightness: "Brightness",
  flicker: "Flicker Effect",
  zoom: "Zoom",
  realSizePreview: "Real Size Feel",
  lightOn: "Neon Light",
  rotate: "Rotate",
  reset: "Reset",
  center: "Center",
  resetView: "Reset View",
  dragTip: "Drag the sign to position it on the wall.",
  lightTip: "Toggle the light to see day / night effect.",
  rotateTip: "Rotation and zoom only affect the preview, not the price.",

  livePreviewTip: "See your design live",
  tryBgTip: "Try the neon effect on different backgrounds",
  fontMoodTip: "Pick a font, change the mood of the light",
  approvalTip: "Design proof before production",
  logoSuitableTip: "This font is well-suited for logos and brand signs",
  shippingTip: "Safe shipping across Türkiye",
  productAddedToCart: "Added to cart",

  badgePopular: "Popular",
  badgePremium: "Premium",
  badgeLogo: "Great for Logos",

  warningSmall: "Text may be too small to produce well. We recommend a larger size.",
  warningOutdoorScript: "Thin / script fonts can be fragile outdoors. Consider a thicker font.",
  warningLongText: "Text is long — consider increasing the size for readability.",
  warningComplexFont: "This font is complex; production may take a bit longer.",
  warningEmptyText: "Type your text in the box above to start designing.",

  heroBadge: "Handmade · from Türkiye",
  heroTitleA: "Design your",
  heroTitleHighlight: "dream neon sign",
  heroTitleB: "yourself.",
  heroSubtitle: "Type your text, pick a font and color, set the size — instant live preview and pricing. We always get your design approval before production.",
  heroTrustApproval: "Design approval",
  heroTrustShipping: "Türkiye-wide shipping",
  heroTrustHandmade: "100% handmade",

  language: "Language",
};

export const dict = { tr, en };
export type Locale = keyof typeof dict;
export type TKey = keyof typeof tr;

const listeners = new Set<() => void>();

function readInitial(): Locale {
  if (typeof window === "undefined") return "tr";
  try {
    const stored = window.localStorage.getItem("locale");
    if (stored === "tr" || stored === "en") return stored;
  } catch {}
  return "tr";
}

let current: Locale = readInitial();

export function getLocale(): Locale {
  return current;
}

export function setLocale(l: Locale) {
  if (l === current) return;
  current = l;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("locale", l);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }
  listeners.forEach((fn) => fn());
}

export function t(key: TKey): string {
  return dict[current][key] ?? dict.tr[key] ?? key;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useLocale(): Locale {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "tr" as Locale,
  );
}

export function useT() {
  useLocale();
  return t;
}
