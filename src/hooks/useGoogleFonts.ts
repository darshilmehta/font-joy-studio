import { useQuery } from "@tanstack/react-query";
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
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (sort) params.set("sort", sort);
      if (limit > 0) params.set("limit", limit.toString());

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
