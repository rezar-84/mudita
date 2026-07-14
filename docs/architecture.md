# Architecture Notes

## Overview

This is a customer-facing storefront and configurator for custom LED neon signs. It is mostly client-driven today: product configuration, pricing, cart storage, sharing, and upload validation happen in the browser. Server/backend integrations are prepared as stubs but are not implemented.

## Application Shell

`src/routes/__root.tsx` defines the root document shell, global metadata, imported CSS, Google Fonts, header, footer, toast provider, and WhatsApp widget.

`src/router.tsx` creates the TanStack Router instance and provides a default error screen.

## Designer Domain Model

The main design type is `NeonDesignConfig` in `src/lib/types.ts`.

Important fields:

- `textLayers`: canonical text layers shown on the canvas.
- `decorations`: preset, uploaded, or drawn SVG-like decoration layers.
- `fontId`, `colorId`, `sizeId`, `backboard`, `mounting`, and accessories: product configuration used for pricing.
- `background` and `customBackground`: preview-only environment controls.
- `brightness`, `flicker`, `ledEffect`, `zoom`, and `isLightOn`: preview-only controls.
- Deprecated fields such as `text`, `positionX`, `positionY`, and `rotationDeg` remain for backward compatibility with older share URLs.

## Component Areas

`src/components/configurator/` contains customer-facing controls and preview components. It owns the main configurator experience: live preview, option panels, price summary, quote dialog, and measurement overlays.

`src/components/designer/` contains richer editing pieces for canvas interaction, selection handles, layer panels, tool rails, decoration picking, text layer editing, and drawing/pen tools.

`src/components/ui/` contains reusable UI primitives based on Radix/shadcn patterns.

## Data Flow

1. Route/component initializes a `NeonDesignConfig`.
2. Configurator/designer controls mutate the config.
3. Preview components render the text and decoration layers from config.
4. `calculatePrice(config)` returns a line-item breakdown and total.
5. Users can add the config and price to local cart storage.
6. Share links serialize a trimmed config into base64.

## Cart Flow

`src/lib/cart.ts` stores cart items in `localStorage`.

Each item includes:

- Generated local id.
- Full design config.
- Price at the time the item was added or updated.
- Creation timestamp.

Cart editing links route back to `/tasarla?editCartId=<id>`, where the designer can reload and update the stored item.

## Pricing Flow

`src/lib/pricing.ts` is the single pricing source. It derives dimensions from the chosen size preset or custom dimensions, then builds line items for base area, text complexity, accessories, production options, and shipping.

Keep pricing side effects out of UI components. Components should call `calculatePrice` and render the returned `PriceBreakdown`.

## Integration Boundary

`src/lib/integrations/index.ts` defines placeholder API shapes for:

- iyzico
- PayTR
- Param
- Stripe
- WhatsApp notifications
- Email quote sending
- Supabase/order persistence

These are intentionally non-functional stubs. Replace them with server-side implementations before accepting real payments or storing customer data.

## Security Notes

- Inline SVG rendering should only use output from `sanitiseSvg`.
- Do not render raw uploaded SVG or user HTML.
- Real payment provider calls must run server-side.
- Do not expose private API keys through Vite client environment variables.
- Customer quote files and order data need a real storage and retention policy before production use.
