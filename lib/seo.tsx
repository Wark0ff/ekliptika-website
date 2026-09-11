import { SITE, SERVICES, FAQ } from './site';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE.url}/#organization`,
    name: SITE.brandFull,
    legalName: SITE.requisites.legalName,
    alternateName: SITE.brand,
    url: SITE.url,
    logo: `${SITE.url}/icon`,
    image: `${SITE.url}/opengraph-image`,
    telephone: SITE.phoneHref,
    email: SITE.email,
    description: SITE.descriptionShort,
    slogan: SITE.slogan,
    areaServed: [
      { '@type': 'City', name: 'Москва' },
      { '@type': 'AdministrativeArea', name: 'Московская область' },
    ],
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressCountry: 'RU' },
    identifier: [
      { '@type': 'PropertyValue', name: 'ИНН', value: SITE.requisites.inn },
      { '@type': 'PropertyValue', name: 'ОГРН', value: SITE.requisites.ogrn },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги строительной компании',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.text },
      })),
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.brand,
    url: SITE.url,
    inLanguage: 'ru-RU',
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function faqJsonLd(items: { q: string; a: string }[] = FAQ) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
