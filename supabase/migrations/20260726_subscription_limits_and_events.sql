create extension if not exists "pgcrypto";

create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  feature_key text not null check (feature_key in ('ai_search', 'ai_report', 'export')),
  period text not null default 'day' check (period in ('day', 'month')),
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

create index if not exists billing_events_user_created_idx
  on public.billing_events(user_id, created_at desc);

alter table public.usage_limits enable row level security;
alter table public.billing_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'usage_limits'
      and policyname = 'usage_limits_select_all'
  ) then
    create policy usage_limits_select_all
      on public.usage_limits
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'billing_events'
      and policyname = 'billing_events_select_own'
  ) then
    create policy billing_events_select_own
      on public.billing_events
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

create or replace function public.set_usage_limits_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists usage_limits_set_updated_at on public.usage_limits;

create trigger usage_limits_set_updated_at
before update on public.usage_limits
for each row
execute function public.set_usage_limits_updated_at();

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
    ('export'::text, case when seeded_plans.code = 'free-monthly' then 3 else null end)
) as x(feature_key, limit_count) on true
on conflict (plan_id, feature_key, period)
do update set
  limit_count = excluded.limit_count,
  updated_at = now();
