// app/collections/pendants/pendant-mens/page.jsx
// SERVER COMPONENT — NO 'use client', NO split needed

import Link from 'next/link';
import SeoSchema from "@/components/SeoSchema";
import Image from 'next/image';
import "./mans.css";

const API_URL = "https://api.bitcoinbutik.com";
const MEDIA_URL = "https://api.bitcoinbutik.com";

// ─── SEO Metadata + Canonical ───────────────────
export const metadata = {
    title: "Shop Luxury Gold & Silver Bitcoin Pendants for Men Online",
    description:
        "Shop bitcoin pendant for men with premium gold finish. Explore luxury men’s Jewelry designed for modern style & everyday wear or gifting. Order online today.",

    alternates: {
        canonical: "https://bitcoinbutik.com/collections/pendants/pendant-mens/",
    },

    openGraph: {
        title: "Luxury Bitcoin Gold & Silver Pendants for Men",
        description:
            "Explore luxury pendants for men at BitcoinButik. Shop designer, elegant and premium bitcoin & crypto pendants crafted for timeless style. Buy now.",
        url: "https://bitcoinbutik.com/collections/pendants/pendant-mens/",
        siteName: "BitcoinButik",
        locale: 'en_US',
        images: [
            {
                url: "https://bitcoinbutik.com/1(4).png",
            },
        ],
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Luxury Pendants for Men | Bitcoin & Crypto Jewelry | BitcoinButik",
        description:
            "Explore luxury pendants for men at BitcoinButik. Shop designer, elegant and premium bitcoin & crypto pendants crafted for timeless style. Buy now.",
        images: ["https://bitcoinbutik.com/1(4).png"],
        creator: '@bitcoin_butik',
    },

    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
    },
};

// ─── Helper ─────────────────────────────────────
const formatMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${MEDIA_URL}/${path.replace(/^\//, '').replace(/\\/g, '/')}`;
};

const createSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// ─── Server Fetch ────────────────────────────────
async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products?category=Man`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
}

// ─── Main Page ───────────────────────────────────
export default async function ManPage() {

    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",

        name: "BitcoinButik",
        url: "https://bitcoinbutik.com/collections/pendants/pendant-mens/",

        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 4.9,
            reviewCount: 110,
        },
    };

    const products = await getProducts();

    const formattedProducts = products.map((p) => ({
        id: p._id,
        name: p.title,
        slug: p.slug || createSlug(p.title),
        price: p.price,
        goldPrice: p.goldPrice,
        images: (p.image || []).map(formatMediaUrl).filter(Boolean),
        video: formatMediaUrl(p.video),
        material: p.category,
        tagText: p.tagText || null,
        description: p.description,
        type: p.type,
        stock: p.stock,
        grams: p.grams,
        hasSize: p.hasSize !== false,
        hasType: p.hasType !== false,
        sizes: p.sizes || [],
    }));

    // Hero product
    const heroProduct1 = formattedProducts.find(
        (p) => createSlug(p.name) === 'not-your-keys-pendant'
    );

    // Sections
    const grid1Products = formattedProducts.slice(0, 4);
    const niche1Products = formattedProducts.slice(4, 8);
    const nicheNewProducts = formattedProducts.slice(8, 12);
    const niche2Products = formattedProducts.slice(16, 20);
    const loadMoreProducts = formattedProducts.slice(20, 32);

    return (
        <>
            <SeoSchema schema={schema} />

            <div className="bzero-page-container">
                <div className="bzero-main-content">

                    {/* ─── Header ─── */}
                    <header className="bzero-header">
                        <div className="bzero-header-left">
                            <span className="breadcrumb">
                                <Link href="/">Home</Link> / <Link href="/collections">Jewelry</Link> / <Link href="/collections/pendants">Pendants</Link> / Men
                            </span>
                            <h1 className="bzero-title">
                                Luxury Bitcoin Gold & Silver Pendants for Men <sup>{formattedProducts.length}</sup>
                            </h1>
                        </div>
                    </header>

                    {/* ─── Main Grid — 4 Products + Hero Image ─── */}
                    <main className="product-grid-wrapper">
                        <div className="product-grid">

                            <div className="product-grid-left">
                                {grid1Products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/collections/pendants/pendant-mens/${product.slug}`}
                                        className="product-card-link"
                                    >
                                        <div className="product-card">
                                            {product.images[0] && (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="product-image"
                                                />
                                            )}
                                            {product.tagText && (
                                                <span className="product-tag">{product.tagText}</span>
                                            )}
                                            <div className="product-info">
                                                <h3 className="product-name">{product.name}</h3>
                                                <div className="product-price-container">
                                                    {product.goldPrice ? (
                                                        <p className="product-price-range">
                                                            ${product.price?.toFixed(2)} – ${product.goldPrice?.toFixed(2)}
                                                        </p>
                                                    ) : (
                                                        <p className="product-price">${product.price?.toFixed(2)}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Hero Image */}
                            <div className="product-grid-right">
                                <div className="hero-image-container">
                                    {heroProduct1 ? (
                                        <Link href={`/collections/pendants/pendant-mens/${heroProduct1.slug}`}>
                                            <Image
                                                src="/1(4).png"
                                                alt="Model wearing Bitcoin Pendants for Men"
                                                fill
                                                style={{ objectFit: 'cover', cursor: 'pointer' }}
                                                priority
                                            />
                                        </Link>
                                    ) : (
                                        <Image
                                            src="/1(4).png"
                                            alt="Model wearing Bitcoin Pendants for Men"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            priority
                                        />
                                    )}
                                </div>
                            </div>

                        </div>
                    </main>

                    {/* ─── Niche Section 1 ─── */}
                    <section className="niche-section-wrapper">
                        <div className="niche-grid">
                            {niche1Products.map((product) => (
                                <Link
                                    key={`${product.id}-a`}
                                    href={`/collections/pendants/pendant-mens/${product.slug}`}
                                    className="product-card-link"
                                >
                                    <div className="product-card">
                                        {product.images[0] && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        )}
                                        {product.tagText && (
                                            <span className="product-tag">{product.tagText}</span>
                                        )}
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <div className="product-price-container">
                                                {product.goldPrice ? (
                                                    <p className="product-price-range">
                                                        ${product.price?.toFixed(2)} – ${product.goldPrice?.toFixed(2)}
                                                    </p>
                                                ) : (
                                                    <p className="product-price">${product.price?.toFixed(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ─── Niche Section — New Products ─── */}
                    <section className="niche-section-wrapper">
                        <div className="niche-grid">
                            {nicheNewProducts.map((product) => (
                                <Link
                                    key={`${product.id}-new`}
                                    href={`/collections/pendants/pendant-mens/${product.slug}`}
                                    className="product-card-link"
                                >
                                    <div className="product-card">
                                        {product.images[0] && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        )}
                                        {product.tagText && (
                                            <span className="product-tag">{product.tagText}</span>
                                        )}
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <div className="product-price-container">
                                                {product.goldPrice ? (
                                                    <p className="product-price-range">
                                                        ${product.price?.toFixed(2)} – ${product.goldPrice?.toFixed(2)}
                                                    </p>
                                                ) : (
                                                    <p className="product-price">${product.price?.toFixed(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ─── Niche Section 2 ─── */}
                    <section className="niche-section-wrapper">
                        <div className="niche-grid">
                            {niche2Products.map((product) => (
                                <Link
                                    key={`${product.id}-d`}
                                    href={`/collections/pendants/pendant-mens/${product.slug}`}
                                    className="product-card-link"
                                >
                                    <div className="product-card">
                                        {product.images[0] && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        )}
                                        {product.tagText && (
                                            <span className="product-tag">{product.tagText}</span>
                                        )}
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <div className="product-price-container">
                                                {product.goldPrice ? (
                                                    <p className="product-price-range">
                                                        ${product.price?.toFixed(2)} – ${product.goldPrice?.toFixed(2)}
                                                    </p>
                                                ) : (
                                                    <p className="product-price">${product.price?.toFixed(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ─── Load More Section (Static render — first 12 extra products) ─── */}
                    {loadMoreProducts.length > 0 && (
                        <>
                            <section className="niche-section-wrapper">
                                <div className="niche-grid">
                                    {loadMoreProducts.slice(0, 4).map((product) => (
                                        <Link
                                            key={`${product.id}-f`}
                                            href={`/collections/pendants/pendant-mens/${product.slug}`}
                                            className="product-card-link"
                                        >
                                            <div className="product-card">
                                                {product.images[0] && (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="product-image"
                                                    />
                                                )}
                                                {product.tagText && (
                                                    <span className="product-tag">{product.tagText}</span>
                                                )}
                                                <div className="product-info">
                                                    <h3 className="product-name">{product.name}</h3>
                                                    <div className="product-price-container">
                                                        {product.goldPrice ? (
                                                            <p className="product-price-range">
                                                                ${product.price?.toFixed(2)} – ${product.goldPrice?.toFixed(2)}
                                                            </p>
                                                        ) : (
                                                            <p className="product-price">${product.price?.toFixed(2)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            <section className="niche-section-wrapper">
                                <div className="niche-grid">
                                    {loadMoreProducts.slice(4, 8).map((product) => (
                                        <Link
                                            key={`${product.id}-g`}
                                            href={`/collections/pendants/pendant-mens/${product.slug}`}
                                            className="product-card-link"
                                        >
                                            <div className="product-card">
                                                {product.images[0] && (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="product-image"
                                                    />
                                                )}
                                                {product.tagText && (
                                                    <span className="product-tag">{product.tagText}</span>
                                                )}
                                                <div className="product-info">
                                                    <h3 className="product-name">{product.name}</h3>
                                                    <div className="product-price-container">
                                                        {product.goldPrice ? (
                                                            <p className="product-price-range">
                                                                ${product.price?.toFixed(2)} – ${product.goldPrice?.toFixed(2)}
                                                            </p>
                                                        ) : (
                                                            <p className="product-price">${product.price?.toFixed(2)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                </div>
            </div>
        </>
    );
}