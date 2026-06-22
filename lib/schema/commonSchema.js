export function generateCommonSchema({ slug, reviewCount, basePath = "" }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",

    name: slug.replace(/-/g, " "),

    url: `https://www.bitcoinbutik.com/${basePath}${slug}`,

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: reviewCount,
    },
  };
}