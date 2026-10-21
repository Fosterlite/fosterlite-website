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
    heading: 'Have a project in mind?',
    text: 'Tell us what you’re trying to do. We’ll get back to you with next steps.',
  },
  home: {
    servicesHeading: 'What we do',
    workHeading: 'Selected work',
    workAll: 'All case studies',
    aboutLink: 'More about us',
  },
  services: {
    whatWeDo: 'What we do',
    engagements: 'Typical engagements',
    tech: 'Tools and technology',
    learnMore: 'Learn more',
  },
  work: {
    client: 'Client',
    industry: 'Industry',
    services: 'Services',
    year: 'Year',
    tech: 'Technology',
    readCase: 'Read case study',
    next: 'Next case study',
    placeholder: 'Placeholder',
  },
  testimonial: {
    pending: 'Attribution pending permission',
  },
  contact: {
    emailLabel: 'Prefer email?',
    form: {
      name: 'Name',
      company: 'Company',
      optional: 'optional',
      email: 'Email',
      message: 'How can we help?',
      messageHint: 'A few sentences about the project, timeline or problem is plenty.',
      honeypot: 'Leave this field empty',
      submit: 'Send message',
      sending: 'Sending…',
    },
    thanks: {
      title: 'Message sent',
      heading: 'Thanks. Your message is on its way.',
      body: 'We’ll get back to you shortly.',
      back: 'Back to home',
    },
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
