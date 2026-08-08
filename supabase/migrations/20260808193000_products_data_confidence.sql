-- Adds provenance metadata to products so the UI can tell users, per row,
-- whether the acquisition price came from a real source (Amazon via
-- DataForSEO, or a connected Shopify store's own catalog) or was invented
-- by the AI Analyzer's OpenAI call. Every other derived figure (selling
-- price, profit, AI/trend/opportunity scores) is a heuristic estimate in
-- every pipeline this app has, so it doesn't need a per-row column -- the
-- UI labels those as estimates unconditionally.
--
-- Both columns are nullable and additive only. insertWithCompatibility()
-- (lib/services/supabaseCompatibility.ts) already drops any column the
-- live table doesn't recognize and retries, so older/un-migrated
-- databases keep working even before this migration is applied there.

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
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'data_source'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN data_source text';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'buy_price_confidence'
    ) THEN
      EXECUTE 'ALTER TABLE public.products ADD COLUMN buy_price_confidence text';
    END IF;

  END IF;
END
$$;
