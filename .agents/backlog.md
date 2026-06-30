# Project Backlog & Tasks - neon-tasarim-dunyasi

This backlog tracks user stories, technical debt, security items, and feature requests.

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
