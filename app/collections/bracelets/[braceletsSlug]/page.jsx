// app/collections/bracelets/[braceletsSlug]/page.jsx
// ✅ Server Component — NO 'use client'

import BraceletsDetailClient from './BraceletsDetailClient';
import SeoSchema from "@/components/SeoSchema";
import reviewCounts from "@/data/reviewCounts";

const API_URL = "https://api.bitcoinbutik.com";
const SITE_URL = "https://www.bitcoinbutik.com";

const createSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ✅ generateStaticParams — pre-renders known bracelet pages at build time
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${API_URL}/api/products?category=Bracelets`,
      { cache: 'no-store' }
    );
    if (!response.ok) return [];
    const products = await response.json();

    return products
      .filter((p) => p.title || p.name)
      .map((product) => ({
        braceletsSlug: product.slug || createSlug(product.title || product.name || ''),
      }));
  } catch (error) {
    console.error('generateStaticParams error:', error);
    return [];
  }
}

// ✅ Full SEO metadata including openGraph
export async function generateMetadata({ params }) {
  const { braceletsSlug } = await params;

  try {
    const response = await fetch(
      `${API_URL}/api/products?category=Bracelets`,
      { cache: 'no-store' }
    );
    if (!response.ok) throw new Error('Failed to fetch');

    const products = await response.json();
    const product = products.find(
      (p) => (p.slug || createSlug(p.title || p.name || '')) === braceletsSlug
    );

    if (!product) {
      return {
        title: 'Bracelet Not Found | BitcoinButik',
        robots: { index: false },
      };
    }

    const title = `${product.title || product.name} | Luxury Bracelet – BitcoinButik`;
    const description =
      product.description ||
      `Shop ${product.title || product.name} at BitcoinButik. Luxury Bitcoin-themed jewellery crafted in silver and gold.`;

    const firstImage =
      product.image?.[0]
        ? product.image[0].startsWith('http')
          ? product.image[0]
          : `${API_URL}/${product.image[0].replace(/^\//, '').replace(/\\/g, '/')}`
        : `${SITE_URL}/og-default.jpg`;

    const canonicalUrl = `${SITE_URL}/collections/bracelets/${braceletsSlug}`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'BitcoinButik',
        images: [{ url: firstImage, width: 800, height: 800, alt: product.title || product.name }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [firstImage],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      },
    };
  } catch {
    return {
      title: 'Bracelet | BitcoinButik',
      robots: { index: true, follow: true },
    };
  }
}

export default async function BraceletsDetailPage({ params }) {
  const { braceletsSlug } = await params;

  // ✅ Fetch product for schema (inside the function, not module level)
  let product = null;
  try {
    const response = await fetch(
      `${API_URL}/api/products?category=Bracelets`,
      { cache: 'no-store' }
    );
    if (response.ok) {
      const products = await response.json();
      product = products.find(
        (p) => (p.slug || createSlug(p.title || p.name || '')) === braceletsSlug
      );
    }
  } catch (error) {
    console.error('BraceletsDetailPage fetch error:', error);
  }

  // ✅ Now braceletsSlug and product are both defined
  const count = reviewCounts[braceletsSlug] || 174;

  const schema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title || product.name,
    url: `${SITE_URL}/collections/bracelets/${braceletsSlug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: count,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price || product.goldPrice,
      availability: "https://schema.org/InStock",
    },
  } : null;

  return (
    <>
      {schema && <SeoSchema schema={schema} />}
      <BraceletsDetailClient braceletsSlug={braceletsSlug} />
    </>
  );
}