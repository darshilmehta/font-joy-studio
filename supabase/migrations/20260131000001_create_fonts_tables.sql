-- Create fonts table to store Google Fonts catalog
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fonts_family ON public.fonts(family);
CREATE INDEX IF NOT EXISTS idx_fonts_category ON public.fonts(category);
CREATE INDEX IF NOT EXISTS idx_fonts_foundry_slug ON public.fonts(foundry_slug);
CREATE INDEX IF NOT EXISTS idx_fonts_popularity ON public.fonts(popularity);
CREATE INDEX IF NOT EXISTS idx_fonts_trending ON public.fonts(trending);
CREATE INDEX IF NOT EXISTS idx_fonts_date_added ON public.fonts(date_added);

-- Text search indexes for ILIKE queries
CREATE INDEX IF NOT EXISTS idx_fonts_family_lower ON public.fonts(LOWER(family));
CREATE INDEX IF NOT EXISTS idx_fonts_foundry_lower ON public.fonts(LOWER(foundry));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_fonts_updated_at
  BEFORE UPDATE ON public.fonts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.fonts
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update (for admin scripts)
CREATE POLICY "Allow authenticated insert/update" ON public.fonts
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create foundries table for designer/foundry metadata
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

-- Create index for foundries
CREATE INDEX IF NOT EXISTS idx_foundries_slug ON public.foundries(slug);
CREATE INDEX IF NOT EXISTS idx_foundries_name_lower ON public.foundries(LOWER(name));

-- Enable RLS for foundries
ALTER TABLE public.foundries ENABLE ROW LEVEL SECURITY;

-- Create policies for foundries
CREATE POLICY "Allow public read access" ON public.foundries
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert/update" ON public.foundries
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for foundries updated_at
CREATE TRIGGER update_foundries_updated_at
  BEFORE UPDATE ON public.foundries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
