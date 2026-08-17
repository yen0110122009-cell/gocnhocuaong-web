-- Allow more than one study account to use the special access code 111.
-- Identity remains protected by the authenticated account/user_id and credentials;
-- the application login matches code 111 together with the normalized account name.
drop index if exists public.study_accounts_account_code_lower_key;

create index if not exists study_accounts_account_code_lower_idx
  on public.study_accounts (lower(account_code));
