## Two parts

### Part A — Dashboard steps (you do these)

1. **Save your Google credentials in Lovable Cloud**
   - Open Cloud Dashboard → **Users → Authentication Settings → Sign In Methods → Google**
   - Paste **Client ID**: `93725082759-rh43rsplf2frmdptjmids5e7d38t13q8.apps.googleusercontent.com`
   - Paste **Client Secret**: (currently `GOCSPX-ZQBt...` — but see step 2)
   - Save.

2. **Rotate the leaked secret** (you pasted it in chat)
   - Google Cloud Console → Credentials → your OAuth client → **Reset secret**
   - Copy the new value → paste into the same Cloud dashboard Google provider → Save again.

3. **Verify the OAuth consent screen** in Google Cloud shows:
   - App name: MudiNeon
   - Logo uploaded
   - Authorized domains: `mudineon.com`, `lovable.app`

No project secrets need to be added — Cloud's Google provider stores those values internally. `GOOGLE_OAUTH_CLIENT_ID` currently in your project secrets is unused by auth and can be deleted later if you want.

### Part B — Add a proper `/auth/callback` route

**Why:** Today the Google button uses `redirect_uri: window.location.origin` and any "return to where I was" state is lost. A dedicated callback route hydrates the Supabase session, then routes the user to the page they originally wanted.

**Changes**

1. **New route `src/routes/auth.callback.tsx`** (public, no auth gate)
   - On mount:
     - Read `next` from URL search params (fallback `/`).
     - Sanitize: only accept a same-origin relative path starting with `/` and not with `//`; otherwise use `/`.
     - Wait for a session via `supabase.auth.getSession()` and, if absent, subscribe to `onAuthStateChange` for a `SIGNED_IN` event (with a 10s timeout).
     - On success: `navigate({ to: sanitizedNext, replace: true })`.
     - On timeout/error: navigate to `/auth?error=callback` with a toast.
   - Render a centered spinner + "Signing you in…" message with i18n keys.
   - Includes `head()` with `robots: noindex` and a generic title.

2. **Update Google sign-in call site** in `src/routes/auth.tsx`
   - Before calling `lovable.auth.signInWithOAuth`, read the current `next` query param (validated same-origin relative path).
   - Pass `redirect_uri: \`${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}\``.
   - Keep email/password sign-in unchanged, but after successful sign-in navigate to the same sanitized `next`.

3. **Update sign-in redirects across the app** so redirect-back is preserved:
   - `src/routes/_authenticated/route.tsx` (integration-managed — do NOT edit) already redirects to `/auth`. It doesn't pass `next`. To preserve intent without touching the managed layout, add a small `useEffect` in `src/routes/auth.tsx` that reads `document.referrer` OR — simpler — read `location.state`/search on the auth page and forward any `next` param it received. Since the managed layout can't be edited, we accept that only OAuth flows that pass through the sign-in button carry `next`; hard-refresh redirects still land on `/`.
   - Add a `next` search param to the header "Sign in" link when we can (`SiteLayout.tsx`): `<Link to="/auth" search={{ next: currentPath }}>`.

4. **i18n keys** in `src/lib/i18n.ts`:
   - `authCallbackTitle` — "Signing you in…" / "Giriş yapılıyor…"
   - `authCallbackError` — error toast text

**Sanitizer helper** (inline in the callback route):
```ts
function safeNext(raw: string | undefined): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}
```

**Files touched**
- new: `src/routes/auth.callback.tsx`
- edit: `src/routes/auth.tsx` (Google button + post-signin navigate)
- edit: `src/components/SiteLayout.tsx` (Sign-in link forwards `next`)
- edit: `src/lib/i18n.ts` (2 new keys × 2 locales)

**Out of scope**
- No database migrations.
- No changes to the managed `_authenticated/route.tsx`.
- No changes to `src/integrations/supabase/*` (auto-generated).

**Reminder after Part B ships:** the callback URL `https://<domain>/auth/callback` is same-origin, so no new entries in Google Cloud "Authorized redirect URIs" are needed — Google still only redirects to `https://qnrvdaobmxgzdzvkagiz.supabase.co/auth/v1/callback`.
