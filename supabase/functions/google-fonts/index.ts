import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    let searchQuery = url.searchParams.get("search") || "";
    let category = url.searchParams.get("category") || "";
    let sort = url.searchParams.get("sort") || "popularity";
    let limit = parseInt(url.searchParams.get("limit") || "0");

    if (req.method === "POST") {
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

    console.log(
      `Querying fonts - search: ${searchQuery}, category: ${category}, sort: ${sort}, limit: ${limit}`,
    );

    // Build query
    let query = supabase.from("fonts").select("*");

    // Apply search filter using full-text search or ILIKE
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      query = query.or(
        `family.ilike.%${searchLower}%,foundry.ilike.%${searchLower}%,designers.cs.{${searchQuery}}`,
      );
    }

    // Apply category filter
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    // Apply sorting
    switch (sort) {
      case "alpha":
        query = query.order("family", { ascending: true });
        break;
      case "date":
        query = query.order("date_added", { ascending: false });
        break;
      case "trending":
        query = query.order("trending", { ascending: true });
        break;
      case "popularity":
      default:
        query = query.order("popularity", { ascending: true });
        break;
    }

    // Apply limit
    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data: fonts, error, count } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Get total count for stats
    const { count: totalCount } = await supabase
      .from("fonts")
      .select("*", { count: "exact", head: true });

    // Transform database format to API format
    const transformedFonts = (fonts || []).map((font: any) => ({
      family: font.family,
      category: font.category,
      weights: font.weights,
      variants: font.variants,
      subsets: font.subsets,
      version: font.version,
      lastModified: font.last_modified,
      files: font.files,
      menu: font.menu_url,
      foundry: font.foundry,
      foundrySlug: font.foundry_slug,
      legibility: font.legibility,
      designers: font.designers,
      popularity: font.popularity,
      trending: font.trending,
      dateAdded: font.date_added,
      classifications: font.classifications,
    }));

    console.log(
      `Returning ${transformedFonts.length} fonts (total in DB: ${totalCount})`,
    );

    return new Response(
      JSON.stringify({
        fonts: transformedFonts,
        total: totalCount || 0,
        filtered: transformedFonts.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching fonts:", errorMessage);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        fonts: [],
        total: 0,
        filtered: 0,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
