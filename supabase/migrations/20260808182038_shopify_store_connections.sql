-- Per-user Shopify (and future provider) store connections.
--
-- This migration is fully independent of the products table's RLS
-- migration -- it does not touch the products table, its columns, or its
-- policies in any way.
--
-- Tokens are designed around Shopify's expiring offline-token model
-- (access token + refresh token, both with their own expiry), not the
-- legacy non-expiring offline token. Token values are stored encrypted
-- (see lib/services/tokenEncryption.ts) -- the columns below hold
-- ciphertext only, never plaintext secrets.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'store_connections'
  ) THEN
    EXECUTE '
      CREATE TABLE public.store_connections (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        provider text NOT NULL,
        shop_domain text,
        encrypted_access_token jsonb,
        access_token_expires_at timestamptz,
        encrypted_refresh_token jsonb,
        refresh_token_expires_at timestamptz,
        scope text,
        status text NOT NULL DEFAULT ''connected'',
        connected_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    ';
  END IF;

  -- Idempotent column guards, in case this migration is re-run against a
  -- table that already exists in a slightly different shape.
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'store_connections' AND column_name = 'access_token_expires_at'
  ) THEN
    EXECUTE 'ALTER TABLE public.store_connections ADD COLUMN access_token_expires_at timestamptz';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'store_connections' AND column_name = 'encrypted_refresh_token'
  ) THEN
    EXECUTE 'ALTER TABLE public.store_connections ADD COLUMN encrypted_refresh_token jsonb';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'store_connections' AND column_name = 'refresh_token_expires_at'
  ) THEN
    EXECUTE 'ALTER TABLE public.store_connections ADD COLUMN refresh_token_expires_at timestamptz';
  END IF;

  -- One connection per (user, provider, shop).
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'store_connections_user_provider_shop_key'
  ) THEN
    EXECUTE '
      CREATE UNIQUE INDEX store_connections_user_provider_shop_key
      ON public.store_connections (user_id, provider, shop_domain)
    ';
  END IF;

  EXECUTE 'CREATE INDEX IF NOT EXISTS idx_store_connections_user_id ON public.store_connections (user_id)';
  EXECUTE 'CREATE INDEX IF NOT EXISTS idx_store_connections_shop_domain ON public.store_connections (shop_domain)';

  -- RLS: identical pattern to products (user_id = auth.uid()), independent
  -- policies scoped to this table only.
  EXECUTE 'ALTER TABLE public.store_connections ENABLE ROW LEVEL SECURITY';

  EXECUTE 'DROP POLICY IF EXISTS store_connections_select_own ON public.store_connections';
  EXECUTE '
    CREATE POLICY store_connections_select_own ON public.store_connections
    FOR SELECT
    USING (user_id = auth.uid())
  ';

  EXECUTE 'DROP POLICY IF EXISTS store_connections_insert_own ON public.store_connections';
  EXECUTE '
    CREATE POLICY store_connections_insert_own ON public.store_connections
    FOR INSERT
    WITH CHECK (user_id = auth.uid())
  ';

  EXECUTE 'DROP POLICY IF EXISTS store_connections_update_own ON public.store_connections';
  EXECUTE '
    CREATE POLICY store_connections_update_own ON public.store_connections
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid())
  ';

  EXECUTE 'DROP POLICY IF EXISTS store_connections_delete_own ON public.store_connections';
  EXECUTE '
    CREATE POLICY store_connections_delete_own ON public.store_connections
    FOR DELETE
    USING (user_id = auth.uid())
  ';
END
$$;
