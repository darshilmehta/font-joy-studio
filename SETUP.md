# Font Joy Studio - Complete Setup Guide

## Overview

Font Joy Studio is a font pairing tool that allows you to discover and pair fonts intuitively. Inspired by [fontjoy.com](https://fontjoy.com/) and [coolors.co](https://coolors.co/), it provides a natural UI for browsing font pairings, locking selections, and generating new combinations.

## Architecture

**No Supabase migrations or edge functions needed!** The app connects directly to the Supabase database using the npm `@supabase/supabase-js` package.

```
┌─────────────────────────────────────────────────┐
│  React App (Frontend)                           │
│  ├─ Font pairing (local seed data)              │
│  ├─ Search & discovery (direct DB queries)      │
│  └─ Font loading (Google Fonts CDN)             │
└─────────────────────────────────────────────────┘
                      ↓
         Direct connection via
         @supabase/supabase-js
                      ↓
┌─────────────────────────────────────────────────┐
│  Supabase Database                              │
│  ├─ fonts table (~1,911 entries)                │
│  └─ foundries table (~674 designers)            │
└─────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up free](https://supabase.com))
- Git (for cloning the repository)

---

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-git-url>
cd font-joy-studio

# Install dependencies
npm install
```

---

## Step 2: Set Up Supabase Project

### 2.1 Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details and create

### 2.2 Get Your API Keys

From your Supabase project dashboard:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public** key
   - **service_role** key (⚠️ Keep this secret!)

### 2.3 Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## Step 3: Create Database Tables

### 3.1 Open Supabase SQL Editor

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### 3.2 Run the Table Creation Script

Copy the contents of `scripts/create-empty-tables.sql` and paste into the SQL editor, then click **Run**.

This will create:

- `fonts` table with all necessary columns and indexes
- `foundries` table for designer information
- Row Level Security (RLS) policies for public read access
- Indexes for fast queries

### 3.3 Verify Tables Created

Go to **Table Editor** in Supabase and confirm you see:

- ✅ `fonts` table (empty)
- ✅ `foundries` table (empty)

---

## Step 4: Import Google Fonts

### Option A: Sync Fonts to Supabase (Recommended)

Import all Google Fonts (~1,911 fonts) into your database:

```bash
npm run fonts:sync
```

This will:

- Fetch metadata from Google Fonts API
- Transform and insert into Supabase `fonts` table
- Extract and save designer/foundry information

**Expected output:**

```
✓ Received 1911 fonts from Google Fonts
✓ Successfully inserted 1911 fonts
✓ Saved 674 foundries/designers to database
```

### Option B: Refresh Fonts (Clear and Re-import)

To clear existing data and re-import:

```bash
npm run fonts:refresh
```

Use this when:

- Google Fonts has new releases
- You want to update font metadata
- Database has corrupt data

### Option C: Download Fonts Locally (Debug)

To save fonts as a JSON file for debugging:

```bash
npm run fonts:fetch
```

This creates `scripts/google-fonts.json` with all font metadata. Useful for:

- Debugging API issues
- Inspecting font data structure
- Offline development

---

## Step 5: Start Development Server

```bash
npm run dev
```

Open http://localhost:8080 in your browser.

---

## Features & Usage

### Font Pairing (Spacebar)

- Press **Spacebar** to generate new font pairings
- Uses local curated seed data (~100 fonts) for instant results
- Works offline, no API calls needed

### Locking Fonts

- Click **lock icon** on header or body to lock that font
- Spacebar will only shuffle the unlocked font
- Great for finding the perfect complement

### Search & Discovery

- Use the **search bar** to find fonts across the full catalog
- Searches 1,911+ fonts in Supabase database
- Results cached for 1 hour via React Query

### Designer Pages

- Click a **designer name** to see all their fonts
- Discover other fonts by the same foundry
- Pair fonts from the same designer

### Category Filters

- Filter by: Sans-serif, Serif, Display, Handwriting, Monospace
- Sort by: Popularity, Alphabetical, Date Added, Trending

---

## How It Works

### Local Font Pairing (Instant)

The core pairing logic uses a curated list of ~100 fonts in `src/lib/fonts.ts`:

```typescript
export const fonts: FontData[] = [
  { family: "Montserrat", category: "sans-serif", ... },
  { family: "Playfair Display", category: "serif", ... },
  // ... ~100 more
];
```

**Why local?**

- ⚡ Instant pairing generation
- 🎯 Curated quality fonts
- 🔒 Works offline
- 💰 No API quota limits

### Database Search (Full Catalog)

The search and discovery features query Supabase directly via `src/hooks/useGoogleFonts.ts`:

```typescript
const query = supabase.from("fonts").select("*", { count: "exact" });
```

**Why database?**

- 🔍 Search 1,911+ fonts
- 👨‍🎨 Browse by designer/foundry
- 📊 Sort by popularity/trending
- 🔄 Always up-to-date

---

## Font Scripts Reference

### `npm run fonts:sync`

**First time import** of fonts to Supabase.

- Fetches from Google Fonts API
- Inserts into database (skips duplicates)
- Safe to run multiple times

### `npm run fonts:refresh`

**Clears and re-imports** all fonts.

- Deletes existing fonts
- Fetches latest from Google
- Use for updates or fixing corrupt data

### `npm run fonts:fetch`

**Downloads fonts to JSON file** for debugging.

- Creates `scripts/google-fonts.json`
- Does NOT touch database
- Useful for inspection and offline work

---

## Troubleshooting

### "No fonts in database"

**Solution:** Run the sync script

```bash
npm run fonts:sync
```

### "Database connection error"

**Check:**

1. `.env` file has correct credentials
2. Supabase project is active
3. Tables were created (Step 3)

### "Tables don't exist"

**Solution:** Run the SQL script again

1. Open `scripts/create-empty-tables.sql`
2. Copy contents
3. Paste in Supabase SQL Editor
4. Click Run

### "Font pairing not working"

**Note:** Font pairing uses local data in `src/lib/fonts.ts`, not the database. The spacebar shuffle should always work, even without database connection.

### "Sync script fails"

**Check:**

1. Node.js 18+ installed: `node --version`
2. Internet connection active
3. Google Fonts API accessible
4. `.env` has `SUPABASE_SERVICE_ROLE_KEY`

Try fetching to JSON first:

```bash
npm run fonts:fetch
```

If this works, the API is fine and issue is with Supabase connection.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** shadcn/ui, Tailwind CSS, Radix UI
- **Database:** Supabase (PostgreSQL)
- **Data Fetching:** @tanstack/react-query, @supabase/supabase-js
- **Font Loading:** Google Fonts CDN
- **Icons:** Lucide React

---

## Project Structure

```
font-joy-studio/
├── src/
│   ├── components/          # React components
│   ├── hooks/
│   │   └── useGoogleFonts.ts    # Database queries hook
│   ├── lib/
│   │   └── fonts.ts             # Local seed data & pairing logic
│   ├── pages/                   # Route components
│   └── integrations/
│       └── supabase/            # Supabase client & types
├── scripts/
│   ├── create-empty-tables.sql  # Database schema
│   └── fetch-google-fonts.js    # Import script
├── .env                         # Your credentials (gitignored)
├── .env.example                 # Template
└── package.json                 # Dependencies & scripts
```

---

## Next Steps

1. ✅ Set up database tables
2. ✅ Import fonts
3. ✅ Start dev server
4. 🎨 Customize the UI
5. 🚀 Deploy to production

**Enjoy building with Font Joy Studio!** 🎉
