# Font Joy Studio 🎨

A beautiful, intuitive font pairing tool inspired by [fontjoy.com](https://fontjoy.com/) and [coolors.co](https://coolors.co/). Discover, pair, and explore the complete Google Fonts catalog with an elegant UI and smart pairing logic.

![Font Joy Studio](https://img.shields.io/badge/fonts-1911-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue) ![React](https://img.shields.io/badge/React-18-61dafb)

## ✨ Features

- **🎲 Smart Font Pairing** - Press spacebar to generate beautiful font combinations
- **🔒 Lock & Shuffle** - Lock header or body font, shuffle the other
- **🔍 Full Catalog Search** - Search 1,911+ Google Fonts in real-time
- **👨‍🎨 Designer Discovery** - Browse fonts by designer/foundry
- **📊 Sort & Filter** - By popularity, trending, date, category
- **⚡ Instant Preview** - Real-time font loading from Google Fonts CDN
- **💾 Database-Powered** - All font data from Supabase, no hardcoded arrays

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <your-git-url>
cd font-joy-studio
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Create database tables (using Supabase CLI)
supabase init
supabase link --project-ref your-project-ref
supabase db push

# 4. Import Google Fonts
npm run fonts:sync

# 5. Start development
npm run dev
```

Open http://localhost:8080 and start pairing fonts! 🎉

**📖 For detailed setup instructions, see [SETUP.md](SETUP.md)**  
**⚡ For quick reference, see [QUICKSTART.md](QUICKSTART.md)**

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI Framework:** shadcn/ui, Tailwind CSS, Radix UI
- **Database:** Supabase (PostgreSQL)
- **State Management:** @tanstack/react-query
- **API Client:** @supabase/supabase-js
- **Icons:** Lucide React
- **Font Loading:** Google Fonts CDN

## 📁 Project Structure

```
font-joy-studio/
├── src/
│   ├── components/          # React UI components
│   ├── hooks/
│   │   └── useGoogleFonts.ts    # Database query hook
│   ├── lib/
│   │   └── fonts.ts             # Font pairing logic & utilities
│   ├── pages/                   # Route components
│   │   ├── Index.tsx            # Main pairing page
│   │   └── Foundry.tsx          # Designer page
│   └── integrations/
│       └── supabase/
│           ├── client.ts        # Supabase client
│           └── types.ts         # Database types
├── supabase/
│   └── migrations/              # Database migrations (Supabase CLI)
│       └── 20240101000000_initial_schema.sql
├── scripts/
│   └── fetch-google-fonts.js    # Font import script
├── .env.example                 # Environment template
├── SETUP.md                     # Detailed setup guide
└── QUICKSTART.md                # Quick reference
```

## 🎯 How It Works

### Architecture Overview

**No edge functions or migrations needed!** The app connects directly to Supabase using the npm package.

```
┌─────────────────────────────────────┐
│  React Frontend                     │
│  ├─ Pairing (database fonts)        │
│  ├─ Search (database queries)       │
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

### Font Pairing Logic

**All Data from Supabase** - No hardcoded arrays!

**Pairing Algorithm** (`src/lib/fonts.ts`)

- Smart complementary font selection
- Category-based matching (serif ↔ sans-serif)
- Legibility scoring
- Random selection from top candidates

**Database Integration** (`src/hooks/useGoogleFonts.ts`)

- Fetches 200 most popular fonts on page load
- Real-time search and filtering
- Direct Supabase queries (no edge functions)
- 1-hour cache via React Query

**How Pairing Works:**

1. App loads → Fetches 200 fonts from Supabase
2. User presses spacebar → Generates pair from fetched fonts
3. Lock system → Finds complementary font from database
4. Search → Queries full catalog in real-time

## 📋 Available Scripts

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start development server (port 8080)  |
| `npm run build`         | Build for production                  |
| `npm run preview`       | Preview production build              |
| `npm run fonts:sync`    | Import fonts to Supabase (first time) |
| `npm run fonts:refresh` | Clear and re-import all fonts         |
| `npm run fonts:fetch`   | Download fonts to JSON (debug)        |

## 🗄️ Database Setup

### Required Environment Variables

Create a `.env` file with these values:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ Never commit your `.env` file!** It contains sensitive credentials.

### Create Database Tables

**Using Supabase CLI (Recommended):**

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize and link to your project
supabase init
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**Or manually via SQL Editor:**

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20240101000000_initial_schema.sql`
3. Paste and run in SQL Editor

This creates:

- ✅ `fonts` table with indexes
- ✅ `foundries` table
- ✅ Row Level Security policies
- ✅ Public read access

### Import Google Fonts

```bash
# First time import (adds fonts, skips duplicates)
npm run fonts:sync

# Refresh (clears and re-imports everything)
npm run fonts:refresh
```

Expected output:

```
✓ Received 1911 fonts from Google Fonts
✓ Successfully inserted 1911 fonts
✓ Saved 674 foundries/designers to database
```

## 🎨 Features in Detail

### Spacebar Generation

Press **Spacebar** to generate new font pairings instantly. The algorithm:

1. Randomly selects a header font from seed data
2. Finds a complementary body font
3. Considers category, legibility, and style
4. Respects locked fonts

### Lock Functionality

Click the **lock icon** to freeze a font:

- Lock header → only body font changes
- Lock body → only header font changes
- Lock both → press unlock to shuffle again

### Search & Discovery

- **Search bar**: Find fonts by name or designer
- **Category filter**: Sans-serif, Serif, Display, Handwriting, Monospace
- **Sort options**: Popularity, Alphabetical, Date Added, Trending
- **Real-time results**: Debounced search with instant previews

### Designer Pages

Click a designer name to:

- See all fonts by that designer
- Learn about the foundry
- Pair fonts from the same designer
- Discover new designers

## 🐛 Troubleshooting

### Fonts Not Loading

**Check:**

1. Database tables created: `supabase db push` (or run migration manually)
2. Fonts imported: `npm run fonts:sync`
3. Environment variables set in `.env`

### Database Connection Error

**Verify:**

- Supabase project is active
- `.env` has correct `VITE_SUPABASE_URL`
- `.env` has correct `VITE_SUPABASE_ANON_KEY`

### Pairing Not Working

**Note:** Pairing uses local seed data in `src/lib/fonts.ts`. It works even without a database connection. If pairing fails, check browser console for errors.

### Script Fails

**Try:**

```bash
# Test if Google Fonts API is accessible
npm run fonts:fetch

# Check Node.js version (requires 18+)
node --version
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder contains your production-ready app.

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
netlify deploy --prod
```

**Don't forget to set environment variables in your deployment platform!**

## 📄 License

This project is built with [Lovable](https://lovable.dev).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📚 Resources

- [Google Fonts](https://fonts.google.com) - Font catalog source
- [Supabase](https://supabase.com) - Database and authentication
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [React Query](https://tanstack.com/query) - Data fetching

---

Made with ❤️ using React, TypeScript, and Supabase
