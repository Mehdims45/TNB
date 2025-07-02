# TracknBuy

A price tracking Progressive Web App built with Next.js and Supabase.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in credentials.
2. Install dependencies:

```bash
npm install
```

3. Run database migrations on Supabase using `db/schema.sql`.
4. Start the development server:

```bash
npm run dev
```


## Deployment

Deploy on Vercel and connect to your Supabase project. Set environment variables from `.env.local` in Vercel. The app works well inside an iOS WebView when deployed as a PWA.
