# Supabase Schema Mismatch Report

Date: 2026-07-17

## Update — 2026-08-08: products.user_id ownership + RLS

`supabase/migrations/20260808172600_products_user_isolation.sql` adds a
`user_id uuid` column to `products` (`REFERENCES auth.users(id) ON DELETE
CASCADE`, `DEFAULT auth.uid()`), enables Row Level Security on the table,
and adds four policies restricting `SELECT`/`INSERT`/`UPDATE`/`DELETE` to
rows where `user_id = auth.uid()`.

Existing rows were **not** backfilled or reassigned — they keep
`user_id = NULL` and become permanently inaccessible through the app once
the policies are active (this was an explicit decision, not an oversight).
Only new rows, inserted by the app after this migration ships, are
reachable, since the app now sets `user_id` explicitly on every insert
(see `lib/services/saveProduct.ts`, `lib/importers/importProducts.ts`,
and `lib/services/productPayload.ts`'s `PRODUCT_INSERT_COLUMNS`).

Application code was also updated to filter `SELECT`/`DELETE`/`UPDATE`
calls by `user_id` explicitly, in addition to relying on RLS
(defense-in-depth).

Scope used:
- Application code references in `app/`, `lib/`, `services/`.
- Existing migration files in `supabase/migrations/`.

## Confirmed tables referenced by code

- `products`
- `profiles`

## Columns referenced by code

### products

- `id`
- `user_id` (added 2026-08-08; see update above)
- `name`
- `image`
- `platform`
- `category`
- `description`
- `buy_price`
- `selling_price`
- `profit`
- `ai_score`
- `trend_score`
- `supplier`
- `supplier_url`
- `product_url`
- `competition`
- `country`
- `recommendation`
- `pros`
- `cons`
- `success_probability`
- `trend_stage`
- `market_saturation`
- `difficulty`
- `marketing_json`
- `business_advisor`
- `created_at`
- `opportunity_score`

### profiles

- `id`
- `email`
- `full_name`
- `plan`
- `subscription_status`

## Migrations currently present

- `supabase/migrations/20260717112000_safe_indexes.sql` — guarded indexes only, does not define base table schemas.
- `supabase/migrations/20260808172600_products_user_isolation.sql` — adds `products.user_id` and RLS policies (see update above).

## Mismatch findings

1. No baseline migration exists for `products` and `profiles` table definitions in this repository.
2. Because base schema DDL is not present, repository-local verification cannot prove that all referenced columns exist in the live Supabase database.

## Action taken

- Write paths now report schema mismatch errors if a referenced payload column is missing in Supabase instead of silently dropping fields.
- 2026-08-08: `products.user_id` was added (see update above) — the only column added to date.