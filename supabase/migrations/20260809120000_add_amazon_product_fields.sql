-- Adds the Amazon Merchant fields the DataForSEO product-search pipeline now
-- produces (see lib/services/dataforseoProductSearch.ts and
-- lib/services/productPayload.ts) so they can be persisted instead of being
-- silently stripped by the app's schema-compatibility layer
-- (lib/services/supabaseCompatibility.ts).
--
-- NOT YET APPLIED to any live database as part of this change. The app-level
-- insert/upsert allow-list already includes these columns; if a given
-- database has not run this migration, insertWithCompatibility/
-- upsertWithCompatibility will detect the "column does not exist" error and
-- automatically drop the unsupported columns from the payload on retry, so
-- existing inserts keep working either way.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'products'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'asin'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN asin text';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'amazon_choice'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN amazon_choice boolean';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'best_seller'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN best_seller boolean';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'delivery_info'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN delivery_info text';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'price_to'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN price_to numeric';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'currency'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN currency text';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'store_rating'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN store_rating numeric';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'asin'
    ) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_products_asin ON public.products (asin)';
    END IF;
  END IF;
END
$$;
