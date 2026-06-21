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

  // Preview / Backgrounds
  previewBackground: "Önizleme Arka Planı",
  brightness: "Parlaklık",
  flicker: "Titreme Efekti",
  zoom: "Yakınlaştır",
  realSizePreview: "Gerçek Boyut Önizlemesi",

  // Helper copy
  livePreviewTip: "Tasarımını canlı olarak gör",
  tryBgTip: "Neon etkisini arka planda dene",
  fontMoodTip: "Yazı tipini seç, ışığın havasını değiştir",
  approvalTip: "Üretim öncesi tasarım onayı alırsın",
  logoSuitableTip: "Bu yazı tipi logo ve marka tabelaları için uygundur",

  // Font badges
  badgePopular: "Popüler",
  badgePremium: "Premium",
  badgeLogo: "Logo İçin Uygun",

  // Warnings
  warningSmall: "Yazı çok küçük, üretim zor olabilir. Daha büyük ölçü öneririz.",
  warningOutdoorScript: "İnce/script yazı tipi dış mekanda dayanıksız olabilir.",
  warningLongText: "Yazı uzun — okunaklık için ölçüyü büyütmeyi düşünebilirsin.",
  warningComplexFont: "Bu yazı tipi karmaşık; üretim süresi ve maliyeti artabilir.",
  warningEmptyText: "Tasarımına başlamak için yukarıdaki kutuya yazını gir.",
};

const en: Dict = {};

export const dict = { tr, en };
export type Locale = keyof typeof dict;

let current: Locale = "tr";
export function setLocale(l: Locale) {
  current = l;
}
export function t(key: keyof typeof tr): string {
  return dict[current][key] ?? tr[key] ?? key;
}
