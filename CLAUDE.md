# Fosterlite website

Read [SCOPE.md](SCOPE.md) before making structural decisions. It is the source of truth for goals, decisions and phases. Ask rather than assume on anything still open, and update SCOPE.md when a decision is made.

Key conventions:

- Static Astro 7 site, deployed on Netlify. No adapter; the contact form will be a Netlify Function in `netlify/functions/`.
- Design tokens live in `src/styles/global.css` (Tailwind v4 `@theme`). Use the token utilities (`bg-surface`, `text-ink-muted`, `bg-accent`, …), never raw hex values in components.
- UI strings live in `src/i18n/en.ts`, page copy in content collections. Never hard-code copy in components (French may come later).
- Placeholder copy is marked `TODO:`. Never invent client names, metrics or testimonials.
- Brand source files are in `design/brand/` (not shipped). Run `npm run optimize:svg` to regenerate `src/assets/brand/`.
- `npm run build` (runs `astro check`) must pass with zero errors; also run `npm run lint` and `npm run format:check`.
- TypeScript is pinned to 6.x because `@astrojs/check` and `typescript-eslint` don't support TS 7 yet.
