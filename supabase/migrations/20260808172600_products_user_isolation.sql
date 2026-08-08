-- Add per-user ownership to products and enforce Row Level Security so each
-- user can only see, insert, update, or delete their own products.
--
-- Existing rows are left untouched: user_id stays NULL for all pre-existing
-- rows (no backfill, no reassignment, no deletion). Once RLS is enabled
-- below, those NULL-owned rows become permanently unreachable through the
-- app for every user, including via the API -- this is the explicitly
-- chosen behavior, not a bug.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'products'
  ) THEN

    -- 1. Ownership column. Nullable, so existing rows are unaffected.
    --    DEFAULT auth.uid() is a safety net only (app code sets user_id
    --    explicitly on every insert; see productPayload.ts / saveProduct.ts).
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'user_id'
    ) THEN
      EXECUTE '
        ALTER TABLE public.products
        ADD COLUMN user_id uuid
        REFERENCES auth.users(id) ON DELETE CASCADE
        DEFAULT auth.uid()
      ';
    END IF;

    -- 2. Index for RLS + query performance.
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products (user_id)';

    -- 3. Enable RLS.
    EXECUTE 'ALTER TABLE public.products ENABLE ROW LEVEL SECURITY';

    -- 4. Policies. Postgres has no CREATE POLICY IF NOT EXISTS, so each is
    --    dropped first for idempotent re-runs.
    EXECUTE 'DROP POLICY IF EXISTS products_select_own ON public.products';
    EXECUTE '
      CREATE POLICY products_select_own ON public.products
      FOR SELECT
      USING (user_id = auth.uid())
    ';

    EXECUTE 'DROP POLICY IF EXISTS products_insert_own ON public.products';
    EXECUTE '
      CREATE POLICY products_insert_own ON public.products
      FOR INSERT
      WITH CHECK (user_id = auth.uid())
    ';

    EXECUTE 'DROP POLICY IF EXISTS products_update_own ON public.products';
    EXECUTE '
      CREATE POLICY products_update_own ON public.products
      FOR UPDATE
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid())
    ';

    EXECUTE 'DROP POLICY IF EXISTS products_delete_own ON public.products';
    EXECUTE '
      CREATE POLICY products_delete_own ON public.products
      FOR DELETE
      USING (user_id = auth.uid())
    ';

  END IF;
END
$$;
