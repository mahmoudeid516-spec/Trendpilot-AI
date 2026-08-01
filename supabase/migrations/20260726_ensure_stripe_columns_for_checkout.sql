create extension if not exists "pgcrypto";

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  price_cents integer not null default 0,
  currency text not null default 'usd',
  interval text not null default 'month',
  monthly_report_limit integer null,
  monthly_search_limit integer null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null default 'inactive',
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null default now(),
  cancel_at_period_end boolean not null default false,
  stripe_customer_id text null,
  stripe_subscription_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_key text not null,
  usage_count integer not null default 0,
  period_start date not null,
  period_end date not null,
  metadata jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, feature_key, period_start, period_end)
);

create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  feature_key text not null,
  period text not null default 'day',
  limit_count integer null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, feature_key, period)
);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid null references public.subscriptions(id) on delete set null,
  event_type text not null,
  payload jsonb null,
  created_at timestamptz not null default now()
);

alter table if exists public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists current_period_start timestamptz,
  add column if not exists current_period_end timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists subscription_id text,
  add column if not exists renewal_date timestamptz;

alter table if exists public.subscriptions
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists subscriptions_user_active_idx
  on public.subscriptions(user_id)
  where status in ('trialing', 'active', 'past_due');

create unique index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);

create index if not exists profiles_stripe_subscription_id_idx
  on public.profiles (stripe_subscription_id);

create index if not exists billing_events_user_created_idx
  on public.billing_events(user_id, created_at desc);

insert into public.plans (code, name, price_cents, currency, interval, monthly_report_limit, monthly_search_limit)
values
  ('free-monthly', 'Free', 0, 'usd', 'month', 3, 5),
  ('pro-monthly', 'Pro', 4900, 'usd', 'month', null, null),
  ('premium-monthly', 'Premium', 9900, 'usd', 'month', null, null)
on conflict (code) do update set
  name = excluded.name,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  interval = excluded.interval,
  monthly_report_limit = excluded.monthly_report_limit,
  monthly_search_limit = excluded.monthly_search_limit,
  is_active = true,
  updated_at = now();

with seeded_plans as (
  select id, code
  from public.plans
)
insert into public.usage_limits (plan_id, feature_key, period, limit_count)
select seeded_plans.id, x.feature_key, 'day', x.limit_count
from seeded_plans
join lateral (
  values
    ('ai_search'::text, case when seeded_plans.code = 'free-monthly' then 5 else null end),
    ('ai_report'::text, case when seeded_plans.code = 'free-monthly' then 3 else null end),
    ('export'::text, case when seeded_plans.code = 'free-monthly' then 0 else null end)
) as x(feature_key, limit_count) on true
on conflict (plan_id, feature_key, period)
do update set
  limit_count = excluded.limit_count,
  updated_at = now();