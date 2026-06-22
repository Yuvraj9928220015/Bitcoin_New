'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './bitcoingift.module.css';

const API_URL = 'https://api.bitcoinbutik.com';

const REMOVE_CATEGORIES = ['woman pendant', 'man pendant'];

const CAPITALIZE_ONLY = ['ring', 'bracelet', 'earring'];

function groupProductsByCategory(products) {
    const map = new Map();

    products.forEach(product => {
        const cat = (product.category || 'Other').trim();
        const catLower = cat.toLowerCase();

        if (REMOVE_CATEGORIES.includes(catLower)) return;

        const isCapOnly = CAPITALIZE_ONLY.includes(catLower);
        if (isCapOnly && cat === catLower) return;

        if (!map.has(cat)) map.set(cat, []);
        map.get(cat).push(product);
    });

    return Array.from(map.entries()).map(([label, prods]) => ({
        key: label,
        label: label,
        products: prods,
    }));
}

function ProductCard({ product }) {
    const imageUrl =
        product.image?.length > 0
            ? `${API_URL}/${product.image[0].replace(/\\/g, '/')}`
            : null;

    const silverPrice =
        product.hasSilver !== false && product.price != null
            ? `$${Number(product.price).toFixed(2)}`
            : null;

    const goldPrice =
        product.hasGold !== false && product.goldPrice != null
            ? `$${Number(product.goldPrice).toFixed(2)}`
            : null;

    return (
        <div className={styles.card}>
            <div className={styles.cardImageWrap}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.title}
                        className={styles.cardImage}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.cardImagePlaceholder}>
                        <span>₿</span>
                    </div>
                )}
                {product.stock === 0 && (
                    <div className={styles.soldOutBadge}>Sold Out</div>
                )}
            </div>
            <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{product.title}</h3>
                <div className={styles.cardPrices}>
                    {silverPrice && (
                        <span className={styles.priceTag}>
                            <span className={styles.priceLabel}>Silver</span>
                            {silverPrice}
                        </span>
                    )}
                    {goldPrice && (
                        <span className={`${styles.priceTag} ${styles.priceTagGold}`}>
                            <span className={styles.priceLabel}>Gold</span>
                            {goldPrice}
                        </span>
                    )}
                    {!silverPrice && !goldPrice && (
                        <span className={styles.priceTag}>View Price</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function CategoryRow({ label, products }) {
    const trackRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const timer = setTimeout(checkScroll, 150);
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        return () => {
            clearTimeout(timer);
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [products]);

    const scroll = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const slide = el.querySelector(`.${styles.cardSlide}`);
        const cardWidth = slide ? slide.offsetWidth + 20 : 280;
        el.scrollBy({ left: dir * cardWidth * 2, behavior: 'smooth' });
    };

    return (
        <section className={styles.categorySection}>
            <div className={styles.categoryHeader}>
                <div className={styles.categoryTitleGroup}>
                    <span className={styles.categoryIcon}>✦</span>
                    <h2 className={styles.categoryTitle}>{label}</h2>
                    <span className={styles.categoryCount}>{products.length} Items</span>
                </div>
                <div className={styles.navBtns}>
                    <button
                        className={`${styles.navBtn} ${!canScrollLeft ? styles.navBtnDisabled : ''}`}
                        onClick={() => scroll(-1)}
                        aria-label="Scroll left"
                        disabled={!canScrollLeft}
                    >
                        ←
                    </button>
                    <button
                        className={`${styles.navBtn} ${!canScrollRight ? styles.navBtnDisabled : ''}`}
                        onClick={() => scroll(1)}
                        aria-label="Scroll right"
                        disabled={!canScrollRight}
                    >
                        →
                    </button>
                </div>
            </div>

            <div className={styles.sliderOuter}>
                <div className={styles.sliderTrack} ref={trackRef}>
                    {products.map(product => (
                        <div key={product._id} className={styles.cardSlide}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                {canScrollLeft && <div className={`${styles.fadeEdge} ${styles.fadeLeft}`} />}
                {canScrollRight && <div className={`${styles.fadeEdge} ${styles.fadeRight}`} />}
            </div>
        </section>
    );
}

export default function Page() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                const uniqueCats = [...new Set(data.map(p => p.category))];
                console.log('📦 DB Categories (exact):', uniqueCats);

                setGroups(groupProductsByCategory(data));
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError('Could not load products. Please try again.');
                setLoading(false);
            });
    }, []);

    return (
        <div className={styles.pageRoot}>
            {/* Hero */}
            <div className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Bitcoin Jewellery Gifts
                    </h1>
                    <p className={styles.heroSub}>
                        Timeless pieces for every crypto lover — pendants, rings, earrings & more.
                    </p>
                </div>
                <div className={styles.heroDivider} />
            </div>

            {/* Categories */}
            <div className={styles.pageContent}>
                {loading && (
                    <div className={styles.stateCenter}>
                        <div className={styles.spinner} />
                        <p className={styles.stateText}>Loading collections…</p>
                    </div>
                )}

                {error && !loading && (
                    <div className={styles.stateCenter}>
                        <p className={styles.errorText}>{error}</p>
                    </div>
                )}

                {!loading && !error && groups.length === 0 && (
                    <div className={styles.stateCenter}>
                        <p className={styles.stateText}>No products found.</p>
                    </div>
                )}

                {!loading && !error && groups.map(group => (
                    <CategoryRow
                        key={group.key}
                        label={group.label}
                        products={group.products}
                    />
                ))}
            </div>
        </div>
    );
}