
-- =========================================================================
-- Roles
-- =========================================================================
create type public.app_role as enum ('admin','customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Profiles
-- =========================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + customer role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'customer')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- Orders + order items
-- =========================================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  subtotal_try integer not null default 0,
  shipping_try integer not null default 0,
  total_try integer not null default 0,
  contact jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;

create policy "Users view own orders" on public.orders
  for select to authenticated using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Admins view all orders" on public.orders
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update all orders" on public.orders
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  config jsonb not null,
  price_try integer not null,
  breakdown jsonb not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;

create policy "Users view own order items" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "Users insert own order items" on public.order_items
  for insert to authenticated with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "Admins view all order items" on public.order_items
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Saved designs
-- =========================================================================
create table public.saved_designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  config jsonb not null,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.saved_designs to authenticated;
grant all on public.saved_designs to service_role;
alter table public.saved_designs enable row level security;

create policy "Users manage own designs" on public.saved_designs
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- Gallery items (admin curated)
-- =========================================================================
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  text text,
  font_id text,
  color_id text,
  config jsonb,
  image_url text,
  tags text[] default '{}',
  published boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.gallery_items to anon;
grant select on public.gallery_items to authenticated;
grant all on public.gallery_items to service_role;
alter table public.gallery_items enable row level security;

create policy "Anyone views published gallery" on public.gallery_items
  for select to anon using (published = true);
create policy "Anyone auth views published gallery" on public.gallery_items
  for select to authenticated using (published = true);
create policy "Admins view all gallery" on public.gallery_items
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage gallery" on public.gallery_items
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Pricing config (single row)
-- =========================================================================
create table public.pricing_config (
  id integer primary key default 1,
  base_rate_per_cm2 numeric not null default 1.6,
  outdoor_mult numeric not null default 1.25,
  rgb_mult numeric not null default 1.35,
  urgent_mult numeric not null default 1.20,
  extra_line_fee integer not null default 250,
  shipping_tr integer not null default 250,
  adapter_prices jsonb not null default '{"tr":0,"eu":120}'::jsonb,
  decoration_preset_base integer not null default 120,
  decoration_upload_base integer not null default 250,
  fonts jsonb,
  colors jsonb,
  sizes jsonb,
  backboards jsonb,
  mountings jsonb,
  accessories jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  constraint pricing_singleton check (id = 1)
);
grant select on public.pricing_config to anon;
grant select on public.pricing_config to authenticated;
grant all on public.pricing_config to service_role;
alter table public.pricing_config enable row level security;

create policy "Anyone reads pricing" on public.pricing_config
  for select to anon using (true);
create policy "Anyone auth reads pricing" on public.pricing_config
  for select to authenticated using (true);
create policy "Admins update pricing" on public.pricing_config
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins insert pricing" on public.pricing_config
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

insert into public.pricing_config (id) values (1) on conflict do nothing;

-- =========================================================================
-- Design events (analytics)
-- =========================================================================
create table public.design_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  session_id text,
  event text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);
grant insert on public.design_events to anon;
grant insert on public.design_events to authenticated;
grant all on public.design_events to service_role;
alter table public.design_events enable row level security;

create policy "Anyone can log events" on public.design_events
  for insert to anon with check (true);
create policy "Auth can log events" on public.design_events
  for insert to authenticated with check (true);
create policy "Admins view events" on public.design_events
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- updated_at trigger helper
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger orders_updated before update on public.orders for each row execute function public.set_updated_at();
create trigger saved_designs_updated before update on public.saved_designs for each row execute function public.set_updated_at();
create trigger gallery_items_updated before update on public.gallery_items for each row execute function public.set_updated_at();
create trigger pricing_config_updated before update on public.pricing_config for each row execute function public.set_updated_at();
