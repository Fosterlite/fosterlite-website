# fosterlite.com Rebuild — Scope

> Reference doc for the rebuild. Claude Code: read this before making structural decisions. Anything marked **[DECIDE]** is open. Ask rather than assume.

## 1. Goal

Replace the current WordPress (Astra theme) site with a fast, static, hand-built site that looks modern and credible. It should present Fosterlite Solutions Ltd. as a serious software and consulting partner.

**Success looks like:**
- The site reads as a real studio's site, not a theme. No stock starter graphics or placeholder avatars.
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO (mobile).
- Zero server maintenance: no database, no plugins, no PHP.
- Contact form delivers reliably to inbox, with spam filtered.
- Email for @fosterlite.com is unaffected by the cutover.

## 2. Non-goals (v1)

- No CMS or admin UI. Content lives in the repo.
- No blog at launch. The structure should allow one later (see §9).
- No client portal, logins or e-commerce.
- No multilingual site (EN only). French is possible later (decided 2026-10-20), so: UI strings (nav, buttons, form labels/errors, footer) live in one `src/i18n/en.ts` file, page copy lives in content collections, components never hard-code copy, and `<html lang>` comes from config. Adding `/fr` later should only need translation plus Astro i18n routing.

## 3. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Astro 7** | Static output. Use React islands only where interactivity is needed (likely just the form). |
| Styling | Tailwind CSS v4 | Tokens are CSS variables with light/dark values in `src/styles/global.css`, exposed through Tailwind's `@theme` (v4 has no JS config). No scattered hex values. |
| Language | TypeScript 6.x | Pinned below 7 until `@astrojs/check` and `typescript-eslint` support TS 7. |
| Content | Astro content collections (Markdown/MDX + typed schema) | Pages, services, products (`work`) and testimonials as collections. |
| Hosting | **Netlify** (decided 2026-10-20) | Deploy on push to `main`. Deploy previews on PRs. Apex served via A record at the current DNS host (no nameserver move). `_headers` and `_redirects` live in `public/`. Chosen over Cloudflare Pages because Pages can only serve the apex if nameservers move to Cloudflare. |
| Form backend | **Netlify Function → Resend** (decided 2026-10-20) | Sends from an @fosterlite.com address once the domain is verified in Resend (see §10). |
| Spam protection | Cloudflare Turnstile + honeypot field | |
| Analytics | **Cloudflare Web Analytics** (decided 2026-10-20) | Free JS beacon, no cookies, no banner, no DNS change. CSP must allow `static.cloudflareinsights.com` (script) and `cloudflareinsights.com` (connect). Beacon token via `PUBLIC_CF_BEACON_TOKEN`. Mention it in `/privacy`. |
| Fonts | Self-hosted **Instrument Sans** (variable 400–700) via Astro's Fonts API | Downloaded at build and served from our domain. Astro generates a metric-matched Arial fallback; only the Latin subset is preloaded. |

Keep dependencies minimal. No UI kit libraries.

## 4. Site structure

Start as a strong one-pager plus a few dedicated pages, so we have more indexable surface than today's single page.

| Route | Purpose |
|---|---|
| `/` | Home: hero, services overview, testimonial, about teaser, CTA. (Products section returns with `/work`.) |
| `/services` | One section per service, with what we do, typical engagements and tech |
| `/work` | **Suspended (decided 2026-10-21).** Will showcase Fosterlite's own products, not client case studies. On hold pending trademark checks on the product names: no route, nav item, home section, sitemap entry or product name anywhere on the site. |
| `/work/[slug]` | Suspended with `/work`. Product page (problem → what it does → engineering decisions). |
| `/about` | Who we are, how we work, Ottawa-based Canadian corporation |
| `/contact` | Form + direct email |
| `/privacy` | Short privacy policy (form data handling, analytics). PIPEDA-appropriate. |
| `/404` | Custom not-found page |

Navigation: Services · About · Contact (CTA-styled button). Work returns when un-suspended.

**Un-suspending `/work`:** set `site.features.work` to `true` in `src/config/site.ts`, move `src/pages/_work/` back to `src/pages/work/` (underscore folders aren't routed), add the product entries to `src/content/work/` from Demi's local copy, and restore the hero CTA if wanted. Product names must not be committed before then, because the GitHub repo is **public**. Demi's `CONTENT.md` is git-ignored for this reason (decided 2026-10-21).

## 5. Content inventory

Content from the current site, to be **rewritten**, not copied verbatim:

- **Hero:** "Scalable Solutions for Every Business" + custom software tagline → rewrite to be more specific (who we serve, what outcome).
- **Services:** Custom Software Development, Web Design, IT Consulting.
- **About:** paragraph on tailored solutions, long-term partnerships.
- **Testimonial:** Three Hills Capital, company-only attribution, "THC" monogram, with a context line in our words. Uses their existing words, trimmed. A reworded quote naming the product is on hold until the client approves it and the products are un-suspended.
- **Why Us:** Integrity, Innovation, Customer Focus. These are generic; fold into About or replace with concrete differentiators.
- **Contact form fields:** Name, Company, Email, Message.
- **Contact details:** the current site shows no email, phone or address anywhere. Footer is just a copyright line.

**Existing brand assets (found on current site, 2026-10-20):**
- Logo: desk-lamp icon in a circle + lowercase "fosterlite" wordmark. **SVGs supplied by Demi (2026-10-20)** in `src/assets/brand/`: `logo-light.svg` (brand blue **`#364F6B`**, for light backgrounds) and `logo-dark.svg` (`#F5F5F5`, for dark backgrounds). Each is a single traced path (~51 KB, viewBox `170 103 1327 418`). Optimise with SVGO at build/commit time. There's no separate icon-only file; the favicon and small marks can be made by cropping the viewBox to the circle (~`170 103 418 418`).
- The WordPress theme palette (`#060097` blue, `#c10fff` purple, `#ffcd57` yellow) appears to be Astra starter defaults, not brand colours. It doesn't match the logo, so it is **not** carried over unless Demi says otherwise.
- Service and About images are stock photos and the hero/Why Us graphics are Astra starter SVGs. None are reused (per §6).

**Needed from Demi before content is final:**
- [x] Revised hero headline and one-line positioning (CONTENT.md, 2026-10-21)
- [x] ~~2–3 case studies~~: replaced by product pages, now suspended. No longer a launch blocker.
- [x] Tech/skills to highlight: per-service stacks in `src/content/services/`
- [x] Testimonial attribution + permission: company only, existing wording (permission confirmed by Demi 2026-10-21)
- [x] Legal name: **Fosterlite Solutions Ltd.** everywhere (footer, JSON-LD, privacy, About), decided 2026-10-21
- [x] Logo files: SVG light + dark, in `src/assets/brand/`
- [x] Palette (decided 2026-10-20): logo slate blue `#364F6B` as brand colour + **deep teal** accent (light `#0F766E` with white text, dark `#3CC6B6` with dark text; hover `#0B5F58` / `#6FD8CB`). All pairs pass WCAG AA. Chosen over lamp amber and ember orange.
- [x] Contact email for form delivery: contact@fosterlite.com (also shown publicly, decided 2026-10-21)
- [ ] Headshot / team photo (optional)

Until content arrives, build with clearly marked placeholder copy (`TODO:` in content files). Do not invent client names, metrics or testimonials.

**Where content lives (Phase 2):** `src/content/pages/*.md` (hero, meta and body copy per page), `src/content/services/*.md`, `src/content/work/*.md` (products, currently empty while suspended), `src/content/testimonials/*.md`. Schemas in `src/content.config.ts` fail the build on missing fields. Copy source: Demi's local `CONTENT.md` (Draft 2), not committed.

## 6. Design direction

- Clean, confident, restrained. Lots of whitespace, strong typography, one accent color.
- Light theme default. Dark mode follows the visitor's system setting (`prefers-color-scheme`) with **no toggle** (decided 2026-10-20). Colours are CSS-variable tokens with light/dark values, so no JS is needed. Both themes must meet AA contrast. Header swaps `logo-light.svg` / `logo-dark.svg` via `prefers-color-scheme`.
- No stock photography of handshakes or laptops. Prefer typography, simple geometric or abstract visuals, real screenshots of work, and diagrams.
- Subtle motion only (fade/translate on scroll, respecting `prefers-reduced-motion`).
- Fully responsive. Design mobile-first, test at 360px, 768px, 1280px and 1536px.
- Reusable components: `Button`, `Section`, `ServiceCard`, `ProductCard` (was `CaseStudyCard`), `Testimonial`, `CTA`, `Header`, `Footer`.

## 7. Quality requirements

**Accessibility:** WCAG 2.2 AA. Semantic landmarks, visible focus states, labelled form fields, alt text, sufficient contrast, keyboard-navigable menu.

**Performance:**
- Ship near-zero JS outside the form island.
- Optimized images via `astro:assets` (AVIF/WebP, explicit dimensions).
- No layout shift from fonts (`font-display: swap` + metric-matched fallback).

**SEO:**
- Unique `<title>` and meta description per page.
- Open Graph + Twitter card tags with a designed OG image.
- `sitemap.xml` (via `@astrojs/sitemap`) and `robots.txt`.
- Canonical URLs.
- `Organization` / `LocalBusiness` JSON-LD (Ottawa, Canada).

**Security headers** (via `public/_headers`): CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. HSTS deliberately omits `includeSubDomains` because `webmail`/`mail`/`cpanel` subdomains live on the cPanel server and their HTTPS status isn't guaranteed.

## 8. Contact form spec

- Fields: name (required), company (optional), email (required, validated), message (required, min length).
- Client-side validation + server-side validation in the function.
- Turnstile token verified server-side; hidden honeypot field rejects bots silently.
- Show inline success/error states without a page reload. It must also work with JS disabled (falls back to a standard POST + thank-you page).
  - **Decided 2026-10-21:** Turnstile needs JS, so a no-JS post (no token) is **not delivered**. The visitor is redirected to `/contact/error`, which shows contact@fosterlite.com instead. Server errors on the no-JS path land on the same page.
- Secrets (email API key, Turnstile secret) live in host environment variables, never in the repo.
- Basic rate limiting per IP (Netlify Blobs counter keyed on hashed IP, e.g. 5 submissions / 10 min).
- Email: sent via Resend (REST API, no SDK) from `CONTACT_FROM_EMAIL` to `CONTACT_TO_EMAIL` (contact@fosterlite.com), with `Reply-To` set to the submitter.
- Implementation: `netlify/functions/contact.mts` (route `/api/contact`, POST only) wires `src/lib/contact-handler.ts` to Turnstile, Netlify Blobs and Resend. Validation rules in `src/lib/contact.ts` are shared with the browser script. Tests: `npm test`.
- Env vars: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (and public `PUBLIC_TURNSTILE_SITE_KEY`).

## 9. Future-proofing (not v1, but don't block it)

- Blog/insights: add a `posts` content collection + `/insights` route.
- If non-technical editing becomes necessary: Git-based CMS (Decap or TinaCMS) can sit on top of the existing content collections without a rebuild.

## 10. Migration & cutover

> ⚠️ Fosterlite email runs on a hybrid **Microsoft 365 + cPanel** setup. The cutover must touch **only web records**.

**DNS audit (public lookup, 2026-10-20). Re-verify against the cPanel zone export before cutover.**

- Registrar: PDR Ltd. (PublicDomainRegistry). Nameservers: `ns1/ns2.bh-13.webhostbox.net`, so **DNS is managed in the cPanel host's zone**.
- `@` → A `208.91.199.115` (cPanel server, serves WordPress). `www` → CNAME `fosterlite.com`.
- **MX → `mail.fosterlite.com` (A `208.91.199.115`), so inbound mail goes to cPanel, not Microsoft 365.**
- `autodiscover` → A `208.91.199.115`.
- SPF: `v=spf1 +a +mx +ip4:208.91.199.91 +ip4:208.91.199.115 +include:websitewelcome.com +include:spf.protection.outlook.com ~all`
- DKIM: `default._domainkey` (cPanel TXT) and `selector1`/`selector2._domainkey` (CNAMEs to Microsoft 365).
- M365 verification: TXT `MS=ms38989566`.
- DMARC: **none**. Worth adding `p=none` with reporting at some point (separate from this project).
- ⚠️ **`webmail`, `cpanel` and `ftp` are CNAMEs to `fosterlite.com`.** Changing the apex A record will break webmail/cPanel/FTP access. Before cutover, repoint each to an A record `208.91.199.115` (or use the host's own server hostname).
- SPF `+a` currently authorises the web server IP via the apex. After cutover it would authorise the new web host's IPs instead. That's harmless for delivery because `ip4:208.91.199.115` is listed explicitly. Removing `+a` afterwards is optional cleanup.
- Old indexed URLs (WP sitemap): `/`, `/contact-us/`, `/sample-page/`. Redirect `/contact-us/` → `/contact` and `/sample-page/` → `/`. Also `/feed/` → `/`.

**Resend domain verification (additive DNS records only, can be done before cutover):** Resend asks for a DKIM TXT at `resend._domainkey`, plus an MX and SPF TXT on the `send` subdomain (bounce handling). None of these touch the apex MX or SPF, so existing mail is unaffected. Add them in the cPanel Zone Editor exactly as Resend shows them.

1. **Audit before changing anything:**
   - Export the current DNS zone (where are nameservers? registrar, cPanel host, or elsewhere?).
   - Record all MX, SPF (TXT), DKIM (CNAME/TXT), DMARC, `autodiscover` and any M365 verification records.
   - Crawl the current site for indexed URLs (sitemap, `/wp-content/uploads/...` images, any `?p=` or page URLs) and check Google Search Console if connected.
2. **Build & stage** on the Netlify preview URL (`*.netlify.app`).
3. **Redirects:** add a `_redirects` file mapping any old indexed URLs to new routes (301).
4. **Cutover:** change only the `@` and `www` A/CNAME records to the new host. Do **not** move nameservers unless the full zone (including all mail records) is reproduced and verified first.
5. **Verify after cutover:** send/receive test emails to and from @fosterlite.com, run a form submission, check HTTPS on both apex and `www`, and resubmit the sitemap in Search Console.
6. Keep the WordPress install available (not public) for ~30 days as a fallback, then decommission it and the cPanel web hosting if it isn't needed for email.

## 11. Repo conventions

- `main` is production; work happens on branches with PR previews.
- `npm run build` must pass with zero type errors before merge.
- Lint/format: ESLint (typescript-eslint, eslint-plugin-astro, `eslint-plugin-jsx-a11y-x` because the original jsx-a11y doesn't support ESLint 10) + Prettier.
- `README.md` covers local dev, env vars and deploy.
- `CLAUDE.md` points to this file.

## 12. Phases

| Phase | Deliverable |
|---|---|
| 1. Foundation | Astro + Tailwind + TS scaffold, design tokens, layout, Header/Footer, deploy pipeline to preview URL |
| 2. Pages | All routes from §4 with placeholder content in collections |
| 3. Form | Contact function, Turnstile, email delivery, success/error states |
| 4. Content | Real copy, images, OG image (products deferred while `/work` is suspended) |
| 5. Polish | Accessibility + Lighthouse pass, SEO metadata, headers, 404, privacy page |
| 6. Launch | DNS audit, redirects, cutover, post-launch verification (§10) |

## 12a. Launch checklist (blocking)

Run `npm run build && npm run check:launch`. It fails while any built page still contains `TODO`, which covers:

- [x] Hero headline, positioning line, About copy and differentiators supplied
- [x] Tech stack per service confirmed
- [x] Testimonial attribution and `permission: true`
- [ ] No product names anywhere in the build while `/work` is suspended
- [x] Privacy policy: final lawyer-reviewed text (dated October 22, 2026). Privacy inquiries go to LegallyYours (info@legallyyours.org), not contact@fosterlite.com. Change the wording only with legal review, and update the date when it changes.
- [x] Default OG image designed (`public/og-default.png`, default in `BaseLayout`), plus apple-touch-icon and PNG logo for JSON-LD

**Phase 5 results (2026-10-22):** Lighthouse mobile, local build: 100 / 100 / 100 / 100 on every page (404 SEO is lower by design: `noindex`). Live checks found Netlify's injected toolbar script (blocked by our CSP, harmless; disable the Netlify Drawer/toolbar) and a malformed analytics beacon: `PUBLIC_CF_BEACON_TOKEN` held Cloudflare's whole snippet instead of the 32-character token. It must be the token only; the build now ignores any other value and warns. Turnstile is now loaded on first form interaction or 3 s after page load, because its challenge delayed LCP on the contact page to 6.4 s on throttled mobile. The beacon's report is CORS-blocked on `*.netlify.app` because the analytics site is registered for fosterlite.com; expected to work after cutover.

## 13. Open decisions (summary)

- [x] Host: **Netlify**
- [x] Form delivery: **own Netlify Function + Resend**
- [x] Analytics provider: **Cloudflare Web Analytics**
- [x] Ship `/work` at launch: **no**. Suspended pending trademark checks (2026-10-21; reverses the 2026-10-20 decision)
- [x] Dark mode approach: **system preference only, no toggle**
- [x] French version planned? **Not v1; keep i18n-ready** (strings file + content collections)
- [x] Where DNS is currently managed: cPanel host zone (webhostbox nameservers). See §10 audit.
