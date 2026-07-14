# Deployment Guide

## Target

The repository is configured for Cloudflare Workers through `wrangler.jsonc` and TanStack Start.

Current Wrangler settings:

```jsonc
{
  "name": "tanstack-start-app",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
}
```

## Build

```bash
npm run build
```

Use `npm run preview` for a local production preview after building.

## Cloudflare Notes

The Vite config uses `@lovable.dev/vite-tanstack-config`, which already wires TanStack Start, React, Tailwind, path aliases, and Cloudflare behavior. Do not manually add duplicate Vite plugins for those concerns in `vite.config.ts`.

Before production deploy:

- Rename the Wrangler app from `tanstack-start-app` to the production worker name.
- Confirm `compatibility_date` with the deployed Cloudflare account.
- Add production environment variables and secrets through Cloudflare, not committed files.
- Wire real backend endpoints for quote submission, file upload, order persistence, and payment sessions.
- Confirm SEO metadata and social image URLs in `src/routes/__root.tsx`.

## Environment Variables

No required production secrets are currently documented in code because provider integrations are stubs.

When providers are implemented, keep this split:

- Public, harmless values can use Vite public env conventions.
- Payment keys, email credentials, storage keys, webhook secrets, and admin tokens must be server-only secrets.

## Pre-Deploy Checklist

- `npm run lint`
- `npm run build`
- Test `/`, `/tasarla`, `/galeri`, `/yukle`, `/sepet`, `/odeme`, `/sss`, `/hakkimizda`, and `/iletisim`.
- Test mobile navigation and language switching.
- Test adding, editing, and clearing cart items.
- Test share links with normal text designs and with uploaded decoration designs.
- Verify uploaded SVGs are sanitized and oversized files are rejected.
- Verify payment buttons cannot create real orders until server integrations are ready.
