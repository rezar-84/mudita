# Development Guide

## Prerequisites

- Node.js compatible with the installed Vite/TanStack toolchain.
- npm, using the committed `package-lock.json`.
- Optional: Bun is present in the repo through `bun.lockb`, but npm scripts are the documented path.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Routing

Routes are defined in `src/routes/` with TanStack Router file routes. The generated route tree is `src/routeTree.gen.ts`.

Primary routes:

- `/` home page.
- `/tasarla` neon sign designer.
- `/galeri` gallery.
- `/yukle` custom artwork quote request.
- `/sepet` local cart.
- `/odeme` checkout placeholder.
- `/sss` FAQ.
- `/hakkimizda` about page.
- `/iletisim` contact page.

## Styling

Global styling, Tailwind theme tokens, neon effects, and preview backgrounds are in `src/styles.css`.

Shared UI primitives live in `src/components/ui/`. Prefer reusing these components before adding new primitives.

## Product Options

Edit `src/data/options.ts` for:

- Fonts and font categories.
- Neon colors and glow colors.
- Size presets.
- Backboard types.
- Mounting types.
- Accessories.
- Preview background presets.

Decorative preset artwork lives in `src/data/decorations.ts`.

## Pricing Changes

Pricing is calculated in `src/lib/pricing.ts`.

The current model includes:

- Base area price in TRY per square centimeter.
- Font complexity multipliers.
- RGB, outdoor, rush production, adapter, mounting, backboard, text layer, and decoration additions.
- Flat shipping cost.
- Production day labels for standard and urgent orders.

When changing product rules, update both `src/lib/pricing.ts` and any customer-facing copy in `src/lib/i18n.ts` or FAQ content.

## Localization

Translations are stored in `src/lib/i18n.ts`. The app supports `tr` and `en`, and the selected locale is controlled by the site layout language selector.

When adding UI copy:

1. Add a stable key to both dictionaries.
2. Use `useT()` inside components.
3. Keep route metadata updated where relevant.

## State And Persistence

- Cart state is browser-only and stored in `localStorage` by `src/lib/cart.ts`.
- Design sharing is encoded into URL-safe base64 by `src/lib/share.ts`.
- Heavy custom backgrounds and large uploaded SVGs are stripped from share links.
- No real backend persistence is wired yet.

## User Uploads

The designer accepts SVG decoration uploads through `src/lib/svgSanitize.ts`.

The sanitizer is intentionally conservative:

- Allows only basic SVG drawing tags.
- Removes scripts, event handlers, external references, and raster image tags.
- Forces scalable inline SVG output.
- Caps output size.

The `/yukle` quote request form validates basic customer fields and file size client-side, then shows a success toast. It does not upload files to a backend yet.
