# Βάσω Ζ. Πανταζή & Συνεργάτες — Δικηγορικό Γραφείο

Full-stack website built with **Next.js 16 (App Router) + PostgreSQL + Drizzle ORM + Tailwind CSS v4**.

## Features

- Public site: home, about & team, 8 practice areas, searchable articles, reviews, contact, online booking (with Greek public holidays + Orthodox Easter logic), embedded Google Translate toggle (EL ↔ EN).
- Admin panel at `/admin`: dashboard, messages inbox, appointment management, review moderation, full Markdown article editor with preview, newsletter subscribers.
- Dark navy + gold design with serif/sans typography, scroll animations, mobile-first.

## Requirements

- **Node.js 20+**
- **PostgreSQL 14+** running locally (or a reachable instance)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy the example environment file and edit it
cp .env.example .env
# Edit .env and set DATABASE_URL + ADMIN_PASSWORD

# 3. Push the database schema (creates tables in your Postgres DB)
npx drizzle-kit push

# 4. Start the development server
npm run dev
```

The site opens at <http://localhost:3000>. The admin panel is at <http://localhost:3000/admin>.

On first page load the database is seeded with the starter articles and sample reviews (controlled by a one-time guard in `site_meta`).

## Production build

```bash
npm run build
npm start
```

## Scripts

| Script             | Purpose                                  |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Next.js development server     |
| `npm run build`    | Create an optimized production build     |
| `npm run start`    | Serve the production build               |
| `npm run lint`     | Run ESLint                               |
| `npm run typecheck`| Run the TypeScript compiler in noEmit mode |

## Project layout

```
src/
  app/
    (site)/        # Public pages (home, about, practice-areas, news, contact, reviews, booking, privacy)
    admin/         # Password-protected admin panel
    api/           # API routes (health, availability, download-source)
  components/      # Shared UI (Header, Footer, BookingForm, PostCard, LanguageSwitcher, admin/*, ...)
  db/              # Drizzle client + schema
  lib/             # Business logic (booking, site config, practice-areas, auth, seed data, ...)
public/
  images/          # Static images
    hero.jpg       # Homepage hero (Lady Justice statue)
    office.jpg     # Office interior
    courthouse.jpg # Courthouse columns
    consultation.jpg # Client consultation
    posts/         # Article cover images
      rights.jpg
      detention.jpg
      family.jpg
      cyber.jpg
      courtroom.jpg
```

**Note:** All images are included in the `public/images/` folder. They're referenced as `/images/filename.jpg` in the code.

## Admin access

Set `ADMIN_PASSWORD` in `.env`, then sign in at `/admin/login`.

## Adding content

- **Articles**: Admin → Articles → New article. Use Markdown for the body. Pick a cover from `/images/` or paste a URL.
- **Practice areas**: edit `src/lib/practice-areas.ts`.
- **Team / stats / FAQs**: edit `src/lib/site.ts`.
- **Images**: drop files in `public/images/` and reference them as `/images/your-file.jpg`.

## Greek public holidays

`src/lib/booking.ts` computes Orthodox Easter each year and blocks all Greek public holidays (fixed + movable) from the online booking calendar.

## License

Private project — all rights reserved.
