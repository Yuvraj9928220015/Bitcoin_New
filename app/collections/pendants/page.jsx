// app/pendants/page.js

import Link from 'next/link';
import Image from 'next/image';
import styles from './pendants.module.css';
import SeoSchema from "@/components/SeoSchema";

// SEO Metadata with Canonical
export const metadata = {
    title: 'Buy Gold & Silver Bitcoin Pendants for Men and Women Online',
    description:
        'Buy premium gold & silver bitcoin pendants and crypto pendants online. Unique, stylish, and high-quality designs for men and women. Secure checkout and fast shipping.',

    alternates: {
        canonical: 'https://bitcoinbutik.com/collections/pendants/',
    },

    // Open Graph
    openGraph: {
        title: 'Buy Gold & Silver Bitcoin Pendants for Men and Women Online',
        description:
            'Buy premium gold & silver bitcoin pendants and crypto pendants online. Unique, stylish, and high-quality designs for men and women.',
        url: 'https://bitcoinbutik.com/collections/pendants/',
        siteName: 'Bitcoin Butik',
        locale: 'en_US',
        images: [
            {
                url: 'https://bitcoinbutik.com/Bzero13-2.webp',
            },
        ],
        type: 'website',
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'Buy Gold & Silver Bitcoin Pendants for Men and Women Online',
        description:
            'Buy premium gold & silver bitcoin pendants and crypto pendants online.',
        images: ['https://bitcoinbutik.com/Bzero13-2.webp'],
        creator: '@bitcoin_butik',
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
        url: "https://bitcoinbutik.com/collections/pendants/",

        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 4.9,
            reviewCount: 100,
        },
    };
    return (
        <>
            <SeoSchema schema={schema} />

            <div className={styles.Collections}>

                {/* H1 Heading */}
                <h1 className={styles['Collections-Title']}>
                    Premium Gold & Silver Bitcoin & Crypto Pendant Collection
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
                                            width={400}
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