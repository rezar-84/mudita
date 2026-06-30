# Architectural Decision Log (ADR) - neon-tasarim-dunyasi

This document logs significant architectural and design choices, providing rationale and context.

---

## ADR 1: Layer-Based Canvas Data Model (June 2026)
* **Status**: Accepted
* **Context**: The original codebase supported only a single text line on the customizer canvas. Users need to combine multiple text blocks, shapes, and upload their own SVGs.
* **Decision**: Adopted a Figma/Canva-like layer stack where the canvas maintains an array of `TextLayer` and `DecorationLayer` items.
* **Consequences**:
  - Requires dynamic layout rendering where each layer is positioned absolutely as a percentage of the canvas box.
  - Multi-select capability and layer ordering logic (send to back, bring to front) are now required.
  - Legacy URLs must be parsed and migrated automatically to a single-layer configuration in `share.ts`.

---

## ADR 2: TailwindCSS v4 with `@tailwindcss/vite` (June 2026)
* **Status**: Accepted
* **Context**: The project was initialized with Vite and required a fast, compiler-first styling library.
* **Decision**: Adopted TailwindCSS v4 which removes the need for a separate `tailwind.config.js` and instead integrates directly into the Vite pipeline via `@tailwindcss/vite`.
* **Consequences**:
  - Styles are defined using the standard `@theme` directive directly in CSS.
  - Avoid using old PostCSS plugin pipelines.

---

## ADR 3: Nitro Server Backend with TanStack Start (June 2026)
* **Status**: Accepted
* **Context**: The project needs full SSR support and serverless API execution (for processing payments and generating order templates) targeting Cloudflare.
* **Decision**: Standardized on TanStack Start with its integrated Nitro server engine.
* **Consequences**:
  - API routes can be defined as standard server-side functions.
  - Fully compatible with Cloudflare Pages/Workers hosting model.
