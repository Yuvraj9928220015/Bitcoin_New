import './customeReviews.css';

const reviewsData = [
    {
        id: 1,
        name: "Sarah ₿",
        date: "29 January 2026",
        rating: 5,
        review: "Finally, Bitcoin jewelry for women done right.",
        avatar: "SB",
        color: "#e8a87c"
    },
    {
        id: 2,
        name: "Luna HODL",
        date: "22 February 2026",
        rating: 5,
        review: "Orange pilled and beautifully styled.",
        avatar: "LH",
        color: "#7cb9e8"
    },
    {
        id: 3,
        name: " Emily Roberts",
        date: "10 March 2026",
        rating: 5,
        review: "I ordered a Bitcoin ring from BitcoinButik and was genuinely impressed by the quality. The craftsmanship is outstanding, and the design feels both modern and timeless.",
        avatar: "ER",
        color: "#85c1ae"
    },
    {
        id: 4,
        name: "Emma Orangepill",
        date: "16 April 2026",
        rating: 5,
        review: "My favorite piece from the conference",
        avatar: "EO",
        color: "#b39ddb"
    },
    {
        id: 5,
        name: "Sophie Sats",
        date: "3 May 2026",
        rating: 5,
        review: "My favorite piece from the conference.",
        avatar: "SS",
        color: "#e8858a"
    },
    {
        id: 6,
        name: "Michael Thompson",
        date: "2 October 2025",
        rating: 5,
        review: "The Bitcoin pendant I purchased looks even better in person. The details are incredibly well done, and the packaging felt premium.",
        avatar: "MT",
        color: "#88e2c6"
    },
    {
        id: 7,
        name: "Michael Anderson",
        date: "29 January 2026",
        rating: 5,
        review: "Luxury energy with Bitcoin soul.",
        avatar: "MA",
        color: "#e8a87c"
    },
    {
        id: 8,
        name: "Nina Coldwallet",
        date: "22 February 2026",
        rating: 5,
        review: "Didn’t expect this quality. Stunning.",
        avatar: "NC",
        color: "#7cb9e8"
    },
    {
        id: 9,
        name: "Jessica Larson",
        date: "10 March 2026",
        rating: 5,
        review: "I bought a Bitcoin bracelet as a gift for my friend, and he absolutely loved it. The piece feels elegant, stylish, and unique compared to traditional jewelry.",
        avatar: "JL",
        color: "#85c1ae"
    },
    {
        id: 10,
        name: "Ava Lightning",
        date: "16 April 2026",
        rating: 5,
        review: "Soft feminine design, hardcore Bitcoin meaning.",
        avatar: "AL",
        color: "#b39ddb"
    },
    {
        id: 11,
        name: "Chloe StackSats",
        date: "29 January 2026",
        rating: 5,
        review: "Every female pleb needs this.",
        avatar: "CS",
        color: "#e8a87c"
    },
    {
        id: 12,
        name: " Ashley Mitchell",
        date: "10 March 2026",
        rating: 5,
        review: "BitcoinButik made the entire shopping experience easy and stress-free. The Bitcoin earrings I ordered arrived exactly as shown on the website and are very comfortable to wear.",
        avatar: "AM",
        color: "#85c1ae"
    },
    {
        id: 13,
        name: "Olivia Blocktime",
        date: "16 April 2026",
        rating: 5,
        review: "Looks premium and feels meaningful.",
        avatar: "OB",
        color: "#b39ddb"
    },
    {
        id: 14,
        name: "Zoe Freedom ₿",
        date: "22 February 2026",
        rating: 5,
        review: "The perfect gift for a Bitcoin queen.",
        avatar: "ZF",
        color: "#7cb9e8"
    },
    {
        id: 15,
        name: " Sophia Carter",
        date: "22 February 2026",
        rating: 5,
        review: "I was looking for jewelry with a modern Bitcoin design, and BitcoinButik delivered exactly what I wanted. My Bitcoin ring looks elegant and feels truly high quality. ",
        avatar: "SC",
        color: "#e8a87c"
    },
    {
        id: 16,
        name: "Charlotte Reed",
        date: "10 March 2026",
        rating: 5,
        review: "I’d been looking for a piece of jewelry that truly captured Bitcoin signal for a long time and couldn’t find anything until now. I’m thrilled someone finally created something with such great quality and attention to detail. This piece feels very special and meaningful. Would buy another piece!",
        avatar: "CR",
        color: "#85c1ae"
    },
];

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const StarRating = ({ rating }) => (
    <div className="cr-stars">
        {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`cr-star ${i < rating ? 'cr-star--filled' : 'cr-star--empty'}`}>★</span>
        ))}
    </div>
);

const ReviewCard = ({ review, name, date, rating, avatar, color }) => (
    <div className="cr-card">
        <div className="cr-card__header">
            <div className="cr-avatar" style={{ backgroundColor: color }}>{avatar}</div>
            <div className="cr-card__meta">
                <h4 className="cr-card__name">{name}</h4>
                <StarRating rating={rating} />
            </div>
            <div className="cr-google-icon"><GoogleIcon /></div>
        </div>
        <p className="cr-card__date">{date}</p>
        <p className="cr-card__review">{review}</p>
    </div>
);

export default function CustomerReviews() {
    const loopData = [...reviewsData, ...reviewsData];

    return (
        <>
            <section className="cr-section">
                <div className="cr-header">
                    <h2 className="cr-header__title">What People Are Saying About Us </h2>
                </div>

                <div className="cr-slider-outer">
                    <div className="cr-track">
                        {loopData.map((item, idx) => (
                            <ReviewCard key={`${item.id}-${idx}`} {...item} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}