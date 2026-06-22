import "./CareInstructions.css"


export const metadata = {
  title: "Jewelry Care Instructions | BitcoinButik",
  description:
    "Learn how to care for your BitcoinButik jewelry. Follow our expert tips to maintain the shine, durability, and quality of your gold and silver pieces.",

  alternates: {
    canonical: "https://bitcoinbutik.com/care-instructions",
  },

  openGraph: {
    title: "Jewelry Care Instructions | BitcoinButik",
    description:
      "Discover how to properly care for your gold and silver crypto jewelry to maintain its shine and longevity.",
    url: "https://bitcoinbutik.com/care-instructions",
    siteName: "BitcoinButik",
    locale: "en_US",
    images: [
      {
        url: "https://bitcoinbutik.com/care-Instructions.jpeg",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Jewelry Care Instructions | BitcoinButik",
    description:
      "Learn how to care for your BitcoinButik jewelry and keep it looking new.",
    images: ["https://bitcoinbutik.com/care-Instructions.jpeg"],
    creator: "@bitcoin_butik",
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default function CareInstructions() {
    return (
        <>
            <div className="Return">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="CareInstructions-image">
                                <img src="/care-Instructions.jpeg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}