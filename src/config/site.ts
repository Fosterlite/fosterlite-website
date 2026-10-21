import { t } from '@/i18n';

export const site = {
  name: 'Fosterlite',
  legalName: 'Fosterlite Solutions Limited',
  url: 'https://fosterlite.com',
  defaultDescription:
    'TODO: Fosterlite builds custom software and web platforms for growing businesses. Ottawa, Canada.',
  // TODO: public contact email (SCOPE §5)
  email: '' as string,
  address: {
    locality: 'Ottawa',
    region: 'ON',
    country: 'CA',
  },
} as const;

export const nav = [
  { href: '/services', label: t.nav.services },
  { href: '/work', label: t.nav.work },
  { href: '/about', label: t.nav.about },
] as const;

export const contactHref = '/contact';
