# Migration Guide: Converting to Next.js + Supabase Estimate Generator

## Overview
This repository needs to be migrated from Vite to Next.js with Supabase integration. All files from the Perplexity response need to be properly implemented.

## Quick Migration Steps

### Option 1: Clone and Replace (RECOMMENDED)

```bash
# 1. Clone the repository locally
git clone https://github.com/MyersDigitalServicesAI/MyersDigital-Estimate-Generator.git
cd MyersDigital-Estimate-Generator

# 2. Delete all old Vite files (keep .git folder)
rm -rf App.tsx index.html index.tsx metadata.json tsconfig.json types.ts vite.config.ts

# 3. Create Next.js structure
mkdir -p app/dashboard app/auth lib components

# 4. Go to the Perplexity tab and download/copy each file:
# - lib-supabase.ts → lib/supabase.ts  
# - app-layout-page.tsx → app/layout.tsx and app/page.tsx
# - app-auth-pages.tsx → app/auth/page.tsx
# - app-dashboard-estimates.tsx → app/dashboard/page.tsx
# - components-estimate-form.tsx → components/EstimateForm.tsx
# - package.json → package.json (replace existing)
# - setup-guide.md → SETUP.md

# 5. Install dependencies
npm install

# 6. Configure environment variables
# Copy .env.local and add your Supabase keys

# 7. Commit and push
git add .
git commit -m "Migrate to Next.js with Supabase"
git push origin main
```

### Option 2: Manual File Creation via GitHub Web

If you can't clone locally, follow these steps in GitHub web interface:

1. **Delete old files one by one:**
   - vite.config.ts
   - types.ts
   - index.tsx  
   - index.html
   - App.tsx
   - metadata.json
   - tsconfig.json (will be replaced)

2. **Create new folder structure using "Add file" > "Create new file":**
   - Type: `lib/supabase.ts` (creates lib folder + file)
   - Paste content from Perplexity "lib-supabase.ts"
   - Commit

3. **Continue for each file:**
   - `app/layout.tsx`
   - `app/page.tsx`
   - `app/auth/page.tsx`
   - `app/dashboard/page.tsx`
   - `components/EstimateForm.tsx`
   - Update `package.json`
   - Update `.env.local`

## File Mapping from Perplexity Response

| Perplexity File | GitHub Location |
|---|---|
| lib-supabase.ts | `lib/supabase.ts` |
| app-layout-page.tsx | `app/layout.tsx` + `app/page.tsx` |
| app-auth-pages.tsx | `app/auth/page.tsx` |
| app-dashboard-estimates.tsx | `app/dashboard/page.tsx` |
| components-estimate-form.tsx | `components/EstimateForm.tsx` |
| package.json | `package.json` |
| setup-guide.md | `SETUP.md` |

## Required Dependencies

From the package.json file in Perplexity, you'll need:

```json
{
  "dependencies": {
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}
```

## Supabase Setup

1. Go to supabase.com
2. Create new project  
3. Get API keys from Settings > API
4. Create database tables (see setup-guide.md in Perplexity)
5. Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
# Follow prompts
# Add environment variables in Vercel dashboard
```

## Next Steps After Migration

1. ✅ Clone repository locally
2. ✅ Delete old Vite files
3. ✅ Create Next.js folder structure
4. ✅ Copy all files from Perplexity
5. ✅ Install dependencies
6. ✅ Setup Supabase
7. ✅ Configure .env.local
8. ✅ Test locally with `npm run dev`
9. ✅ Deploy to Vercel
10. ✅ Verify production deployment

## Troubleshooting

- **Module not found errors**: Run `npm install`
- **Supabase errors**: Check `.env.local` keys
- **Build errors**: Ensure all files are in correct folders
- **TypeScript errors**: Check tsconfig.json from Perplexity package

## Need Help?

All the complete code is available in the Perplexity search result. Each file card can be clicked to view and copy the full code.

---

**Status**: Ready to migrate
**Estimated Time**: 30-60 minutes  
**Complexity**: Medium
