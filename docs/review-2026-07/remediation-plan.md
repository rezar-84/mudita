# Remediation plan — agent-ready tasks

Each task is self-contained: files to touch, the change, and acceptance criteria.
Do them top-to-bottom for the smoothest dependency order. After any code change run
`npx tsc --noEmit` and `npm run lint`.

Suggested sequencing:
- **Phase 1 (safe, high-impact, no funnel logic):** SEC-1, SEC-2, DEV-2, UX-1, PM-3.
- **Phase 2 (backend/funnel):** DEV-1, PM-1, PM-2.
- **Phase 3 (hardening/polish):** SEC-3, SEC-4, OPS-1, OPS-2, OPS-3, DEV-3, UX-2, DEV-4.

---

## Phase 1

### SEC-1 — Sanitize SVG at every trust boundary + harden the sanitizer 🔴
**Files:** `src/lib/svgSanitize.ts`, `src/lib/share.ts`,
`src/components/configurator/DesignerContext.tsx`, `src/lib/cart.ts`,
`src/routes/_authenticated/hesap.tasarimlar.tsx`, `src/routes/galeri.tsx`.

**Steps:**
1. Harden `sanitiseSvg`:
   - Add `style`, `use`, `foreignObject`, `image`, `script`, `animate*` to a hard
     denylist (drop node entirely; `use`/`foreignObject` are the dangerous ones).
   - Remove the `style` attribute from every element (add `"style"` to
     `DISALLOWED_ATTRS`).
   - Reject any attribute whose value matches `/url\s*\(/i` or `/expression\s*\(/i`.
2. Add a helper `sanitiseConfigDecorations(cfg)` (new export, e.g. in
   `svgSanitize.ts` or a small `src/lib/configSafety.ts`) that maps over
   `cfg.decorations` and, for any `source === "upload"` with `svgMarkup`, replaces
   it with `sanitiseSvg(svgMarkup)?.markup` (dropping the decoration if it returns
   null). Runs client-side only (guards `typeof window`).
3. Call it at **every** inbound boundary:
   - `decodeConfig()` result in `share.ts` (or at its call site in
     `DesignerContext.tsx:281`).
   - Cart item load in `DesignerContext.tsx` (`editCartId` branch) and in
     `sepet.tsx` render.
   - Saved-design load in `hesap.tasarimlar.tsx`.
   - Gallery config load in `galeri.tsx`.

**Acceptance:**
- A share link containing `<svg onload=...>` or `<svg><script>...` renders nothing
  executable (verify: craft a config, base64 it, load `/tasarla?d=...`, confirm no
  alert / no script node in DOM).
- `npx tsc --noEmit` clean; existing legit uploads still render.

### SEC-2 — Untrack `.env` 🟠
**Steps:**
1. `git rm --cached .env`
2. Add to `.gitignore`:
   ```
   .env
   .env.*
   !.env.example
   ```
3. Create `.env.example` with names only (no values):
   `SUPABASE_URL=`, `SUPABASE_PUBLISHABLE_KEY=`, `SUPABASE_PROJECT_ID=`,
   `VITE_SUPABASE_URL=`, `VITE_SUPABASE_PUBLISHABLE_KEY=`,
   `VITE_SUPABASE_PROJECT_ID=`, and a commented `# SUPABASE_SERVICE_ROLE_KEY=` note
   that it is server-only and must never be committed.
**Acceptance:** `git ls-files | grep .env` returns only `.env.example`.

### DEV-2 — Graceful cart fallbacks 🟡
**File:** `src/routes/sepet.tsx:187-188`.
**Change:** `FONTS.find(...) ?? FONTS[0]`, `COLORS.find(...) ?? COLORS[0]`.
**Acceptance:** A cart item whose config uses an unknown `fontId`/`colorId` renders
without throwing.

### UX-1 — Only block navigation when the design is dirty 🟠
**File:** `src/routes/tasarla.tsx`.
**Change:** Introduce a `dirty` boolean (compare current config to the initial /
last-saved config, or expose an `isDirty` from `DesignerContext`). Pass
`shouldBlock` = `dirty && nextLocation.pathname !== "/sepet"`. Only attach the
`beforeunload` listener while `dirty`.
**Acceptance:** Navigating away from an untouched designer does *not* prompt;
navigating away after an edit *does*.

### PM-3 — Centralize real contact info 🟠
**Files:** new `src/lib/contact.ts`; consumers `WhatsAppWidget.tsx`,
`iletisim.tsx`, `odeme.tsx`, `PriceSummary.tsx`.
**Change:** Export `CONTACT = { whatsappNumber, waMeBase, email, phoneDisplay, iban? }`.
Replace `905555555555` and every bare `https://wa.me/` with values from `CONTACT`.
**Note:** Real values must be supplied by the owner — leave a clearly-marked
`TODO(owner)` placeholder if unknown, but wire the single source of truth now.
**Acceptance:** No hardcoded phone/wa.me literals remain (grep
`905555555555|wa\.me/` returns only `contact.ts`).

---

## Phase 2

### DEV-1 — Recompute order prices server-side 🟠
**File:** `src/lib/orders.functions.ts` (`createOrder`).
**Change:**
1. Import `calculatePrice` from `@/lib/pricing` and the pricing overrides loader
   (`pricing.functions.ts`) — fetch the current `pricing_config` in the handler.
2. For each incoming item, recompute `expected = calculatePrice(item.config, overrides)`.
3. Reject (throw) if `Math.abs(expected.total - client price)` exceeds a small
   tolerance (e.g. > 2 TRY); otherwise persist the **server-computed** values, not
   the client's.
**Acceptance:** An order POST with a tampered low `price_try` is rejected; a
legitimate order still succeeds with prices matching `calculatePrice`.
**Dependency:** none, but pairs with PM-2(b).

### PM-1 — Make `/yukle` quote submissions real 🔴
**Files:** new migration `supabase/migrations/*_quote_requests.sql`; new
`src/lib/quotes.functions.ts`; `src/routes/yukle.tsx`; optionally
`src/lib/integrations/index.ts` (replace email stub).
**Steps:**
1. Migration: `quote_requests` table (`id`, `name`, `email`, `phone`, `size`,
   `usage`, `deadline`, `notes`, `file_path`, `created_at`, `status default 'new'`).
   RLS: anon INSERT allowed (with length/format checks like `design_events`);
   admin SELECT/UPDATE via `has_role`. Create a private Storage bucket `quotes`.
2. `submitQuoteRequest` server fn: Zod-validate (mirror the schema already in
   `yukle.tsx`), upload the file to the `quotes` bucket via `supabaseAdmin`, insert
   the row, and fire a notification (Resend email to owner, or a webhook — leave a
   `TODO(owner)` for the destination address/key).
3. `yukle.tsx`: call the server fn on submit; only `toast.success` on real success;
   show `toast.error` on failure.
4. Admin: add a minimal `/admin/quotes` list (optional, can be a follow-up) reading
   `quote_requests`.
**Acceptance:** Submitting the form creates a `quote_requests` row + a stored file,
and the owner is notified. A failed upload surfaces an error toast, not success.

### PM-2 — Resolve the checkout dead-end 🔴
**Decision required from owner** (pick one; default recommendation = A for v1):
- **Option A (manual/quote v1):** Remove the four fake "coming soon" provider cards
  in `odeme.tsx`. Make the WhatsApp + bank-transfer paths real using `CONTACT`
  (PM-3): prefill a wa.me message with the order id/total; show IBAN + reference.
  Reframe `sepet.tsx` CTA copy from "pay" to "place quote/reservation".
- **Option B (real payments):** Integrate iyzico or PayTR. Add a server fn that
  creates the checkout/token from the **server-recomputed** total (needs DEV-1),
  handle the callback, and set order `status` on success.
**Acceptance (A):** No fake provider cards; every checkout CTA reaches a working
channel with the order reference attached.
**Acceptance (B):** A test payment moves an order `pending → confirmed` via the
provider callback, using a server-trusted amount.

---

## Phase 3 (hardening & polish)

### SEC-3 — Generic client-facing errors 🟡
Wrap server-fn throws: log `error` server-side, throw a generic message; keep
"Not found"/"Forbidden" explicit. Files: all `*.functions.ts`.

### SEC-4 — Rate-limit / prune `design_events` 🟡
Add a scheduled prune (keep N days) and cap payload size in the RLS check.

### OPS-1 — Error monitoring 🟡
Add a reporter in the `src/router.tsx` error boundary + server-fn catch paths.

### OPS-2 — `robots.txt` + `sitemap.xml` 🟡
Serve `robots.txt` (allow public routes, disallow `/hesap`, `/admin`, `/auth`) and
a `sitemap.xml` covering `/ , /galeri , /sss , /hakkimizda , /iletisim , /tasarla ,
/yukle`.

### OPS-3 — Security headers / CSP 🟡
Add response headers (worker or a TanStack Start server middleware): CSP,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`X-Frame-Options: DENY`. Tune CSP to allow Supabase + Google Fonts origins.

### DEV-3 — Comment the auth authority 🟢
Comment at `assertAdmin` (`orders.functions.ts:97`) and above the route guards that
the server check is the security boundary; the client redirect is UX only.

### UX-2 — Server-persisted cart + login merge 🟢 (optional)
Persist cart for logged-in users; merge local → server on login.

### DEV-4 — Split `i18n.ts` if it keeps growing 🟢
Namespace-split when it exceeds comfort; not urgent.

---

## Verification checklist (run before marking a phase done)
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` clean
- [ ] `npm run build` succeeds
- [ ] For SEC-1: manual XSS probe via a crafted `?d=` link shows no execution
- [ ] For DEV-1/PM: tampered-price order rejected; happy path still works
</content>
