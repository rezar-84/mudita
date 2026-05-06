type Dict = Record<string, string>;

const tr: Dict = {
  brand: "Mudita Dekorasyon",
  brandTagline: "Vazolar'dan Dekorasyona Üretim",
  navHome: "Ana Sayfa",
  navDesign: "Tasarla",
  navGallery: "Galeri",
  navUpload: "Görsel Yükle",
  navAbout: "Hakkımızda",
  navFaq: "S.S.S.",
  navContact: "İletişim",
  navCart: "Sepet",
  ctaDesign: "Neon Tabelanı Tasarla",
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
  addToCart: "Sepete Ekle",
  getQuote: "Teklif Al",
  sendWhatsapp: "WhatsApp ile Gönder",
  shareDesign: "Tasarımı Paylaş",
  outdoor: "Dış Mekan (IP Korumalı)",
  indoor: "İç Mekan",
  dimmer: "Uzaktan Kumandalı Dimmer",
  urgent: "Acil Üretim",
  adapter: "Güç Adaptörü",
  background: "Arka Plan",
  bgBrick: "Tuğla Duvar",
  bgDark: "Karanlık Oda",
  bgWall: "Düz Duvar",
  bgTransparent: "Şeffaf",
  warningSmall: "Yazı çok küçük, üretim zor olabilir.",
  warningOutdoorScript: "İnce yazı tipi dış mekanda dayanıksız olabilir.",
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
