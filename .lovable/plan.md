# Mudita Dekorasyon — Neon Tabela Konfigüratörü

Mudita Dekorasyon markası altında, Türkiye pazarına yönelik LED neon tabela tasarım ve sipariş sitesi. Custom Neon tarzı bir konfigüratör + canlı neon önizleme + dinamik TRY fiyatlandırma + teklif/sepet akışı. Ödeme entegrasyonu sonraki aşamada.

## Marka

- İsim: Mudita Dekorasyon — "Vazolar'dan Dekorasyona Üretim"
- Hikaye: 2021'de iki kız kardeşin evlerinde başlattığı, el emeği, tescilli, dünya çapında gönderim yapan bir marka. Samimi, sıcak, modern.
- Logo: yüklenen `user-uploads://logo-117x50.png` → `src/assets/logo.png` olarak projeye alınır, header + footer + OG görsellerinde kullanılır.
- Ton: sıcak, samimi, modern e-ticaret. "Biz" dili. Hakkımızda metni `/hakkimizda` sayfasında kullanıcının verdiği metinle birebir.
- Renk paleti: temiz beyaz/açık gri UI panelleri + koyu önizleme alanı; neon vurgu olarak elektrik pembesi/cyan gradient (CTA'larda). Logodaki sıcak ton (terracotta) ikincil aksan olarak kullanılır.

## Sayfalar (TanStack Start route'ları)

- `/` — Ana sayfa: hero ("Neon Tabelanı Tasarla"), öne çıkan örnekler, marka hikayesi özeti, galeri teaser, SSS önizleme
- `/tasarla` — Konfigüratör (tasarımcı + canlı önizleme + sticky özet)
- `/galeri` — İlham galerisi (mock görseller, stil filtresi)
- `/yukle` — Logo/görsel yükleyerek özel teklif isteme
- `/hakkimizda` — Mudita Dekorasyon hikayesi (verilen metin)
- `/sss` — SSS akordiyon
- `/iletisim` — İletişim / teklif formu
- `/sepet` — Sepet (placeholder, localStorage)
- `/odeme` — Ödeme placeholder (iyzico, PayTR, Param, Stripe, EFT, WhatsApp seçenekleri devre dışı listelenir)
- Ortak header/footer `__root.tsx` içinde, logo + TR navigasyon

## Konfigüratör UX (`/tasarla`)

Masaüstünde iki sütun, mobilde yığılmış:

```text
┌─────────────────────────┬──────────────────┐
│  Koyu Önizleme Canvas   │  Adım Panelleri  │
│  (neon glow, bg toggle) │  1 Yazı          │
│  cm boyut etiketi       │  2 Yazı Tipi     │
│  uyarılar               │  3 Renk          │
│                         │  4 Ölçü          │
│                         │  5 Arka Panel    │
├─────────────────────────┤  6 Montaj        │
│  Sticky Fiyat Özeti     │  7 Aksesuar      │
│  Sepete Ekle / Teklif   │  8 Notlar        │
│  WhatsApp ile Gönder    │                  │
└─────────────────────────┴──────────────────┘
```

shadcn Tabs + Card; mobilde akordiyon + altta sabit fiyat barı.

## Canlı Önizleme

- CSS tabanlı neon: katmanlı `text-shadow` + `drop-shadow`, hafif flicker animasyonu
- Çok satırlı destek (textarea)
- Arka plan toggle: tuğla duvar, karanlık oda, düz duvar, şeffaf (dama)
- Google Fonts: script=Pacifico, handwritten=Caveat, bold=Bungee, modern=Montserrat, block=Russo One, retro=Monoton
- cm boyut rozeti karakter sayısı + font + preset'ten hesaplanır
- Uyarılar: harf yüksekliği < 4cm → "Yazı çok küçük, üretim zor olabilir"; outdoor + ince script → ek uyarı

## Fiyatlandırma Motoru (`src/lib/pricing.ts`)

Saf fonksiyon `calculatePrice(config): PriceBreakdown` → TRY cinsinden taban + kalemler:

- Taban: en × yükseklik faktörü
- Font karmaşıklığı: script 1.25, handwritten 1.2, bold 1.1, diğer 1.0
- 1. satır sonrası ek satır ücreti
- Renk: standart sabit, RGB/multicolor +%35
- Outdoor / IP-rated +%25
- Arka panel: cut-to-letter ve mirror gold/silver premium, dikdörtgen taban
- Aksesuar: duvar kiti, asma kiti, stand, dimmer, TR/EU adaptör (sabit ek)
- Acil üretim +%20
- TR kargo tahmini (sabit bölge ücreti)
- Özet panel için kalem listesi döner

## Veri Modelleri (`src/lib/types.ts` + `src/data/*.ts`)

TS interface + seed array (sonra Supabase tablolarına geçecek):

- `Font`, `Color`, `BackboardOption`, `SizePreset`, `Accessory`, `MountingOption`
- `PricingRule` sabitleri
- `NeonDesignConfig` (paylaşım URL'sine kodlanan JSON)
- `Order`, `QuoteRequest`, `UploadedFile` (sadece şekil)

## State & Paylaşım

- `useReducer` + `DesignerProvider` context
- Config base64 JSON `?d=` search param'da, Zod + `fallback` ile validasyon
- "Tasarımı Paylaş" butonu URL kopyalar; URL açıldığında konfigüratör hidrasyon
- Sepet için localStorage

## Yeniden Kullanılabilir Bileşenler (`src/components/configurator/`)

`NeonPreview`, `TextControls`, `FontSelector`, `ColorSelector`, `SizeSelector`, `BackboardSelector`, `MountingSelector`, `AccessorySelector`, `PriceSummary`, `QuoteForm`, `UploadArtworkForm`, `WarningBanner`, `BackgroundToggle`.

## Lokalizasyon

- `src/lib/i18n.ts` — `tr` (varsayılan, dolu) + `en` (boş, sonra doldurulacak)
- Tüm UI metinleri `t(key)` ile çekilir, bileşenlerde sabit TR string yok
- Verilen TR etiketler aynen: Neon Tabelanı Tasarla, Yazını Gir, Yazı Tipi, Renk Seç, Ölçü, Arka Panel, Montaj Seçenekleri, Tahmini Fiyat, Teklif Al, Sepete Ekle, WhatsApp ile Gönder

## CTA Akışları

- **Sepete Ekle** → localStorage sepete ekler, toast, `/sepet`
- **Teklif Al** → `QuoteForm` dialog (ad, e-posta, telefon, notlar) — Zod validasyon, mock submit + toast
- **WhatsApp ile Gönder** → wa.me linki, encoded özet metni + paylaşım URL'i

## Tasarım Sistemi

- Açık UI panelleri + koyu önizleme alanı
- CTA: elektrik pembesi → cyan gradient (neon hissi)
- İkincil aksan: logodan terracotta tonu
- UI fontu Inter; neon fontlar yalnızca önizlemede
- shadcn/ui: Card, Tabs, Slider, Select, RadioGroup, Dialog, Sheet, Sonner
- Mobil öncelikli, smooth CSS geçişleri (ek dependency yok)

## Gelecek Entegrasyon Stub'ları

`src/lib/integrations/` altında tipli boş istemciler: `iyzico.ts`, `paytr.ts`, `param.ts`, `stripe.ts`, `whatsapp.ts`, `email.ts`, `supabase.ts` — her biri `// TODO` ile gerçek API imzasına yakın fonksiyonlar export eder. Ödeme sayfası bunları seçili-ama-disabled olarak listeler.

## Bu İterasyon Dışında

- Gerçek ödeme işleme
- Gerçek dosya yükleme depolaması (form dosya kabul eder, ad gösterir, backend yazımı yok)
- Supabase bağlantısı (tipler hazır, client yok)
- Admin paneli UI

## Teknik Notlar

- TanStack Start `src/routes/` altında file-based route
- Her route kendi `head()` ile TR title/description/OG (logo OG image)
- Pricing logic saf, React import'suz, kolayca test edilebilir
- Form'lar `react-hook-form` + `zod`
- Tailwind v4 mobile-first; önizleme `aspect-video` + iç ölçeklendirme
- Logo `src/assets/logo.png` olarak kopyalanır, ES6 import ile kullanılır
