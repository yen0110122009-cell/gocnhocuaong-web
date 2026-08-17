-- GÓC HỌC TẬP CỦA ONG — Supabase baseline migration
-- Apply this file in Supabase SQL Editor or through the approved Supabase connector.
-- Supabase Auth owns passwords and reset flows; this schema never stores plaintext passwords.

begin;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'study_role') then
    create type public.study_role as enum ('Founder', 'Admin', 'Member');
  end if;
end
$$;

create table if not exists public.study_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  code text not null unique check (char_length(trim(code)) between 3 and 48),
  role public.study_role not null default 'Member',
  locked boolean not null default false,
  locked_at timestamptz,
  locked_reason text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((locked = false and locked_at is null) or (locked = true and locked_at is not null))
);

create unique index if not exists study_accounts_code_lower_key
  on public.study_accounts (lower(code));
create index if not exists study_accounts_active_role_idx
  on public.study_accounts (role, created_at desc)
  where deleted_at is null;

create table if not exists public.study_profiles (
  account_id uuid primary key references public.study_accounts(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  score integer not null default 0 check (score >= 0),
  level integer not null default 1 check (level >= 1),
  knowledge_map jsonb not null default '{}'::jsonb,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.study_accounts(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create index if not exists study_sessions_account_active_idx
  on public.study_sessions (account_id, expires_at desc)
  where revoked_at is null;

create table if not exists public.study_settings (
  key text primary key check (char_length(trim(key)) between 1 and 100),
  data jsonb not null default '{}'::jsonb,
  updated_by uuid references public.study_accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.piece_types (
  id text primary key check (char_length(trim(id)) between 1 and 96),
  name text not null check (char_length(trim(name)) between 1 and 120),
  ordinal integer not null unique check (ordinal >= 0),
  unit_value integer not null default 1 check (unit_value > 0),
  enabled boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists piece_types_visible_idx
  on public.piece_types (ordinal)
  where enabled = true and deleted_at is null;

create table if not exists public.user_pieces (
  account_id uuid not null references public.study_accounts(id) on delete cascade,
  piece_type_id text not null references public.piece_types(id) on delete restrict,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now(),
  primary key (account_id, piece_type_id)
);

create index if not exists user_pieces_account_idx
  on public.user_pieces (account_id, updated_at desc);

create table if not exists public.piece_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.study_accounts(id) on delete restrict,
  piece_type_id text not null references public.piece_types(id) on delete restrict,
  delta integer not null check (delta <> 0),
  kind text not null check (kind in ('award', 'adjustment', 'consume', 'reversal')),
  idempotency_key text not null check (char_length(trim(idempotency_key)) between 8 and 160),
  reference_type text,
  reference_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (account_id, idempotency_key)
);

create index if not exists piece_transactions_account_created_idx
  on public.piece_transactions (account_id, created_at desc);
create index if not exists piece_transactions_piece_type_created_idx
  on public.piece_transactions (piece_type_id, created_at desc);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_account_id uuid references public.study_accounts(id) on delete set null,
  target_account_id uuid references public.study_accounts(id) on delete set null,
  action text not null check (char_length(trim(action)) between 1 and 64),
  entity_type text not null check (char_length(trim(entity_type)) between 1 and 64),
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_target_created_idx
  on public.audit_logs (target_account_id, created_at desc);
create index if not exists audit_logs_entity_idx
  on public.audit_logs (entity_type, entity_id, created_at desc);

create table if not exists public.catalog_achievements (
  id text primary key check (char_length(trim(id)) between 1 and 96),
  rank integer not null check (rank > 0),
  rank_name text not null check (char_length(trim(rank_name)) between 1 and 80),
  icon text not null check (char_length(trim(icon)) between 1 and 32),
  name text not null check (char_length(trim(name)) between 1 and 180),
  description text not null,
  metric text not null check (char_length(trim(metric)) between 1 and 48),
  threshold integer not null check (threshold >= 0),
  reward_xp integer not null default 0 check (reward_xp >= 0),
  reward_fragments integer not null default 0 check (reward_fragments >= 0),
  title_id text,
  title_meaning text,
  difficulty text not null check (char_length(trim(difficulty)) between 1 and 32),
  badge_label text not null check (char_length(trim(badge_label)) between 1 and 120),
  encouragement text not null,
  animation text not null check (char_length(trim(animation)) between 1 and 32),
  enabled boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_achievements_rank_idx
  on public.catalog_achievements (rank, id)
  where enabled = true and deleted_at is null;
create index if not exists catalog_achievements_title_idx
  on public.catalog_achievements (title_id)
  where title_id is not null;

create table if not exists public.catalog_titles (
  id text primary key check (char_length(trim(id)) between 1 and 96),
  achievement_id text not null unique references public.catalog_achievements(id) on delete restrict,
  name text not null check (char_length(trim(name)) between 1 and 180),
  meaning text not null,
  enabled boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_titles_visible_idx
  on public.catalog_titles (name)
  where enabled = true and deleted_at is null;

create or replace function public.study_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists study_accounts_set_updated_at on public.study_accounts;
create trigger study_accounts_set_updated_at before update on public.study_accounts
for each row execute function public.study_set_updated_at();

drop trigger if exists study_profiles_set_updated_at on public.study_profiles;
create trigger study_profiles_set_updated_at before update on public.study_profiles
for each row execute function public.study_set_updated_at();

drop trigger if exists study_settings_set_updated_at on public.study_settings;
create trigger study_settings_set_updated_at before update on public.study_settings
for each row execute function public.study_set_updated_at();

drop trigger if exists piece_types_set_updated_at on public.piece_types;
create trigger piece_types_set_updated_at before update on public.piece_types
for each row execute function public.study_set_updated_at();

drop trigger if exists user_pieces_set_updated_at on public.user_pieces;
create trigger user_pieces_set_updated_at before update on public.user_pieces
for each row execute function public.study_set_updated_at();

drop trigger if exists catalog_achievements_set_updated_at on public.catalog_achievements;
create trigger catalog_achievements_set_updated_at before update on public.catalog_achievements
for each row execute function public.study_set_updated_at();

drop trigger if exists catalog_titles_set_updated_at on public.catalog_titles;
create trigger catalog_titles_set_updated_at before update on public.catalog_titles
for each row execute function public.study_set_updated_at();

-- Security definer helpers avoid RLS policy recursion. They run with a fixed search path.
create or replace function public.study_is_active_account()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select not locked and deleted_at is null
    from public.study_accounts
    where id = auth.uid()
  ), false);
$$;

create or replace function public.study_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select not locked
      and deleted_at is null
      and role in ('Founder'::public.study_role, 'Admin'::public.study_role)
    from public.study_accounts
    where id = auth.uid()
  ), false);
$$;

create or replace function public.study_is_founder()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select not locked and deleted_at is null and role = 'Founder'::public.study_role
    from public.study_accounts
    where id = auth.uid()
  ), false);
$$;

revoke all on function public.study_is_active_account() from public;
revoke all on function public.study_is_staff() from public;
revoke all on function public.study_is_founder() from public;
grant execute on function public.study_is_active_account() to authenticated;
grant execute on function public.study_is_staff() to authenticated;
grant execute on function public.study_is_founder() to authenticated;

-- Create a Member account and profile for every Supabase Auth user.
create or replace function public.handle_new_study_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  supplied_name text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'Học viên');
  supplied_code text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'study_code'), ''), 'ONG-' || upper(substr(replace(new.id::text, '-', ''), 1, 8)));
begin
  insert into public.study_accounts (id, display_name, code)
  values (new.id, left(supplied_name, 120), left(supplied_code, 48))
  on conflict (id) do nothing;

  insert into public.study_profiles (account_id)
  values (new.id)
  on conflict (account_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_study_account on auth.users;
create trigger on_auth_user_created_study_account
  after insert on auth.users
  for each row execute procedure public.handle_new_study_user();

alter table public.study_accounts enable row level security;
alter table public.study_profiles enable row level security;
alter table public.study_sessions enable row level security;
alter table public.study_settings enable row level security;
alter table public.piece_types enable row level security;
alter table public.user_pieces enable row level security;
alter table public.piece_transactions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.catalog_achievements enable row level security;
alter table public.catalog_titles enable row level security;

revoke all on public.study_accounts, public.study_profiles, public.study_sessions,
  public.study_settings, public.piece_types, public.user_pieces,
  public.piece_transactions, public.audit_logs, public.catalog_achievements,
  public.catalog_titles from anon, authenticated;

grant select on public.study_accounts, public.study_profiles, public.study_settings,
  public.piece_types, public.user_pieces, public.piece_transactions,
  public.audit_logs, public.catalog_achievements, public.catalog_titles to authenticated;
grant select on public.catalog_achievements, public.catalog_titles to anon;
grant insert (id, display_name, code) on public.study_accounts to authenticated;
grant update (display_name) on public.study_accounts to authenticated;
grant insert, update, delete on public.study_settings, public.piece_types,
  public.catalog_achievements, public.catalog_titles to authenticated;

drop policy if exists study_accounts_read_own_or_staff on public.study_accounts;
create policy study_accounts_read_own_or_staff on public.study_accounts
  for select to authenticated
  using (id = auth.uid() or public.study_is_staff());

drop policy if exists study_accounts_create_self on public.study_accounts;
create policy study_accounts_create_self on public.study_accounts
  for insert to authenticated
  with check (id = auth.uid() and role = 'Member'::public.study_role and locked = false and deleted_at is null);

drop policy if exists study_accounts_update_own_display_name on public.study_accounts;
create policy study_accounts_update_own_display_name on public.study_accounts
  for update to authenticated
  using (id = auth.uid() and locked = false and deleted_at is null)
  with check (id = auth.uid() and locked = false and deleted_at is null);

drop policy if exists study_profiles_read_own_or_staff on public.study_profiles;
create policy study_profiles_read_own_or_staff on public.study_profiles
  for select to authenticated
  using ((account_id = auth.uid() and public.study_is_active_account()) or public.study_is_staff());

drop policy if exists study_settings_read_authenticated on public.study_settings;
create policy study_settings_read_authenticated on public.study_settings
  for select to authenticated
  using (public.study_is_active_account());

drop policy if exists study_settings_manage_staff on public.study_settings;
create policy study_settings_manage_staff on public.study_settings
  for all to authenticated
  using (public.study_is_staff())
  with check (public.study_is_staff());

drop policy if exists piece_types_read_visible_or_staff on public.piece_types;
create policy piece_types_read_visible_or_staff on public.piece_types
  for select to authenticated
  using ((enabled = true and deleted_at is null and public.study_is_active_account()) or public.study_is_staff());

drop policy if exists piece_types_manage_staff on public.piece_types;
create policy piece_types_manage_staff on public.piece_types
  for all to authenticated
  using (public.study_is_staff())
  with check (public.study_is_staff());

drop policy if exists user_pieces_read_own_or_staff on public.user_pieces;
create policy user_pieces_read_own_or_staff on public.user_pieces
  for select to authenticated
  using ((account_id = auth.uid() and public.study_is_active_account()) or public.study_is_staff());

drop policy if exists piece_transactions_read_own_or_staff on public.piece_transactions;
create policy piece_transactions_read_own_or_staff on public.piece_transactions
  for select to authenticated
  using ((account_id = auth.uid() and public.study_is_active_account()) or public.study_is_staff());

drop policy if exists audit_logs_read_staff on public.audit_logs;
create policy audit_logs_read_staff on public.audit_logs
  for select to authenticated
  using (public.study_is_staff());

drop policy if exists catalog_achievements_read_public on public.catalog_achievements;
create policy catalog_achievements_read_public on public.catalog_achievements
  for select to anon, authenticated
  using (enabled = true and deleted_at is null);

drop policy if exists catalog_achievements_manage_staff on public.catalog_achievements;
create policy catalog_achievements_manage_staff on public.catalog_achievements
  for all to authenticated
  using (public.study_is_staff())
  with check (public.study_is_staff());

drop policy if exists catalog_titles_read_public on public.catalog_titles;
create policy catalog_titles_read_public on public.catalog_titles
  for select to anon, authenticated
  using (enabled = true and deleted_at is null);

drop policy if exists catalog_titles_manage_staff on public.catalog_titles;
create policy catalog_titles_manage_staff on public.catalog_titles
  for all to authenticated
  using (public.study_is_staff())
  with check (public.study_is_staff());

-- No browser policies are created for study_sessions, user_pieces writes,
-- piece_transactions writes, audit log writes, or study_profile writes.
-- Those sensitive mutations must execute only through a trusted backend or service role.

commit;

-- Founder bootstrap, run once after creating the founder in Supabase Auth:
-- update public.study_accounts set role = 'Founder' where id = '<founder-auth-user-uuid>';
