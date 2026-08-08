# Anndrea's Birthday Coupon Book

A romantic, mobile-first digital coupon book for Anndrea's 25th birthday — made with love by Alex.

Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, Motion, Supabase, and localStorage cache.

## Installation

```bash
npm install
cp .env.example .env.local
```

Add your Supabase **service role** key to `.env.local` (see below).

## Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run start
npm run lint
```

## Supabase sync (required for cross-device saves)

Redemptions sync through Next.js API routes to Supabase so Anndrea’s progress follows her on any phone or browser.

1. Open your Supabase project → **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server only — never put this in client code)
3. Put both in `.env.local` and in **Vercel → Project → Settings → Environment Variables**
4. Redeploy / restart `npm run dev`

Optional: `COUPON_BOOK_ID` (defaults to `anndrea-birthday`).

The table `coupon_book_state` is already created with RLS enabled (no public anon access). The browser never talks to Supabase directly.

LocalStorage still caches the latest state for fast loads / offline fallback. If the database is empty and this device has local redemptions, they upload once automatically. If the database already has data, the database wins.

## Birthday countdown

Edit in [`config/site.ts`](config/site.ts):

```ts
birthdayDate: "2026-07-31",
birthdayTimezone: "America/Toronto",
countdownEnabled: true,
```

Counts down to midnight at the start of July 31 in that timezone. After the target, it shows a birthday-ready message instead of ticking numbers.

## Monchhichi-inspired theme

The site uses an **original cozy monkey-doll aesthetic** (soft fur browns, peach faces, rosy cheeks, pink bows, paw prints) — not official Monchhichi artwork.

- Mascots & bows: [`components/decor/CuteDecor.tsx`](components/decor/CuteDecor.tsx)
- Palette & plush textures: [`app/globals.css`](app/globals.css)
- Theme tagline: `themeTagline` / `themeName` in [`config/site.ts`](config/site.ts)
- Optional custom images later: [`public/theme/`](public/theme/)

## How to change names

Edit [`config/site.ts`](config/site.ts):

```ts
recipientName: "Anndrea",
senderName: "Alex",
birthdayAge: 25,
welcomeTitle: "Happy 25th Birthday, Anndrea!",
welcomeSubtitle: "A little book of love, surprises, and adventures from Alex.",
```

## How to edit birthday messages

In [`config/site.ts`](config/site.ts):

- `birthdayMessage` — letter after opening the gift
- `finalHeading` / `finalMessage` — closing note
- `secretMessage` / `secretCouponHint` — revealed after tapping the heart 5 times
- `relationshipDate` — optional `YYYY-MM-DD` for the days-together counter

“Reasons I love you” lines live in [`data/love-reasons.ts`](data/love-reasons.ts).

## How to add or remove coupons

Edit [`data/coupons.ts`](data/coupons.ts). Each coupon needs:

- `id`, `couponNumber`, `title`, `description`, `category`
- `icon` (see `components/coupons/CouponIcon.tsx` for supported names)
- `maxRedemptions` (default `3`)
- `variant`, `indicatorStyle`
- `requiresWish: true` for the custom wish coupon

## How to change the maximum redemption quantity

Update `maxRedemptions` on each coupon in [`data/coupons.ts`](data/coupons.ts). Remaining uses are always calculated as:

```ts
maxRedemptions - redemptionHistory.length
```

They never go below 0 or above `maxRedemptions`.

## Optional background music

Place a file at `public/music/birthday.mp3`. Music **never autoplays** — Anndrea can enable it from the header / settings. If the file is missing, the control stays hidden.

## Alex dashboard + notifications

Open **`/alex`** for a private login and live inbox of every coupon redemption (including wish text).

1. Run the migration [`supabase/migrations/20260808000000_create_alex_notifications.sql`](supabase/migrations/20260808000000_create_alex_notifications.sql) in your Supabase SQL editor (or via the Supabase CLI).
2. Sign in at `/alex/login` with Alex’s password (`ALEX_PASSWORD`, or the same `RESET_PASSWORD` / `resetPassword` used for resets).
3. Keep the dashboard open — it polls every few seconds and highlights new redemptions.

### Email alerts (optional)

Add these env vars locally and in Vercel:

- `RESEND_API_KEY` — from [Resend](https://resend.com)
- `RESEND_FROM_EMAIL` — e.g. `Coupon Book <onboarding@resend.dev>` (or your verified domain)
- `ALEX_NOTIFY_EMAIL` — where Alex should receive alerts
- `NEXT_PUBLIC_SITE_URL` — production URL for the dashboard link in emails

When Anndrea redeems a coupon, the API stores an inbox row and emails Alex (wish text included when present).

## Reset

Reset is behind Alex’s password (default in [`config/site.ts`](config/site.ts) as `resetPassword`, overridable with env `RESET_PASSWORD`). From the settings gear, enter the password to erase Supabase + local cache. Resetting also clears the Alex inbox.

## Deploy to Vercel

1. Push this repo to GitHub / connect the Vercel project
2. Add env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy
4. Share the private URL only with Anndrea

## Project structure

```text
app/                      # App Router pages + API routes
app/alex/                 # Alex login + live redemption dashboard
app/api/coupon-book/      # GET/PUT sync endpoints
app/api/alex/             # Alex auth + notification feed
components/alex/          # Dashboard UI
components/birthday/      # Welcome, countdown, letter, finale
components/coupons/       # Coupon book + redemption flow
config/site.ts            # Names, messages, countdown (EDIT HERE)
data/coupons.ts           # Coupon definitions (EDIT HERE)
lib/alex-auth.ts          # Cookie session for /alex
lib/alex-notifications.ts # Inbox rows + email fan-out
lib/coupon-service.ts     # Pure redeem / undo / pluralize logic
lib/coupon-storage.ts     # localStorage cache + sanitizers
lib/coupon-repository.ts  # Supabase read/write
lib/supabase/server.ts    # Service-role client
proxy.ts                  # Protects /alex routes
supabase/migrations/      # SQL migrations
```
