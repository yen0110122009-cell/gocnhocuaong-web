-- Prepare an isolated, per-auth-user sync table for the next Supabase Realtime rollout.
-- This migration is intentionally additive: it does not read, rewrite, or delete public.app_state.

create table if not exists public.profile_sync_state (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  revision bigint not null default 0 check (revision >= 0),
  client_updated_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint profile_sync_state_profile_object check (jsonb_typeof(profile) = 'object')
);

create or replace function public.set_profile_sync_state_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profile_sync_state_set_updated_at on public.profile_sync_state;
create trigger profile_sync_state_set_updated_at
before update on public.profile_sync_state
for each row execute function public.set_profile_sync_state_updated_at();

alter table public.profile_sync_state enable row level security;

grant select, insert, update, delete on public.profile_sync_state to authenticated;

 drop policy if exists profile_sync_state_owner_select on public.profile_sync_state;
create policy profile_sync_state_owner_select
on public.profile_sync_state
for select
to authenticated
using ((select auth.uid()) = auth_user_id);

drop policy if exists profile_sync_state_owner_insert on public.profile_sync_state;
create policy profile_sync_state_owner_insert
on public.profile_sync_state
for insert
to authenticated
with check ((select auth.uid()) = auth_user_id);

drop policy if exists profile_sync_state_owner_update on public.profile_sync_state;
create policy profile_sync_state_owner_update
on public.profile_sync_state
for update
to authenticated
using ((select auth.uid()) = auth_user_id)
with check ((select auth.uid()) = auth_user_id);

drop policy if exists profile_sync_state_owner_delete on public.profile_sync_state;
create policy profile_sync_state_owner_delete
on public.profile_sync_state
for delete
to authenticated
using ((select auth.uid()) = auth_user_id);

-- Add the table to Realtime when the standard publication exists.
-- Realtime remains locked down by the RLS policies above until a Supabase Auth session is used.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'profile_sync_state'
     ) then
    execute 'alter publication supabase_realtime add table public.profile_sync_state';
  end if;
end
$$;
