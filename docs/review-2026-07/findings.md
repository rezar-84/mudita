# Findings — July 2026 review

Evidence uses `path:line` at the time of review (commit `c11baa5`). Line numbers
may drift; the surrounding description keeps each item locatable.

---

## Security

### SEC-1 🔴 Stored/reflected XSS via share links and uploaded SVG decorations

- **Where:** `src/lib/svgSanitize.ts`, `src/lib/share.ts`,
  `src/components/configurator/DesignerContext.tsx:281`,
  `src/components/designer/DecorationOverlay.tsx:174,203`,
  `src/components/designer/DecorationPickerDialog.tsx:102`.
- **What:** `DecorationOverlay` renders `decoration.svgMarkup` with
  `dangerouslySetInnerHTML`. `sanitiseSvg()` is only applied at _upload_ time.
  Configs also enter the app from untrusted sources that never re-sanitize:
  - `?d=<base64>` share links → `decodeConfig()` → `dispatch({ type: "replace" })`.
  - `saved_designs.config` / `gallery_items.config` loaded from the DB.
  - `editCartId` → localStorage cart.
    A crafted share URL can embed arbitrary `svgMarkup` and execute script in the
    victim's origin.
- **Extra gap:** the sanitizer allows the `style` attribute and does not strip
  `<style>`/`url(...)`; `style` can carry external references and CSS-based
  exfiltration vectors. It also lacks a `<foreignObject>`/`<use>` guard beyond the
  tag allowlist (allowlist is good, but confirm `use`/`foreignObject` are absent).
- **Impact:** Supabase session tokens live in `localStorage` (see
  `src/integrations/supabase/client.ts`, `persistSession: true`). XSS = full
  account/session takeover, including admin if an admin opens a malicious link.
- **Fix direction:** Sanitize on the way _in_, not only on upload. Re-run
  `sanitiseSvg()` over every decoration's `svgMarkup` inside `decodeConfig()` and
  at every other trust boundary (cart load, saved design load, gallery load).
  Harden `sanitiseSvg` to strip `style`, `<style>`, `use`, `foreignObject`, and
  reject `url(` in any remaining attribute value. Add a CSP header on the worker
  as defense-in-depth (see OPS-3).

### SEC-2 🟠 `.env` committed to git

- **Where:** tracked by git since commit `7d2e5ad`; absent from `.gitignore`.
- **What:** `.env` currently holds only public values
  (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_*`) — no secret key today, so
  this is not an active leak. But the file being tracked means the first time
  anyone adds `SUPABASE_SERVICE_ROLE_KEY` locally, it will be committed.
- **Fix direction:** `git rm --cached .env`, add `.env` (and `.env.*` except
  `.env.example`) to `.gitignore`, commit a `.env.example` with key _names_ only.

### SEC-3 🟡 Server functions leak raw error strings

- **Where:** every `throw new Error(error.message)` in
  `src/lib/orders.functions.ts`, `pricing.functions.ts`, `designs.functions.ts`.
- **What:** Postgres / Supabase internal error text is forwarded to the client.
- **Fix direction:** Log the raw error server-side, throw a generic user-facing
  message. Keep a small map for expected cases ("Not found", "Forbidden").

### SEC-4 🟡 `design_events` open to anonymous inserts

- **Where:** migration policy "Anyone can log valid events" (anon INSERT, only a
  1–64 char length check); read path `adminStats` in `orders.functions.ts:255`
  reads up to 5000 rows.
- **What:** Unauthenticated flooding of the events table is possible.
- **Fix direction:** Add a periodic prune (cron/edge function) and/or basic
  rate-limiting; cap payload size in the policy.

---

## Product / funnel

### PM-1 🔴 `/yukle` quote form throws away every submission

- **Where:** `src/routes/yukle.tsx:48-56`; stubs in `src/lib/integrations/index.ts`.
- **What:** On submit it validates, shows `toast.success(...)`, and resets. No file
  upload, no DB write, no email. The highest-intent lead source produces nothing.
- **Fix direction:** New `submitQuoteRequest` server fn → insert into a new
  `quote_requests` table + upload the file to a Supabase Storage bucket; notify the
  shop (Resend email or a WhatsApp/Telegram webhook). See feature spec in
  remediation-plan `PM-1`.

### PM-2 🔴 Checkout has no working payment or contact path

- **Where:** `src/routes/odeme.tsx` (all 5 providers marked "soon"; the one live
  action links to bare `https://wa.me/` with no number); `src/routes/sepet.tsx`
  places an order row but never charges.
- **What:** A buyer ready to pay hits a wall. Four fake "coming soon" cards read as
  an unfinished site.
- **Fix direction:** Decide the v1 model explicitly:
  - (a) Manual: make WhatsApp/bank-transfer real (real number, order reference,
    IBAN), remove the fake provider cards; **or**
  - (b) Wire one real provider (iyzico or PayTR are the TR-market fits).
    Until (b), the "order" should be framed as a _quote/reservation_, not a purchase.

### PM-3 🟠 Placeholder contact info will ship to production

- **Where:** `src/components/WhatsAppWidget.tsx:5` (`905555555555`),
  `src/routes/iletisim.tsx:49` and `src/routes/odeme.tsx:50` (bare `https://wa.me/`).
- **What:** Every WhatsApp CTA fails in production.
- **Fix direction:** One `src/lib/contact.ts` config constant (phone, wa.me base,
  email, IBAN) consumed everywhere. See SEC/PM overlap in remediation `PM-3`.

---

## Developer / correctness

### DEV-1 🟠 Server trusts client-sent order prices

- **Where:** `src/lib/orders.functions.ts:38-62` (`createOrder`).
- **What:** `price_try`, `subtotal_try`, `total_try` are stored exactly as the
  browser sends them; the server never recomputes from `config` + `pricing_config`.
  A user can place an order for ₺1. Blast radius is limited _only_ because there is
  no payment gate yet — this becomes critical the moment PM-2(b) lands.
- **Fix direction:** In `createOrder`, recompute each item's price server-side with
  the shared `calculatePrice()` + DB pricing overrides, and reject if the client
  total deviates beyond a rounding tolerance. Make the pricing module import-safe on
  the server (it already is — pure functions over `data/options.ts`).

### DEV-2 🟡 Non-null assertions on cart render can crash

- **Where:** `src/routes/sepet.tsx:187-188` (`FONTS.find(...)!`, `COLORS.find(...)!`).
- **What:** A stored config referencing a font/color later removed from
  `src/data/options.ts` throws and blanks the cart. `pricing.ts` already falls back
  gracefully; the cart does not.
- **Fix direction:** `?? FONTS[0]` / `?? COLORS[0]` fallbacks.

### DEV-3 🟡 Admin gate is client-side redirect only (defense-in-depth note)

- **Where:** `src/routes/_authenticated/admin.tsx:8-18`,
  `src/routes/_authenticated/route.tsx`.
- **What:** The route guards are `ssr:false` client redirects. The _real_
  protection is `assertAdmin()` in each admin server fn (present and correct). Not a
  hole, but easy to mistake the client check for the security boundary.
- **Fix direction:** Add a comment at `assertAdmin` and above the route guards
  stating which is the authority, so nobody "optimizes" the server check away.

### DEV-4 🟢 `i18n.ts` is 946 lines

- **Where:** `src/lib/i18n.ts`.
- **What:** At the project's own "split large files" threshold. Fine as a data file
  now; split by namespace if it keeps growing.

---

## UI / UX

### UX-1 🟠 `/tasarla` blocks all navigation regardless of dirty state

- **Where:** `src/routes/tasarla.tsx:33-62`.
- **What:** `useBlocker` fires a `window.confirm` on _any_ nav away (except
  `/sepet`), and `beforeunload` always prompts — even on a pristine, untouched
  design. Clicking the site logo prompts "are you sure you want to leave?". This is
  a real bounce driver.
- **Fix direction:** Track a `dirty` flag (config changed from initial) and only
  block when dirty. Don't attach `beforeunload` until dirty.

### UX-2 🟡 Cart is localStorage-only, no server persistence or login merge

- **Where:** `src/lib/cart.ts`.
- **What:** A logged-in user's cart doesn't survive device switch; no merge on
  login. For a considered custom purchase this costs conversions.
- **Fix direction:** Optional — persist cart to `saved_designs` or a `carts` table
  for logged-in users and merge local → server on login.

---

## Opsec / production readiness

### OPS-1 🟡 No error monitoring

- **What:** No Sentry/equivalent; failures are invisible in production.
- **Fix direction:** Add a lightweight error reporter in `src/router.tsx` error
  boundary and server fn catch paths.

### OPS-2 🟡 No `robots.txt` / `sitemap.xml`

- **What:** Only `auth.callback.tsx` sets `noindex`. An SEO-driven storefront ships
  with no crawl guidance.
- **Fix direction:** Add static `robots.txt` + generated `sitemap.xml` for public
  routes (`/`, `/galeri`, `/sss`, `/hakkimizda`, `/iletisim`, `/tasarla`, `/yukle`).

### OPS-3 🟡 No security headers / CSP on the Cloudflare worker

- **Where:** `wrangler.jsonc` has no headers config.
- **What:** No CSP, `X-Content-Type-Options`, `Referrer-Policy`, etc. CSP in
  particular is the second layer behind SEC-1.
- **Fix direction:** Add a response-header middleware (TanStack Start server route
or worker) setting a strict-ish CSP, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.
</content>
