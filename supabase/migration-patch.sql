-- =============================================================
-- PATCH for existing "investors-website" schema
-- Run this if you already ran migration.sql before 2026-05-19.
-- (Fresh installs: just run migration.sql — it already has these.)
--
-- What this does:
--   1. Rename short_description → description (longer rich text)
--   2. Add valuation, moat, traction columns
-- =============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'investors-website'
      AND table_name = 'startups'
      AND column_name = 'short_description'
  ) THEN
    ALTER TABLE "investors-website".startups
      RENAME COLUMN short_description TO description;
  END IF;
END $$;

ALTER TABLE "investors-website".startups
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS valuation TEXT,
  ADD COLUMN IF NOT EXISTS moat TEXT,
  ADD COLUMN IF NOT EXISTS traction TEXT,
  ADD COLUMN IF NOT EXISTS metrics TEXT,   -- markdown: user writes their own bullets (revenue / valuation / ask / anything)
  ADD COLUMN IF NOT EXISTS metrics_list JSONB DEFAULT '[]'::jsonb;  -- structured metrics: [{ label, value }, ...]
