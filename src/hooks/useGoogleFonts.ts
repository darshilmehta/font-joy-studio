import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GoogleFontData {
  family: string;
  category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
  weights: number[];
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  menu: string;
  foundry: string;
  foundrySlug: string;
  legibility: "high" | "medium" | "low";
  designers?: string[];
  popularity?: number;
  trending?: number;
  dateAdded?: string;
  classifications?: string[];
}

interface GoogleFontsResponse {
  fonts: GoogleFontData[];
  total: number;
  filtered: number;
  error?: string;
}

interface UseGoogleFontsOptions {
  search?: string;
  category?: string;
  sort?: "alpha" | "popularity" | "date" | "style" | "trending";
  limit?: number;
  enabled?: boolean;
}

export function useGoogleFonts(options: UseGoogleFontsOptions = {}) {
  const {
    search = "",
    category = "",
    sort = "popularity",
    limit = 0,
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ["google-fonts", search, category, sort, limit],
    queryFn: async (): Promise<GoogleFontsResponse> => {
      // Build query
      let query = supabase.from("fonts").select("*", { count: "exact" });

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        query = query.or(
          `family.ilike.%${searchLower}%,foundry.ilike.%${searchLower}%`,
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
        console.error("Error fetching fonts:", error);
        return { fonts: [], total: 0, filtered: 0 };
      }

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

      return {
        fonts: transformedFonts,
        total: count || 0,
        filtered: transformedFonts.length,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });
}

export function useSearchFonts(searchQuery: string) {
  return useGoogleFonts({
    search: searchQuery,
    enabled: searchQuery.length > 0,
  });
}

export function useAllFonts() {
  return useGoogleFonts({
    sort: "popularity",
  });
}

export function useFontsByDesigner(designerSlug: string) {
  const { data, isLoading, error } = useGoogleFonts({
    enabled: designerSlug.length > 0,
  });

  // Filter fonts by designer slug
  const fonts = useMemo(() => {
    if (!data?.fonts) return [];
    return data.fonts.filter((font) => {
      // Check if foundrySlug matches
      if (font.foundrySlug === designerSlug) return true;
      // Check if any designer slug matches
      return font.designers?.some((d) => {
        const slug = d
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        return slug === designerSlug;
      });
    });
  }, [data?.fonts, designerSlug]);

  // Get designer name from first matching font
  const designerName = useMemo(() => {
    if (fonts.length === 0) return null;
    const font = fonts[0];
    // Find matching designer name
    const matchingDesigner = font.designers?.find((d) => {
      const slug = d
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      return slug === designerSlug;
    });
    return matchingDesigner || font.foundry;
  }, [fonts, designerSlug]);

  return { fonts, designerName, isLoading, error };
}
