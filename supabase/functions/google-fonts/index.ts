import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google Fonts API key - this is a public/publishable key
const GOOGLE_FONTS_API_KEY = 'AIzaSyAPQPYOphKjL9HNF9RtlgKVTzNBRqkEMsI';

interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
  version: string;
  lastModified: string;
  files: Record<string, string>;
  kind: string;
  menu: string;
}

interface GoogleFontsResponse {
  kind: string;
  items: GoogleFont[];
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

    console.log(`Fetching Google Fonts - search: ${searchQuery}, category: ${category}, sort: ${sort}`);

    // Fetch from Google Fonts API
    const apiUrl = `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=${sort}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Google Fonts API error: ${response.status}`);
    }

    const data: GoogleFontsResponse = await response.json();
    console.log(`Received ${data.items.length} fonts from Google Fonts API`);

    // Transform and filter the data
    let fonts = data.items.map((font) => {
      // Extract weights from variants
      const weights = font.variants
        .filter(v => !v.includes('italic'))
        .map(v => v === 'regular' ? 400 : parseInt(v))
        .filter(w => !isNaN(w))
        .sort((a, b) => a - b);

      // Create foundry slug from the font family (we'll enhance this later)
      const foundrySlug = font.family.toLowerCase().replace(/\s+/g, '-');

      return {
        family: font.family,
        category: font.category as "sans-serif" | "serif" | "display" | "handwriting" | "monospace",
        weights: weights.length > 0 ? weights : [400],
        variants: font.variants,
        subsets: font.subsets,
        version: font.version,
        lastModified: font.lastModified,
        files: font.files,
        menu: font.menu,
        foundry: "Google Fonts", // Default, will be enriched by metadata
        foundrySlug: foundrySlug,
        legibility: font.category === 'display' || font.category === 'handwriting' ? 'medium' : 'high' as "high" | "medium" | "low",
      };
    });

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      fonts = fonts.filter(font => 
        font.family.toLowerCase().includes(query)
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

    console.log(`Returning ${fonts.length} fonts after filtering`);

    return new Response(JSON.stringify({ 
      fonts,
      total: data.items.length,
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
