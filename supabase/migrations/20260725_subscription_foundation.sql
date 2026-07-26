create extension if not exists "pgcrypto";

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null check (name in ('Free', 'Pro', 'Premium')),
  price_cents integer not null default 0,
  currency text not null default 'usd',
  interval text not null default 'month' check (interval in ('month', 'year')),
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
  status text not null default 'inactive' check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'inactive')),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null default now(),
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscriptions_user_active_idx
  on public.subscriptions(user_id)
  where status in ('trialing', 'active', 'past_due');

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

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_tracking enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'plans' and policyname = 'plans_select_all') then
    create policy plans_select_all
      on public.plans
      for select
      using (is_active = true);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'subscriptions' and policyname = 'subscriptions_select_own') then
    create policy subscriptions_select_own
      on public.subscriptions
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'usage_tracking' and policyname = 'usage_tracking_select_own') then
    create policy usage_tracking_select_own
      on public.usage_tracking
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

insert into public.plans (code, name, price_cents, currency, interval, monthly_report_limit, monthly_search_limit)
values
  ('free-monthly', 'Free', 0, 'usd', 'month', 5, 50),
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
