## Goals
1. Kill horizontal scroll on mobile across the site (designer is the main offender).
2. Keep the right-side controls in the designer readable when the preview grows (real-size mode + zoom).
3. Add a working TR/EN language selector in the header.
4. Tighten general designer UX (toolbar wrap, spacing, sticky behavior).

## 1. No horizontal scroll on mobile

Root causes found:
- `NeonPreview` real-size mode uses `width: min(width*cmPx, 1100px)` — on a 390px mobile this pushes the page wider than the viewport.
- Hero `conic-gradient` ray layer is `80rem` wide and only `overflow-hidden` on its section, but any nested `min-w` from preview can leak.
- Floating preview toolbar can overflow narrow widths.

Fixes:
- Add a global guard in `src/routes/__root.tsx` `<body>` / `<main>`: `overflow-x-hidden` and `max-w-[100vw]`.
- `NeonPreview` container: add `max-w-full` and clamp real-size style via `width: min(<computed>, 100%)`. Use `maxWidth: "100%"` on the inline style so cm-based width never exceeds the cell.
- Floating quick-action toolbar in preview: make it `flex-wrap`, shrink icon padding under `sm`, and switch label "Açık/Kapalı" → icon-only under `sm` (already i18n-driven after step 3).
- `tasarla.tsx` outer wrapper: add `overflow-x-clip` and use `min-w-0` on both grid columns.

## 2. Right-side controls when preview grows

- Change grid template from `lg:grid-cols-[1.7fr_1fr]` to `lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]` so the right column always reserves ≥320px and the preview cell can shrink.
- Cap preview height on desktop with `lg:max-h-[70vh]` and `object-fit`-style scaling: when `realSizeMode` is on, the preview keeps its sticky behavior but scrolls vertically inside the cell instead of pushing the layout.
- Drop `lg:sticky` while `realSizeMode` is on (it fights with tall content); switch to a normal block when real size, sticky otherwise.
- Right column wrapper: `min-w-0` + `w-full` so the configurator panel never overflows its cell when long font labels appear.

## 3. Language selector (TR / EN)

Current `src/lib/i18n.ts` is a module-level singleton with empty EN dict and no reactivity — switching it would not re-render.

Refactor to a small reactive store:

```ts
// src/lib/i18n.ts
import { useSyncExternalStore } from "react";

const dict = { tr: { /* existing */ }, en: { /* full EN translations */ } };
type Locale = keyof typeof dict;

const listeners = new Set<() => void>();
let current: Locale = (typeof localStorage !== "undefined"
  && (localStorage.getItem("locale") as Locale)) || "tr";

export function setLocale(l: Locale) {
  current = l;
  if (typeof localStorage !== "undefined") localStorage.setItem("locale", l);
  if (typeof document !== "undefined") document.documentElement.lang = l;
  listeners.forEach((fn) => fn());
}
export function getLocale() { return current; }
export function t(key: keyof typeof dict.tr) {
  return dict[current][key] ?? dict.tr[key] ?? key;
}
export function useLocale() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => current,
    () => "tr",
  );
}
export function useT() {
  useLocale(); // subscribe
  return t;
}
```

Then in `SiteHeader.tsx`:
- Add a compact `LanguageSelector` (TR / EN toggle pill or shadcn `Select`) before the Sepet button. Mobile shows it inside the burger menu too.
- Existing call sites that use `t(...)` directly inside components (designer, hero, etc.) get switched to `const t = useT()` so they re-render on locale change. Where `t()` is used inside non-component helpers (e.g. inline once at module load), leave as-is.

Translations to populate in EN dictionary: every key currently in TR (`navHome`, `ctaDesign`, `enterText`, `livePreviewTip`, all warnings, badges, preview labels, etc.). Hard-coded Turkish strings in JSX (e.g. "Yazını Gir", "Renk Seç", "Sahne", "Sepete Ekle", nav labels in `SiteLayout`, hero `<h1>`, FAQ section titles in `index.tsx`) get moved behind `t()` so EN works end-to-end. Scope kept to the **header, designer page, hero, and global nav/footer** in this pass to keep the diff manageable; sub-pages (galeri, sss, hakkimizda) stay Turkish-only this round and we note that follow-up is needed.

Default locale stays `tr`. `<html lang>` updates on switch.

## Files touched
- `src/lib/i18n.ts` — reactive store + EN dictionary + `useT`/`useLocale` hooks
- `src/components/SiteLayout.tsx` — language selector in header (desktop + mobile menu), nav labels via `t()`
- `src/components/configurator/{NeonPreview,ConfiguratorPanel,PreviewControls,FontSelector}.tsx` — switch from `t` import to `useT()` hook
- `src/routes/tasarla.tsx` — grid template, min-w-0, overflow guard, useT
- `src/routes/index.tsx` — useT for hero/CTA/benefits/steps copy
- `src/routes/__root.tsx` — body/main `overflow-x-hidden`, set `<html lang>` from locale at mount

## Out of scope
- Translating /galeri, /sss, /hakkimizda, /iletisim, /yukle full bodies (will be a follow-up).
- Persisting locale to URL (e.g. /en/tasarla). Stays in `localStorage`.