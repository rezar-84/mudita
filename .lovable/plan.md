
## Part A — Rebrand "Mudita" → "MudiNeon" (mudineon.com)

Sweep every user-facing "Mudita" / "Mudita Dekorasyon" string and replace with "MudiNeon". Domain references become `mudineon.com`.

Files touched (all strings only, no logic change):

- `src/routes/__root.tsx` — root `head()` title/description, og tags, canonical URL → `https://mudineon.com`.
- `src/routes/{index,tasarla,galeri,sepet,odeme,iletisim,hakkimizda,sss,yukle}.tsx` — per-route `head()` titles/descriptions/OG.
- `src/components/SiteLayout.tsx` — header/footer brand text & logo alt.
- `src/components/WhatsAppWidget.tsx` — greeting text.
- `src/components/configurator/{NeonPreview,PriceSummary,ConfiguratorPanel,FontSelector,DesignerContext}.tsx` — placeholders, watermark, default text layer ("Mudita" → "MudiNeon"), font previews.
- `src/components/designer/{EditorShell,EditorTopBar,ToolRail}.tsx` — labels/tooltips.
- `src/lib/i18n.ts` — every TR/EN string containing "Mudita".
- `src/lib/cart.ts` — any embedded brand copy.
- `README.md` — project title, links.

Default gallery share fallbacks and legacy `text` migration in `DesignerContext.migrateConfig` continue to work (only the visible default word changes).

## Part B — Auth, User Panel, Admin Panel

### B1. Enable Lovable Cloud

Turn on Cloud to get Postgres + Auth. Sign-in methods: Email/password + Google (defaults). Add a `/reset-password` route.

### B2. Data model (single migration)

```sql
-- roles
create type public.app_role as enum ('admin','customer');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique(user_id, role)
);
-- + GRANTs, RLS, has_role() security-definer fn (per user-roles rules)

-- profiles (display name, phone, address)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text, phone text, address jsonb,
  created_at timestamptz default now()
);

-- orders + items (customer sees own; admin sees all)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending', -- pending|confirmed|producing|shipped|delivered|cancelled
  subtotal_try int not null, shipping_try int not null, total_try int not null,
  contact jsonb, notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  config jsonb not null,          -- full NeonDesignConfig snapshot
  price_try int not null,
  breakdown jsonb not null        -- pricing line items snapshot
);

-- saved designs (user "My Designs")
create table public.saved_designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text, config jsonb not null, thumbnail_url text,
  created_at timestamptz default now()
);

-- gallery (admin-curated)
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null,
  text text, font_id text, color_id text,
  config jsonb,                    -- optional full snapshot
  image_url text, tags text[], published boolean default true,
  sort int default 0, created_at timestamptz default now()
);

-- pricing config (single row, editable by admin)
create table public.pricing_config (
  id int primary key default 1 check (id = 1),
  base_rate_per_cm2 numeric not null default 1.6,
  outdoor_mult numeric not null default 1.25,
  rgb_mult numeric not null default 1.35,
  urgent_mult numeric not null default 1.20,
  extra_line_fee int not null default 250,
  shipping_tr int not null default 250,
  adapter_prices jsonb not null default '{"tr":0,"eu":120}',
  decoration_preset_base int not null default 120,
  decoration_upload_base int not null default 250,
  fonts jsonb,      -- per-font complexity overrides {id: multiplier}
  colors jsonb,     -- per-color rgb flag overrides
  sizes jsonb,      -- preset dimensions overrides
  backboards jsonb, -- {id: {multiplier, flatAdd}}
  mountings jsonb,  -- {id: price}
  accessories jsonb,-- {dimmer: price, ...}
  updated_at timestamptz default now(), updated_by uuid
);
insert into public.pricing_config(id) values (1) on conflict do nothing;

-- analytics events (design activity)
create table public.design_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,        -- nullable (anon)
  session_id text,
  event text not null, -- 'design_started','font_selected','color_selected','decoration_added','added_to_cart','checkout_started','order_placed'
  payload jsonb,
  created_at timestamptz default now()
);
```

RLS summary:
- `profiles`, `saved_designs`, `orders`, `order_items`: owner-only for customers; admins full via `has_role(auth.uid(),'admin')`.
- `gallery_items`: public SELECT where `published=true`; admin write.
- `pricing_config`: public SELECT (read by pricing engine); admin update only.
- `design_events`: insert-any (public), select admin-only.
- All tables get correct `GRANT` statements per the public-schema-grants rule.

### B3. Auth wiring

- Add `src/routes/auth.tsx` (login/signup/reset) — public route; supports Google + email/password. Preserves `?next=` param.
- Integration-managed `src/routes/_authenticated/route.tsx` gates the subtree.
- Root `__root.tsx` adds `onAuthStateChange` (per tanstack-supabase-integration rules) and header user affordance (avatar menu when signed in, "Giriş" button when out).
- `SiteLayout` header gains a user menu: **My Designs**, **My Orders**, **Profile**, **Sign out**. If admin role → **Admin Panel** link.

### B4. User panel routes (under `_authenticated/hesap`)

- `/hesap` — dashboard overview (recent orders + saved designs).
- `/hesap/tasarimlar` — saved designs list; "Open in editor" loads config into `DesignerProvider`.
- `/hesap/siparisler` — order list + detail (status, items, breakdown snapshot).
- `/hesap/profil` — profile & address edit.

Add "Save design" button in `/tasarla` (visible when signed in; prompts login otherwise) → writes to `saved_designs`. Checkout flow inserts an order row on submit.

### B5. Admin panel routes (under `_authenticated/admin`, gated by `has_role='admin'`)

Pathless layout with `beforeLoad` calling a `requireAdmin` server fn (using `requireSupabaseAuth` + `has_role` RPC); redirects non-admins.

Sections:
- `/admin` — KPIs: signed-up users, orders by status, revenue (sum of `total_try`), top fonts/colors/sizes from `design_events` and `order_items` (SQL aggregations).
- `/admin/orders` — table with filter/status change (dropdown updates `orders.status`), detail view showing customer, contact, notes, per-item config + breakdown.
- `/admin/users` — list users (`auth.admin.listUsers` via `supabaseAdmin` server fn), promote/demote admin role.
- `/admin/gallery` — CRUD for `gallery_items` (title, slug, text/font/color, upload image or capture from designer snapshot, tags, publish toggle, sort).
- `/admin/pricing` — form editing every field of `pricing_config`, including nested JSON editors:
  - Sliders/inputs for `base_rate_per_cm2`, multipliers (outdoor/RGB/urgent), extra-line fee, shipping.
  - **Per-font complexity** grid (row per font in `FONTS`).
  - **Per-color** RGB flag.
  - **Sizes** editor (S/M/L width×height).
  - **Backboards** (multiplier + flatAdd per type).
  - **Mountings** & **accessories** prices.
  - **Adapter** prices (`tr`, `eu`).
  - **Decoration** base prices (preset/upload).
  - Save writes row 1 and cache-invalidates the pricing hook.
- `/admin/analytics` — design analysis: most-used fonts/colors/sizes, decoration usage, avg cart total, drop-off funnel from `design_events`.

### B6. Pricing engine refactor

- Introduce `getPricingConfig()` server fn (`createServerFn`, no auth) reading `pricing_config` row 1; cached via TanStack Query with 5 min stale.
- `src/lib/pricing.ts` `calculatePrice(cfg, pricing?)` takes optional `pricing` param; existing constants become defaults when `pricing` absent (preserves SSR/tests).
- `PriceSummary` and `MobilePriceBar` fetch pricing via `useQuery(['pricing'])` and pass to `calculatePrice`.
- Options (`src/data/options.ts`) are merged at runtime with overrides from `pricing_config` (fonts complexity, colors rgb, sizes dims, backboards, mountings, accessories) before display and pricing.

### B7. Event tracking

Add lightweight `trackEvent(event, payload)` (server fn insert into `design_events`) called from:
- Designer mount (`design_started`).
- Font/color/decoration change.
- Add-to-cart, checkout, order submit.

### B8. i18n

Add TR/EN keys for all new UI (auth, user panel, admin panel labels, table headers, empty states, toasts).

## Part C — Out of scope

- Payment gateway integration (iyzico/Stripe) — still in `Milestone 2` roadmap; admin panel receives the manually placed orders.
- Email notifications — later.
- Multi-tenant/multi-outlet regional pricing — "different outlets" is interpreted here as per-configuration (size, mounting, backboard, adapter) pricing rows editable in admin.

## Verification

1. Global grep: no remaining "Mudita" strings; `mudineon.com` appears in canonical + OG URLs.
2. Sign up → row appears in `auth.users`; profile auto-created via trigger.
3. Assigning admin role → `/admin/*` becomes reachable; non-admin gets redirected.
4. Change `base_rate_per_cm2` in admin → `/tasarla` price updates after query refetch.
5. Place order (from `/sepet`) while signed in → row in `orders` + `order_items`; visible in `/hesap/siparisler` and `/admin/orders`.
6. Add gallery item in admin → appears on `/galeri`; "Design similar" still applies text/font/color as base layer.
7. Design events populate; `/admin/analytics` shows top fonts/colors.
8. `bunx tsgo --noEmit` and build pass.
