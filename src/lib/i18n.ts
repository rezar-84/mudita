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

  // Gallery
  galleryTitle: "İlham Galerisi",
  gallerySubtitle: "Daha önce ürettiğimiz tasarıtiplerden ilham al. Beğendiğin tarzın benzerini birkaç tıkla kendi yazınla tasarla.",
  categoryAll: "Tümü",
  categoryHome: "Ev",
  categoryOffice: "Ofis",
  categoryCafe: "Kafe",
  categoryWedding: "Düğün",
  categoryBaby: "Bebek Odası",
  categoryLogo: "Logo",
  categoryShop: "Mağaza",

  // Contact
  contactTitle: "İletişim",
  contactSubtitle: "Her türlü soru, özel sipariş ve teklif için bize ulaşın.",
  contactWhatsApp: "WhatsApp",
  contactWhatsAppDesc: "Hızlı destek için tıklayın",
  contactEmail: "E-posta",
  contactPhone: "Telefon",
  contactPhoneHours: "Hafta içi 09:00 - 18:00",
  contactNameLabel: "Ad Soyad",
  contactPhoneLabel: "Telefon",
  contactEmailLabel: "E-posta",
  contactMessageLabel: "Mesajınız",
  contactSendBtn: "Mesaj Gönder",
  contactSuccessToast: "Mesajınız iletildi. En kısa sürede dönüş yapacağız.",

  // Cart
  cartTitle: "Sepetim",
  cartEmptyTitle: "Sepetiniz boş",
  cartEmptySubtitle: "Hadi ilk neon tabelanızı tasarlayın.",
  cartStartDesigning: "Tasarlamaya Başla",
  cartTextless: "Yazısız",
  cartRemoveBtn: "Kaldır",
  cartOrderSummary: "Sipariş Özeti",
  cartSubtotal: "Ara toplam",
  cartTotal: "Toplam",
  cartCheckoutBtn: "Ödemeye Geç",
  cartClearBtn: "Sepeti boşalt",

  // FAQ
  faqTitle: "Sıkça Sorulan Sorular",
  faqSubtitleA: "Aklınıza takılan sorular için hızlı cevaplar. Cevabını bulamadığınız bir konu varsa",
  faqSubtitleLink: "bize yazın",
  faqStillUnsureTitle: "Hâlâ kararsız mısın?",
  faqStillUnsureSub: "Tasarımını birlikte oluşturalım. Birkaç dakikada ücretsiz teklif alabilirsin.",
  faqQ1: "Fiyat nasıl belirleniyor?",
  faqA1: "Fiyat; yazı uzunluğu, ölçü, yazı tipi karmaşıklığı, renk, arka panel ve montaj seçeneklerine göre belirlenir. /tasarla sayfasındaki konfigüratörden anında tahmini fiyatı görebilirsiniz.",
  faqQ2: "Üretim ne kadar sürer?",
  faqA2: "Standart üretim süresi 7-10 iş günüdür. Acil üretim seçeneği ile 3-5 iş günü içinde gönderim yapabiliyoruz. Üretim, tasarım onayınız alındıktan sonra başlar.",
  faqQ3: "Dış mekanda kullanabilir miyim?",
  faqA3: "Evet. IP65 dış mekan seçeneğini aktifleştirerek su ve toz korumalı üretim yapıyoruz. Çok ince/script fontlar dış mekan için önerilmez; kalın fontlar daha dayanıklıdır.",
  faqQ4: "Kurulum nasıl yapılıyor?",
  faqA4: "Duvar montaj kiti, asma kiti veya stand seçeneklerinden birini seçebilirsiniz. Tabelalar fişe takılır takılmaz çalışır; özel elektrik tesisatına gerek yoktur.",
  faqQ5: "Garanti veriyor musunuz?",
  faqA5: "Tüm ürünlerimiz 2 yıl üretim hatalarına karşı garantilidir. Kullandığımız LED neon şeritlerin ömrü 50.000 saatin üzerindedir.",
  faqQ6: "Kargo nereye gönderilir?",
  faqA6: "Türkiye geneli 81 ile özel köpük ambalajla gönderim yapıyoruz. Yurt dışı için lütfen iletişime geçin.",
  faqQ7: "Tasarım onayı nasıl işliyor?",
  faqA7: "Sipariş veya teklif sonrası, üretime başlamadan önce dijital ön görseli WhatsApp veya e-posta ile size gönderiyoruz. Renk, ölçü veya font değişiklikleri olursa birlikte revize ediyoruz. Onayınız olmadan üretime başlamıyoruz.",
  faqQ8: "Logo veya özel tasarım yaptırabilir miyim?",
  faqA8: "Tabii! 'Logonu Yükle' sayfasından logo, çizim, referans fotoğraf veya marka tasarımınızı paylaşın, size özel teklif hazırlayalım.",
  faqQ9: "Hangi adaptör ile geliyor?",
  faqA9: "Türkiye tipi (220V) adaptör standart olarak gönderilir. AB tipi adaptör opsiyoneldir.",
  faqQ10: "Renkler farklı görünüyor mu?",
  faqA10: "Ekran ile gerçek neon ışığı arasında küçük farklar olabilir; canlı önizleme mümkün olduğunca yakındır. Tasarım onayında gerçek renk tonunu da paylaşıyoruz.",
  faqQ11: "İade ve değişim mümkün mü?",
  faqA11: "Tüm ürünler kişiye özel üretildiği için iade kapsamı dışındadır. Üretim hatası, kargo hasarı veya onayladığınız tasarımdan farklı bir ürün gelmesi durumunda ücretsiz değişim sağlıyoruz.",

  // About
  aboutTitle: "Mudita Dekorasyon Kimdir?",
  aboutP1: "Merhaba! Biz iki kız kardeş olarak 2021 yılında evimizin bir köşesinde başladık bu yolculuğa. Amacımız basitti: el emeğimizi, tasarım sevgimizi ve kalbimizi koyduğumuz ürünlerle hem evimize ek gelir sağlamak hem de insanların yaşam alanlarına küçük mutluluklar katmak.",
  aboutP2: "Tamamen el yapımı ürünlerden oluşan koleksiyonumuz, zamanla sadece yakın çevremizin değil, dünyanın dört bir yanındaki dekorasyon severlerin ilgisini çekti. Derken ne oldu? Bir sabah baktık ki küçük işletmemiz büyümüş, tescilli bir markaya dönüşmüşüz ve artık dünya çapında gönderim yapan kocaman bir aileyiz.",
  aboutP3: "Müşteri memnuniyetini her şeyin önünde tuttuk, çünkü bizce bir ürünü güzel yapan sadece görüntüsü değil, arkasındaki samimiyet ve hizmettir. Her koleksiyonumuzda günün trendlerini takip ederek, modern ve özgün tasarımlar sunmaya çalışıyoruz. Ev dekorasyonunda modaya ayak uydururken, kendi tarzımızı da unutmadan!",
  aboutP4: "Her paketimizin içinde biraz sevgi, biraz emek, bolca da biz varız. Bu yüzden ürünlerimiz sadece bir dekorasyon objesi değil, aynı zamanda size bizden gelen küçük bir selam",

  // Upload
  uploadTitle: "Logonu Yükle, Teklif Al",
  uploadSubtitle: "Logo, el çizimi, referans fotoğraf veya marka tasarımı — ne paylaşırsan paylaş, sana özel LED neon tabela teklifi hazırlayalım. Üretime başlamadan önce dijital tasarım onayını alıyoruz.",
  uploadBadgeLogo: "Logo veya çizim",
  uploadBadgePhoto: "Referans fotoğraf",
  uploadBadgeBrand: "Marka tasarımı",
  uploadFileLabel: "Görsel / Logo",
  uploadFileCta: "Tıkla ve yükle",
  uploadFileHint: "Kabul edilen formatlar: PNG, JPG, PDF, SVG · max 10MB",
  uploadFieldName: "Ad Soyad",
  uploadFieldPhone: "Telefon",
  uploadFieldEmail: "E-posta",
  uploadFieldSize: "Yaklaşık ölçü",
  uploadFieldSizePh: "örn. 80 cm",
  uploadFieldUsage: "Kullanım yeri",
  uploadFieldUsagePh: "ev / kafe / vitrin",
  uploadFieldDeadline: "Termin",
  uploadFieldDeadlinePh: "örn. 2 hafta içinde",
  uploadFieldNotes: "Notlar (renk tercihi, arka panel, montaj vs.)",
  uploadSubmit: "Ücretsiz Teklif Al",
  uploadApprovalNote: "Üretime başlamadan önce dijital tasarım onayınızı alıyoruz. Görseliniz yalnızca teklif amacıyla kullanılır.",
  uploadErrName: "Adınızı girin",
  uploadErrEmail: "Geçerli bir e-posta girin",
  uploadErrPhone: "Telefon numaranızı girin",
  uploadErrFile: "Lütfen bir görsel/logo dosyası ekleyin",
  uploadErrSize: "Dosya 10MB'dan büyük olamaz",
  uploadSuccess: "Talebiniz alındı! Görselinizi inceleyip 1 iş günü içinde dönüş yapacağız.",

  // Checkout
  checkoutTitle: "Ödeme",
  checkoutSubtitle: "Online ödeme entegrasyonu yakında aktif olacak. Şimdilik WhatsApp ile manuel sipariş verebilir veya teklif talep edebilirsiniz.",
  checkoutSoon: "Yakında",
  checkoutOpen: "Aç",
  checkoutFooter: "Online ödeme aktif olana kadar siparişinizi",
  checkoutFooterLink: "iletişim formu",
  checkoutFooterOr: "veya WhatsApp üzerinden tamamlayabilirsiniz.",
  payIyzicoDesc: "Kredi/banka kartı (yakında)",
  payPaytrDesc: "Tüm kart tipleri (yakında)",
  payParamDesc: "Türk bankaları (yakında)",
  payStripeDesc: "Uluslararası (yakında)",
  payBankName: "Banka Havalesi / EFT",
  payBankDesc: "Manuel onay ile sipariş",
  payWhatsappName: "WhatsApp ile Sipariş",
  payWhatsappDesc: "Hemen mesaj gönderin, manuel sipariş alalım",
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

  // Gallery
  galleryTitle: "Inspiration Gallery",
  gallerySubtitle: "Get inspired by designs we've produced before. Customize similar designs with your own text in just a few clicks.",
  categoryAll: "All",
  categoryHome: "Home",
  categoryOffice: "Office",
  categoryCafe: "Cafe",
  categoryWedding: "Wedding",
  categoryBaby: "Baby Room",
  categoryLogo: "Logo",
  categoryShop: "Shop",

  // Contact
  contactTitle: "Contact",
  contactSubtitle: "Contact us for any questions, special orders, and quotes.",
  contactWhatsApp: "WhatsApp",
  contactWhatsAppDesc: "Click for quick support",
  contactEmail: "E-mail",
  contactPhone: "Phone",
  contactPhoneHours: "Weekdays 09:00 - 18:00",
  contactNameLabel: "Full Name",
  contactPhoneLabel: "Phone Number",
  contactEmailLabel: "E-mail",
  contactMessageLabel: "Your Message",
  contactSendBtn: "Send Message",
  contactSuccessToast: "Your message has been sent. We will get back to you as soon as possible.",

  // Cart
  cartTitle: "My Cart",
  cartEmptyTitle: "Your cart is empty",
  cartEmptySubtitle: "Go ahead and design your first neon sign.",
  cartStartDesigning: "Start Designing",
  cartTextless: "No text",
  cartRemoveBtn: "Remove",
  cartOrderSummary: "Order Summary",
  cartSubtotal: "Subtotal",
  cartTotal: "Total",
  cartCheckoutBtn: "Proceed to Checkout",
  cartClearBtn: "Empty cart",
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
