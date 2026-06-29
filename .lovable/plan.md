## Direction

Drop the current "tabs of form fields" pattern. Adopt the editor layout people already know from Figma / Inkscape / Canva, so the canvas is the centre of attention and properties appear in context.

```text
┌─────────────────────────────────────────────────────────────────────┐
│  ◆ Mudita   Tasarımım ▾   ↶ ↷    ── canvas ──    100% ⌄    🛒 ₺4.950 │  ← top bar
├──┬──────────────────────────────────────────────────────────────┬───┤
│  │                                                              │   │
│ ▼│                                                              │ ▼ │
│ T│                                                              │ P │
│ ♥│              ┌────────────────────────────┐                  │ R │
│ ⤓│              │                            │                  │ O │
│ ✎│              │      NEON CANVAS           │                  │ P │
│ ▣│              │   (rulers, grid, snap)     │                  │ E │
│ 🖼│              │                            │                  │ R │
│  │              └────────────────────────────┘                  │ T │
│  │                                                              │ Y │
├──┴──────────────────────────────────────────────────────────────┴───┤
│  Katmanlar (Layers)        ◯ ── ─⊕── + ─    Bg: Koyu Oda ▾   ─ 100% +│  ← status bar
└─────────────────────────────────────────────────────────────────────┘
```

### Left tool rail (vertical, icon-only, tooltips)

- **V — Seç (Select)** : pointer; click to select objects, drag to move, shift-click to multi-select.
- **T — Yazı (Text)** : click on canvas to add a new text layer.
- **♥ — Süsleme (Decoration)** : opens icon picker flyout (24 curated SVGs + search).
- **⤓ — SVG Yükle** : upload your own SVG (sanitised, 50 KB max).
- **✎ — Çiz (Path)** *(later, stub for now)* : freehand glow stroke.
- **▣ — Arka Panel (Backboard)** : toggles backboard styles flyout.
- **🖼 — Sahne (Scene)** : background presets + custom background upload.

### Top action bar

Left: brand + project name (editable) + undo/redo.
Centre: tool hint ("Seç" / "Yazı" / "Süsleme") + selection name.
Right: zoom %, fit-to-screen, fullscreen toggle, live price chip, **Sepete Ekle** button.

### Right properties panel (context-aware)

Shows properties of the currently selected object:

- **No selection** → Canvas properties (size, background, light on/off, dimmer, measurements toggle).
- **Text layer** → Content textarea, font, color, brightness, rotation, size (auto from text width — read-only with bump buttons), outline style, mounting & extras section collapsed below.
- **Decoration / SVG layer** → Color, size, rotation, position, opacity, glow intensity, delete.
- **Multi-select** → Align (left/center/right), distribute, group delete.

When nothing is open, the panel shows a quiet "Tip" card so it doesn't feel empty.

### Bottom status bar

- Layers strip: thumbnails of every text / decoration, drag-reorder, eye toggle, lock.
- Zoom controls (−/+, fit, 100 %, real-size).
- Active background selector.

### Canvas

- Rulers on top + left (toggle).
- Soft 5-cm grid + snap (toggle).
- Selection: marching-ants outline + 8 transform handles + rotation handle (visual only for v1 — sliders in the right panel do the actual work).
- Pan: hold space + drag, or middle-mouse drag.
- Zoom: cmd/ctrl + scroll, or +/− buttons.
- Multi-object: text layer + N decoration layers, all draggable independently.

## Data model changes

```ts
// src/lib/types.ts
type LayerKind = "text" | "decoration";

interface BaseLayer {
  id: string;
  kind: LayerKind;
  x: number;          // -50..50, % of canvas
  y: number;          // -50..50, % of canvas
  rotation: number;   // deg
  locked?: boolean;
  hidden?: boolean;
}

interface TextLayer extends BaseLayer {
  kind: "text";
  text: string;
  fontId: string;
  colorId: string;
  sizeId: SizePresetId;
  customWidth?: number;
  customHeight?: number;
}

interface DecorationLayer extends BaseLayer {
  kind: "decoration";
  source: "preset" | "upload";
  presetId?: string;        // references DECORATIONS[]
  svgMarkup?: string;       // for "upload"
  colorId: string;
  sizePct: number;          // 5..40 % of canvas height
  glowIntensity: number;    // 60..140
}

interface NeonDesignConfig {
  // canvas-level (what is currently the single text)
  layers: (TextLayer | DecorationLayer)[];
  selectedLayerId?: string;

  // canvas / scene
  outdoor: boolean;
  backboard: BackboardType;
  mounting: MountingType;
  dimmer: boolean;
  adapter: PowerAdapter;
  urgent: boolean;
  notes: string;
  background: BackgroundPreset;
  customBackground?: string;
  customBackgroundName?: string;

  // visual-only
  brightness?: number;
  flicker?: boolean;
  zoom?: number;
  panX?: number;
  panY?: number;
  isLightOn?: boolean;
  realSizeMode?: boolean;
  showMeasurements?: boolean;
  showBackboardBounds?: boolean;
  showSafeArea?: boolean;
  showGrid?: boolean;
  showRulers?: boolean;
  snapToGrid?: boolean;
}
```

### Backwards compatibility for shared URLs

`share.ts` will detect the old shape (top-level `text` / `fontId` / `colorId` / `positionX`) and migrate it on the fly into a single text layer with the same content. Existing share links keep working.

## Decorations library (new)

`src/data/decorations.ts` ships 24 curated SVG paths suited to neon silhouettes:

Heart · Star · Sparkle · Crown · Coffee Cup · Music Note · Lightning Bolt · Sun · Moon · Cloud · Cocktail · Pizza · Camera · Smile · Cat · Paw · Flower · Leaf · Cactus · Wedding Ring · Arrow · Lips · Eye · Infinity.

Each preset is `{ id, label, viewBox, path, defaultRatio }`. Rendered as inline `<svg>` filled with the chosen neon color and given the same multi-layer `drop-shadow` filter the text uses, so the glow matches exactly.

### SVG upload

- Click-or-drop on the left rail's ⤓ button.
- Read as text → sanitise (strip `<script>`, event handlers, `javascript:` URLs, external `href`/`xlink:href`, foreign-namespace nodes, embedded raster `<image>` tags) → keep only `<svg>`, `<g>`, `<path>`, `<circle>`, `<rect>`, `<polygon>`, `<polyline>`, `<line>`, `<ellipse>`.
- Hard limits: 50 KB per file, 8 decoration layers per design.
- Friendly errors for invalid / oversized / non-SVG files.

## Floating preview-toolbar fixes

- Fix the 3-dot popover not opening inside fullscreen (z-index): add `className="z-[210]"` to the in-canvas PopoverContent so it sits above the `z-[100]` overlay portal.
- Remove the duplicate "more" popover from fullscreen entirely — those actions move to the new toolbars/properties panel.

## Font library expansion

Add to `FONTS` + load the matching Google Fonts in `src/routes/__root.tsx`:

Allura · Kaushan Script · Yellowtail · Tangerine · Parisienne · Marck Script · Anton · Black Ops One · Audiowide · Faster One · Press Start 2P · Alfa Slab One · Fredoka · Bowlby One · Staatliches.

Brings the total from 20 → 35.

## Pricing impact (mock engine, `pricing.ts`)

- Each preset decoration: +₺120 base + (estimated cm² × area factor × 0.6).
- Each uploaded SVG decoration: +₺250 base + same area factor.
- Multiple text layers: each layer priced independently then summed (single-text designs unchanged).
- Surfaced as "Süsleme (N adet)" and "Yazı katmanı (N adet)" in the breakdown.

## Files

**New**
- `src/components/designer/EditorShell.tsx` — top bar + tool rail + canvas + properties panel + status bar
- `src/components/designer/ToolRail.tsx`
- `src/components/designer/TopBar.tsx`
- `src/components/designer/StatusBar.tsx`
- `src/components/designer/Canvas.tsx` — pan/zoom/grid/rulers/snap, hosts the layer tree
- `src/components/designer/layers/TextLayerView.tsx`
- `src/components/designer/layers/DecorationLayerView.tsx`
- `src/components/designer/properties/CanvasProperties.tsx`
- `src/components/designer/properties/TextProperties.tsx`
- `src/components/designer/properties/DecorationProperties.tsx`
- `src/components/designer/properties/PropertiesPanel.tsx` (dispatcher)
- `src/components/designer/LayersStrip.tsx`
- `src/components/designer/DecorationPickerFlyout.tsx`
- `src/data/decorations.ts`
- `src/lib/svgSanitize.ts`
- `src/lib/layers.ts` (helpers: addLayer, updateLayer, removeLayer, reorder)

**Updated**
- `src/lib/types.ts` (Layer types + new config shape)
- `src/components/configurator/DesignerContext.tsx` (selectedLayerId, layer-aware update fns, undo/redo via a small ring buffer)
- `src/routes/tasarla.tsx` (use EditorShell; keep current header summary text)
- `src/components/configurator/FullscreenDesigner.tsx` (just wraps EditorShell in a portal with body-scroll lock + ESC)
- `src/lib/share.ts` (migrate old shape → new layer shape)
- `src/lib/pricing.ts` (per-layer pricing + decoration line items)
- `src/data/options.ts` + `src/routes/__root.tsx` (font additions)
- `src/lib/i18n.ts` (Süsleme, Katmanlar, Seç, Yakınlaştır/Uzaklaştır, etc. TR + EN)

**Retired** (kept around briefly, then removed)
- `src/components/configurator/ConfiguratorPanel.tsx` (tab-based UI replaced)
- `src/components/configurator/PreviewControls.tsx` (folded into CanvasProperties)
- `src/components/configurator/BackgroundToggle.tsx` (folded into CanvasProperties)
- `src/components/configurator/NeonPreview.tsx` (replaced by Canvas + layer views; behaviour preserved)
- `src/components/configurator/MeasurementOverlay.tsx` (folded into Canvas)

## Scope & sequencing

Done in a single pass, but in this order so each step compiles:

1. Type + share-migration changes.
2. EditorShell skeleton (top bar, tool rail, empty canvas, properties stub, status bar) — wired in `/tasarla` and `FullscreenDesigner`.
3. Text layer + canvas dragging + properties panel (parity with current behaviour, just rehoused).
4. Decoration library + DecorationPickerFlyout + DecorationLayerView (preset only).
5. SVG upload + sanitiser.
6. Layers strip + reorder + show/hide/lock.
7. Pan/zoom/rulers/grid polish.
8. Fonts + i18n.
9. Pricing engine updates.

## Out of scope (next round)

- Full undo/redo history (we'll ship a 20-step ring buffer; no branching).
- Multi-text alignment guides (Figma-style smart guides).
- Snap-to-decoration (only snap-to-grid for v1).
- Drag-resize handles on canvas (resize via slider; visual handles come later).
- AI-generated icons from text.
- PNG/JPG stickers (only SVG so the glow stays correct).
