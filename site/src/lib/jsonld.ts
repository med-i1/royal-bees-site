import { SITE } from '../config';
import type { Product } from '../data/products';

const ORIGIN = 'https://royalbeeseg.com';

export function organizationLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: SITE.name,
    url: ORIGIN + '/',
    logo: ORIGIN + '/favicon.svg',
    telephone: SITE.phone,
    email: SITE.email,
    foundingDate: String(SITE.founded),
    address: { '@type': 'PostalAddress', addressLocality: 'أبو النمرس', addressRegion: 'الجيزة', addressCountry: 'EG' },
    areaServed: ['القاهرة', 'الجيزة'],
  };
}

export function productLd(p: Product, url: string): object {
  const prices = p.variants.map((v) => v.price);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.short,
    image: ORIGIN + p.image,
    url,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'EGP', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: p.variants.length },
  };
}

export function faqLd(items: { q: string; a: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((i, n) => ({ '@type': 'ListItem', position: n + 1, name: i.name, item: i.url })),
  };
}
