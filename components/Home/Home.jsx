import Banner from "./Banner/Banner";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Slider from "./Slider/Slider";
// ✅ FIX: Import name uppercase 'C' se hona chahiye
import CustomerReviews from './customerReviews/customerReviews';

export const metadata = {
    title: "BitcoinButik | Gold & Silver Bitcoin Jewelry Store",
    description:
        "Shop premium bitcoin jewelry at BitcoinButik. Explore gold and silver rings, pendants, earrings, and bracelets designed with elegance and modern crypto style.",
    alternates: {
        canonical: "https://www.bitcoinbutik.com/",
    },
    openGraph: {
        title: "BitcoinButik | Gold & Silver Bitcoin Jewelry Store",
        description:
            "Discover premium bitcoin jewelry including rings, pendants, earrings, and bracelets crafted in gold and silver.",
        url: "https://www.bitcoinbutik.com/",
        siteName: "BitcoinButik",
        locale: "en_US",
        images: [{ url: "https://bitcoinbutik.com/DSC02974.webp" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "BitcoinButik | Crypto Jewelry Store",
        description: "Shop stylish bitcoin jewelry crafted in gold and silver.",
        images: ["https://bitcoinbutik.com/DSC02974.webp"],
        creator: "@bitcoin_butik",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function Home() {
    return (
        <>
            <Banner />
            <Header />
            <Slider />
            <Main />
            <CustomerReviews />
        </>
    );
}