# MudiNeon Neon Designer

Custom LED neon sign storefront and design tool for MudiNeon. The app lets customers design a sign, preview it live, estimate the TRY price, save designs to a local cart, share designs by URL, and request a custom quote for uploaded artwork.

## Tech Stack

- React 19 with TypeScript
- TanStack Router / TanStack Start
- Vite via `@lovable.dev/vite-tanstack-config`
- Tailwind CSS 4 and shadcn/Radix UI components
- Cloudflare Workers deployment config through Wrangler
- Local browser storage for cart state

## Main Features

- Landing page for custom neon sign sales.
- `/tasarla` full neon designer with text layers, decoration layers, uploaded SVG support, drawing tools, measurement overlays, background previews, and live pricing.
- `/galeri` inspiration gallery.
- `/yukle` quote request flow for logo, image, PDF, or SVG uploads.
- `/sepet` local cart with edit links back into the designer.
- `/odeme` checkout placeholder with future payment provider options.
- `/sss`, `/hakkimizda`, and `/iletisim` content pages.
- Turkish and English UI text through `src/lib/i18n.ts`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview a production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

Format files:

```bash
npm run format
```

## Project Structure

```text
src/
  assets/                  Static app assets, including the logo
  components/
    configurator/          Customer-facing neon preview and option panels
    designer/              Advanced designer canvas, layer tools, and properties
    ui/                    Shared shadcn/Radix UI primitives
  data/                    Product option catalogs and decoration presets
  hooks/                   Shared React hooks
  lib/                     Pricing, cart, sharing, i18n, SVG sanitizing, integrations
  routes/                  File-based TanStack routes
  router.tsx               Router setup and default error UI
  styles.css               Tailwind theme, app styles, neon effects, backgrounds
```

## Documentation

- [Development Guide](docs/development.md)
- [Architecture Notes](docs/architecture.md)
- [Deployment Guide](docs/deployment.md)
- [Integration Notes](docs/integrations.md)

## Important Implementation Notes

- Product options live in `src/data/options.ts`.
- Pricing logic lives in `src/lib/pricing.ts`; update this when changing product rules or fees.
- Cart data is saved in `localStorage` under `mudita-cart-v1`.
- Share links use base64-encoded design config from `src/lib/share.ts`; large custom images and oversized uploaded SVG markup are intentionally stripped.
- Uploaded SVGs are sanitized in `src/lib/svgSanitize.ts` before inline rendering.
- Payment, email, WhatsApp API, and persistence providers are currently stubs in `src/lib/integrations/index.ts`.

## Deployment

The repo includes `wrangler.jsonc` for Cloudflare Workers with the TanStack Start server entry:

```jsonc
{
  "name": "tanstack-start-app",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry"
}
```

See [Deployment Guide](docs/deployment.md) before wiring production environment variables or real provider credentials.

