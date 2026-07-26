alter table if exists public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists subscription_id text,
  add column if not exists renewal_date timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false;

alter table if exists public.subscriptions
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create unique index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);

update public.usage_limits ul
set limit_count = 0,
    updated_at = now()
from public.plans p
where ul.plan_id = p.id
  and p.code = 'free-monthly'
  and ul.feature_key = 'export'
  and ul.period = 'day';

update public.plans
set monthly_search_limit = 5,
    monthly_report_limit = 3,
    updated_at = now()
where code = 'free-monthly';
