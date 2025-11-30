export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'Alajo',
    description: 'Digital savings platform offering traditional ajo contribution system with modern technology. Save daily, weekly, or monthly with secure online platform.',
    url: 'https://alajo.ng',
    logo: 'https://alajo.ng/logo.png',
    image: 'https://alajo.ng/og-image.png',
    telephone: '+234-907-114-2022',
    email: 'hello@alajo.ng',
    foundingDate: '2024',
    founder: [
      {
        '@type': 'Person',
        name: 'Yemi Dada',
        jobTitle: 'Co-Founder & CEO',
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Lagos State University',
        },
        knowsAbout: ['Financial Services', 'Savings', 'Ajo', 'Microfinance', 'Insurance'],
      },
      {
        '@type': 'Person',
        name: 'Azeez Agbona O.',
        jobTitle: 'Co-Founder & CTO',
        knowsAbout: ['Software Development', 'SaaS', 'Fintech', 'Enterprise Architecture', 'Cloud Computing'],
        affiliation: [
          {
            '@type': 'Organization',
            name: 'Harzotech Nigeria Ltd',
          },
          {
            '@type': 'Organization',
            name: 'Harzotech Innovative Solutions UK',
          },
        ],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2, Azeez Olaoluwa Str, Orisunbare',
      addressLocality: 'Ayobo',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '6.5244',
      longitude: '3.3792',
    },
    sameAs: [
      'https://twitter.com/alajong',
      'https://facebook.com/alajong',
      'https://instagram.com/alajong',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
    },
    offers: {
      '@type': 'Offer',
      description: 'Flexible savings plans with daily, weekly, and monthly contribution options',
      availability: 'https://schema.org/InStock',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alajo',
    url: 'https://alajo.ng',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://alajo.ng/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Alajo',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'NGN',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Alajo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Alajo is a digital savings platform that brings the traditional Nigerian ajo (contribution) system online. Save money daily, weekly, or monthly with our secure and flexible platform.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Alajo work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Alajo allows you to create savings plans, make regular contributions (daily, weekly, or monthly), track your progress, and withdraw your savings when you reach your goals. Our platform combines traditional ajo with modern technology for a seamless savings experience.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Alajo secure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Alajo uses bank-level security with encrypted transactions, secure data storage, and regular security audits to protect your money and personal information.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I start saving with Alajo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simply register on our platform, create a savings plan with your target amount and contribution frequency, then start making contributions through our secure payment system.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
