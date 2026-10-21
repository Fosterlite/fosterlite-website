# fosterlite.com Rebuild — Scope

> Reference doc for the rebuild. Claude Code: read this before making structural decisions. Anything marked **[DECIDE]** is open. Ask rather than assume.

## 1. Goal

Replace the current WordPress (Astra theme) site with a fast, static, hand-built site that looks modern and credible. It should present Fosterlite Solutions Limited as a serious software and consulting partner.

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
- No multilingual site (EN only). **[DECIDE]** Is French wanted later? If so, keep copy in content files, not hard-coded in components.

## 3. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Astro** (latest stable) | Static output. Use React islands only where interactivity is needed (likely just the form). |
| Styling | Tailwind CSS | Design tokens defined in the Tailwind theme config, not scattered hex values. |
| Language | TypeScript | |
| Content | Astro content collections (Markdown/MDX + typed schema) | Services, case studies, testimonials as collections. |
| Hosting | **Cloudflare Pages** **[DECIDE]**: alt. Netlify / Vercel | Deploy on push to `main`. Preview deploys on PRs. |
| Form backend | Cloudflare Pages Function → transactional email (Resend or Postmark) **[DECIDE]** | Alt: Formspree if we'd rather not own the function. |
| Spam protection | Cloudflare Turnstile + honeypot field | |
| Analytics | Cloudflare Web Analytics or Plausible **[DECIDE]** | Privacy-friendly, no cookie banner needed. |
| Fonts | Self-hosted (no Google Fonts CDN at runtime) | |

Keep dependencies minimal. No UI kit libraries.

## 4. Site structure

Start as a strong one-pager plus a few dedicated pages, so we have more indexable surface than today's single page.

| Route | Purpose |
|---|---|
| `/` | Home: hero, services overview, selected work, testimonial, about teaser, CTA |
| `/services` | One section per service, with what we do, typical engagements and tech |
| `/work` | Case study index **[DECIDE]**: include at launch only if ≥2 case studies are ready |
| `/work/[slug]` | Individual case study (problem → approach → outcome) |
| `/about` | Who we are, how we work, Ottawa-based Canadian corporation |
| `/contact` | Form + direct email |
| `/privacy` | Short privacy policy (form data handling, analytics). PIPEDA-appropriate. |
| `/404` | Custom not-found page |

Navigation: Services · Work · About · Contact (CTA-styled button).

## 5. Content inventory

Content from the current site, to be **rewritten**, not copied verbatim:

- **Hero:** "Scalable Solutions for Every Business" + custom software tagline → rewrite to be more specific (who we serve, what outcome).
- **Services:** Custom Software Development, Web Design, IT Consulting.
- **About:** paragraph on tailored solutions, long-term partnerships.
- **Testimonial:** Three Hills Capital. Needs a real name/title and logo or initials avatar, with permission. Remove the placeholder avatar.
- **Why Us:** Integrity, Innovation, Customer Focus. These are generic; fold into About or replace with concrete differentiators.
- **Contact form fields:** Name, Company, Email, Message.

**Needed from Demi before content is final:**
- [ ] Revised hero headline and one-line positioning
- [ ] 2–3 case studies (can be anonymized): client type, problem, what was built, result
- [ ] Tech/skills to highlight (e.g. Java, Vue/React, cloud)
- [ ] Testimonial attribution + permission
- [ ] Logo files (SVG preferred) and any brand colors to keep
- [ ] Contact email for form delivery
- [ ] Headshot / team photo (optional)

Until content arrives, build with clearly marked placeholder copy (`TODO:` in content files). Do not invent client names, metrics or testimonials.

## 6. Design direction

- Clean, confident, restrained. Lots of whitespace, strong typography, one accent color.
- Light theme default. **[DECIDE]** Dark mode toggle or system-preference only.
- No stock photography of handshakes or laptops. Prefer typography, simple geometric or abstract visuals, real screenshots of work, and diagrams.
- Subtle motion only (fade/translate on scroll, respecting `prefers-reduced-motion`).
- Fully responsive. Design mobile-first, test at 360px, 768px, 1280px and 1536px.
- Reusable components: `Button`, `Section`, `ServiceCard`, `CaseStudyCard`, `Testimonial`, `CTA`, `Header`, `Footer`.

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

**Security headers** (via `_headers`): CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

## 8. Contact form spec

- Fields: name (required), company (optional), email (required, validated), message (required, min length).
- Client-side validation + server-side validation in the function.
- Turnstile token verified server-side; hidden honeypot field rejects bots silently.
- Show inline success/error states without a page reload. It must also work with JS disabled (falls back to a standard POST + thank-you page).
- Secrets (email API key, Turnstile secret) live in host environment variables, never in the repo.
- Basic rate limiting per IP.

## 9. Future-proofing (not v1, but don't block it)

- Blog/insights: add a `posts` content collection + `/insights` route.
- If non-technical editing becomes necessary: Git-based CMS (Decap or TinaCMS) can sit on top of the existing content collections without a rebuild.

## 10. Migration & cutover

> ⚠️ Fosterlite email runs on a hybrid **Microsoft 365 + cPanel** setup. The cutover must touch **only web records**.

1. **Audit before changing anything:**
   - Export the current DNS zone (where are nameservers? registrar, cPanel host, or elsewhere?).
   - Record all MX, SPF (TXT), DKIM (CNAME/TXT), DMARC, `autodiscover` and any M365 verification records.
   - Crawl the current site for indexed URLs (sitemap, `/wp-content/uploads/...` images, any `?p=` or page URLs) and check Google Search Console if connected.
2. **Build & stage** on the host's preview URL (e.g. `*.pages.dev`).
3. **Redirects:** add a `_redirects` file mapping any old indexed URLs to new routes (301).
4. **Cutover:** change only the `@` and `www` A/CNAME records to the new host. Do **not** move nameservers unless the full zone (including all mail records) is reproduced and verified first.
5. **Verify after cutover:** send/receive test emails to and from @fosterlite.com, run a form submission, check HTTPS on both apex and `www`, and resubmit the sitemap in Search Console.
6. Keep the WordPress install available (not public) for ~30 days as a fallback, then decommission it and the cPanel web hosting if it isn't needed for email.

## 11. Repo conventions

- `main` is production; work happens on branches with PR previews.
- `npm run build` must pass with zero type errors before merge.
- Lint/format: ESLint + Prettier.
- `README.md` covers local dev, env vars and deploy.
- `CLAUDE.md` points to this file.

## 12. Phases

| Phase | Deliverable |
|---|---|
| 1. Foundation | Astro + Tailwind + TS scaffold, design tokens, layout, Header/Footer, deploy pipeline to preview URL |
| 2. Pages | All routes from §4 with placeholder content in collections |
| 3. Form | Contact function, Turnstile, email delivery, success/error states |
| 4. Content | Real copy, case studies, images, OG image |
| 5. Polish | Accessibility + Lighthouse pass, SEO metadata, headers, 404, privacy page |
| 6. Launch | DNS audit, redirects, cutover, post-launch verification (§10) |

## 13. Open decisions (summary)

- [ ] Host: Cloudflare Pages vs Netlify vs Vercel
- [ ] Form delivery: own function (Resend/Postmark) vs Formspree
- [ ] Analytics provider
- [ ] Ship `/work` at launch or after case studies exist
- [ ] Dark mode approach
- [ ] French version planned?
- [ ] Where DNS is currently managed
