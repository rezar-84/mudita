-- Admin CRM baseline: manually created leads and recoverable / waiting carts.
create table public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  source text not null default 'manual' check (source in ('manual', 'waiting_cart', 'order')),
  status text not null default 'new' check (status in ('new', 'contacted', 'waiting', 'won', 'lost')),
  name text,
  email text,
  phone text,
  cart_snapshot jsonb,
  estimated_total_try integer,
  note text,
  next_follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crm_leads_status_created_idx on public.crm_leads(status, created_at desc);
create index crm_leads_user_id_idx on public.crm_leads(user_id);
grant all on public.crm_leads to service_role;
grant select, insert, update on public.crm_leads to authenticated;
alter table public.crm_leads enable row level security;
create policy "Admins manage CRM leads" on public.crm_leads for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger crm_leads_updated before update on public.crm_leads for each row execute function public.set_updated_at();
