# Hale Studio

Decoration for homes, offices, and public rooms. Furniture from the shop; a human decorator still leads. Imagine is an illustration, not a photograph.

## Mock (default)

```bash
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Image generation and speech-to-text stay on **mock** until a live provider is set. Consult letters and shop orders are addressed to **kennnyfagbenro44@gmail.com** and, while `EMAIL_PROVIDER=console`, they land in `/studio/inbox` (letters) and `/studio/orders` (shop) rather than Gmail.

```bash
npm run build
npm run lint
```

## Live providers

Stay on mock until the client is ready. Then set `AI_IMAGE_PROVIDER` to `openai`, `fal`, or `replicate`, and `AI_STT_PROVIDER` to `openai`, with the matching key. If the key is missing, the app falls back to mock.

**Cost.** Live image calls are billed by the provider. Four complimentary stills per guest is four paid generations. Keep mock for local work unless you intend to spend.

`PUBLIC_APP_URL` (or `SITE_URL`) is the origin used in emails and magic links.

On Vercel, set `DATABASE_URL` to `file:./dev.db` if it is not already set. The build now runs `prisma db push` so tables exist before Next prerenders. SQLite on Vercel is ephemeral — enough for a mock demo, not a lasting mailbox or catalogue.

## Seed

`npm run seed` prepares local media folders and loads a **sample shop catalogue** (Unsplash stills, so the demo paginates). Replace those pieces and photographs from `/studio/products` (same password as the inbox). Set `SAMPLE_CATALOG` in `lib/catalog-meta.ts` to `false` when the studio’s own photographs are listed. Replace the photographed portfolio in `lib/projects.ts` (`SAMPLE_PORTFOLIO`) with the studio’s own camera work; do not treat Unsplash stand-ins as client jobs. The consult portrait is a placeholder until the studio supplies Ellery Hale’s photograph.

## Brand rules for later agents

- Hale / Ellery Hale, Lagos. Homes, offices, and public rooms. Human decorator is the product.
- Imagine is an illustration. Say so on the page. Never treat canvas furniture as product photography.
- Shop demo catalogue is Unsplash until the studio uploads. Copy is written, Nigerian-English, specific. No lorem, no hype. Prices in naira. Checkout is an order to confirm, not a payment — do not invent Paystack or Stripe until asked.
- One primary button per view. Room photographs stay louder than chrome.
- Do not invent unwired APIs. Mock when a key is absent.
- Guest path only unless asked: cookie `hale_guest`. Cart is `hale_cart` in localStorage.
- User stills (`/generated`, `/api/media`, `/favorites`) and shop checkout (`/cart`, `/checkout`, `/order`) are private. Do not index them.

## What this build includes

- Home, Work, Shop (paginated), Imagine (illustration), Services, About, Consult
- Cart and checkout: order to the studio (mailbox + email), not a payment
- Studio desk at `/studio/inbox` (letters), `/studio/products` (pieces and photographs), `/studio/orders`
- Inquiry + brief + confirmation email (console / Resend / SMTP), drop-in `kennnyfagbenro44@gmail.com`
