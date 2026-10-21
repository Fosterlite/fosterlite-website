# fosterlite.com

Marketing site for Fosterlite Solutions Ltd. Static [Astro](https://astro.build) site with Tailwind CSS, hosted on Netlify. See [SCOPE.md](SCOPE.md) for the full brief.

## Local development

Requires Node 22.22+ (Netlify builds with Node 24; see `.nvmrc`).

```sh
npm install
cp .env.example .env   # optional; all variables are optional locally
npm run dev            # http://localhost:4321
```

| Script                            | What it does                                           |
| --------------------------------- | ------------------------------------------------------ |
| `npm run dev`                     | Dev server with hot reload                             |
| `npm run build`                   | Type-check (`astro check`) then build to `dist/`       |
| `npm run preview`                 | Serve the built `dist/` locally                        |
| `npm test`                        | Contact form handler tests (Node built-in test runner) |
| `npm run lint`                    | ESLint (TypeScript + Astro + a11y rules)               |
| `npm run format` / `format:check` | Prettier                                               |
| `npm run optimize:svg`            | Optimise `design/brand/*.svg` into `src/assets/brand/` |

## Project layout

```
design/brand/        Original logo files (not shipped)
public/              Static files: favicon, robots.txt, _headers, _redirects
src/assets/brand/    Optimised logos used by the site
src/components/      Header, Footer, Button, Section, Logo, …
src/config/site.ts   Site name, URL, nav, contact details
src/i18n/en.ts       All UI strings
src/layouts/         BaseLayout (meta tags, SEO, JSON-LD, analytics)
src/pages/           Routes
src/styles/global.css  Design tokens (colours, type scale) and base styles
```

## Environment variables

Set these in Netlify → Site configuration → Environment variables. Never commit them.

| Variable                    | Used for                                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `PUBLIC_CF_BEACON_TOKEN`    | Cloudflare Web Analytics. Analytics are off when unset.                                               |
| `PUBLIC_TURNSTILE_SITE_KEY` | Contact form spam check (public key).                                                                 |
| `TURNSTILE_SECRET_KEY`      | Contact form spam check (server).                                                                     |
| `RESEND_API_KEY`            | Sending contact form emails.                                                                          |
| `CONTACT_TO_EMAIL`          | Inbox that receives enquiries.                                                                        |
| `CONTACT_FROM_EMAIL`        | Sender, e.g. `Fosterlite Website <website@fosterlite.com>`. Must be on the domain verified in Resend. |

## Contact form

`POST /api/contact` is a Netlify Function (`netlify/functions/contact.mts`). It checks the hidden honeypot field, validates input (`src/lib/contact.ts`, shared with the browser), verifies the Cloudflare Turnstile token, applies a per-IP limit of 5 messages per 10 minutes (Netlify Blobs, hashed IPs), then sends the email through Resend.

Without JavaScript the form still posts, but Turnstile can't run, so the visitor is redirected to `/contact/error`, which shows the email address. Local builds use Cloudflare's always-pass test site key; Netlify builds fail if `PUBLIC_TURNSTILE_SITE_KEY` is missing.

## Deploy

Netlify builds from this repo using `netlify.toml`:

- Pushes to `main` deploy to production.
- Pull requests get a deploy preview URL.

Security headers are in `public/_headers` and old WordPress redirects are in `public/_redirects`. DNS cutover steps are in SCOPE.md §10. Change only the web records; email depends on the rest.
