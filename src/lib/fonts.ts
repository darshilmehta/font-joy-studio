export interface FontData {
  family: string;
  category: "sans-serif" | "serif" | "display";
  weights: number[];
  foundry: string;
  legibility: "high" | "medium" | "low";
}

export const fonts: FontData[] = [
  { family: "Montserrat", category: "sans-serif", weights: [400, 700], foundry: "Julieta Ulanovsky", legibility: "high" },
  { family: "Lora", category: "serif", weights: [400, 700], foundry: "Cyreal", legibility: "high" },
  { family: "Roboto", category: "sans-serif", weights: [400, 700], foundry: "Christian Robertson", legibility: "high" },
  { family: "Open Sans", category: "sans-serif", weights: [400, 700], foundry: "Steve Matteson", legibility: "high" },
  { family: "Playfair Display", category: "serif", weights: [400, 700], foundry: "Claus Eggers Sørensen", legibility: "medium" },
  { family: "Raleway", category: "sans-serif", weights: [400, 700], foundry: "The League of Moveable Type", legibility: "high" },
  { family: "Merriweather", category: "serif", weights: [400, 700], foundry: "Sorkin Type", legibility: "high" },
  { family: "Poppins", category: "sans-serif", weights: [400, 700], foundry: "Indian Type Foundry", legibility: "high" },
  { family: "Oswald", category: "sans-serif", weights: [400, 700], foundry: "Vernon Adams", legibility: "medium" },
  { family: "PT Sans", category: "sans-serif", weights: [400, 700], foundry: "ParaType", legibility: "high" },
  { family: "Source Sans Pro", category: "sans-serif", weights: [400, 700], foundry: "Paul D. Hunt", legibility: "high" },
  { family: "Nunito", category: "sans-serif", weights: [400, 700], foundry: "Vernon Adams", legibility: "high" },
  { family: "Ubuntu", category: "sans-serif", weights: [400, 700], foundry: "Dalton Maag", legibility: "high" },
  { family: "Crimson Text", category: "serif", weights: [400, 700], foundry: "Sebastian Kosch", legibility: "high" },
  { family: "Libre Baskerville", category: "serif", weights: [400, 700], foundry: "Impallari Type", legibility: "high" },
  { family: "Bitter", category: "serif", weights: [400, 700], foundry: "Huerta Tipográfica", legibility: "high" },
  { family: "Josefin Sans", category: "sans-serif", weights: [400, 700], foundry: "Santiago Orozco", legibility: "medium" },
  { family: "Quicksand", category: "sans-serif", weights: [400, 700], foundry: "Andrew Paglinawan", legibility: "high" },
  { family: "Arvo", category: "serif", weights: [400, 700], foundry: "Anton Koovit", legibility: "high" },
  { family: "Karla", category: "sans-serif", weights: [400, 700], foundry: "Jonathan Pinhorn", legibility: "high" },
  { family: "DM Serif Display", category: "serif", weights: [400], foundry: "Colophon Foundry", legibility: "medium" },
  { family: "Space Grotesk", category: "sans-serif", weights: [400, 700], foundry: "Florian Karsten", legibility: "high" },
  { family: "Cormorant Garamond", category: "serif", weights: [400, 700], foundry: "Christian Thalmann", legibility: "high" },
  { family: "Work Sans", category: "sans-serif", weights: [400, 700], foundry: "Wei Huang", legibility: "high" },
];

// Popular pre-made pairings
export const popularPairings: [string, string][] = [
  ["Playfair Display", "Raleway"],
  ["Montserrat", "Lora"],
  ["DM Serif Display", "Space Grotesk"],
  ["Oswald", "Open Sans"],
  ["Cormorant Garamond", "Work Sans"],
  ["Crimson Text", "Nunito"],
  ["Libre Baskerville", "Source Sans Pro"],
  ["Arvo", "PT Sans"],
  ["Merriweather", "Roboto"],
  ["Poppins", "Lora"],
];

export function getFontByFamily(family: string): FontData | undefined {
  return fonts.find(f => f.family === family);
}

// Calculate pairing score between two fonts
function calculatePairingScore(font1: FontData, font2: FontData): number {
  let score = 50; // Base score
  
  // High contrast: serif + sans-serif
  if ((font1.category === "serif" && font2.category === "sans-serif") ||
      (font1.category === "sans-serif" && font2.category === "serif")) {
    score += 30;
  }
  
  // Medium contrast: same category but different characteristics
  if (font1.category === font2.category && font1.family !== font2.family) {
    score += 10;
  }
  
  // Penalize same font
  if (font1.family === font2.family) {
    score -= 100;
  }
  
  // Boost if body font has high legibility
  if (font2.legibility === "high") {
    score += 15;
  }
  
  // Penalize if body font has low legibility
  if (font2.legibility === "low") {
    score -= 20;
  }
  
  return score;
}

// Get a complementary font for the given font
export function getComplementaryFont(lockedFont: FontData, position: "header" | "body"): FontData {
  const candidates = fonts.filter(f => f.family !== lockedFont.family);
  
  // Score all candidates
  const scored = candidates.map(font => ({
    font,
    score: position === "body" 
      ? calculatePairingScore(lockedFont, font)
      : calculatePairingScore(font, lockedFont)
  }));
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  // Get top candidates and pick randomly from top 5
  const topCandidates = scored.slice(0, 5);
  const randomIndex = Math.floor(Math.random() * topCandidates.length);
  
  return topCandidates[randomIndex].font;
}

// Get a random font pair
export function getRandomPair(): [FontData, FontData] {
  const headerFont = fonts[Math.floor(Math.random() * fonts.length)];
  const bodyFont = getComplementaryFont(headerFont, "body");
  return [headerFont, bodyFont];
}

// Load a Google Font dynamically
export function loadGoogleFont(family: string): void {
  const encodedFamily = encodeURIComponent(family);
  const linkId = `font-${encodedFamily}`;
  
  if (document.getElementById(linkId)) return;
  
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@400;700&display=swap`;
  document.head.appendChild(link);
}

// Preload common fonts
export function preloadFonts(): void {
  fonts.forEach(font => loadGoogleFont(font.family));
}
