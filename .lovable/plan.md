## Goals

1. Text/Style tabs should clearly target the **selected** text layer. Today the "active layer" silently falls back to the first visible layer when nothing is selected, so edits land on a layer the user didn't pick — confusing.
2. Gallery "Benzerini Tasarla" links open the designer but the chosen text/font/color don't apply. The base text layer keeps showing "Mudita".

## Fix 1 — Selection-driven Text & Style tabs

`src/components/configurator/ConfiguratorPanel.tsx`

- Derive `activeLayer` strictly from selection:
  - `selection.kind === "textLayer"` → that layer.
  - Otherwise → `null` (no silent fallback).
- When `activeLayer` is null, replace the Text and Style tab bodies with a clear empty state:
  - "Select a text on the canvas to edit it" + a compact list/buttons of existing text layers (click to select) + the existing "+ New text layer" button.
- When a layer is selected, the textarea, font tiles, color swatches, size/rotation/flip controls drive only that layer via `updateTextLayer`. Remove the `update({ fontId })` / `update({ colorId })` fallbacks that wrote to the deprecated global fields.
- Auto-switch to the Text tab when the user picks a text layer on the canvas. Add a `useEffect` watching `selection`; if `selection.kind === "textLayer"` and current tab is not `text`/`style`, set tab to `text`. Also dispatch nothing new — just a local effect.
- Keep the `ActiveLayerBadge` but show it only when a layer is selected; remove the "switcher dropdown" duplication (the empty-state list replaces it).

`src/components/designer/TextLayerOverlay.tsx` (verify only, no behavior change needed): clicking a text already calls `setSelection({ kind: "textLayer", id })`. With the effect above, the editor jumps to the Text tab.

## Fix 2 — Gallery "Use this design" applies to base text layer

Root cause: `migrateConfig` (in `DesignerContext.tsx`) only seeds a base text layer when none exists. `defaultConfig` already includes the "Mudita" base layer, so legacy `text/fontId/colorId` passed via the share URL are ignored.

Two complementary changes:

- `src/routes/galeri.tsx` — `buildDesignUrl(item)` builds the config by replacing the base text layer instead of setting deprecated globals:

  ```ts
  const baseLayer = defaultConfig.textLayers![0];
  const cfg: NeonDesignConfig = {
    ...defaultConfig,
    textLayers: [
      { ...baseLayer, text: item.text, fontId: item.fontId, colorId: item.colorId },
      ...defaultConfig.textLayers!.slice(1),
    ],
  };
  ```

  Also localize the two hardcoded Turkish strings ("Benzerini Tasarla", "Sıfırdan Tasarla") using existing `useT()` keys (`useThisDesign`, `designFromScratch` — add if missing in `src/lib/i18n.ts`).

- `src/components/configurator/DesignerContext.tsx` — harden `migrateConfig` for old links: if incoming `cfg.text` is non-empty AND a base layer exists, overwrite that base layer's `text/fontId/colorId/x/y/rotation` from the legacy fields. This keeps any pre-existing share links working.

## Out of scope

- Pricing engine, Scene tab, alignment controls, decoration inspector — unchanged.
- No new routes, no backend.

## Verification

1. `/tasarla` with no selection → Text and Style tabs show "Select a text to edit" + buttons listing existing layers. No silent writes occur.
2. Click a text on the canvas → editor switches to Text tab; textarea, fonts, colors, sliders all drive that layer; switching to Style tab keeps the same target.
3. `/galeri` → click "Benzerini Tasarla" on any tile → `/tasarla` opens with the tile's text/font/color visibly applied as the base layer (no more "Mudita" leftover).
4. Old share links containing `text/fontId/colorId` still render correctly.
5. `bunx tsgo --noEmit` and `bun run build` pass.
