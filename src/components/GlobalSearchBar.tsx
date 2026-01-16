import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { fonts, foundries, searchFonts, searchFoundries, loadGoogleFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function GlobalSearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return { fonts: [], foundries: [] };
    
    const lowerQuery = query.toLowerCase();
    
    // Search fonts
    const matchedFonts = fonts.filter(font => 
      font.family.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
    
    // Search foundries
    const matchedFoundries = foundries.filter(foundry => 
      foundry.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
    
    // Load matched fonts for preview
    matchedFonts.forEach(f => loadGoogleFont(f.family, [400]));
    
    return { fonts: matchedFonts, foundries: matchedFoundries };
  }, [query]);

  const hasResults = results.fonts.length > 0 || results.foundries.length > 0;

  const handleSelectFont = (family: string) => {
    // Navigate to the font's foundry page
    const font = fonts.find(f => f.family === family);
    if (font) {
      navigate(`/foundry/${font.foundrySlug}`);
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
          isFocused && "ring-2 ring-foreground/10"
        )}
      >
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search fonts, foundries, designers..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Dropdown */}
      {hasResults && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-slide-up">
          {/* Foundries */}
          {results.foundries.length > 0 && (
            <>
              <div className="px-5 py-2 text-xs font-medium text-muted-foreground bg-secondary/50">
                Foundries & Designers
              </div>
              {results.foundries.map((foundry) => (
                <button
                  key={foundry.slug}
                  onClick={() => handleSelectFoundry(foundry.slug)}
                  className={cn(
                    "w-full px-5 py-3 text-left",
                    "hover:bg-secondary transition-colors duration-150",
                    "flex items-center justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#FF6B35' }}
                    />
                    <div>
                      <div className="font-medium">{foundry.name}</div>
                      {foundry.handle && (
                        <div className="text-xs text-muted-foreground">{foundry.handle}</div>
                      )}
                    </div>
                  </div>
                  {foundry.isFoundry && (
                    <span className="text-xs bg-foreground text-background px-2 py-0.5 rounded-full">
                      FOUNDRY
                    </span>
                  )}
                </button>
              ))}
            </>
          )}
          
          {/* Fonts */}
          {results.fonts.length > 0 && (
            <>
              <div className="px-5 py-2 text-xs font-medium text-muted-foreground bg-secondary/50">
                Fonts
              </div>
              {results.fonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => handleSelectFont(font.family)}
                  className={cn(
                    "w-full px-5 py-3 text-left",
                    "hover:bg-secondary transition-colors duration-150",
                    "flex items-center justify-between"
                  )}
                >
                  <div>
                    <div 
                      className="font-medium"
                      style={{ fontFamily: `"${font.family}", ${font.category}` }}
                    >
                      {font.family}
                    </div>
                    <div className="text-xs text-muted-foreground">{font.foundry}</div>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {font.category}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
