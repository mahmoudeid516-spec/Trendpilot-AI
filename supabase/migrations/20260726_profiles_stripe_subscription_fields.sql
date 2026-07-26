alter table if exists public.profiles
  add column if not exists stripe_subscription_id text,
  add column if not exists current_period_start timestamptz,
  add column if not exists current_period_end timestamptz;

create index if not exists profiles_stripe_subscription_id_idx
  on public.profiles (stripe_subscription_id);
