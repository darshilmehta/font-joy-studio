import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_FONTS_METADATA_URL = "https://fonts.google.com/metadata/fonts";

const MODE = process.env.MODE || "json";
const REFRESH = process.env.REFRESH === "true";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fetchGoogleFonts() {
  console.log("Fetching Google Fonts metadata...");

  const response = await fetch(GOOGLE_FONTS_METADATA_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; FontJoyStudio/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Fonts metadata error: ${response.status}`);
  }

  const text = await response.text();
  const jsonText = text.replace(/^\)\]\}'/, "");
  const data = JSON.parse(jsonText);

  console.log(
    `✓ Received ${data.familyMetadataList.length} fonts from Google Fonts`,
  );

  return data.familyMetadataList;
}

function transformFontData(fontMetadata) {
  const weights = Object.keys(fontMetadata.fonts)
    .filter((key) => !key.includes("i"))
    .map((key) => parseInt(key) || 400)
    .filter((w) => !isNaN(w))
    .sort((a, b) => a - b);

  const categoryMap = {
    "Sans Serif": "sans-serif",
    Serif: "serif",
    Display: "display",
    Handwriting: "handwriting",
    Monospace: "monospace",
  };

  const designer = fontMetadata.designers[0] || "Google Fonts";
  const foundrySlug = designer
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const legibility =
    fontMetadata.category === "Display" ||
    fontMetadata.category === "Handwriting"
      ? "medium"
      : "high";

  return {
    family: fontMetadata.family,
    category:
      categoryMap[fontMetadata.category] || fontMetadata.category.toLowerCase(),
    weights: weights.length > 0 ? weights : [400],
    variants: Object.keys(fontMetadata.fonts),
    subsets: fontMetadata.subsets,
    version: "v1",
    last_modified: fontMetadata.lastModified,
    files: {},
    menu_url: `https://fonts.gstatic.com/s/${fontMetadata.family.toLowerCase().replace(/\s+/g, "")}/v1/menu.woff2`,
    foundry: designer,
    foundry_slug: foundrySlug,
    legibility,
    popularity: fontMetadata.popularity,
    trending: fontMetadata.trending,
    date_added: fontMetadata.dateAdded,
    designers: fontMetadata.designers,
    classifications: fontMetadata.classifications || [],
    axes: fontMetadata.axes || null,
  };
}

async function saveToJSON(fonts) {
  const outputPath = path.join(__dirname, "google-fonts.json");
  fs.writeFileSync(outputPath, JSON.stringify(fonts, null, 2));
  console.log(`✓ Saved ${fonts.length} fonts to ${outputPath}`);
}

async function saveToSupabase(fonts) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error(
      "❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env",
    );
    process.exit(1);
  }

  console.log("Connecting to Supabase...");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  if (REFRESH) {
    console.log("Clearing existing fonts...");
    const { error: deleteError } = await supabase
      .from("fonts")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteError) {
      console.error("Error clearing fonts:", deleteError);
    } else {
      console.log("✓ Cleared existing fonts");
    }
  }

  console.log("Inserting fonts into Supabase...");
  const batchSize = 100;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < fonts.length; i += batchSize) {
    const batch = fonts.slice(i, i + batchSize);

    const { error } = await supabase.from("fonts").upsert(batch, {
      onConflict: "family",
      ignoreDuplicates: false,
    });

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      errors += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`\r  Inserted ${inserted}/${fonts.length} fonts`);
    }
  }

  console.log(`\n✓ Successfully inserted ${inserted} fonts`);
  if (errors > 0) {
    console.log(`⚠ ${errors} fonts had errors`);
  }

  await extractAndSaveFoundries(supabase, fonts);
}

async function extractAndSaveFoundries(supabase, fonts) {
  console.log("\nExtracting foundries and designers...");

  const foundriesMap = new Map();

  fonts.forEach((font) => {
    if (font.foundry_slug && !foundriesMap.has(font.foundry_slug)) {
      foundriesMap.set(font.foundry_slug, {
        name: font.foundry,
        slug: font.foundry_slug,
        is_foundry: false,
      });
    }

    font.designers.forEach((designer) => {
      const slug = designer
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      if (!foundriesMap.has(slug)) {
        foundriesMap.set(slug, {
          name: designer,
          slug,
          is_foundry: false,
        });
      }
    });
  });

  const foundries = Array.from(foundriesMap.values());

  console.log(`Found ${foundries.length} unique designers/foundries`);

  const { error } = await supabase.from("foundries").upsert(foundries, {
    onConflict: "slug",
    ignoreDuplicates: true,
  });

  if (error) {
    console.error("Error inserting foundries:", error);
  } else {
    console.log(`✓ Saved ${foundries.length} foundries/designers to database`);
  }
}

async function main() {
  try {
    console.log("=== Google Fonts Fetcher ===\n");
    console.log(`Mode: ${MODE}`);
    if (MODE === "supabase") {
      console.log(`Refresh: ${REFRESH}\n`);
    }

    const fontMetadataList = await fetchGoogleFonts();
    const transformedFonts = fontMetadataList.map(transformFontData);

    if (MODE === "json") {
      await saveToJSON(transformedFonts);
    } else if (MODE === "supabase") {
      await saveToSupabase(transformedFonts);
    } else {
      console.error('Invalid MODE. Use "json" or "supabase"');
      process.exit(1);
    }

    console.log("\n✨ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
