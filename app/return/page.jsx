import "./return.css"

export const metadata = {
    title: "Return & Exchange Policy | BitcoinButik",
    description:
        "Read BitcoinButik's return and exchange policy. Learn about our guidelines, conditions, and important information before making a purchase.",

    alternates: {
        canonical: "https://bitcoinbutik.com/return",
    },

    openGraph: {
        title: "Return & Exchange Policy | BitcoinButik",
        description:
            "Understand BitcoinButik's return and exchange policy, including important conditions and guidelines.",
        url: "https://bitcoinbutik.com/return",
        siteName: "BitcoinButik",
        locale: "en_US",
        images: [
            {
                url: "https://bitcoinbutik.com/DSC02974.webp",
            },
        ],
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Return & Exchange Policy | BitcoinButik",
        description:
            "Understand BitcoinButik's return and exchange policy and important purchase guidelines.",
        images: ["https://bitcoinbutik.com/DSC02974.webp"],
        creator: "@bitcoin_butik",
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function Return() {
    return (
        <>
            <div className="Return">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="Return-heading">
                                Return and Exchange Policy
                            </h1>
                            <div className="Return-des">
                                At Bitcoin Butik, we take pride in the quality of our products and strive to ensure our customers are satisfied. However,
                                due to the high costs associated with small business operations and the nature of our products, we do not accept returns or exchanges.
                                This policy helps us keep our costs manageable and maintain fair prices for our customers. Please read our policy carefully before
                                making a purchase.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}