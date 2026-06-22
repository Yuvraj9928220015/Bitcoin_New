"use client";
import Head from "next/head";
import "./Banner.css";

export default function Banner() {
    return (
        <>
            {/* Meta Title, Description & Canonical — Sab ek file mein */}
            <Head>
                <title>Buy Luxury Bitcoin Jewelry &amp; Limited Edition Crypto Designs</title>
                <meta
                    name="description"
                    content="Shop luxury Bitcoin jewelry and crypto jewelry online. Discover limited edition fashion jewelry and unique designs from a premium crypto jewelry store."
                />
                <link
                    rel="canonical"
                    href="https://bitcoinbutik.com/collections/pendants/pendant-women"
                />
            </Head>

            {/* Main Content */}
            <main data-aos="fade-up" className="main-content">
                <div className="hero-section">
                    <div className="hero-image">
                        <img src="./Banner-men.webp" alt="Bulgari Hero" />
                        <div className="hero-overlay">
                            <div className="hero-text">
                                {/* Updated H1 */}
                                <h1 className="hero-text-title">
                                    Luxury Bitcoin Jewelry
                                </h1>
                                <div className="">
                                    <a href="/collections/pendants/pendant-women"><div className="hero-cta-btn-v4">SHOP NOW</div></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}