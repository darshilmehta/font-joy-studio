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
  const { search = "", category = "", sort = "popularity", limit = 0, enabled = true } = options;

  return useQuery({
    queryKey: ["google-fonts", search, category, sort, limit],
    queryFn: async (): Promise<GoogleFontsResponse> => {
      // Use supabase.functions.invoke with query params in body
      const { data, error } = await supabase.functions.invoke("google-fonts", {
        body: { search, category, sort, limit },
      });

      if (error) {
        console.error("Error fetching fonts:", error);
        return { fonts: [], total: 0, filtered: 0 };
      }

      return data as GoogleFontsResponse;
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
    return data.fonts.filter(font => {
      // Check if foundrySlug matches
      if (font.foundrySlug === designerSlug) return true;
      // Check if any designer slug matches
      return font.designers?.some(d => {
        const slug = d.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return slug === designerSlug;
      });
    });
  }, [data?.fonts, designerSlug]);

  // Get designer name from first matching font
  const designerName = useMemo(() => {
    if (fonts.length === 0) return null;
    const font = fonts[0];
    // Find matching designer name
    const matchingDesigner = font.designers?.find(d => {
      const slug = d.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return slug === designerSlug;
    });
    return matchingDesigner || font.foundry;
  }, [fonts, designerSlug]);

  return { fonts, designerName, isLoading, error };
}
