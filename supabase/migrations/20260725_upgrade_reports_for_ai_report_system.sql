alter table public.reports
  add column if not exists marketplace text,
  add column if not exists report_json jsonb,
  add column if not exists confidence_score integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reports'
      and column_name = 'platform'
  ) then
    update public.reports
    set marketplace = coalesce(marketplace, platform)
    where marketplace is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reports'
      and column_name = 'report'
  ) then
    update public.reports
    set report_json = coalesce(report_json, report)
    where report_json is null;
  end if;
end $$;

alter table public.reports
  alter column marketplace set not null,
  alter column report_json set not null;

create index if not exists reports_user_marketplace_created_idx
  on public.reports(user_id, marketplace, created_at desc);

create or replace function public.set_reports_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_set_updated_at on public.reports;

create trigger reports_set_updated_at
before update on public.reports
for each row
execute function public.set_reports_updated_at();