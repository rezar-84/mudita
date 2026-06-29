# /tasarla Pro Editor Upgrade

Frontend-only enlargement of the existing designer. No backend, no payments, no AI API calls. Pricing stays pure. Old shared URLs keep working via defaulted fields. All visible copy stays Turkish.

## What you'll see

1. **Bigger canvas** — preview takes 65% / controls 35% on desktop. On mobile, preview is dominant and controls collapse into an accordion + sticky bottom CTA.
2. **Tam Ekran Tasarla** — a true fullscreen mode (in-page, no navigation), large canvas, compact right drawer, sticky price bar, ESC to exit, body scroll locked while open.
3. **Floating toolbar** over the preview: Işık aç/kapat, Tam ekran, Ölçüler, Ortala, Sıfırla, Arka Plan, Mockup Al (placeholder toast).
4. **Measurement overlays** — width/height lines with "80 cm / 40 cm" labels, backboard bounds box, safe-area guide. Each togglable; toggles persist in share URL.
5. **Drag / rotate / zoom** — already partly working; polish bounds, add slider rotate (-15°…+15°) and zoom (0.6×…1.8×).
6. **Neon on/off + brightness + flicker** — already present; cleaner UI grouping in "Önizleme Ayarları" accordion.
7. **Richer backgrounds** — add Tuğla, Beton, Salon, Kafe, Mağaza, Ahşap, Mermer, Şeffaf, Dama (CSS gradients/patterns, no heavy images), shown as a `BackgroundCarousel` with thumbnails.
8. **Better font selector** — `FontCarousel` cards with live sample, category filter (El Yazısı / Modern / Kalın / Retro / Elegant / Minimal / Eğlenceli / Logo), badges (Popüler / Premium / Logo İçin Uygun), simple search. Add new fonts (Caveat, Bungee, Russo One, Monoton, Lobster, Great Vibes, Dancing Script, Playfair, Poppins, Bebas Neue, Quicksand, Righteous, Satisfy, Sacramento, Comfortaa, Abril Fatface, Cinzel, Permanent Marker) via Google Fonts `<link>` in `__root.tsx`.
9. **Carousels** — `InspirationCarousel`, `UseCaseCarousel`, `IncludedItemsCarousel`, `TrustBadgeStrip` reusable widgets (used on designer page and homepage where it fits).
10. **AI ile Fikir Üret** panel — input + select fields + "Fikir Öner" button. Returns 4 hard-coded sample suggestions. TODO comments for future OpenAI/image-gen integration. No network calls.

## Technical changes

**Types** — extend `NeonDesignConfig` with optional defaulted fields: `showMeasurements`, `showBackboardBounds`, `showSafeArea`, `flickerEnabled` (alias of existing `flicker`, keep both for back-compat), plus already-present `isLightOn / brightness / background / positionX / positionY / rotationDeg / zoom`. `DesignerContext.defaultConfig` gets the new defaults; reducer + `decodeConfig` merge with defaults so old URLs keep loading. `share.ts` already strips `customBackground`; no change needed.

**Pricing** — `src/lib/pricing.ts` stays pure. New font entries get complexity in font constants only.

**New / refactored components** under `src/components/configurator/`:
- `InteractivePreviewCanvas.tsx` — extracted core preview (current `NeonPreview` body) so it can render in both normal and fullscreen modes.
- `PreviewToolbar.tsx` — the floating action bar (was inline in `NeonPreview`).
- `MeasurementOverlay.tsx` — width/height/backboard/safe-area SVG overlay.
- `BackgroundCarousel.tsx` — thumbnail grid with horizontal scroll on mobile.
- `FontCarousel.tsx` — replaces/wraps existing `FontSelector` with category chips + search + live preview cards.
- `FullscreenDesigner.tsx` — fixed-inset overlay using a portal, ESC handler, `document.body.style.overflow = 'hidden'` while open.
- `AiIdeaPanel.tsx` — local mock; no fetch.
- `widgets/{InspirationCarousel,UseCaseCarousel,IncludedItemsCarousel,TrustBadgeStrip}.tsx`.

`NeonPreview.tsx` becomes a thin wrapper: `<InteractivePreviewCanvas />` + `<PreviewToolbar />` + `<MeasurementOverlay />`.

`tasarla.tsx` grid stays `minmax(0,1.7fr)_minmax(320px,1fr)` (already ~63/37). Right column gets an Accordion with: Yazı & Font, Renk & Ölçü, Montaj & Donanım, Önizleme Ayarları, AI ile Fikir Üret. Below the main grid: `IncludedItemsCarousel`, `UseCaseCarousel`, `TrustBadgeStrip`.

**Backgrounds** — extend `src/data/options.ts` `BACKGROUNDS` with new entries; each gets a `thumb` Tailwind class using gradients (`bg-[linear-gradient(...)]`, `bg-[radial-gradient(...)]`, repeating patterns for tuğla/dama). Light vs dark flag drives wall reflection logic already in preview.

**Fonts** — add families to `src/data/options.ts` with `category` and optional `badges`. Add a single Google Fonts `<link>` in `src/routes/__root.tsx` head pulling all families with `display=swap`.

**Share/URL compat** — `decodeConfig` already returns partial; `replace` action in reducer already does `{ ...defaultConfig, ...cfg }`. New fields are optional → safe.

**i18n** — add new TR keys (`fullscreen`, `exitFullscreen`, `showMeasurements`, `showBackboardBounds`, `showSafeArea`, `backgroundShortcut`, `takeMockup`, `mockupToast`, `aiIdeaTitle`, `aiIdeaPrompt`, `aiSuggest`, sample suggestion strings, category names, etc.) to both `tr` and `en` dictionaries in `src/lib/i18n.ts`.

**Mockup Al** — calls `toast.info(t("mockupToast"))`. No html2canvas dependency added.

**Quality gates** — `bun run build` clean, manual sanity on:
- Old share URL loads with defaults filled
- Cart add still works (config shape unchanged at required fields)
- Quote dialog + WhatsApp summary unaffected
- `routeTree.gen.ts` untouched
- Pricing tests (if any) still pass; `pricing.ts` not modified beyond font constants

## Out of scope

- Real AI calls, image export (html2canvas/satori), payments, auth, DB
- Translating non-designer pages beyond what already ships
- Persisting locale or design to URL beyond current `?d=` base64

## Files touched (estimate)

`src/lib/types.ts`, `src/lib/i18n.ts`, `src/data/options.ts`, `src/components/configurator/DesignerContext.tsx`, `src/components/configurator/NeonPreview.tsx`, `src/components/configurator/ConfiguratorPanel.tsx`, `src/components/configurator/FontSelector.tsx`, `src/components/configurator/PreviewControls.tsx`, `src/routes/tasarla.tsx`, `src/routes/__root.tsx`, plus the new files listed above (~10).

Approve to start with types + data + extracted preview core, then layer toolbar, measurements, fullscreen, carousels, and the AI panel.
