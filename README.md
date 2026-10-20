# Vaso

Website for Βάσω Ζ. Πανταζή & Συνεργάτες, built with Next.js as a static site and published to GitHub Pages.

- Greek pages live at the site root (`/about`), English at `/en` (`/en/about`).
- Pushing to `main` builds and deploys automatically (`.github/workflows/deploy.yml`).

## Editing content

- News articles and reviews: `src/lib/seed-data.ts`
- Office details, team, FAQs: `src/lib/site.ts` and `src/lib/en-content.ts`
- Practice areas: `src/lib/practice-areas.ts`
- Images: put them in `public/images/` (the pages expect `hero.jpg`, `office.jpg`, `consultation.jpg`, `courthouse.jpg` and `posts/*.jpg`).

## Forms

Contact, booking, review and newsletter forms open the visitor's email app with a pre-filled message to the office email.
To receive submissions directly instead, set `FORM_ENDPOINT` in `src/lib/forms.ts` to a Formspree / Getform / Web3Forms URL.

## Local development

```bash
npm install
npm run dev
```
