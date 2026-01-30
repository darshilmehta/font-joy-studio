import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { loadGoogleFont } from "@/lib/fonts";
import { useGoogleFonts, GoogleFontData } from "@/hooks/useGoogleFonts";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export function GlobalSearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // Fetch fonts from Supabase database
  const { data: apiData, isLoading } = useGoogleFonts({
    search: debouncedQuery,
    enabled: debouncedQuery.length > 1,
  });

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return { fonts: [], designers: [] };

    const lowerQuery = debouncedQuery.toLowerCase();

    // All fonts come from API/database now
    const matchedFonts = (apiData?.fonts || []).slice(0, 15);

    // Search designers from API data
    const matchedDesigners = new Map<
      string,
      { name: string; slug: string; fontCount: number }
    >();
    (apiData?.fonts || []).forEach((font) => {
      font.designers?.forEach((designer) => {
        if (designer.toLowerCase().includes(lowerQuery)) {
          const slug = designer
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          if (!matchedDesigners.has(slug)) {
            matchedDesigners.set(slug, { name: designer, slug, fontCount: 1 });
          } else {
            matchedDesigners.get(slug)!.fontCount++;
          }
        }
      });
    });

    // Load matched fonts for preview
    matchedFonts.forEach((f) => loadGoogleFont(f.family, [400]));

    return {
      fonts: matchedFonts,
      designers: Array.from(matchedDesigners.values()).slice(0, 5),
    };
  }, [debouncedQuery, apiData]);

  const hasResults = results.fonts.length > 0 || results.designers.length > 0;
  const totalFonts = results.fonts.length;

  const handleSelectFont = (family: string, foundrySlug?: string) => {
    // Navigate to the font's foundry page
    if (foundrySlug) {
      navigate(`/foundry/${foundrySlug}`);
    }
    setQuery("");
  };

  const handleSelectFoundry = (slug: string) => {
    navigate(`/foundry/${slug}`);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-full",
          "bg-search-bg transition-all duration-200",
          isFocused && "ring-2 ring-foreground/10",
        )}
      >
        {isLoading && debouncedQuery ? (
          <Loader2 className="w-4 h-4 text-muted-foreground flex-shrink-0 animate-spin" />
        ) : (
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search all Google Fonts, foundries, designers..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Dropdown */}
      {hasResults && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-slide-up max-h-[60vh] overflow-y-auto">
          {/* Designers */}
          {results.designers.length > 0 && (
            <>
              <div className="px-5 py-2 text-xs font-medium text-muted-foreground bg-secondary/50">
                Designers
              </div>
              {results.designers.map((designer) => (
                <button
                  key={designer.slug}
                  onClick={() => handleSelectFoundry(designer.slug)}
                  className={cn(
                    "w-full px-5 py-3 text-left",
                    "hover:bg-secondary transition-colors duration-150",
                    "flex items-center justify-between",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-primary/20" />
                    <div>
                      <div className="font-medium">{designer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {designer.fontCount} font
                        {designer.fontCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* All Fonts (combined local + API) */}
          {totalFonts > 0 && (
            <>
              <div className="px-5 py-2 text-xs font-medium text-muted-foreground bg-secondary/50 flex items-center justify-between">
                <span>Fonts</span>
                {apiData && (
                  <span className="text-[10px] text-muted-foreground/70">
                    {apiData.total.toLocaleString()} fonts available
                  </span>
                )}
              </div>

              {/* Local fonts first */}
              {results.fonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => handleSelectFont(font.family)}
                  className={cn(
                    "w-full px-5 py-3 text-left",
                    "hover:bg-secondary transition-colors duration-150",
                    "flex items-center justify-between",
                  )}
                >
                  <div>
                    <div
                      className="font-medium"
                      style={{
                        fontFamily: `"${font.family}", ${font.category}`,
                      }}
                    >
                      {font.family}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {font.foundry}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {font.category}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Loading state */}
          {isLoading && debouncedQuery && (
            <div className="px-5 py-4 text-sm text-muted-foreground text-center">
              Searching all Google Fonts...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
