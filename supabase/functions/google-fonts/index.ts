import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Use the public Google Fonts metadata endpoint (no API key required)
const GOOGLE_FONTS_METADATA_URL = 'https://fonts.google.com/metadata/fonts';

interface FontMetadata {
  family: string;
  displayName?: string;
  category: string;
  size: number;
  subsets: string[];
  fonts: Record<string, {
    thickness: number;
    slant: number;
    width: number;
    lineHeight: number;
  }>;
  axes?: Array<{
    tag: string;
    min: number;
    max: number;
    defaultValue: number;
  }>;
  designers: string[];
  lastModified: string;
  dateAdded: string;
  popularity: number;
  trending: number;
  defaultSort: number;
  stroke?: string;
  classifications?: string[];
}

interface MetadataResponse {
  familyMetadataList: FontMetadata[];
  promotedScript?: unknown;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Support both query params and POST body
    let searchQuery = url.searchParams.get('search') || '';
    let category = url.searchParams.get('category') || '';
    let sort = url.searchParams.get('sort') || 'popularity';
    let limit = parseInt(url.searchParams.get('limit') || '0');
    
    // Override with body params if POST
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (body.search) searchQuery = body.search;
        if (body.category) category = body.category;
        if (body.sort) sort = body.sort;
        if (body.limit) limit = parseInt(body.limit);
      } catch {
        // Body parsing failed, use query params
      }
    }

    console.log(`Fetching Google Fonts - search: ${searchQuery}, category: ${category}, sort: ${sort}`);

    // Fetch from Google Fonts metadata endpoint (no API key required!)
    const response = await fetch(GOOGLE_FONTS_METADATA_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FontJoyStudio/1.0)',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Google Fonts metadata error: ${response.status}`);
    }

    const text = await response.text();
    // The response starts with ")]}'" which needs to be stripped
    const jsonText = text.replace(/^\)\]\}'/, '');
    const data: MetadataResponse = JSON.parse(jsonText);
    
    console.log(`Received ${data.familyMetadataList.length} fonts from Google Fonts metadata`);

    // Transform the data
    let fonts = data.familyMetadataList.map((font) => {
      // Extract weights from fonts object
      const weights = Object.keys(font.fonts)
        .filter(key => !key.includes('i')) // Exclude italic variants
        .map(key => parseInt(key) || 400)
        .filter(w => !isNaN(w))
        .sort((a, b) => a - b);

      // Map category to our format
      const categoryMap: Record<string, string> = {
        'Sans Serif': 'sans-serif',
        'Serif': 'serif',
        'Display': 'display',
        'Handwriting': 'handwriting',
        'Monospace': 'monospace',
      };

      // Create foundry slug from designer name
      const designer = font.designers[0] || 'Google Fonts';
      const foundrySlug = designer.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      return {
        family: font.family,
        category: (categoryMap[font.category] || font.category.toLowerCase()) as "sans-serif" | "serif" | "display" | "handwriting" | "monospace",
        weights: weights.length > 0 ? weights : [400],
        variants: Object.keys(font.fonts),
        subsets: font.subsets,
        version: 'v1',
        lastModified: font.lastModified,
        files: {},
        menu: `https://fonts.gstatic.com/s/${font.family.toLowerCase().replace(/\s+/g, '')}/v1/menu.woff2`,
        foundry: designer,
        foundrySlug: foundrySlug,
        legibility: (font.category === 'Display' || font.category === 'Handwriting') ? 'medium' : 'high' as "high" | "medium" | "low",
        popularity: font.popularity,
        trending: font.trending,
        dateAdded: font.dateAdded,
        designers: font.designers,
        classifications: font.classifications || [],
      };
    });

    // Sort first (before filtering for better results)
    switch (sort) {
      case 'alpha':
        fonts.sort((a, b) => a.family.localeCompare(b.family));
        break;
      case 'date':
        fonts.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'trending':
        fonts.sort((a, b) => a.trending - b.trending);
        break;
      case 'popularity':
      default:
        fonts.sort((a, b) => a.popularity - b.popularity);
        break;
    }

    const totalCount = fonts.length;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      fonts = fonts.filter(font => 
        font.family.toLowerCase().includes(query) ||
        font.foundry.toLowerCase().includes(query) ||
        font.designers.some(d => d.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      fonts = fonts.filter(font => font.category === category);
    }

    // Apply limit if specified
    if (limit > 0) {
      fonts = fonts.slice(0, limit);
    }

    console.log(`Returning ${fonts.length} fonts after filtering (total: ${totalCount})`);

    return new Response(JSON.stringify({ 
      fonts,
      total: totalCount,
      filtered: fonts.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching Google Fonts:', errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      fonts: [],
      total: 0,
      filtered: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
