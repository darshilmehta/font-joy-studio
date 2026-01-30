# Quick Start Guide

## First Time Setup

1. **Set environment variables** in `.env`:

   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Run migration** to create tables:

   ```bash
   npx supabase db push
   ```

3. **Import fonts** from Google:
   ```bash
   npm run fonts:sync
   ```

That's it! Your app now has ~1,500+ fonts in the database.

## Common Commands

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run fonts:fetch`   | Export fonts to JSON file             |
| `npm run fonts:sync`    | Import fonts to Supabase (first time) |
| `npm run fonts:refresh` | Clear and re-import all fonts         |
| `npm run dev`           | Start development server              |

## How Font Pairing Works

**Local pairing (instant)**

- Uses curated seed data in `src/lib/fonts.ts`
- Spacebar shuffle generates pairs from ~100 fonts
- Lock header/body to constrain generation
- Works offline, no API calls

**Search & discovery (database)**

- Global search queries full Supabase catalog
- Foundry pages show all fonts by designer
- Category filters, sorting, popularity rankings
- Cached with React Query (1 hour)

## Architecture

```
┌─────────────────────────────────────────────────┐
│  React App (src/)                               │
│  ├─ Font pairing (local seed data)              │
│  ├─ Search (API → Supabase)                     │
│  └─ Font loading (Google Fonts CDN)             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Supabase Edge Function (google-fonts/)         │
│  Queries fonts table, returns filtered results  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Supabase Database                              │
│  ├─ fonts table (~1,500 entries)                │
│  └─ foundries table (~200 designers)            │
└─────────────────────────────────────────────────┘
```

## Troubleshooting

**"No fonts found"**

- Run `npm run fonts:sync` to populate database

**"Database error"**

- Check `.env` has correct Supabase credentials
- Run `npx supabase db push` to apply migration

**"Pairing not working"**

- Font pairing uses local data, not API
- Check `src/lib/fonts.ts` has seed data

**Script fails**

- Verify Node.js 18+ installed
- Check Google Fonts API is accessible
- Try `npm run fonts:fetch` first (exports JSON)
