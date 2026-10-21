import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
    principles: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    whatWeDo: z.array(z.string()),
    engagements: z.array(z.string()),
    tech: z.array(z.string()),
  }),
});

// Case studies. Body follows ## Problem / ## Approach / ## Outcome.
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      industry: z.string(),
      summary: z.string(),
      services: z.array(reference('services')),
      tech: z.array(z.string()).default([]),
      year: z.number().optional(),
      order: z.number(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      outcomes: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      /** True while the entry is TODO content. Must be false for every entry before launch. */
      placeholder: z.boolean().default(false),
    }),
});

const testimonials = defineCollection({
  loader: glob({ base: './src/content/testimonials', pattern: '*.md' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    company: z.string(),
    /** Written permission to publish received. */
    permission: z.boolean(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { pages, services, work, testimonials };
