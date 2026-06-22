// app/collections/page.js
import SeoSchema from "@/components/SeoSchema";
import Link from 'next/link';
import Image from 'next/image';
import styles from './collections.module.css';

// SEO Metadata (Fixed Canonical)
export const metadata = {
    title: 'Buy Modern Bitcoin Jewelry & Crypto Jewelry Online',
    description:
        'Buy Bitcoin jewelry online and explore crypto jewelry collections in modern and gold styles. Discover unique pieces designed for everyday wear and gifting.',

    alternates: {
        canonical: 'https://bitcoinbutik.com/collections',
    },
};

const collectionsData = [
    {
        id: 1,
        image: '/Bzero13-2.webp',
        title: 'Women Pendant',
        url: 'https://bitcoinbutik.com/collections/pendants/pendant-women',
    },
    {
        id: 2,
        image: '/Ring-2.webp',
        title: 'Ring',
        url: 'https://bitcoinbutik.com/collections/rings',
    },
    {
        id: 3,
        image: '/DSC02926.webp',
        title: 'Bracelets',
        url: 'https://bitcoinbutik.com/collections/bracelets',
    },
    {
        id: 4,
        image: '/DSC02.webp',
        title: 'Earrings',
        url: 'https://bitcoinbutik.com/collections/earrings',
    },
    {
        id: 5,
        image: '/1(4).png',
        title: 'Men Pendant',
        url: 'https://bitcoinbutik.com/collections/pendants/pendant-mens/',
    }
];

export default function Page() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",

        name: "BitcoinButik",
        url: "https://www.bitcoinbutik.com/collections",

        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 4.9,
            reviewCount: 140, // dynamic bhi kar sakte ho
        },
    };

    return (
        <>
            <SeoSchema schema={schema} />
            <div className={styles.Collections}>

                {/* H1 Heading */}
                <h1 className={styles['Collections-Title']}>
                    Explore Bitcoin Jewelry & Crypto Jewelry Collections
                </h1>

                <div className="container-fluid">
                    <div className="row">
                        {collectionsData.map((item) => (
                            <div className="col-3" key={item.id}>
                                <Link
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles['Collections-Link']}
                                >
                                    <div className={styles['Collections-Box']}>
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={600}
                                            height={600}
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <div className={styles['Collections-Box-content']}>
                                            <div className={styles['Collections-Box-title']}>
                                                {item.title}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}