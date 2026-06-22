import SeoSchema from "@/components/SeoSchema";
import Link from 'next/link';
import "./earrings.css";

const API_URL = "https://api.bitcoinbutik.com";
const MEDIA_URL = "https://api.bitcoinbutik.com";
const SITE_URL = "https://www.bitcoinbutik.com";

// ─── SEO Metadata + Canonical ───
export const metadata = {
    title: "Buy Gold Bitcoin & Crypto Earrings for Women Online",
    description:
        "Shop gold earrings for women online with stylish bitcoin and crypto designs. Explore elegant, modern earrings perfect for daily wear and gifting. Buy now.",

    alternates: {
        canonical: "https://bitcoinbutik.com/collections/earrings/",
    },

    openGraph: {
        title: "Buy Gold Bitcoin & Crypto Earrings for Women Online",
        description:
            "Shop gold earrings for women online with stylish bitcoin and crypto designs. Explore elegant, modern earrings perfect for daily wear and gifting. Buy now.",
        url: "https://bitcoinbutik.com/collections/earrings/",
        siteName: "BitcoinButik",
        locale: 'en_US',
        images: [
            {
                url: "https://bitcoinbutik.com/Earrings-Banner.webp",
            },
        ],
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Buy Gold Bitcoin & Crypto Earrings for Women Online",
        description:
            "Shop gold earrings for women online with stylish bitcoin and crypto designs. Explore elegant, modern earrings perfect for daily wear and gifting. Buy now.",
        images: ["https://bitcoinbutik.com/Earrings-Banner.webp"],
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

// ─── Server Fetch ────────────────────────────────
async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products?category=Earrings`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
}

// ─── Main Page ───────────────────────────────────
export default async function EarringsPage() {

    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",

        name: "BitcoinButik",
        url: "https://bitcoinbutik.com/collections/earrings/",

        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 4.9,
            reviewCount: 124,
        },
    };

    const products = await getProducts();

    const formattedProducts = products.map((p) => ({
        id: p._id,
        name: p.title,
        slug: p.slug,
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
        (p) => p.slug === 'bitcoin-standard-earings'
    );

    // Sections
    const grid1Products = formattedProducts.slice(0, 4);
    const niche1Products = formattedProducts.slice(4, 8);
    const nicheNewProducts = formattedProducts.slice(8, 12);
    const niche2Products = formattedProducts.slice(16, 20);

    return (
        <>
            <SeoSchema schema={schema} />
            <div className="bzero-page-container">
                <div className="bzero-main-content">

                    {/* ─── Header ─── */}
                    <header className="bzero-header">
                        <div className="bzero-header-left">
                            <span className="breadcrumb">
                                <Link href="/">Home</Link> / <Link href="/collections">Jewelry</Link> / Earrings
                            </span>
                            <h1 className="bzero-title">
                                Premium Gold & Silver Bitcoin Earrings for Women <sup>{formattedProducts.length}</sup>
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
                                        href={`/collections/earrings/${product.slug}`}
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
                                        <Link href={`/collections/earrings/${heroProduct1.slug}`}>
                                            <img
                                                src="/Earrings-Banner.webp"
                                                alt="Model wearing Earrings"
                                                style={{ cursor: 'pointer', width: '100%' }}
                                            />
                                        </Link>
                                    ) : (
                                        <img
                                            src="/Earrings-Banner.webp"
                                            alt="Model wearing Earrings"
                                            style={{ width: '100%' }}
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
                                    href={`/collections/earrings/${product.slug}`}
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
                                    href={`/collections/earrings/${product.slug}`}
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
                                    href={`/collections/earrings/${product.slug}`}
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

                </div>
            </div>
        </>
    );
}