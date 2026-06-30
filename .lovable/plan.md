## Goals

1. Unify base "Mudita" text with `TextLayer[]` so every text on the canvas has identical controls (content, font, color, size, rotation, flip, position, z-order, lock/hide, duplicate, delete).
2. Decouple text from the global "sign" config — global `text`, `fontId`, `colorId`, `positionX/Y`, `rotationDeg`, `zoom` no longer control any specific layer.
3. Guarantee the canvas always has at least one visible item (text or SVG); deletion of the last layer is blocked.
4. Ambient glow on the canvas aggregates ALL visible layers, independent of selection.
5. Fix the alignment icon mapping — horizontal-align actions show vertical-baseline icons, vertical-align actions show horizontal-baseline icons.

## Architectural change

Treat the base text as a regular `TextLayer` with a stable id `"base"` auto-seeded into `config.textLayers` when the array is empty. No special-case rendering path.

### `src/lib/types.ts`
- Mark `NeonDesignConfig.text`, `fontId`, `colorId`, `positionX/Y`, `rotationDeg` as deprecated/optional — kept only for legacy share-URL decode.
- `textLayers` becomes the single source of truth for all on-canvas text.

### `src/components/configurator/DesignerContext.tsx`
- `defaultConfig` seeds `textLayers: [{ id: "base", text: "Mudita", fontId: "pacifico", colorId: "pink", sizePct: 18, x: 0, y: 0, rotation: 0 }]`.
- Reducer "replace": if `cfg.textLayers` is empty AND legacy `cfg.text` is set, migrate into a single `"base"` layer.
- `removeTextLayer` / `removeDecoration`: refuse when it would leave zero combined layers; toast `t("layerLastWarning")` instead.
- Default `selection` becomes `{ kind: "textLayer", id: "base" }`.
- Remove the `{ kind: "text" }` branch from `alignSelected` / `boundsOf`.

### `src/components/configurator/NeonPreview.tsx`
- Remove the dedicated "main text" render block, the drag handler bound to `positionX/Y`, and the base-text `SelectionHandles`.
- Canvas renders: ambient glow halo (aggregated over ALL visible layers — see below), `DecorationOverlay`, `TextLayerOverlay`, measurement overlays, floating docks.
- **Ambient glow**: build a `radial-gradient` for each visible text + decoration layer using its own color's `glow`, position (`x`,`y` in %), and a radius derived from `sizePct`. Compose them as a layered `background-image` on the halo div (multiple radial gradients separated by commas). Falls back to dim canvas when nothing visible.
- "Center" button centers the currently selected layer (or no-op when `canvas`).

### `src/components/designer/TextLayerOverlay.tsx`
- Already per-layer; now also renders the `"base"` layer — no behavioral change.

### `src/components/designer/TextLayerProperties.tsx`
- Works for `"base"` automatically. Hide "Delete" when it is the only remaining item.

### `src/lib/pricing.ts`
- `getDimensions` and length calculations derive from `textLayers` (longest layer text + sum of glyphs) instead of `config.text`, with a small minimum.

### `src/lib/share.ts`
- Encoder writes `textLayers` (already supported). Migration done in reducer.

### `src/components/configurator/ConfiguratorPanel.tsx` (Yazı tab)
- Remove global text/font/color inputs (they duplicated per-layer controls). Replace with a helper note + "Add text layer" button. Per-layer edits happen via the inspector when a layer is selected.

### `src/components/designer/AlignmentControls.tsx` — icon fix
Swap so the glyph matches the action:
```
horizontal (left/centerH/right) → AlignStartVertical, AlignCenterVertical, AlignEndVertical
vertical   (top/centerV/bottom) → AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal
```
Rationale: `AlignStartVertical` shows a vertical baseline with items right of it — the correct visual for "align objects to a shared left edge". The current code has these reversed.

## Out of scope

- Backend, pricing coefficients, routing, editor shell visual redesign.
- Only one new i18n key: `layerLastWarning` (TR + EN).

## Verification

1. `/tasarla`: "Mudita" appears as a normal selected text layer with full inspector. Selection handles, drag, rotate, resize, close all behave like any other layer.
2. Delete every layer one by one — last layer cannot be deleted; toast explains why.
3. Two text layers with different colors visibly contribute their own glow halo to the canvas, even when nothing is selected.
4. Multi-select + alignment buttons show icons that visually match the action.
5. Old share URL with `text=` / `fontId=` is migrated into a single `"base"` text layer.
6. `bun run build` + tsgo pass.
