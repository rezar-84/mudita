
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Tighten permissive INSERT policies on design_events with a light payload check
drop policy if exists "Anyone can log events" on public.design_events;
drop policy if exists "Auth can log events" on public.design_events;
create policy "Anyone can log valid events" on public.design_events
  for insert to anon
  with check (event is not null and length(event) between 1 and 64);
create policy "Auth can log valid events" on public.design_events
  for insert to authenticated
  with check (event is not null and length(event) between 1 and 64);
