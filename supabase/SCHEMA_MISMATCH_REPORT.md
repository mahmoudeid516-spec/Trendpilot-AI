# Supabase Schema Mismatch Report

Date: 2026-07-17

Scope used:
- Application code references in `app/`, `lib/`, `services/`.
- Existing migration files in `supabase/migrations/`.

## Confirmed tables referenced by code

- `products`
- `profiles`

## Columns referenced by code

### products

- `id`
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

- `supabase/migrations/20260717112000_safe_indexes.sql`

This migration only adds guarded indexes and does not define base table schemas.

## Mismatch findings

1. No baseline migration exists for `products` and `profiles` table definitions in this repository.
2. Because base schema DDL is not present, repository-local verification cannot prove that all referenced columns exist in the live Supabase database.

## Action taken

- Write paths now report schema mismatch errors if a referenced payload column is missing in Supabase instead of silently dropping fields.
- No new tables or columns were added.