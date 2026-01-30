export interface FontData {
  family: string;
  category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
  weights: number[];
  foundry: string;
  foundrySlug: string;
  legibility: "high" | "medium" | "low";
}

export interface FoundryData {
  name: string;
  slug: string;
  handle?: string;
  bio?: string;
  website?: string;
  instagram?: string;
  isFoundry?: boolean;
}

// Helper function to find font by family name
export function getFontByFamily(fonts: FontData[], family: string): FontData | undefined {
  return fonts.find((f) => f.family === family);
}

// Calculate pairing score between two fonts
function calculatePairingScore(font1: FontData, font2: FontData): number {
  let score = 50;

  if (
    (font1.category === "serif" && font2.category === "sans-serif") ||
    (font1.category === "sans-serif" && font2.category === "serif")
  ) {
    score += 30;
  }

  if (font1.category === font2.category && font1.family !== font2.family) {
    score += 10;
  }

  if (font1.family === font2.family) {
    score -= 100;
  }

  if (font2.legibility === "high") {
    score += 15;
  }

  if (font2.legibility === "low") {
    score -= 20;
  }

  return score;
}

export function getComplementaryFont(
  lockedFont: FontData,
  availableFonts: FontData[],
  position: "header" | "body",
): FontData {
  const candidates = availableFonts.filter((f) => f.family !== lockedFont.family);

  const scored = candidates.map((font) => ({
    font,
    score:
      position === "body"
        ? calculatePairingScore(lockedFont, font)
        : calculatePairingScore(font, lockedFont),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topCandidates = scored.slice(0, 5);
  const randomIndex = Math.floor(Math.random() * topCandidates.length);

  return topCandidates[randomIndex].font;
}

export function getRandomPair(availableFonts: FontData[]): [FontData, FontData] {
  const headerFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];
  const bodyFont = getComplementaryFont(headerFont, availableFonts, "body");
  return [headerFont, bodyFont];
}

export function loadGoogleFont(family: string, weights?: number[]): void {
  const encodedFamily = encodeURIComponent(family);
  const linkId = `font-${encodedFamily}`;

  if (document.getElementById(linkId)) return;

  const weightString =
    weights?.join(";") || "100;200;300;400;500;600;700;800;900";

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightString}&display=swap`;
  document.head.appendChild(link);
}

export function preloadFonts(fonts: FontData[], count: number = 20): void {
  // Only preload common fonts for performance
  const commonFonts = fonts.slice(0, count);
  commonFonts.forEach((font) => loadGoogleFont(font.family, font.weights));
}
