-- Backward-compatible performance indexes for existing columns used by the app.
-- This migration does not add or rename columns.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'products'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'created_at'
    ) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC)';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'platform'
    ) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_products_platform ON public.products (platform)';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'name'
    ) AND EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'platform'
    ) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_products_platform_name ON public.products (platform, name)';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'category'
    ) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category)';
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'subscription_status'
    ) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles (subscription_status)';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'plan'
    ) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles (plan)';
    END IF;
  END IF;
END
$$;