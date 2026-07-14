-- Hardening design_events table: cap payload size in RLS insert checks.
drop policy if exists "Anyone can log valid events" on public.design_events;
drop policy if exists "Auth can log valid events" on public.design_events;

create policy "Anyone can log valid events" on public.design_events
  for insert to anon
  with check (
    event is not null 
    and length(event) between 1 and 64
    and (payload is null or octet_length(payload::text) <= 2048)
  );

create policy "Auth can log valid events" on public.design_events
  for insert to authenticated
  with check (
    event is not null 
    and length(event) between 1 and 64
    and (payload is null or octet_length(payload::text) <= 2048)
  );

-- Enable pg_cron if not already done
create extension if not exists pg_cron;

-- Prune design_events older than 30 days daily
select cron.schedule(
  'prune-design-events',
  '0 2 * * *', -- Everyday at 2 AM
  $$delete from public.design_events where created_at < now() - interval '30 days'$$
);
