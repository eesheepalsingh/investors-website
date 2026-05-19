-- =============================================================
-- India Accelerator — Investor Portal: Supabase schema
-- Target schema: "investors-website"   (hyphenated → must be quoted)
--
-- Run this in: Supabase Dashboard → SQL Editor → New query
--
-- BEFORE running the app, also do:
--   Dashboard → Project Settings → API → "Exposed schemas"
--     → add:  investors-website
--   (PostgREST won't serve a schema that isn't in this list,
--    even with the service-role key.)
-- =============================================================

-- 1. Schema
CREATE SCHEMA IF NOT EXISTS "investors-website";

-- 2. Grants so anon / authenticated / service_role can reach it
GRANT USAGE ON SCHEMA "investors-website"
  TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA "investors-website"
  TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA "investors-website"
  TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA "investors-website"
  GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA "investors-website"
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 3. Tables
CREATE TABLE IF NOT EXISTS "investors-website".startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  sector TEXT,
  stage TEXT,
  revenue TEXT,               -- legacy: superseded by `metrics`; safe to leave NULL
  valuation TEXT,             -- legacy: superseded by `metrics`
  ask TEXT,                   -- legacy: superseded by `metrics`
  metrics TEXT,               -- markdown: user-authored bullet list of all metrics
  moat TEXT,                  -- markdown
  traction TEXT,              -- markdown
  description TEXT,           -- markdown (long-form company summary)
  investor_backers TEXT[],
  pitch_deck_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  calendly_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "investors-website".founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES "investors-website".startups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  linkedin_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS founders_startup_id_idx
  ON "investors-website".founders(startup_id);

CREATE INDEX IF NOT EXISTS startups_is_visible_idx
  ON "investors-website".startups(is_visible);

-- 4. Row Level Security
ALTER TABLE "investors-website".startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE "investors-website".founders ENABLE ROW LEVEL SECURITY;

-- Startups: public can read only visible rows
DROP POLICY IF EXISTS "Public can view visible startups"
  ON "investors-website".startups;
CREATE POLICY "Public can view visible startups"
  ON "investors-website".startups
  FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Admins full access startups"
  ON "investors-website".startups;
CREATE POLICY "Admins full access startups"
  ON "investors-website".startups
  FOR ALL USING (auth.role() = 'authenticated');

-- Founders: public can read all
DROP POLICY IF EXISTS "Public can view founders"
  ON "investors-website".founders;
CREATE POLICY "Public can view founders"
  ON "investors-website".founders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access founders"
  ON "investors-website".founders;
CREATE POLICY "Admins full access founders"
  ON "investors-website".founders
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================
-- Storage buckets (create via Dashboard → Storage → New bucket)
--   - logos              (Public)
--   - pitch-decks        (Public)
--   - founder-photos     (Public)
-- Writes go through the backend with the service-role key, so no
-- additional storage policies are required.
-- =============================================================
