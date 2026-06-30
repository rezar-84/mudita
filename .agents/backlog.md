# Project Backlog & Tasks - neon-tasarim-dunyasi

This backlog tracks user stories, technical debt, security items, and feature requests.

---

## 🎯 Target User Scenarios

### Scenario 1: Uniform Base Text Layer Behavior
* **User Goal**: The default "Mudita" text layer preloaded on the canvas must behave exactly like a normal layer.
* **Flow**:
  1. User opens the designer page. The text "Mudita" is pre-populated in the center.
  2. Clicking the text displays standard resize, rotate, and close (delete) handles on the canvas.
  3. The user can drag to position, drag the rotate handle to tilt, or click the "×" close button to delete the text entirely (allowing them to build an icon-only neon design).

### Scenario 2: Multi-Layer Canvas Selection (Shift-Clicking)
* **User Goal**: Select multiple text and decoration layers simultaneously.
* **Flow**:
  1. User adds a text layer "HAPPY", a second text layer "BIRTHDAY", and a heart decoration icon.
  2. The user holds down the `Shift` key and clicks the "HAPPY" layer, the "BIRTHDAY" layer, and the heart icon on the canvas (or clicks them in the sidebar layers panel).
  3. All three items show active selection borders, and the properties panel switches to a multi-align control layout.

### Scenario 3: Corrected Horizontal & Vertical Alignment Controls
* **User Goal**: Align and distribute selected layers horizontally or vertically using correct visual guidelines.
* **Flow**:
  1. With multiple layers selected, the user clicks the "Align Left" button (which correctly uses the horizontal `AlignLeft` icon).
  2. The layers align their left edges to the chosen reference (e.g. Page, or the biggest item).
  3. The user clicks "Align Center Vertical" (which correctly uses a vertical alignment icon), and the layers align their vertical midpoints.

---

## 🔴 High Priority (Sprint 1)
- [ ] **[UI/UX]** Touch support on mobile: Ensure users can drag/resize neon layers easily on mobile screens without triggering page scrolls.
- [ ] **[Security]** SVG sanitization audit: Verify `src/lib/svgSanitize.ts` blocks XSS attempts via malicious inline SVG files.
- [ ] **[Feature]** Custom wall background upload: Allow users to upload a JPG/PNG of their own wall to preview how the neon will look.
- [ ] **[Bug]** Font loading flicker: Fix fonts flash of unstyled text (FOUT) when switching font types in the customizer.

## 🟡 Medium Priority (Sprint 2)
- [ ] **[Feature]** Localized Checkout: Wire up checkout inputs (`odeme.tsx`) and link with a mock or real payment provider (iyzico).
- [ ] **[Feature]** Multi-item alignment controls: Add quick-align tools (Align Left, Align Center, Align Right) for multi-selected layers on the canvas.
- [ ] **[Tech Debt]** Share link migrations: Add comprehensive unit tests for `src/lib/share.ts` to ensure legacy query strings correctly map to the new layers data shape.
- [ ] **[Ops]** GitHub Actions setup: Build a basic CI workflow that runs `bun run lint` and `bun run build`.

## 🟢 Low Priority (Future)
- [ ] **[Feature]** Vector Export for Production: Generate a perfect production-ready SVG/DXF file containing outline layers for the CNC router / laser cutter.
- [ ] **[Feature]** Glow animation toggle: Let neon signs slowly pulse or flash in the preview.
- [ ] **[Feature]** Dark mode toggle for the main marketing site.
