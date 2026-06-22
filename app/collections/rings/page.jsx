import Link from 'next/link';
import SeoSchema from "@/components/SeoSchema";
import "./rings.css";

const API_URL = "https://api.bitcoinbutik.com";
const MEDIA_URL = "https://api.bitcoinbutik.com";

export const metadata = {
  title: "Shop Stylish Bitcoin Gold & Silver Rings for Women Online",
  description:
    "Shop premium bitcoin rings and stylish crypto rings online. Explore gold & silver rings for women with modern and elegant designs, perfect for daily wear and gifting.",

  alternates: {
    canonical: "https://bitcoinbutik.com/collections/rings/",
  },

  openGraph: {
    title: "Shop Stylish Bitcoin Gold & Silver Rings for Women Online",
    description:
      "Shop premium bitcoin rings and stylish crypto rings online. Explore gold & silver rings for women with modern and elegant designs, perfect for daily wear and gifting.",
    url: "https://bitcoinbutik.com/collections/rings/",
    siteName: "BitcoinButik",
    locale: 'en_US',
    images: [
      {
        url: "https://bitcoinbutik.com/DSC02974.webp",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shop Stylish Bitcoin Gold & Silver Rings for Women Online",
    description:
      "Shop premium bitcoin rings and stylish crypto rings online. Explore gold & silver rings for women with modern and elegant designs, perfect for daily wear and gifting.",
    images: ["https://bitcoinbutik.com/DSC02974.webp"],
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

// ─── SERVER FETCH ───────────────────────────────
async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const allProducts = await response.json();

    const filtered = allProducts.filter((p) => {
      const cat = p.category?.toLowerCase().trim();
      return cat === "ring" || cat === "rings";
    });

    const seen = new Set();
    const products = filtered.filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });

    console.log("Rings Products (after dedup):", products.length); // DEBUG

    return products;
  } catch (error) {
    console.log("Fetch Error:", error);
    return [];
  }
}

// ─── MAIN PAGE ─────────────────────────────────
export default async function RingsPage() {

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",

    name: "BitcoinButik",
    url: "https://bitcoinbutik.com/collections/rings/",

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 130,
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
  }));

  const heroProduct1 = formattedProducts.find(
    (p) => p.slug === 'bitcoin-pure-silver-ring'
  );

  const grid1Products = formattedProducts.slice(0, 4);
  const niche1Products = formattedProducts.slice(4, 8);
  const nicheNewProducts = formattedProducts.slice(8, 12);

  return (
    <>
      <SeoSchema schema={schema} />
      <div className="bzero-page-container">
        <div className="bzero-main-content">

          <header className="bzero-header">
            <div className="bzero-header-left">
              <span className="breadcrumb">
                <Link href="/">Home</Link> / <Link href="/collections">Jewelry</Link> / Rings
              </span>
              <h1 className="bzero-title">
                Stylish Bitcoin Gold & Silver Rings for Women <sup>{formattedProducts.length}</sup>
              </h1>
            </div>
          </header>

          {/* ─── GRID ─── */}
          <main className="product-grid-wrapper">
            <div className="product-grid">

              <div className="product-grid-left">
                {grid1Products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/collections/rings/${product.slug}`}
                    className="product-card-link"
                  >
                    <div className="product-card">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-image"
                      />
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

              {/* HERO */}
              <div className="product-grid-right">
                <div className="hero-image-container">
                  {heroProduct1 ? (
                    <Link href={`/collections/rings/${heroProduct1.slug}`}>
                      <img
                        src="/DSC02974.webp"
                        alt="Model wearing Rings"
                        style={{ cursor: 'pointer', width: '100%' }}
                      />
                    </Link>
                  ) : (
                    <img src="/DSC02974.webp" alt="Model wearing Rings" style={{ width: '100%' }} />
                  )}
                </div>
              </div>

            </div>
          </main>

          {/* ─── SECTION 1 ─── */}
          {niche1Products.length > 0 && (
            <section className="niche-section-wrapper">
              <div className="niche-grid">
                {niche1Products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/collections/rings/${product.slug}`}
                    className="product-card-link"
                  >
                    <div className="product-card">
                      <img src={product.images[0]} alt={product.name} />
                      <h3>{product.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ─── SECTION 2 ─── */}
          {nicheNewProducts.length > 0 && (
            <section className="niche-section-wrapper">
              <div className="niche-grid">
                {nicheNewProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/collections/rings/${product.slug}`}
                    className="product-card-link"
                  >
                    <div className="product-card">
                      <img src={product.images[0]} alt={product.name} />
                      <h3>{product.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}