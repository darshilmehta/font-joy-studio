-- Quick script to create empty tables (use this if migrations don't work)
-- Run with: psql <your_database_url> -f scripts/create-empty-tables.sql

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.fonts CASCADE;
DROP TABLE IF EXISTS public.foundries CASCADE;

-- Create fonts table
CREATE TABLE public.fonts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  weights INTEGER[] NOT NULL DEFAULT '{}',
  variants TEXT[] NOT NULL DEFAULT '{}',
  subsets TEXT[] NOT NULL DEFAULT '{}',
  version TEXT,
  last_modified TEXT,
  files JSONB DEFAULT '{}',
  menu_url TEXT,
  foundry TEXT,
  foundry_slug TEXT,
  legibility TEXT CHECK (legibility IN ('high', 'medium', 'low')),
  designers TEXT[] DEFAULT '{}',
  popularity INTEGER,
  trending INTEGER,
  date_added TEXT,
  classifications TEXT[] DEFAULT '{}',
  axes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create foundries table
CREATE TABLE public.foundries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  handle TEXT,
  bio TEXT,
  website TEXT,
  instagram TEXT,
  is_foundry BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_fonts_family ON public.fonts(family);
CREATE INDEX idx_fonts_category ON public.fonts(category);
CREATE INDEX idx_fonts_foundry_slug ON public.fonts(foundry_slug);
CREATE INDEX idx_fonts_popularity ON public.fonts(popularity);
CREATE INDEX idx_fonts_trending ON public.fonts(trending);
CREATE INDEX idx_fonts_date_added ON public.fonts(date_added);
CREATE INDEX idx_fonts_family_lower ON public.fonts(LOWER(family));
CREATE INDEX idx_fonts_foundry_lower ON public.fonts(LOWER(foundry));
CREATE INDEX idx_foundries_slug ON public.foundries(slug);
CREATE INDEX idx_foundries_name_lower ON public.foundries(LOWER(name));

-- Enable RLS
ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.fonts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert/update" ON public.fonts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access" ON public.foundries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert/update" ON public.foundries FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_fonts_updated_at BEFORE UPDATE ON public.fonts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_foundries_updated_at BEFORE UPDATE ON public.foundries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.fonts TO anon;
GRANT SELECT ON public.foundries TO anon;
GRANT ALL ON public.fonts TO authenticated;
GRANT ALL ON public.foundries TO authenticated;
