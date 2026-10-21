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
      verifying: 'Checking you’re not a bot. This usually takes a second.',
      errors: {
        name: {
          required: 'Enter your name.',
          tooLong: 'Your name must be 100 characters or fewer.',
        },
        company: {
          tooLong: 'Company name must be 100 characters or fewer.',
        },
        email: {
          required: 'Enter your email address.',
          invalid: 'Enter a valid email address, like name@company.com.',
        },
        message: {
          required: 'Tell us a little about your project.',
          tooShort: 'Add a bit more detail (at least 20 characters).',
          tooLong: 'Your message must be 5,000 characters or fewer.',
        },
      },
      status: {
        fixFields: 'Please fix the highlighted fields.',
        verification: 'We couldn’t confirm you’re not a bot. Please try again, or email us at',
        rateLimited:
          'You’ve sent several messages in a short time. Please wait a few minutes, or email us at',
        server: 'Your message didn’t send. Please try again, or email us at',
      },
    },
    success: {
      heading: 'Thanks. Your message is on its way.',
      body: 'We’ll get back to you shortly at the email address you gave.',
    },
    fallback: {
      title: 'Message not sent',
      heading: 'We couldn’t send your message.',
      body: 'Our contact form needs JavaScript for its spam check, or something went wrong on our side. Please email us directly instead. Your message will reach the same inbox.',
      back: 'Back to the contact page',
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
