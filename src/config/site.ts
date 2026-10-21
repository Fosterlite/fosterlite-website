import { t } from '@/i18n';

export const site = {
  name: 'Fosterlite',
  legalName: 'Fosterlite Solutions Limited',
  url: 'https://fosterlite.com',
  defaultDescription:
    'Fosterlite builds custom software, web applications and websites for growing businesses and organizations, and advises on the technology behind them. An experienced team based in Ottawa, Canada.',
  email: 'contact@fosterlite.com' as string,
  address: {
    locality: 'Ottawa',
    region: 'ON',
    country: 'CA',
  },
  features: {
    // Suspended pending trademark checks (SCOPE §4). To restore: set true, move src/pages/_work/
    // back to src/pages/work/, and add the product entries to src/content/work/.
    work: false,
  },
} as const;

export const nav = [
  { href: '/services', label: t.nav.services },
  ...(site.features.work ? [{ href: '/work', label: t.nav.work }] : []),
  { href: '/about', label: t.nav.about },
];

export const contactHref = '/contact';
