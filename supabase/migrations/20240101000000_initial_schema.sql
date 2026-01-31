-- Initial database schema for Font Joy Studio
-- Creates fonts and foundries tables with all necessary indexes, RLS policies, and triggers

-- Create fonts table
CREATE TABLE IF NOT EXISTS public.fonts (
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
CREATE TABLE IF NOT EXISTS public.foundries (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fonts_family ON public.fonts(family);
CREATE INDEX IF NOT EXISTS idx_fonts_category ON public.fonts(category);
CREATE INDEX IF NOT EXISTS idx_fonts_foundry_slug ON public.fonts(foundry_slug);
CREATE INDEX IF NOT EXISTS idx_fonts_popularity ON public.fonts(popularity);
CREATE INDEX IF NOT EXISTS idx_fonts_trending ON public.fonts(trending);
CREATE INDEX IF NOT EXISTS idx_fonts_date_added ON public.fonts(date_added);
CREATE INDEX IF NOT EXISTS idx_fonts_family_lower ON public.fonts(LOWER(family));
CREATE INDEX IF NOT EXISTS idx_fonts_foundry_lower ON public.fonts(LOWER(foundry));
CREATE INDEX IF NOT EXISTS idx_foundries_slug ON public.foundries(slug);
CREATE INDEX IF NOT EXISTS idx_foundries_name_lower ON public.foundries(LOWER(name));

-- Enable Row Level Security
ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY IF NOT EXISTS "Allow public read access to fonts" 
  ON public.fonts FOR SELECT 
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to modify fonts" 
  ON public.fonts FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow public read access to foundries" 
  ON public.foundries FOR SELECT 
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to modify foundries" 
  ON public.foundries FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- Create update trigger function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
DROP TRIGGER IF EXISTS update_fonts_updated_at ON public.fonts;
CREATE TRIGGER update_fonts_updated_at 
  BEFORE UPDATE ON public.fonts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_foundries_updated_at ON public.foundries;
CREATE TRIGGER update_foundries_updated_at 
  BEFORE UPDATE ON public.foundries 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.fonts TO anon;
GRANT SELECT ON public.foundries TO anon;
GRANT ALL ON public.fonts TO authenticated;
GRANT ALL ON public.foundries TO authenticated;
