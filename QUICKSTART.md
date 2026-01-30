# Quick Start Guide

## ⚡ First Time Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example file and add your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get these from: Supabase Dashboard → Project Settings → API

### 3. Create Database Tables

**Important:** No Supabase migrations or edge functions needed! The app uses a new hook (`useGoogleFonts`) that connects directly to the database.

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy contents of `scripts/create-empty-tables.sql`
5. Paste and click **Run**

This creates the `fonts` and `foundries` tables with proper indexes and permissions.

### 4. Import Google Fonts

```bash
npm run fonts:sync
```

Expected output:

```
✓ Received 1911 fonts from Google Fonts
✓ Successfully inserted 1911 fonts
✓ Saved 674 foundries/designers to database
```

### 5. Start Development

```bash
npm run dev
```

Open http://localhost:8080 🎉

---

## 📋 Common Commands

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `npm run dev`           | Start development server (port 8080)   |
| `npm run fonts:sync`    | Import fonts to Supabase (first time)  |
| `npm run fonts:refresh` | Clear and re-import all fonts          |
| `npm run fonts:fetch`   | Download fonts to JSON (for debugging) |

---

## 🎯 How Font Pairing Works

### Local Pairing (Instant)

**What:** Spacebar generates font pairs instantly  
**How:** Uses curated seed data in `src/lib/fonts.ts` (~100 fonts)  
**Features:**

- Lock header/body to constrain generation
- Smart complementary selection
- Works offline, no API calls
- Zero latency

### Search & Discovery (Database)

**What:** Search the full Google Fonts catalog  
**How:** Direct queries to Supabase via `useGoogleFonts` hook  
**Features:**

- Search 1,911+ fonts by name/designer
- Filter by category (sans-serif, serif, etc.)
- Sort by popularity, trending, date added
- Results cached for 1 hour (React Query)

---

## 🏗️ Architecture

**New simplified architecture - no edge functions!**

```
┌─────────────────────────────────────┐
│  React Frontend                     │
│  ├─ Pairing (local seed data)       │
│  ├─ Search (direct DB queries)      │
│  └─ Loading (Google Fonts CDN)      │
└─────────────────────────────────────┘
         ↓ Direct connection via
           @supabase/supabase-js
┌─────────────────────────────────────┐
│  Supabase PostgreSQL                │
│  ├─ fonts table (1,911 entries)     │
│  └─ foundries table (674 designers) │
└─────────────────────────────────────┘
```

**Key components:**

- `src/hooks/useGoogleFonts.ts` - Direct database queries
- `src/lib/fonts.ts` - Local seed data for pairing
- `scripts/fetch-google-fonts.js` - Font import script

---

## 🔄 Managing Font Data

### First Time Import

```bash
npm run fonts:sync
```

Imports all Google Fonts to your database. Safe to run multiple times (skips duplicates).

### Refresh Data

```bash
npm run fonts:refresh
```

Clears existing fonts and re-imports fresh data from Google. Use when:

- Google releases new fonts
- Database has corrupt data
- You want the latest metadata

### Debug Mode (Local JSON)

```bash
npm run fonts:fetch
```

Downloads fonts to `scripts/google-fonts.json` without touching the database. Useful for:

- Debugging API issues
- Inspecting font data structure
- Offline development
- Testing transformations

---

## 🐛 Troubleshooting

### "No fonts found in search"

**Solution:** Import fonts to database

```bash
npm run fonts:sync
```

### "Database connection error"

**Check:**

1. `.env` file exists and has correct values
2. Supabase project is active
3. Tables created via SQL script

**Verify connection:**

```bash
# In browser console on localhost:8080
console.log(import.meta.env.VITE_SUPABASE_URL)
```

### "Tables don't exist"

**Solution:** Run SQL script again

1. Open `scripts/create-empty-tables.sql`
2. Copy entire contents
3. Paste in Supabase SQL Editor
4. Click Run

### "Font pairing not working"

**Note:** Pairing uses local data in `src/lib/fonts.ts`, NOT the database.

**Check:**

- Browser console for errors
- Spacebar key is working
- No JavaScript errors blocking execution

### "Sync script fails"

**Diagnose:**

```bash
# Test Google Fonts API access
npm run fonts:fetch

# Check Node.js version (need 18+)
node --version

# Verify .env has service role key
cat .env | grep SUPABASE_SERVICE_ROLE_KEY
```

---

## 📚 Next Steps

1. ✅ Database set up
2. ✅ Fonts imported
3. ✅ App running
4. 🎨 Customize UI colors in `tailwind.config.ts`
5. 🔧 Add more fonts to seed data in `src/lib/fonts.ts`
6. 🚀 Deploy to Vercel/Netlify

**For detailed setup, see [SETUP.md](SETUP.md)**
