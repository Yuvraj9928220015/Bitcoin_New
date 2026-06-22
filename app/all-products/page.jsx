
import Link from "next/link";

export const dynamic = "force-static";

const API_URL = "https://api.bitcoinbutik.com";

async function getProducts() {
    const res = await fetch(`${API_URL}/api/products`, {
        cache: "force-cache",
    });

    if (!res.ok) return [];

    return res.json();
}

export default async function Page() {
    const products = await getProducts();

    return (
        <div style={{ padding: "20px" }}>
            <h1>All Products</h1>

            {products.map((p) => {
                let url = "/collections/pendants/pendant-women/" + p.slug;

                const cat = (p.category || "").toLowerCase();

                //FIXED ORDER + SIMPLE LOGIC

                if (cat.includes("earring")) {
                    url = "/collections/earrings/" + p.slug;
                }
                else if (cat.includes("ring")) {
                    url = "/collections/rings/" + p.slug;
                }
                else if (cat.includes("bracelet")) {
                    url = "/collections/bracelets/" + p.slug;
                }
                else if (cat === "man") {   // 🔥 EXACT MATCH
                    url = "/collections/pendants/pendant-mens/" + p.slug;
                }
                else if (cat === "woman") {
                    url = "/collections/pendants/pendant-women/" + p.slug;
                }

                return (
                    <div key={p._id || p.slug}>
                        <Link href={url}>
                            {p.title || p.name || p.slug}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}