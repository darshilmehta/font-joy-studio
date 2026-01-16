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

// Comprehensive Google Fonts database
export const fonts: FontData[] = [
  // Sans-serif fonts
  { family: "Montserrat", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Julieta Ulanovsky", foundrySlug: "julieta-ulanovsky", legibility: "high" },
  { family: "Roboto", category: "sans-serif", weights: [100, 300, 400, 500, 700, 900], foundry: "Christian Robertson", foundrySlug: "christian-robertson", legibility: "high" },
  { family: "Open Sans", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800], foundry: "Steve Matteson", foundrySlug: "steve-matteson", legibility: "high" },
  { family: "Raleway", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "The League of Moveable Type", foundrySlug: "the-league-of-moveable-type", legibility: "high" },
  { family: "Poppins", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Indian Type Foundry", foundrySlug: "indian-type-foundry", legibility: "high" },
  { family: "Oswald", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700], foundry: "Vernon Adams", foundrySlug: "vernon-adams", legibility: "medium" },
  { family: "PT Sans", category: "sans-serif", weights: [400, 700], foundry: "ParaType", foundrySlug: "paratype", legibility: "high" },
  { family: "Source Sans Pro", category: "sans-serif", weights: [200, 300, 400, 600, 700, 900], foundry: "Paul D. Hunt", foundrySlug: "paul-d-hunt", legibility: "high" },
  { family: "Nunito", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800, 900], foundry: "Vernon Adams", foundrySlug: "vernon-adams", legibility: "high" },
  { family: "Ubuntu", category: "sans-serif", weights: [300, 400, 500, 700], foundry: "Dalton Maag", foundrySlug: "dalton-maag", legibility: "high" },
  { family: "Josefin Sans", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700], foundry: "Santiago Orozco", foundrySlug: "santiago-orozco", legibility: "medium" },
  { family: "Quicksand", category: "sans-serif", weights: [300, 400, 500, 600, 700], foundry: "Andrew Paglinawan", foundrySlug: "andrew-paglinawan", legibility: "high" },
  { family: "Karla", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800], foundry: "Jonathan Pinhorn", foundrySlug: "jonathan-pinhorn", legibility: "high" },
  { family: "Space Grotesk", category: "sans-serif", weights: [300, 400, 500, 600, 700], foundry: "Florian Karsten", foundrySlug: "florian-karsten", legibility: "high" },
  { family: "Work Sans", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Wei Huang", foundrySlug: "wei-huang", legibility: "high" },
  { family: "Inter", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Rasmus Andersson", foundrySlug: "rasmus-andersson", legibility: "high" },
  { family: "Lato", category: "sans-serif", weights: [100, 300, 400, 700, 900], foundry: "Łukasz Dziedzic", foundrySlug: "lukasz-dziedzic", legibility: "high" },
  { family: "Noto Sans", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Google", foundrySlug: "google", legibility: "high" },
  { family: "Manrope", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800], foundry: "Mikhail Sharanda", foundrySlug: "mikhail-sharanda", legibility: "high" },
  { family: "DM Sans", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Colophon Foundry", foundrySlug: "colophon-foundry", legibility: "high" },
  { family: "Outfit", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Rodrigo Fuenzalida", foundrySlug: "rodrigo-fuenzalida", legibility: "high" },
  { family: "Plus Jakarta Sans", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800], foundry: "Tokotype", foundrySlug: "tokotype", legibility: "high" },
  { family: "Figtree", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800, 900], foundry: "Erik Kennedy", foundrySlug: "erik-kennedy", legibility: "high" },
  { family: "Sora", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800], foundry: "Jonathan Barnbrook", foundrySlug: "jonathan-barnbrook", legibility: "high" },
  { family: "Barlow", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Jeremy Tribby", foundrySlug: "jeremy-tribby", legibility: "high" },
  { family: "Rubik", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800, 900], foundry: "Hubert & Fischer", foundrySlug: "hubert-fischer", legibility: "high" },
  { family: "Mulish", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800, 900], foundry: "Vernon Adams", foundrySlug: "vernon-adams", legibility: "high" },
  { family: "Cabin", category: "sans-serif", weights: [400, 500, 600, 700], foundry: "Impallari Type", foundrySlug: "impallari-type", legibility: "high" },
  { family: "Mukta", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800], foundry: "Ek Type", foundrySlug: "ek-type", legibility: "high" },
  { family: "Titillium Web", category: "sans-serif", weights: [200, 300, 400, 600, 700, 900], foundry: "Accademia di Belle Arti di Urbino", foundrySlug: "accademia-di-belle-arti-di-urbino", legibility: "high" },
  { family: "Archivo", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Omnibus-Type", foundrySlug: "omnibus-type", legibility: "high" },
  { family: "Urbanist", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Corey Hu", foundrySlug: "corey-hu", legibility: "high" },
  
  // Serif fonts
  { family: "Lora", category: "serif", weights: [400, 500, 600, 700], foundry: "Cyreal", foundrySlug: "cyreal", legibility: "high" },
  { family: "Playfair Display", category: "serif", weights: [400, 500, 600, 700, 800, 900], foundry: "Claus Eggers Sørensen", foundrySlug: "claus-eggers-sorensen", legibility: "medium" },
  { family: "Merriweather", category: "serif", weights: [300, 400, 700, 900], foundry: "Sorkin Type", foundrySlug: "sorkin-type", legibility: "high" },
  { family: "Crimson Text", category: "serif", weights: [400, 600, 700], foundry: "Sebastian Kosch", foundrySlug: "sebastian-kosch", legibility: "high" },
  { family: "Libre Baskerville", category: "serif", weights: [400, 700], foundry: "Impallari Type", foundrySlug: "impallari-type", legibility: "high" },
  { family: "Bitter", category: "serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Huerta Tipográfica", foundrySlug: "huerta-tipografica", legibility: "high" },
  { family: "Arvo", category: "serif", weights: [400, 700], foundry: "Anton Koovit", foundrySlug: "anton-koovit", legibility: "high" },
  { family: "DM Serif Display", category: "serif", weights: [400], foundry: "Colophon Foundry", foundrySlug: "colophon-foundry", legibility: "medium" },
  { family: "Cormorant Garamond", category: "serif", weights: [300, 400, 500, 600, 700], foundry: "Christian Thalmann", foundrySlug: "christian-thalmann", legibility: "high" },
  { family: "PT Serif", category: "serif", weights: [400, 700], foundry: "ParaType", foundrySlug: "paratype", legibility: "high" },
  { family: "Noto Serif", category: "serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Google", foundrySlug: "google", legibility: "high" },
  { family: "Source Serif Pro", category: "serif", weights: [200, 300, 400, 600, 700, 900], foundry: "Frank Grießhammer", foundrySlug: "frank-griesshammer", legibility: "high" },
  { family: "Spectral", category: "serif", weights: [200, 300, 400, 500, 600, 700, 800], foundry: "Production Type", foundrySlug: "production-type", legibility: "high" },
  { family: "EB Garamond", category: "serif", weights: [400, 500, 600, 700, 800], foundry: "Georg Duffner", foundrySlug: "georg-duffner", legibility: "high" },
  { family: "Vollkorn", category: "serif", weights: [400, 500, 600, 700, 800, 900], foundry: "Friedrich Althausen", foundrySlug: "friedrich-althausen", legibility: "high" },
  { family: "Cardo", category: "serif", weights: [400, 700], foundry: "David Perry", foundrySlug: "david-perry", legibility: "high" },
  { family: "Libre Caslon Text", category: "serif", weights: [400, 700], foundry: "Impallari Type", foundrySlug: "impallari-type", legibility: "high" },
  { family: "IBM Plex Serif", category: "serif", weights: [100, 200, 300, 400, 500, 600, 700], foundry: "IBM", foundrySlug: "ibm", legibility: "high" },
  { family: "Cormorant", category: "serif", weights: [300, 400, 500, 600, 700], foundry: "Christian Thalmann", foundrySlug: "christian-thalmann", legibility: "high" },
  { family: "Alegreya", category: "serif", weights: [400, 500, 600, 700, 800, 900], foundry: "Huerta Tipográfica", foundrySlug: "huerta-tipografica", legibility: "high" },
  { family: "Antic Slab", category: "serif", weights: [400], foundry: "Huerta Tipográfica", foundrySlug: "huerta-tipografica", legibility: "high" },
  { family: "Telex", category: "sans-serif", weights: [400], foundry: "Huerta Tipográfica", foundrySlug: "huerta-tipografica", legibility: "high" },
  { family: "Faustina", category: "serif", weights: [300, 400, 500, 600, 700, 800], foundry: "Huerta Tipográfica", foundrySlug: "huerta-tipografica", legibility: "high" },
  { family: "Zilla Slab", category: "serif", weights: [300, 400, 500, 600, 700], foundry: "Typotheque", foundrySlug: "typotheque", legibility: "high" },
  
  // Display fonts
  { family: "Bebas Neue", category: "display", weights: [400], foundry: "Ryoichi Tsunekawa", foundrySlug: "ryoichi-tsunekawa", legibility: "medium" },
  { family: "Abril Fatface", category: "display", weights: [400], foundry: "TypeTogether", foundrySlug: "typetogether", legibility: "low" },
  { family: "Pacifico", category: "display", weights: [400], foundry: "Vernon Adams", foundrySlug: "vernon-adams", legibility: "low" },
  { family: "Righteous", category: "display", weights: [400], foundry: "Astigmatic", foundrySlug: "astigmatic", legibility: "medium" },
  { family: "Lobster", category: "display", weights: [400], foundry: "Impallari Type", foundrySlug: "impallari-type", legibility: "low" },
  { family: "Staatliches", category: "display", weights: [400], foundry: "Brian LaRossa", foundrySlug: "brian-larossa", legibility: "medium" },
  { family: "Anton", category: "display", weights: [400], foundry: "Vernon Adams", foundrySlug: "vernon-adams", legibility: "medium" },
  { family: "Alfaslab One", category: "display", weights: [400], foundry: "JM Solé", foundrySlug: "jm-sole", legibility: "medium" },
  { family: "Bungee", category: "display", weights: [400], foundry: "David Jonathan Ross", foundrySlug: "david-jonathan-ross", legibility: "low" },
  { family: "Monoton", category: "display", weights: [400], foundry: "Vernon Adams", foundrySlug: "vernon-adams", legibility: "low" },
  
  // Handwriting fonts
  { family: "Dancing Script", category: "handwriting", weights: [400, 500, 600, 700], foundry: "Impallari Type", foundrySlug: "impallari-type", legibility: "low" },
  { family: "Caveat", category: "handwriting", weights: [400, 500, 600, 700], foundry: "Impallari Type", foundrySlug: "impallari-type", legibility: "low" },
  { family: "Great Vibes", category: "handwriting", weights: [400], foundry: "TypeSETit", foundrySlug: "typesetit", legibility: "low" },
  { family: "Satisfy", category: "handwriting", weights: [400], foundry: "Sideshow", foundrySlug: "sideshow", legibility: "low" },
  { family: "Kalam", category: "handwriting", weights: [300, 400, 700], foundry: "Indian Type Foundry", foundrySlug: "indian-type-foundry", legibility: "medium" },
  { family: "Indie Flower", category: "handwriting", weights: [400], foundry: "Kimberly Geswein", foundrySlug: "kimberly-geswein", legibility: "low" },
  { family: "Shadows Into Light", category: "handwriting", weights: [400], foundry: "Kimberly Geswein", foundrySlug: "kimberly-geswein", legibility: "low" },
  { family: "Permanent Marker", category: "handwriting", weights: [400], foundry: "Font Diner", foundrySlug: "font-diner", legibility: "medium" },
  
  // Monospace fonts
  { family: "Roboto Mono", category: "monospace", weights: [100, 200, 300, 400, 500, 600, 700], foundry: "Christian Robertson", foundrySlug: "christian-robertson", legibility: "high" },
  { family: "Source Code Pro", category: "monospace", weights: [200, 300, 400, 500, 600, 700, 800, 900], foundry: "Paul D. Hunt", foundrySlug: "paul-d-hunt", legibility: "high" },
  { family: "Fira Code", category: "monospace", weights: [300, 400, 500, 600, 700], foundry: "Nikita Prokopov", foundrySlug: "nikita-prokopov", legibility: "high" },
  { family: "JetBrains Mono", category: "monospace", weights: [100, 200, 300, 400, 500, 600, 700, 800], foundry: "JetBrains", foundrySlug: "jetbrains", legibility: "high" },
  { family: "IBM Plex Mono", category: "monospace", weights: [100, 200, 300, 400, 500, 600, 700], foundry: "IBM", foundrySlug: "ibm", legibility: "high" },
  { family: "Space Mono", category: "monospace", weights: [400, 700], foundry: "Colophon Foundry", foundrySlug: "colophon-foundry", legibility: "high" },
  { family: "Inconsolata", category: "monospace", weights: [200, 300, 400, 500, 600, 700, 800, 900], foundry: "Raph Levien", foundrySlug: "raph-levien", legibility: "high" },
];

// Foundry metadata
export const foundries: FoundryData[] = [
  { name: "Huerta Tipográfica", slug: "huerta-tipografica", handle: "@huertatipografica", bio: "Type foundry based in Argentina, creating quality fonts for the world.", website: "https://www.huertatipografica.com", instagram: "huertatipografica", isFoundry: true },
  { name: "Impallari Type", slug: "impallari-type", handle: "@pabloimpallari", bio: "Open source type foundry", isFoundry: true },
  { name: "Colophon Foundry", slug: "colophon-foundry", handle: "@colophonfoundry", bio: "Award-winning type foundry based in London.", website: "https://www.colophon-foundry.org", isFoundry: true },
  { name: "Indian Type Foundry", slug: "indian-type-foundry", handle: "@indiantypefoundry", bio: "Creating fonts for Indian and international markets.", isFoundry: true },
  { name: "ParaType", slug: "paratype", handle: "@paratype", bio: "Russian type foundry established in 1989.", isFoundry: true },
  { name: "Sorkin Type", slug: "sorkin-type", handle: "@sorkintype", bio: "Type design studio focused on legibility.", isFoundry: true },
  { name: "Cyreal", slug: "cyreal", handle: "@cyrealfoundry", bio: "Type design studio.", isFoundry: true },
  { name: "TypeTogether", slug: "typetogether", handle: "@typetogether", bio: "Award-winning independent type foundry.", isFoundry: true },
  { name: "Typotheque", slug: "typotheque", handle: "@typotheque", bio: "Type design and publishing.", isFoundry: true },
  { name: "Omnibus-Type", slug: "omnibus-type", handle: "@omnibustype", bio: "Collective dedicated to type design.", isFoundry: true },
  { name: "Tokotype", slug: "tokotype", handle: "@tokotype", bio: "Type foundry from Indonesia.", isFoundry: true },
  { name: "Ek Type", slug: "ek-type", handle: "@ektype", bio: "Type foundry specializing in Indian scripts.", isFoundry: true },
  { name: "Production Type", slug: "production-type", handle: "@productiontype", bio: "Parisian type foundry.", isFoundry: true },
  { name: "Google", slug: "google", handle: "@googlefonts", bio: "Making the web more beautiful, fast, and open through great typography.", website: "https://fonts.google.com", isFoundry: true },
  { name: "IBM", slug: "ibm", handle: "@ibmdesign", bio: "The IBM Plex typeface family.", isFoundry: true },
  { name: "JetBrains", slug: "jetbrains", handle: "@jetbrains", bio: "Developer tools company.", isFoundry: true },
  { name: "The League of Moveable Type", slug: "the-league-of-moveable-type", handle: "@theleaboratory", bio: "Open-source type movement.", isFoundry: true },
  { name: "Dalton Maag", slug: "dalton-maag", handle: "@daltonmaag", bio: "Type design and font development.", isFoundry: true },
  
  // Individual designers
  { name: "Julieta Ulanovsky", slug: "julieta-ulanovsky", handle: "@julietaulanovsky", bio: "Argentine type designer, creator of Montserrat." },
  { name: "Christian Robertson", slug: "christian-robertson", handle: "@cr64", bio: "Designer at Google, creator of Roboto." },
  { name: "Steve Matteson", slug: "steve-matteson", handle: "@stevematteson1", bio: "Type designer, creator of Open Sans and Droid." },
  { name: "Vernon Adams", slug: "vernon-adams", handle: "@vernnobile", bio: "Prolific type designer creating open source fonts." },
  { name: "Paul D. Hunt", slug: "paul-d-hunt", handle: "@pauldhunt", bio: "Type designer at Adobe, creator of Source family." },
  { name: "Claus Eggers Sørensen", slug: "claus-eggers-sorensen", handle: "@clauseggers", bio: "Danish type designer, creator of Playfair Display." },
  { name: "Sebastian Kosch", slug: "sebastian-kosch", handle: "@sebastiankosch", bio: "Type designer, creator of Crimson Text." },
  { name: "Anton Koovit", slug: "anton-koovit", handle: "@antonkoovit", bio: "Estonian type designer, creator of Arvo." },
  { name: "Santiago Orozco", slug: "santiago-orozco", handle: "@santiagoorozco", bio: "Type designer, creator of Josefin Sans." },
  { name: "Andrew Paglinawan", slug: "andrew-paglinawan", handle: "@andrewpaglinawan", bio: "Type designer, creator of Quicksand." },
  { name: "Jonathan Pinhorn", slug: "jonathan-pinhorn", handle: "@jonpinhorn", bio: "Type designer at Dalton Maag." },
  { name: "Florian Karsten", slug: "florian-karsten", handle: "@floriankarsten", bio: "Czech type designer, creator of Space Grotesk." },
  { name: "Wei Huang", slug: "wei-huang", handle: "@weihuangdesign", bio: "Type designer, creator of Work Sans." },
  { name: "Christian Thalmann", slug: "christian-thalmann", handle: "@christianth", bio: "Type designer, creator of Cormorant." },
  { name: "Rasmus Andersson", slug: "rasmus-andersson", handle: "@rsms", bio: "Designer, creator of Inter." },
  { name: "Łukasz Dziedzic", slug: "lukasz-dziedzic", handle: "@lukaszdziedzic", bio: "Polish type designer, creator of Lato." },
  { name: "Mikhail Sharanda", slug: "mikhail-sharanda", handle: "@sharanda", bio: "Type designer, creator of Manrope." },
  { name: "Rodrigo Fuenzalida", slug: "rodrigo-fuenzalida", handle: "@rfuenzalida", bio: "Type designer, creator of Outfit." },
  { name: "Erik Kennedy", slug: "erik-kennedy", handle: "@erikdkennedy", bio: "Designer, creator of Figtree." },
  { name: "Jonathan Barnbrook", slug: "jonathan-barnbrook", handle: "@barnbrook", bio: "British graphic designer." },
  { name: "Jeremy Tribby", slug: "jeremy-tribby", handle: "@tribby", bio: "Type designer, creator of Barlow." },
  { name: "Corey Hu", slug: "corey-hu", handle: "@coreyhu", bio: "Designer, creator of Urbanist." },
  { name: "Georg Duffner", slug: "georg-duffner", handle: "@georgduffner", bio: "Type designer, creator of EB Garamond." },
  { name: "Friedrich Althausen", slug: "friedrich-althausen", handle: "@falthausen", bio: "Type designer, creator of Vollkorn." },
  { name: "David Perry", slug: "david-perry", handle: "@davidperry", bio: "Type designer, creator of Cardo." },
  { name: "Frank Grießhammer", slug: "frank-griesshammer", handle: "@frankrolf", bio: "Type designer at Adobe." },
  { name: "Ryoichi Tsunekawa", slug: "ryoichi-tsunekawa", handle: "@flat_it", bio: "Japanese type designer, creator of Bebas Neue." },
  { name: "Nikita Prokopov", slug: "nikita-prokopov", handle: "@nikitonsky", bio: "Developer and designer, creator of Fira Code." },
  { name: "Raph Levien", slug: "raph-levien", handle: "@raphlinus", bio: "Type designer, creator of Inconsolata." },
  { name: "Kimberly Geswein", slug: "kimberly-geswein", handle: "@kimberlygeswein", bio: "Handwriting font designer." },
  { name: "David Jonathan Ross", slug: "david-jonathan-ross", handle: "@djr", bio: "Type designer, creator of Bungee." },
  { name: "Hubert & Fischer", slug: "hubert-fischer", handle: "@hubertfischer", bio: "Design studio, creators of Rubik." },
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
  ["Inter", "EB Garamond"],
  ["Bebas Neue", "Open Sans"],
  ["Abril Fatface", "Poppins"],
  ["DM Sans", "DM Serif Display"],
  ["Plus Jakarta Sans", "Libre Baskerville"],
];

export function getFontByFamily(family: string): FontData | undefined {
  return fonts.find(f => f.family === family);
}

export function getFontsByFoundry(foundrySlug: string): FontData[] {
  return fonts.filter(f => f.foundrySlug === foundrySlug);
}

export function getFoundryBySlug(slug: string): FoundryData | undefined {
  return foundries.find(f => f.slug === slug);
}

export function searchFonts(query: string): FontData[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return fonts.filter(font => 
    font.family.toLowerCase().includes(lowerQuery) ||
    font.foundry.toLowerCase().includes(lowerQuery) ||
    font.category.toLowerCase().includes(lowerQuery)
  );
}

export function searchFoundries(query: string): FoundryData[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return foundries.filter(foundry => 
    foundry.name.toLowerCase().includes(lowerQuery) ||
    foundry.slug.toLowerCase().includes(lowerQuery)
  );
}

// Calculate pairing score between two fonts
function calculatePairingScore(font1: FontData, font2: FontData): number {
  let score = 50;
  
  if ((font1.category === "serif" && font2.category === "sans-serif") ||
      (font1.category === "sans-serif" && font2.category === "serif")) {
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

export function getComplementaryFont(lockedFont: FontData, position: "header" | "body"): FontData {
  const candidates = fonts.filter(f => f.family !== lockedFont.family);
  
  const scored = candidates.map(font => ({
    font,
    score: position === "body" 
      ? calculatePairingScore(lockedFont, font)
      : calculatePairingScore(font, lockedFont)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  const topCandidates = scored.slice(0, 5);
  const randomIndex = Math.floor(Math.random() * topCandidates.length);
  
  return topCandidates[randomIndex].font;
}

export function getRandomPair(): [FontData, FontData] {
  const headerFont = fonts[Math.floor(Math.random() * fonts.length)];
  const bodyFont = getComplementaryFont(headerFont, "body");
  return [headerFont, bodyFont];
}

export function loadGoogleFont(family: string, weights?: number[]): void {
  const encodedFamily = encodeURIComponent(family);
  const linkId = `font-${encodedFamily}`;
  
  if (document.getElementById(linkId)) return;
  
  const weightString = weights?.join(';') || '100;200;300;400;500;600;700;800;900';
  
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightString}&display=swap`;
  document.head.appendChild(link);
}

export function preloadFonts(): void {
  // Only preload common fonts for performance
  const commonFonts = fonts.slice(0, 20);
  commonFonts.forEach(font => loadGoogleFont(font.family, font.weights));
}

export function getGoogleFontDownloadUrl(family: string): string {
  return `https://fonts.google.com/specimen/${encodeURIComponent(family)}`;
}
