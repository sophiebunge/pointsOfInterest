# Point of Interest — Exhibition App

A lightweight web app that lets visitors create a personal session, scan NFC tags on artworks, and receive a visual map of their journey at the end.

Built with **Next.js**, **Supabase**, and **NFC tags**. No app install required for visitors.

---

## Project Structure

```
exhibition-app/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # / → Entry, creates session
│   ├── ready/page.js      # /ready → Journey started screen
│   ├── scan/page.js       # /scan?artwork=X → Logs artwork scan
│   └── exit/page.js       # /exit → Shows full journey
├── lib/
│   └── supabase.js        # Supabase client
├── supabase/
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Test artwork data
├── .env.example           # Required environment variables
└── README.md
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/exhibition-app.git
cd exhibition-app
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Then run `supabase/seed.sql` to add test artworks
4. Go to **Settings → API** and copy your project URL and anon key

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run locally

```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## Testing on iPhone with ngrok

```bash
# Install once
brew install ngrok
ngrok config add-authtoken YOUR_TOKEN  # free at ngrok.com

# Run alongside npm run dev
ngrok http 3000
```

You'll get a URL like `https://abc123.ngrok.io` — use this when writing NFC tags.

---

## Writing NFC Tags

Download **NFC Tools** (free, App Store) and write these URLs:

| Tag | URL |
|-----|-----|
| Entry | `https://abc123.ngrok.io/` |
| Artwork 1 | `https://abc123.ngrok.io/scan?artwork=artwork-01` |
| Artwork 2 | `https://abc123.ngrok.io/scan?artwork=artwork-02` |
| Artwork 3 | `https://abc123.ngrok.io/scan?artwork=artwork-03` |
| Exit | `https://abc123.ngrok.io/exit` |

The `artwork-01` value must match the `nfc_code` field in your `artworks` table.

---

## Visitor Flow

1. **Tap Entry tag** → new session created, ID saved to phone
2. **Tap artwork tags** → each scan logged with timestamp
3. **Tap Exit tag** → journey ends, personal map shown

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in the Vercel dashboard under **Settings → Environment Variables**. Update NFC tags with your permanent Vercel URL.

---

## Roadmap

- [ ] Note-taking on scan page
- [ ] Generative visual map on exit page
- [ ] Admin panel to manage artworks
- [ ] QR code fallback for phones without NFC
