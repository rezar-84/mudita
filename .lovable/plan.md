## What's changing

Five focused fixes across the configurator, checkout, header, and auth.

### 1. Smaller default text on new designs

`defaultConfig` seeds the base text layer at `sizePct: 22`, which renders very large in the preview.

- Lower the seeded base layer to `sizePct: 14` in `src/components/configurator/DesignerContext.tsx`.
- Also lower the default `sizePct` used when the user adds a new text layer (currently 22 in the text layer creator) to `14`, so newly added layers start at a friendly size.
- No migration needed — existing saved designs and cart items keep their stored size.

### 2. Proper billing/shipping fields at checkout and in the profile

Right now checkout collects only name / email / phone / one free-text address line, and profile stores the address as `{ line }`. That's not enough for shipping a physical product.

- Extend the `contact` payload on `createOrder` (server fn) to accept structured fields:
  - `name`, `email`, `phone`
  - `address_line1`, `address_line2` (optional)
  - `city`, `district`, `postal_code`, `country` (defaulted to `TR`)
  - `tax_id` (optional, for corporate invoices)
- Update the `/sepet` checkout aside to render those fields in a clean 2-column form, pre-filled from the user's profile when available.
- Update `/hesap/profil` to save the same structured shape into `profiles.address` (jsonb) so future checkouts auto-fill.
- Add a "Save this address to my profile" checkbox on checkout (default on) that upserts the profile address after a successful order.
- Server-side validation via zod for all new fields.

No database migration is required — `profiles.address` and `orders.contact` are both `jsonb`, so the shape can evolve freely.

### 3. De-cramp the header (nav, user menu, language switcher)

The header packs logo, 7 nav links, language pills, CTA button, cart, user menu and a hamburger into one row, which overflows on mid-width screens.

- Bump the desktop breakpoint for the inline nav from `lg` to `xl` so the mobile drawer takes over sooner and mid-widths stop compressing.
- Give the header more breathing room: increase gap, use `py-3.5`, and let the nav row wrap the CTA below on narrow desktop.
- Move the language switcher into the user menu dropdown (with a compact `TR / EN` toggle inside it) AND into the mobile drawer. Keep a small `TR|EN` pill visible on `xl+` only, so the toolbar isn't crowded on smaller widths.
- User menu: widen trigger to show avatar + name comfortably, add a header row with avatar + email, group items into "Hesabım / Tasarımlarım / Siparişlerim / Profil", separator, "Dil: TR / EN", separator, admin link (if admin), sign out.
- Translate the user menu labels (currently hardcoded Turkish) via the i18n system, matching the existing pattern.

### 4. Unified layer z-order (decorations + text respect one stack)

Today `NeonPreview` renders `<DecorationOverlay />` then `<TextLayerOverlay />`, so every text layer paints on top of every decoration regardless of the order in the Layers panel. Reordering the base text down has no visible effect.

- Introduce a single merged render list built from `[...decorations, ...textLayers]` with a shared `z` derived from position in the combined array (as edited from the Layers panel).
- Refactor `DecorationOverlay` and `TextLayerOverlay` so each item accepts an explicit `zIndex`; the parent picks the order.
- Update `LayersPanel` to display one unified list (decorations + text together) with drag / up / down actions moving items across the combined stack. The `reorder` action in `DesignerContext` gets a new "unified" mode that swaps between the two arrays while preserving the total order via a `zOrder: string[]` field on the config (array of layer ids in bottom-to-top order). When absent, it defaults to `[...decorations, ...textLayers]` for backwards compatibility.
- The base "MudiNeon" layer becomes an ordinary participant — send-to-back, bring-forward, etc. all work.

### 5. Google OAuth showing the Lovable brand

By default, Lovable Cloud uses its managed Google OAuth client, so the Google consent screen shows "Lovable" as the requesting app. To show "MudiNeon" you have to bring your own Google OAuth client and configure it in the Cloud dashboard.

I'll add a short in-chat note explaining the two options and, if you want the branded flow now, walk you through creating the Google Cloud OAuth client and pasting the client ID/secret into Cloud → Authentication → Google. No code changes on our side — the same `lovable.auth.signInWithOAuth("google", …)` call is used either way.

## Technical notes

- Files touched:
  - `src/components/configurator/DesignerContext.tsx` — default sizePct, add `zOrder` field, unified `reorder`.
  - `src/lib/types.ts` — add optional `zOrder?: string[]` to `NeonDesignConfig`.
  - `src/components/configurator/NeonPreview.tsx` — merged render list.
  - `src/components/designer/DecorationOverlay.tsx`, `src/components/designer/TextLayerOverlay.tsx` — accept `zIndex`.
  - `src/components/designer/LayersPanel.tsx` — unified list + reorder across kinds.
  - `src/components/SiteLayout.tsx` — header density, user-menu grouping, i18n labels, embedded language toggle.
  - `src/lib/i18n.ts` — new keys for user menu, checkout billing fields.
  - `src/routes/sepet.tsx` — structured billing form, autofill from profile, optional save-to-profile.
  - `src/lib/orders.functions.ts` — extend zod `contact` schema.
  - `src/routes/_authenticated/hesap.profil.tsx` — structured address form matching checkout.

- No SQL migration needed. `orders.contact` and `profiles.address` are `jsonb`; existing rows keep the old `{ line }` shape and continue to render (readers fall back to `address_line1 ?? line`).

- Google OAuth branding is a Cloud dashboard change, not code.
