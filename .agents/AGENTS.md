# Agent Guidelines - neon-tasarim-dunyasi

This project is a multi-agent and human developer collaborative project. The site is a neon design customizer built with TanStack Start, React 19, Cloudflare (Vite + Wrangler), and TailwindCSS v4.

## Agent Cooperation Principles

### 1. Collaboration with Loveable.dev

- **Loveable** is a cloud-based development environment that translates natural language prompts into codebase changes and automatically handles deployment previews.
- **Local Agents (Antigravity, Cursor, etc.)** run locally on the developer machine and are best for deep structural refactoring, complex backend wiring, performance optimizations, and multi-agent coordination.
- **Rule**: Never modify `.lovable/plan.md` directly unless aligning on high-level roadmap syncs. Loveable manages its plan dynamically.
- **Rule**: Before making large structural changes, verify Loveable's recent commits to avoid code conflicts. Keep commit messages clear.

### 2. Tech Stack Constraints

- **Framework**: TanStack Start (React Router + Nitro Server + React 19)
- **Styling**: TailwindCSS v4 (using `@tailwindcss/vite`). Avoid adding Tailwind configurations in standard CSS paths unless compatible with v4 directives.
- **Deployment**: Cloudflare Workers / Pages (via Wrangler config in `wrangler.jsonc` and `@cloudflare/vite-plugin`).

### 3. File Organization

- Keep business logic in `src/lib/` or `src/hooks/`.
- Keep customizable configuration items (like pricing, fonts, option limits) in `src/data/` or `src/lib/pricing.ts`.
- Keep configuration docs, checklists, and roadmaps inside the `.agents/` folder. Do not pollute the root directory.
