# Hale Studio

Decoration for homes, offices, and places that need a professional finish. Concept stills when someone needs to see an idea before the studio begins. The model is never the decorator.

## Mock (default)

```bash
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Image generation and speech-to-text stay on **mock** until you set a live provider. Sample stills are labelled on the Imagine desk.

```bash
npm run build
npm run lint
```

## Live providers

Set `AI_IMAGE_PROVIDER` to `openai`, `fal`, or `replicate`, and `AI_STT_PROVIDER` to `openai`, with the matching key. If the key is missing, the app falls back to mock.

**Cost.** Live image calls are billed by the provider. Four complimentary stills per guest is four paid generations. Keep mock for local work unless you intend to spend.

`PUBLIC_APP_URL` (or `SITE_URL`) is the origin used in emails and magic links.

## Seed

`npm run seed` prepares local media folders. The photographed portfolio is curated in `lib/projects.ts` (`SAMPLE_PORTFOLIO`). Replace that file with the studio’s own camera work; do not treat Unsplash stand-ins as client jobs.

## Brand rules for later agents

- Hale / Ellery Hale, Lagos. Homes, offices, and public rooms. Human decorator is the product.
- Imagine starts with a space. Users paint, seat, light, and dress a canvas. Never “AI design” in the nav.
- Copy is written, Nigerian-English, specific. No lorem, no hype, no prices from the model. Budgets in naira.
- One primary button per view. Room photographs stay louder than chrome.
- Do not invent unwired APIs. Mock when a key is absent.
- Guest path only unless asked: cookie `hale_guest`, three complimentary concepts.
- User stills (`/generated`, `/api/media`, `/favorites`) are private. Do not index them.

## What this build includes

- Home, Work, Services, About, Consult
- Imagine: write, voice, optional photograph, four concept stills, send to the studio
- Inquiry + brief + confirmation email (console / Resend / SMTP)
- Studio inbox at `/studio/inbox`
# interiordecor
