import { describe, it, expect } from 'vitest';
import { organizationLd, productLd, faqLd, breadcrumbLd } from '../../src/lib/jsonld';
import { bySlug } from '../../src/data/products';

describe('json-ld', () => {
  it('describes the product price range in EGP', () => {
    const ld = productLd(bySlug('sidr-doani')!, 'https://royalbeeseg.com/product/sidr-doani/') as Record<string, any>;
    expect(ld['@type']).toBe('Product');
    expect(ld.offers).toEqual({ '@type': 'AggregateOffer', priceCurrency: 'EGP', lowPrice: 850, highPrice: 1500, offerCount: 2 });
  });
  it('describes the business in Abu El Nomros, founded 1990', () => {
    const ld = organizationLd() as Record<string, any>;
    expect(ld.foundingDate).toBe('1990');
    expect(ld.telephone).toBe('0238090519');
    expect(ld.address).toMatchObject({ addressLocality: 'أبو النمرس', addressRegion: 'الجيزة', addressCountry: 'EG' });
  });
  it('builds FAQ and breadcrumb lists', () => {
    expect((faqLd([{ q: 'س', a: 'ج' }]) as any).mainEntity[0]).toEqual({ '@type': 'Question', name: 'س', acceptedAnswer: { '@type': 'Answer', text: 'ج' } });
    expect((breadcrumbLd([{ name: 'الرئيسية', url: 'https://x/' }]) as any).itemListElement[0].position).toBe(1);
  });
});
