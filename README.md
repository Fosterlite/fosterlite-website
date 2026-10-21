# fosterlite.com

Marketing site for Fosterlite Solutions Limited. Static [Astro](https://astro.build) site with Tailwind CSS, hosted on Netlify. See [SCOPE.md](SCOPE.md) for the full brief.

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

| Variable                    | Used for                                                |
| --------------------------- | ------------------------------------------------------- |
| `PUBLIC_CF_BEACON_TOKEN`    | Cloudflare Web Analytics. Analytics are off when unset. |
| `PUBLIC_TURNSTILE_SITE_KEY` | Contact form spam check (public key). Phase 3.          |
| `TURNSTILE_SECRET_KEY`      | Contact form spam check (server). Phase 3.              |
| `RESEND_API_KEY`            | Sending contact form emails. Phase 3.                   |
| `CONTACT_TO_EMAIL`          | Inbox that receives enquiries. Phase 3.                 |
| `CONTACT_FROM_EMAIL`        | Sender address, e.g. `website@fosterlite.com`. Phase 3. |

## Deploy

Netlify builds from this repo using `netlify.toml`:

- Pushes to `main` deploy to production.
- Pull requests get a deploy preview URL.

Security headers are in `public/_headers` and old WordPress redirects are in `public/_redirects`. DNS cutover steps are in SCOPE.md §10. Change only the web records; email depends on the rest.
