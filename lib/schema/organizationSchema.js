export function generateOrganizationSchema({ rating, reviewCount }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BitcoinButik",
    url: "https://www.bitcoinbutik.com",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviewCount,
    },
  };
}