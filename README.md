# Βάσω Ζ. Πανταζή & Συνεργάτες — Δικηγορικό Γραφείο

Static website built with **Next.js 16 (App Router, static export) + Tailwind CSS v4**.
No server or database: `npm run build` produces plain HTML/CSS/JS in `out/` that any static host can serve.

## Features

- Home, about & team, 8 practice areas, articles (search + categories), reviews, contact, booking request (Greek public holidays + Orthodox Easter logic), privacy policy.
- Google Translate toggle (EL ↔ EN).
- Dark navy + gold design with serif/sans typography, scroll animations, mobile-first.

## Editing content

| What | Where |
| --- | --- |
| Articles and reviews | `src/lib/seed-data.ts` (add an entry; set `published: false` / `approved: false` to hide one) |
| Office details, phones, email, hours | `src/lib/site.ts` |
| Practice areas | `src/lib/practice-areas.ts` |
| Images | `public/images/` (`hero.jpg`, `office.jpg`, `consultation.jpg`, `courthouse.jpg`, `posts/*.jpg`) |

Push to `main` and the host rebuilds the site.

## Forms

Contact, booking, review and newsletter forms open the visitor's email app with a pre-filled message to the office email (`site.email`). Nothing is stored on the site, and bookings are requests that the office confirms.

To receive submissions directly instead, set `FORM_ENDPOINT` in `src/lib/forms.ts` to a form service URL (Formspree, Getform, Web3Forms, …).

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

Requires Node.js 20+.

## Hosting

The site is hosted on Vercel, which builds `main` automatically. Any static host works too: upload the contents of `out/`.
