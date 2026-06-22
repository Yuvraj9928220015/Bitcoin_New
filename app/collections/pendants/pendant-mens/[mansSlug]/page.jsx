// app/collections/pendants/pendant-mens/[mansSlug]/page.jsx
// ✅ Server Component — NO 'use client'

import ManDetailClient from './ManDetailClient';
import SeoSchema from "@/components/SeoSchema";
import reviewCounts from "@/data/reviewCounts";

const API_URL = "https://api.bitcoinbutik.com";
const SITE_URL = "https://www.bitcoinbutik.com";

const createSlug = (name) =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export async function generateStaticParams() {
    try {
        const response = await fetch(
            `${API_URL}/api/products?category=Man`,
            { cache: 'no-store' }
        );
        if (!response.ok) return [];
        const products = await response.json();

        return products
            .filter((p) => p.title || p.name)
            .map((product) => ({
                mansSlug: product.slug || createSlug(product.title || product.name || ''),
            }));
    } catch (error) {
        console.error('generateStaticParams error:', error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { mansSlug } = await params;

    try {
        const response = await fetch(
            `${API_URL}/api/products?category=Man`,
            { cache: 'no-store' }
        );
        if (!response.ok) throw new Error('Failed to fetch');

        const products = await response.json();
        const product = products.find(
            (p) => (p.slug || createSlug(p.title || p.name || '')) === mansSlug
        );

        if (!product) {
            return {
                title: "Men's Pendant Not Found | BitcoinButik",
                robots: { index: false },
            };
        }

        const title = `${product.title || product.name} | Luxury Men's Pendant – BitcoinButik`;
        const description =
            product.description ||
            `Shop ${product.title || product.name} at BitcoinButik. Luxury Bitcoin-themed jewellery crafted in silver and gold.`;

        const firstImage =
            product.image?.[0]
                ? product.image[0].startsWith('http')
                    ? product.image[0]
                    : `${API_URL}/${product.image[0].replace(/^\//, '').replace(/\\/g, '/')}`
                : `${SITE_URL}/og-default.jpg`;

        const canonicalUrl = `${SITE_URL}/collections/pendants/pendant-mens/${mansSlug}`;

        return {
            title,
            description,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                siteName: 'BitcoinButik',
                images: [
                    {
                        url: firstImage,
                        width: 800,
                        height: 800,
                        alt: product.title || product.name,
                    },
                ],
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
                googleBot: {
                    index: true,
                    follow: true,
                },
            },
        };
    } catch {
        return {
            title: "Men's Jewelry | BitcoinButik",
            robots: { index: true, follow: true },
        };
    }
}

// ✅ Page renders the client component with the slug
export default async function ManDetailPage({ params }) {
    const { mansSlug } = await params;

    let product = null;
    try {
        const response = await fetch(
            `${API_URL}/api/products?category=Man`,
            { cache: 'no-store' }
        );
        if (response.ok) {
            const products = await response.json();
            product = products.find(
                (p) => (p.slug || createSlug(p.title || p.name || '')) === mansSlug
            ) || null;
        }
    } catch (error) {
        console.error('ManDetailPage fetch error:', error);
    }

    const count = reviewCounts[mansSlug] || 130;

    const schema = product ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title || product.name,
        url: `${SITE_URL}/collections/pendants/pendant-mens/${mansSlug}`,
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

    // ✅ FIX 3: return ( ... ) — JSX must be on the same line as return, no stray semicolon
    return (
        <>
            {schema && <SeoSchema schema={schema} />}
            <ManDetailClient mansSlug={mansSlug} />
        </>
    );
}