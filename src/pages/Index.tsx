import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { FontSection } from "@/components/FontSection";
import { GlobalSearchBar } from "@/components/GlobalSearchBar";
import { TabNav } from "@/components/TabNav";
import { ShuffleTooltip } from "@/components/ShuffleTooltip";
import {
  FontData,
  getFontByFamily,
  getComplementaryFont,
  getRandomPair,
  loadGoogleFont,
  preloadFonts,
} from "@/lib/fonts";
import { useGoogleFonts } from "@/hooks/useGoogleFonts";

const DEFAULT_HEADER_TEXT = "All in the recognition of inherent dignity";
const DEFAULT_BODY_TEXT = `Underpinned by Newton's immutable logic – what goes up, must come down – this new field of energy storage technology is, in principle, remarkably simple. When green energy is plentiful, use it to haul a colossal weight to a predetermined height. When renewables are limited, release the load, powering a generator with the downward gravitational pull.`;

type TabType = "popular" | "foundry";

export default function Index() {
  const [headerFont, setHeaderFont] = useState<FontData | null>(null);
  const [bodyFont, setBodyFont] = useState<FontData | null>(null);
  const [headerLocked, setHeaderLocked] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("foundry");
  const [dragOverPosition, setDragOverPosition] = useState<
    "header" | "body" | null
  >(null);
  const [showTooltip, setShowTooltip] = useState(true);

  // Fetch fonts from Supabase
  const { data: fontsData } = useGoogleFonts({
    limit: 200,
    sort: "popularity",
  });
  const fonts = fontsData?.fonts || [];

  // Initialize with a random pair when fonts are loaded
  useEffect(() => {
    if (fonts.length > 0 && !headerFont && !bodyFont) {
      const fontsForPairing = fonts.map((f) => ({
        family: f.family,
        category: f.category,
        weights: f.weights,
        foundry: f.foundry,
        foundrySlug: f.foundrySlug,
        legibility: f.legibility,
      }));
      preloadFonts(fontsForPairing, 20);
      const [header, body] = getRandomPair(fontsForPairing);
      setHeaderFont(header);
      setBodyFont(body);
    }
  }, [fonts, headerFont, bodyFont]);

  // Load fonts when they change
  useEffect(() => {
    if (headerFont) loadGoogleFont(headerFont.family);
    if (bodyFont) loadGoogleFont(bodyFont.family);
  }, [headerFont, bodyFont]);

  const shuffle = useCallback(() => {
    if (fonts.length === 0 || !headerFont || !bodyFont) return;

    const fontsForPairing = fonts.map((f) => ({
      family: f.family,
      category: f.category,
      weights: f.weights,
      foundry: f.foundry,
      foundrySlug: f.foundrySlug,
      legibility: f.legibility,
    }));

    if (headerLocked && bodyLocked) return;

    if (headerLocked) {
      const newBody = getComplementaryFont(headerFont, fontsForPairing, "body");
      setBodyFont(newBody);
    } else if (bodyLocked) {
      const newHeader = getComplementaryFont(
        bodyFont,
        fontsForPairing,
        "header",
      );
      setHeaderFont(newHeader);
    } else {
      const [header, body] = getRandomPair(fontsForPairing);
      setHeaderFont(header);
      setBodyFont(body);
    }
  }, [headerLocked, bodyLocked, headerFont, bodyFont, fonts]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        document.activeElement?.tagName !== "INPUT" &&
        !(document.activeElement as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        shuffle();
        setShowTooltip(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shuffle]);

  const handleDragStart =
    (position: "header" | "body") => (e: React.DragEvent) => {
      e.dataTransfer.setData("position", position);
      e.dataTransfer.effectAllowed = "move";
    };

  const handleDragOver =
    (position: "header" | "body") => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverPosition(position);
    };

  const handleDragLeave = () => {
    setDragOverPosition(null);
  };

  const handleDrop =
    (targetPosition: "header" | "body") => (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverPosition(null);

      const sourcePosition = e.dataTransfer.getData("position") as
        | "header"
        | "body";
      if (sourcePosition === targetPosition) return;

      // Swap fonts
      if (!headerFont || !bodyFont || fonts.length === 0) return;

      const fontsForPairing = fonts.map((f) => ({
        family: f.family,
        category: f.category,
        weights: f.weights,
        foundry: f.foundry,
        foundrySlug: f.foundrySlug,
        legibility: f.legibility,
      }));

      if (sourcePosition === "header" && targetPosition === "body") {
        const oldHeader = headerFont;
        setBodyFont(oldHeader);
        setBodyLocked(true);
        // Generate new header
        const newHeader = getComplementaryFont(
          oldHeader,
          fontsForPairing,
          "header",
        );
        setHeaderFont(newHeader);
        setHeaderLocked(false);
      } else {
        const oldBody = bodyFont;
        setHeaderFont(oldBody);
        setHeaderLocked(true);
        // Generate new body
        const newBody = getComplementaryFont(oldBody, fontsForPairing, "body");
        setBodyFont(newBody);
        setBodyLocked(false);
      }
    };

  const handleSearchSelect = (font: FontData, position: "header" | "body") => {
    if (fonts.length === 0) return;

    const fontsForPairing = fonts.map((f) => ({
      family: f.family,
      category: f.category,
      weights: f.weights,
      foundry: f.foundry,
      foundrySlug: f.foundrySlug,
      legibility: f.legibility,
    }));

    if (position === "header") {
      setHeaderFont(font);
      setHeaderLocked(true);
      if (!bodyLocked) {
        const newBody = getComplementaryFont(font, fontsForPairing, "body");
        setBodyFont(newBody);
      }
    } else {
      setBodyFont(font);
      setBodyLocked(true);
      if (!headerLocked) {
        const newHeader = getComplementaryFont(font, fontsForPairing, "header");
        setHeaderFont(newHeader);
      }
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "foundry" && fonts.length > 0) {
      // Find two fonts from the same foundry
      const foundries = [...new Set(fonts.map((f) => f.foundry))];
      for (const foundry of foundries) {
        const fontsFromFoundry = fonts.filter((f) => f.foundry === foundry);
        if (fontsFromFoundry.length >= 2) {
          const fontsForPairing = fontsFromFoundry.map((f) => ({
            family: f.family,
            category: f.category,
            weights: f.weights,
            foundry: f.foundry,
            foundrySlug: f.foundrySlug,
            legibility: f.legibility,
          }));
          setHeaderFont(fontsForPairing[0]);
          setBodyFont(fontsForPairing[1]);
          break;
        }
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      onDragLeave={handleDragLeave}
    >
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12 py-4 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">F</span>
            </div>
          </Link>

          {/* Search */}
          <GlobalSearchBar
            onFontSelect={(font) => handleSearchSelect(font, "header")}
          />
        </div>
      </header>

      {/* Back to map */}
      <div className="container mx-auto px-6 md:px-12 py-4">
        <Link
          to="/pairing"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 inline-flex"
        >
          <span>←</span> Back to map
        </Link>
      </div>

      {/* Tabs */}
      <div className="container px-6 md:px-12 pb-8">
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Font Sections */}
      <main className="flex-1">
        {headerFont && bodyFont ? (
          <>
            <FontSection
              key={`header-${headerFont.family}`}
              font={headerFont}
              position="header"
              isLocked={headerLocked}
              onLockToggle={() => setHeaderLocked(!headerLocked)}
              onDragStart={handleDragStart("header")}
              onDragOver={handleDragOver("header")}
              onDrop={handleDrop("header")}
              isDragOver={dragOverPosition === "header"}
              defaultText={DEFAULT_HEADER_TEXT}
            />

            <FontSection
              key={`body-${bodyFont.family}`}
              font={bodyFont}
              position="body"
              isLocked={bodyLocked}
              onLockToggle={() => setBodyLocked(!bodyLocked)}
              onDragStart={handleDragStart("body")}
              onDragOver={handleDragOver("body")}
              onDrop={handleDrop("body")}
              isDragOver={dragOverPosition === "body"}
              defaultText={DEFAULT_BODY_TEXT}
            />
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Loading fonts from database...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>© 2025 FontPair</span>
            <a href="#" className="hover:text-foreground transition-colors">
              How We Work
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Shuffle Tooltip */}
      <ShuffleTooltip
        show={showTooltip}
        onDismiss={() => setShowTooltip(false)}
      />
    </div>
  );
}
