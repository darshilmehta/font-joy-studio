import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Search, ExternalLink } from "lucide-react";
import {
  getFontsByFoundry,
  getFoundryBySlug,
  loadGoogleFont,
  getGoogleFontDownloadUrl,
  FontData,
} from "@/lib/fonts";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlobalSearchBar } from "@/components/GlobalSearchBar";

export default function Foundry() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(48);
  const [selectedWeight, setSelectedWeight] = useState<string>("400");
  const [sortBy, setSortBy] = useState<"name" | "popularity">("name");

  const foundry = useMemo(() => getFoundryBySlug(slug || ""), [slug]);
  const fonts = useMemo(() => getFontsByFoundry(slug || ""), [slug]);

  // Load all fonts from this foundry
  useEffect(() => {
    fonts.forEach(font => loadGoogleFont(font.family, font.weights));
  }, [fonts]);

  // Redirect if foundry not found
  useEffect(() => {
    if (slug && !foundry && fonts.length === 0) {
      navigate("/");
    }
  }, [slug, foundry, fonts.length, navigate]);

  const sortedFonts = useMemo(() => {
    const sorted = [...fonts];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.family.localeCompare(b.family));
    }
    return sorted;
  }, [fonts, sortBy]);

  // Generate a random color for the avatar
  const avatarColor = useMemo(() => {
    const colors = ["#FF6B35", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
    const hash = (foundry?.name || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }, [foundry?.name]);

  if (!foundry && fonts.length === 0) {
    return null;
  }

  const displayName = foundry?.name || fonts[0]?.foundry || "Unknown Foundry";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">F</span>
            </div>
          </Link>

          {/* Search */}
          <GlobalSearchBar />

          {/* Spacer */}
          <div className="w-10 flex-shrink-0" />
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12 py-3 flex items-center gap-6">
          <Link 
            to="/pairing" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Font Pairing Tool
          </Link>
        </div>
      </nav>

      {/* Foundry Profile */}
      <div className="py-16 text-center border-b border-border/50">
        {/* Avatar */}
        <div 
          className="w-28 h-28 rounded-full mx-auto mb-6"
          style={{ backgroundColor: avatarColor }}
        />
        
        {/* Name */}
        <h1 className="text-3xl font-semibold mb-2 flex items-center justify-center gap-2">
          {displayName}
          {foundry?.isFoundry && (
            <span className="text-muted-foreground">✿</span>
          )}
        </h1>
        
        {/* Handle */}
        {foundry?.handle && (
          <p className="text-muted-foreground mb-4">{foundry.handle}</p>
        )}
        
        {/* Badge */}
        {foundry?.isFoundry && (
          <div className="inline-block px-4 py-1 bg-foreground text-background text-xs font-medium rounded-full mb-4">
            FOUNDRY
          </div>
        )}
        
        {/* Bio */}
        {foundry?.bio && (
          <p className="text-muted-foreground max-w-md mx-auto mb-4">{foundry.bio}</p>
        )}
        
        {/* Links */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
          {foundry?.website && (
            <a 
              href={foundry.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Website
            </a>
          )}
          {foundry?.instagram && (
            <a 
              href={`https://instagram.com/${foundry.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Instagram
            </a>
          )}
        </div>
        
        {/* Follow Button */}
        <Button variant="outline" className="rounded-full px-8">
          Follow
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center gap-8">
            <button className="py-4 border-b-2 border-foreground font-medium">
              Fonts
            </button>
            <button className="py-4 text-muted-foreground hover:text-foreground transition-colors">
              Collections
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Weight Selector */}
            <Select value={selectedWeight} onValueChange={setSelectedWeight}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border">
                <SelectItem value="100">Thin</SelectItem>
                <SelectItem value="200">ExtraLight</SelectItem>
                <SelectItem value="300">Light</SelectItem>
                <SelectItem value="400">Regular</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">SemiBold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
                <SelectItem value="800">ExtraBold</SelectItem>
                <SelectItem value="900">Black</SelectItem>
              </SelectContent>
            </Select>

            {/* Size Slider */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-8">{fontSize}</span>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={12}
                max={120}
                step={1}
                className="w-40"
              />
            </div>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v: "name" | "popularity") => setSortBy(v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border">
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Font List */}
      <main className="flex-1 container mx-auto px-6 md:px-12 py-8">
        <div className="space-y-2">
          {sortedFonts.map((font) => (
            <FontRow 
              key={font.family} 
              font={font} 
              fontSize={fontSize}
              weight={parseInt(selectedWeight)}
            />
          ))}
        </div>
        
        {fonts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No fonts found for this foundry.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>© 2025 FontPair</span>
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/pairing" className="hover:text-foreground transition-colors">Font Pairing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FontRowProps {
  font: FontData;
  fontSize: number;
  weight: number;
}

function FontRow({ font, fontSize, weight }: FontRowProps) {
  const [sampleText, setSampleText] = useState(font.family);
  
  // Find the closest available weight
  const closestWeight = useMemo(() => {
    if (font.weights.includes(weight)) return weight;
    return font.weights.reduce((prev, curr) => 
      Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev
    );
  }, [font.weights, weight]);

  return (
    <div className="group py-6 border-b border-border/30 flex items-center justify-between gap-8">
      <div className="flex-1 min-w-0">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setSampleText(e.currentTarget.textContent || font.family)}
          className="outline-none"
          style={{
            fontFamily: `"${font.family}", ${font.category}`,
            fontSize: `${fontSize}px`,
            fontWeight: closestWeight,
            lineHeight: 1.2,
          }}
        >
          {sampleText}
        </div>
      </div>
      
      <a
        href={getGoogleFontDownloadUrl(font.family)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "text-sm text-muted-foreground hover:text-foreground",
          "border border-border hover:border-foreground",
          "opacity-0 group-hover:opacity-100 transition-all duration-200",
          "flex-shrink-0"
        )}
      >
        Download
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
