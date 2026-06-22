import Link from 'next/link';
import "./women.css";
import SeoSchema from "@/components/SeoSchema";

const API_URL = "https://api.bitcoinbutik.com";
const MEDIA_URL = "https://api.bitcoinbutik.com";

// ─── SEO Metadata + Canonical ───────────────────
export const metadata = {
    title: "Buy Gold & Silver Bitcoin Pendant for Women | Crypto Jewelry Online",
    description:
        "Shop bitcoin pendant for women in elegant and modern designs. Explore stylish women crypto pendants perfect for daily wear and gifting. Order online now.",
    alternates: {
        canonical: "https://bitcoinbutik.com/collections/pendants/pendant-women/",
    },
    openGraph: {
        title: "Stylish Bitcoin Gold & Silver Pendant for Women",
        description:
            "Shop bitcoin pendant for women in elegant and modern designs. Explore stylish women crypto pendants perfect for daily wear and gifting. Order online now.",
        url: "https://bitcoinbutik.com/collections/pendants/pendant-women/",
        siteName: "BitcoinButik",
        locale: 'en_US',
        images: [
            {
                url: "https://bitcoinbutik.com/Bzero18-2.webp",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Buy Gold & Silver Bitcoin Pendant for Women | Crypto Jewelry Online",
        description:
            "Shop bitcoin pendant for women in elegant and modern designs. Explore stylish women crypto pendants perfect for daily wear and gifting. Order online now.",
        images: ["https://bitcoinbutik.com/Bzero18-2.webp"],
        creator: '@bitcoin_butik',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
    },
};

// ─── Helpers ───
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
        const response = await fetch(`${API_URL}/api/products?category=pendant`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
}

// ─── Price Display Helper ────────────────────────
function PriceDisplay({ price, goldPrice }) {
    const hasSilver = price !== null && price !== undefined && price > 0;
    const hasGold = goldPrice !== null && goldPrice !== undefined && goldPrice > 0;

    if (hasSilver && hasGold) {
        return (
            <div className="product-price-container">
                <p className="product-price-range">${price?.toFixed(2)} - ${goldPrice?.toFixed(2)}</p>
            </div>
        );
    }
    if (hasSilver) {
        return (
            <div className="product-price-container">
                <p className="product-price-range">Silver: ${price?.toFixed(2)}</p>
            </div>
        );
    }
    if (hasGold) {
        return (
            <div className="product-price-container">
                <p className="product-price-range">Gold: ${goldPrice?.toFixed(2)}</p>
            </div>
        );
    }
    return (
        <div className="product-price-container">
            <p className="product-price-range">Price not available</p>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────
export default async function Pendants() {

    // ✅ FIX: pehle products fetch karo
    const products = await getProducts();

    // ✅ FIX: formattedProducts declare karo
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

    // ✅ FIX: schema ab formattedProducts ke BAAD hai — error gone!
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",

        name: "BitcoinButik",
        url: "https://bitcoinbutik.com/collections/pendants/pendant-women/",

        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 4.9,
            reviewCount: 120, // dynamic bhi kar sakte ho
        },
    };

    // Hero products
    const heroProduct1 = formattedProducts.find(
        (p) => createSlug(p.name) === 'radiant-reserve-pendant'
    );
    const heroProduct2 = formattedProducts.find(
        (p) => createSlug(p.name) === 'immutable-pendant'
    );

    // Sections
    const grid1Products = formattedProducts.slice(0, 4);
    const niche1Products = formattedProducts.slice(4, 8);
    const nicheNewProducts = formattedProducts.slice(8, 12);
    const grid2Products = formattedProducts.slice(12, 16);
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
                                <Link href="/">Home</Link> / <Link href="/collections">Jewelry</Link> / Pendants
                            </span>
                            <h1 className="bzero-title">
                                Stylish Bitcoin Gold & Silver Pendant for Women <sup>{formattedProducts.length}</sup>
                            </h1>
                        </div>
                    </header>

                    {/* ─── Main Grid 1 — 4 Products + Hero Image ─── */}
                    <main className="product-grid-wrapper">
                        <div className="product-grid">
                            <div className="product-grid-left">
                                {grid1Products.map((product) => (
                                    <Link key={product.id} href={`/collections/pendants/pendant-women/${product.slug}`} className="product-card-link">
                                        <div className="product-card">
                                            {product.images[0] && (<img src={product.images[0]} alt={product.name} className="product-image" />)}
                                            {product.tagText && (<span className="product-tag">{product.tagText}</span>)}
                                            <div className="product-info">
                                                <h3 className="product-name">{product.name}</h3>
                                                <PriceDisplay price={product.price} goldPrice={product.goldPrice} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="product-grid-right">
                                <div className="hero-image-container">
                                    {heroProduct1 ? (
                                        <Link href={`/collections/pendants/pendant-women/${heroProduct1.slug}`}>
                                            <img src="/Bzero18-2.webp" alt="Model wearing Bitcoin Pendants for Women" style={{ cursor: 'pointer', width: '100%' }} />
                                        </Link>
                                    ) : (
                                        <img src="/Bzero18-2.webp" alt="Model wearing Bitcoin Pendants for Women" style={{ width: '100%' }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* ─── Niche Section 1 ─── */}
                    <section className="niche-section-wrapper">
                        <div className="niche-grid">
                            {niche1Products.map((product) => (
                                <Link key={`${product.id}-a`} href={`/collections/pendants/pendant-women/${product.slug}`} className="product-card-link">
                                    <div className="product-card">
                                        {product.images[0] && (<img src={product.images[0]} alt={product.name} className="product-image" />)}
                                        {product.tagText && (<span className="product-tag">{product.tagText}</span>)}
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <PriceDisplay price={product.price} goldPrice={product.goldPrice} />
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
                                <Link key={`${product.id}-new`} href={`/collections/pendants/pendant-women/${product.slug}`} className="product-card-link">
                                    <div className="product-card">
                                        {product.images[0] && (<img src={product.images[0]} alt={product.name} className="product-image" />)}
                                        {product.tagText && (<span className="product-tag">{product.tagText}</span>)}
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <PriceDisplay price={product.price} goldPrice={product.goldPrice} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ─── Main Grid 2 — Hero Image + 4 Products ─── */}
                    <main className="product-grid-wrapper">
                        <div className="product-grid">
                            <div className="product-grid-right">
                                <div className="hero-image-container">
                                    {heroProduct2 ? (
                                        <Link href={`/collections/pendants/pendant-women/${heroProduct2.slug}`}>
                                            <img src="/Bzero11-2.webp" alt="Model wearing Bitcoin Pendants for Women" style={{ cursor: 'pointer', width: '100%' }} />
                                        </Link>
                                    ) : (
                                        <img src="/Bzero11-2.webp" alt="Model wearing Bitcoin Pendants for Women" style={{ width: '100%' }} />
                                    )}
                                </div>
                            </div>
                            <div className="product-grid-left">
                                {grid2Products.map((product) => (
                                    <Link key={`${product.id}-c`} href={`/collections/pendants/pendant-women/${product.slug}`} className="product-card-link">
                                        <div className="product-card">
                                            {product.images[0] && (<img src={product.images[0]} alt={product.name} className="product-image" />)}
                                            {product.tagText && (<span className="product-tag">{product.tagText}</span>)}
                                            <div className="product-info">
                                                <h3 className="product-name">{product.name}</h3>
                                                <PriceDisplay price={product.price} goldPrice={product.goldPrice} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </main>

                    {/* ─── Niche Section 2 ─── */}
                    <section className="niche-section-wrapper">
                        <div className="niche-grid">
                            {niche2Products.map((product) => (
                                <Link key={`${product.id}-d`} href={`/collections/pendants/pendant-women/${product.slug}`} className="product-card-link">
                                    <div className="product-card">
                                        {product.images[0] && (<img src={product.images[0]} alt={product.name} className="product-image" />)}
                                        {product.tagText && (<span className="product-tag">{product.tagText}</span>)}
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <PriceDisplay price={product.price} goldPrice={product.goldPrice} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ─── Load More — Static Render ─── */}
                    {loadMoreProducts.length > 0 && (
                        <>
                            <section className="niche-section-wrapper">
                                <div className="niche-grid">
                                    {loadMoreProducts.slice(0, 4).map((product) => (
                                        <Link key={`${product.id}-f`} href={`/collections/pendants/pendant-women/${product.slug}`} className="product-card-link">
                                            <div className="product-card">
                                                {product.images[0] && (<img src={product.images[0]} alt={product.name} className="product-image" />)}
                                                {product.tagText && (<span className="product-tag">{product.tagText}</span>)}
                                                <div className="product-info">
                                                    <h3 className="product-name">{product.name}</h3>
                                                    <PriceDisplay price={product.price} goldPrice={product.goldPrice} />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                            <section className="niche-section-wrapper">
                                <div className="niche-grid">
                                    {loadMoreProducts.slice(4, 8).map((product) => (
                                        <Link key={`${product.id}-g`} href={`/collections/pendants/pendant-women/${product.slug}`} className="product-card-link">
                                            <div className="product-card">
                                                {product.images[0] && (<img src={product.images[0]} alt={product.name} className="product-image" />)}
                                                {product.tagText && (<span className="product-tag">{product.tagText}</span>)}
                                                <div className="product-info">
                                                    <h3 className="product-name">{product.name}</h3>
                                                    <PriceDisplay price={product.price} goldPrice={product.goldPrice} />
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