# i18n Localization Audit & Solutions

This document highlights critical flaws in the current localization system of `neon-tasarim-dunyasi` and maps out standard resolutions.

---

## 🔍 Critical Flaws Identified

### 1. Incomplete Translation Coverage across Routes

While the main customizer and landing page use the `t()` translation function, multiple pages are completely hardcoded in Turkish:

- **[galeri.tsx](file:///home/rubuntu/Projects/neon-tasarim-dunyasi/src/routes/galeri.tsx)**:
  - Header: `"İlham Galerisi"`, `"Daha önce ürettiğimiz tasarımlardan ilham al..."`
  - Categories: `"Tümü"`, `"Ev"`, `"Ofis"`, `"Kafe"`, `"Düğün"`, `"Bebek Odası"`, `"Logo"`, `"Mağaza"`
  - Gallery items title & useCase: `"Düğün Arkası Aşk"`, `"Nikah masası arkası..."`
- **[iletisim.tsx](file:///home/rubuntu/Projects/neon-tasarim-dunyasi/src/routes/iletisim.tsx)**:
  - Titles & Labels: `"İletişim"`, `"Ad Soyad"`, `"Telefon"`, `"Mesajınız"`, `"Mesaj Gönder"`, `"Hızlı destek için tıklayın"`
  - Alert/Toast messages: `"Mesajınız iletildi. En kısa sürede dönüş yapacağız."`
- **[sepet.tsx](file:///home/rubuntu/Projects/neon-tasarim-dunyasi/src/routes/sepet.tsx)**:
  - Empty state: `"Sepetiniz boş"`, `"Hadi ilk neon tabelanızı tasarlayın."`
  - Labels: `"Kaldır"`, `"Sipariş Özeti"`, `"Ara toplam"`, `"Toplam"`, `"Ödemeye Geç"`, `"Sepeti boşalt"`, `"Yazısız"`
- **[odeme.tsx](file:///home/rubuntu/Projects/neon-tasarim-dunyasi/src/routes/odeme.tsx)**:
  - Form controls: `"Ödeme Bilgileri"`, `"Kargo Adresi"`, `"Kart Bilgileri"` etc.

### 2. Pricing Hardcoding

- The project imports `formatTRY` from `src/lib/pricing.ts` which uses hardcoded `TRY` and Turkish Lira (`₺`) notation. For English users, showing prices in Lira without internationalization option reduces trust.

### 3. Lack of Fallback Key Sync in `i18n.ts`

- The `Dict` structure in `src/lib/i18n.ts` does not enforce strict key alignment at build time, leading to potential missing keys in `en` dictionary falling back to raw keys or Turkish strings.

---

## 🛠️ The Solution

### Phase 1: Enrich `src/lib/i18n.ts` with Missing Keys

We must add key translations for all pages. Let's document the missing key structure:

```typescript
// Add these to i18n dictionaries
tr: {
  // Gallery
  galleryTitle: "İlham Galerisi",
  gallerySubtitle: "Daha önce ürettiğimiz tasarımlardan ilham al. Beğendiğin tarzın benzerini birkaç tıkla kendi yazınla tasarla.",
  categoryAll: "Tümü",
  categoryHome: "Ev",
  categoryOffice: "Ofis",
  categoryCafe: "Kafe",
  categoryWedding: "Düğün",
  categoryBaby: "Bebek Odası",
  categoryLogo: "Logo",
  categoryShop: "Mağaza",

  // Cart
  cartTitle: "Sepetim",
  cartEmpty: "Sepetiniz boş",
  cartEmptySub: "Hadi ilk neon tabelanızı tasarlayın.",
  cartRemove: "Kaldır",
  cartSummary: "Sipariş Özeti",
  cartSubtotal: "Ara toplam",
  cartClear: "Sepeti boşalt",
  cartCheckout: "Ödemeye Geç",
  cartTextless: "Yazısız",

  // Contact
  contactTitle: "İletişim",
  contactSubtitle: "Her türlü soru, özel sipariş ve teklif için bize ulaşın.",
  contactName: "Ad Soyad",
  contactPhone: "Telefon",
  contactMessage: "Mesajınız",
  contactSend: "Mesaj Gönder",
  contactSuccess: "Mesajınız iletildi. En kısa sürede dönüş yapacağız."
}
```

### Phase 2: Dynamic Pricing Localization

Refactor `src/lib/pricing.ts` to output localized symbols based on the active language (`tr` vs `en`):

- `tr` -> `₺4.950`
- `en` -> `$150` or `150 USD` (or use currency converting ratios).

### Phase 3: Build-time Type Verification

Update `src/lib/i18n.ts` to define types that ensure both dictionaries contain the exact same keys:

```typescript
type TranslationDict = typeof tr;
const en: TranslationDict = { ... }; // TypeScript will enforce that all keys exist
```
