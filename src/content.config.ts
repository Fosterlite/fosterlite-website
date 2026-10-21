import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const titledText = z.object({ title: z.string(), text: z.string() });

// Page-level copy (hero, meta, page-specific blocks). Body is rendered as prose where the page has one.
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    heading: z.string(),
    lede: z.string().optional(),
    aboutTeaser: z.object({ heading: z.string(), text: z.string() }).optional(),
    differentiators: z.object({ heading: z.string(), items: z.array(titledText) }).optional(),
    process: z.object({ heading: z.string(), steps: z.array(titledText) }).optional(),
  }),
});

// Card copy is `summary`; the Markdown body is the longer services-page copy.
const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    engagements: z.array(z.string()),
    tech: z.array(z.object({ label: z.string().optional(), value: z.string() })),
  }),
});

// Fosterlite's own products. Routes live in src/pages/_work/ and stay off the site while
// site.features.work is false (SCOPE §4). Entries with draft: true are never built.
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      title: z.string(),
      category: z.string(),
      status: z.enum(['inProduction', 'comingSoon']),
      summary: z.string(),
      intro: z.string().optional(),
      tech: z.array(z.string()).default([]),
      externalUrl: z.url().optional(),
      order: z.number(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

const testimonials = defineCollection({
  loader: glob({ base: './src/content/testimonials', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      quote: z.string(),
      company: z.string(),
      name: z.string().optional(),
      role: z.string().optional(),
      /** Our words, shown alongside the quote to explain the work. */
      context: z.string().optional(),
      initials: z.string().max(3).optional(),
      logo: image().optional(),
      /** Written permission to publish received. */
      permission: z.boolean(),
      featured: z.boolean().default(false),
    }),
});

export const collections = { pages, services, work, testimonials };
