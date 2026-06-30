
## Goals

Fix five UX regressions / bugs in the designer:

1. **Text & Style tabs feel weak now.** Restore the rich UI (live font preview tiles, large color swatches, size/rotation sliders) but make them act on the *currently selected text layer* instead of the deprecated global text. When nothing is selected, fall back to editing the first/base text layer so the editor never feels empty.
2. **Confusing context switch.** Today Text/Style live in `ConfiguratorPanel`, but when a layer is clicked the inspector hides them and shows `TextLayerProperties` somewhere else. Unify: Text + Style tabs render the per-layer controls inline (same component for selected text layer OR base layer), so the user edits in one consistent place. The right-hand "Decoration" inspector stays only for SVG/icon layers.
3. **Scene tab cleanup.** Remove view-only controls that belong to layers (rotation, position sliders inside `PreviewControls`). Scene keeps only scene-level things: background, zoom, brightness, light on/off, AI idea panel.
4. **Hide alignment when nothing selectable.** `AlignmentControls` should render only when `selection.kind` is `textLayer`, `decoration`, or `multi`. Hide for `canvas` / `none`.
5. **Background tool button does nothing.** Wire the left ToolRail "background" icon to open the Scene tab (or jump-scroll to the `BackgroundToggle`) and select canvas. Implement via a small event (`mudita:open-scene`) that `ConfiguratorPanel` listens to and switches its `Tabs` value.

Also fix the reported hydration mismatch on the Home nav link (server renders Turkish "Ana Sayfa", client renders English "Home"). Cause: language is read from `localStorage` at first render. Fix by initializing the language state to the SSR-safe default ("tr") and hydrating from localStorage in a `useEffect`, so server + first client render match.

## Files to change

- `src/components/configurator/ConfiguratorPanel.tsx`
  - Replace the placeholder "Text" tab with the rich editor: text input/textarea, font preview tiles, color swatches, size slider, rotation slider, flip, plus "+ New text layer" button.
  - Replace the placeholder "Style" tab with a per-layer style block (font + color + size + rotation), same target layer as Text tab.
  - Both tabs target a single `activeTextLayer` derived as:
    `selection.kind === "textLayer"` → that layer; else first visible layer; else `textLayers[0]` (always exists post-migration).
  - All edits route through `updateTextLayer(active.id, …)` — no writes to deprecated global `text/fontId/colorId`.
  - Listen for `mudita:open-scene` and switch Tabs to `scene`.
- `src/components/configurator/PreviewControls.tsx` — drop rotation + positionX/Y sliders (they were global and meaningless now). Keep zoom, brightness, light on/off.
- `src/components/designer/PropertiesPanel.tsx` — when `selection.kind === "textLayer"`, render the same `ConfiguratorPanel` (so right panel mirrors editor) OR keep `TextLayerProperties` but remove its duplicate font/color/size controls (since they live in the unified tabs). Choose: drop `TextLayerProperties` and let the unified tabs in `ConfiguratorPanel` be the single source; the right panel for textLayer shows just `AlignmentControls` + transform/flip/lock/hide/delete/z-order quick actions + `LayersPanel`.
- `src/components/designer/AlignmentControls.tsx` — early-return `null` when selection isn't `textLayer | decoration | multi`. Update `PropertiesPanel` "scene" branch to not render it.
- `src/components/designer/ToolRail.tsx` — `background` tool dispatches `window.dispatchEvent(new CustomEvent("mudita:open-scene"))` and sets selection to `canvas`.
- `src/lib/i18n.ts` — add small helper `getInitialLanguage()` that always returns `"tr"` during SSR and the first client render; expose `useLanguage()` that hydrates from localStorage in `useEffect`. Update any consumers that currently read `localStorage` synchronously during render.
- `src/components/configurator/FontSelector.tsx` — accept optional `value` / `onChange` props so it can drive a layer's font instead of the deprecated `config.fontId`. Keep current behavior as default.

## Out of scope

- Pricing engine, share encoding, backend, route changes.
- No new translation strings beyond what's needed for the unified tab headers (reuse existing keys where possible).

## Verification

1. `/tasarla` Text tab: rich textarea + font tiles + color swatches act on the selected (or base) layer. Editing reflects on canvas immediately.
2. Clicking a different text layer updates the Text/Style tab contents to that layer.
3. Scene tab no longer shows rotation/position sliders; only zoom/brightness/light/background/AI idea.
4. With no selection, the right-side `AlignmentControls` is hidden.
5. Clicking the Background icon in the left rail switches the editor to the Scene tab and scrolls to the background section.
6. Hard refresh `/` — no hydration warning in console; nav label matches SSR. Language toggle still works after mount.
7. `bun run build` and `bunx tsgo --noEmit` pass.
