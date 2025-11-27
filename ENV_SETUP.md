# Environment Variables Setup

This file has been created automatically and contains the necessary configuration for your FinancePro contact form application.

## Current Configuration

The `.env.local` file contains:

- **VITE_SUPABASE_URL**: Your Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous key (public)
- **VITE_GOOGLE_PLACES_API_KEY**: (Optional) Google Places API key for address autocomplete

## Security Notes

✅ **Safe to commit**: The `.env.local` file is already excluded from Git (via `*.local` in `.gitignore`)

✅ **Fallback values**: The app includes fallback values in `src/lib/supabase.ts` so it will work even without the .env.local file

⚠️ **Anon key is public**: The Supabase anon key is meant to be public and is safe to use in client-side code. Row Level Security (RLS) policies protect your data.

## Usage

The environment variables are automatically loaded by Vite and can be accessed in your code using:

```typescript
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
import.meta.env.VITE_GOOGLE_PLACES_API_KEY
```

## Google Places API

To enable address autocomplete:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the "Places API" for your project
3. Either:
   - Add `VITE_GOOGLE_PLACES_API_KEY=your_key_here` to `.env.local`, OR
   - Configure it in the app's Settings dialog (Paramètres > Adresses tab)

## Changing Configuration

If you need to use a different Supabase project:

1. Update the values in `.env.local`
2. Restart your development server (`npm run dev`)

The app will automatically use the new values.
