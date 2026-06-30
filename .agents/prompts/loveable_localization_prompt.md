# Loveable Prompt: Fix Localization Issues & Standards

Copy and paste the prompt below into the Loveable.dev chat window to automatically audit the codebase, fix hardcoded text, and align the translation setup with standard i18n practices.

---

## Copy-Paste Prompt for Loveable.dev

```text
Please audit the codebase to identify, extract, and fix any hardcoded Turkish or English user-facing text strings, and refactor them to use our centralized i18n system.

Here are the requirements for this task:

1. Centralized i18n File:
   - All translations must live in `src/lib/i18n.ts`.
   - Ensure the `Dict` types and dictionary objects (`tr` and `en`) are perfectly synchronized. Every key present in `tr` must also exist in `en` (and vice-versa).

2. Component & Route Scan:
   - Scan all route files in `src/routes/` (e.g. `index.tsx`, `tasarla.tsx`, `galeri.tsx`, `iletisim.tsx`, `sss.tsx`, `sepet.tsx`, `odeme.tsx`, `yukle.tsx`, `hakkimizda.tsx`).
   - Scan components in `src/components/` (specifically `designer/` and `configurator/` subfolders).
   - Find any hardcoded text inside buttons, placeholders, dialog messages, form validation messages, or overlays and replace them with the `t('key')` function or `useT()` hook.

3. Static & Dynamic Data:
   - Check if any arrays or objects defined in `src/data/` contain raw Turkish/English strings that should be localized dynamically based on the current locale (e.g., `src/data/decorations.ts`, `src/data/options.ts`).
   - Ensure these configurations support localization keys instead of raw text.

4. Formatting & Pluralization:
   - For currency values, ensure we correctly suffix/prefix based on the language (e.g., "₺100" or "100 TRY" vs "100 TL").
   - Double-check dates and number representations.

5. Code Integrity:
   - Run a dry build or linting check after updates to ensure no TypeScript compilation errors (especially concerning matching keys in `TKey` type definitions).
```
