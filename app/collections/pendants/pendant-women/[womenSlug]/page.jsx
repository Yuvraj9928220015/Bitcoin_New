// app/collections/pendants/pendant-women/[womenSlug]/page.jsx
// ✅ Server Component — NO 'use client'

import WomenDetailClient from './WomenDetailClient';
import SeoSchema from "@/components/SeoSchema";
import reviewCounts from "@/data/reviewCounts";

const API_URL = "https://api.bitcoinbutik.com";
const SITE_URL = "https://www.bitcoinbutik.com";

// ✅ createSlug — apostrophe pehle remove karo
const createSlug = (name) => {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/[''`]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// ✅ FIX: cache: 'no-store' hatao — revalidate: 3600 use karo
// 'no-store' = revalidate:0 = dynamic rendering force hoti hai
// Yahi build error ka root cause tha
async function fetchAllProducts() {
    const [res1, res2] = await Promise.all([
        fetch(`${API_URL}/api/products?category=woman%20pendant`, {
            next: { revalidate: 3600 }, // ✅ ISR — har 1 ghante mein fresh data
        }),
        fetch(`${API_URL}/api/products?category=pendant`, {
            next: { revalidate: 3600 }, // ✅ ISR — har 1 ghante mein fresh data
        }),
    ]);

    const products1 = res1.ok ? await res1.json() : [];
    const products2 = res2.ok ? await res2.json() : [];

    const allProducts = [...products1, ...products2];
    const seen = new Set();
    return allProducts.filter(p => {
        const id = p._id || p.id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
}

// ✅ generateStaticParams — ab kaam karega kyunki fetch dynamic nahi hai
export async function generateStaticParams() {
    try {
        const unique = await fetchAllProducts();
        return unique
            .filter((p) => p.title || p.name)
            .map((product) => ({
                womenSlug: product.slug || createSlug(product.title || product.name || ''),
            }));
    } catch (error) {
        console.error('generateStaticParams error:', error);
        return [];
    }
}

// ✅ generateMetadata
export async function generateMetadata({ params }) {
    const { womenSlug } = await params;

    try {
        const allProducts = await fetchAllProducts();

        const product = allProducts.find(
            (p) => (p.slug || createSlug(p.title || p.name || '')) === womenSlug
        );

        if (!product) {
            return {
                title: 'Pendant Not Found | BitcoinButik',
                robots: { index: false },
            };
        }

        const title = `${product.title || product.name} | Luxury Pendant – BitcoinButik`;
        const description =
            product.description ||
            `Shop ${product.title || product.name} at BitcoinButik. Luxury Bitcoin-themed jewellery crafted in silver and gold.`;

        const firstImage =
            product.image?.[0]
                ? product.image[0].startsWith('http')
                    ? product.image[0]
                    : `${API_URL}/${product.image[0].replace(/^\//, '').replace(/\\/g, '/')}`
                : `${SITE_URL}/og-default.jpg`;

        const canonicalUrl = `${SITE_URL}/collections/pendants/pendant-women/${womenSlug}`;

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
            title: 'Pendant | BitcoinButik',
            robots: { index: true, follow: true },
        };
    }
}

// ✅ Page Component
export default async function WomenDetailPage({ params }) {
    const { womenSlug } = await params;

    const allProducts = await fetchAllProducts();
    const product = allProducts.find(
        (p) => (p.slug || createSlug(p.title || p.name || '')) === womenSlug
    );

    const count = reviewCounts[womenSlug] || 150;

    const schema = product ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title || product.name,
        url: `${SITE_URL}/collections/pendants/pendant-women/${womenSlug}`,
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
            <WomenDetailClient womenSlug={womenSlug} />
        </>
    );
}