/**
 * UI strings (nav, buttons, labels, footer). Page copy lives in content collections.
 * Components must read text from here, never hard-code it, so a French file can be added later (SCOPE §2).
 */
export const en = {
  lang: 'en-CA',
  skipToContent: 'Skip to content',
  nav: {
    label: 'Main',
    menu: 'Menu',
    close: 'Close menu',
    home: 'Fosterlite home',
    services: 'Services',
    work: 'Work',
    about: 'About',
    contact: 'Contact',
  },
  cta: {
    primary: 'Start a project',
  },
  footer: {
    tagline: 'TODO: one-line positioning statement',
    location: 'Ottawa, Canada',
    legal: 'Fosterlite Solutions Limited',
    navLabel: 'Footer',
    privacy: 'Privacy',
    rights: 'All rights reserved.',
  },
  notFound: {
    title: 'Page not found',
    heading: 'We couldn’t find that page.',
    body: 'It may have moved, or the link may be out of date.',
    back: 'Back to home',
  },
} as const;

export type Strings = typeof en;
