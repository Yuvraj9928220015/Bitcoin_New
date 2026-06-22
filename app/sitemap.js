// app/sitemap.js

export const dynamic = "force-static"; // ← jcdrink me yahi tha aur kaam kiya

const SITE_URL = "https://www.bitcoinbutik.com";
const API_URL = "https://api.bitcoinbutik.com";

// ─── API category → actual Next.js route ────────────────────────────────────
// API me jo bhi category aaye — sab handle karo
const getRoute = (category = "") => {
  const cat = category.toLowerCase().trim();

  // Earring PEHLE (kyunki "earring" me "ring" bhi hota hai)
  if (cat.includes("earring")) return "/collections/earrings";

  // Ring / Rings
  if (cat === "ring" || cat === "rings") return "/collections/rings";

  // Bracelet
  if (cat.includes("bracelet")) return "/collections/bracelets";

  // Women pendant (sab variations)
  if (cat.includes("woman") || cat.includes("women")) return "/collections/pendants/pendant-women";

  // Men pendant (sab variations — "man", "men", "man pendant")
  if (cat === "man" || cat === "men") return "/collections/pendants/pendant-mens";
  if (cat.includes("man pendant") || cat.includes("men pendant")) return "/collections/pendants/pendant-mens";

  // Generic pendant — women me daalo by default
  if (cat.includes("pendant")) return "/collections/pendants/pendant-women";

  return null; // unknown category — skip
};

export default async function sitemap() {

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages = [
    { url: `${SITE_URL}/`, priority: 1.0 },
    { url: `${SITE_URL}/collections/pendants/pendant-women`, priority: 0.9 },
    { url: `${SITE_URL}/collections/pendants/pendant-mens`, priority: 0.9 },
    { url: `${SITE_URL}/collections/rings`, priority: 0.9 },
    { url: `${SITE_URL}/collections/earrings`, priority: 0.9 },
    { url: `${SITE_URL}/collections/bracelets`, priority: 0.9 },
    { url: `${SITE_URL}/new-arrival`, priority: 0.8 },
    { url: `${SITE_URL}/about`, priority: 0.7 },
    { url: `${SITE_URL}/return`, priority: 0.6 },
    { url: `${SITE_URL}/faqs`, priority: 0.6 },
    { url: `${SITE_URL}/privacy`, priority: 0.5 },
    { url: `${SITE_URL}/terms`, priority: 0.5 },
  ].map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));

  // ── Product pages ─────────────────────────────────────────────────────────
  let productPages = [];

  try {
    const res = await fetch(`${API_URL}/api/products`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`API ${res.status}`);

    const products = await res.json();

    // Deduplicate by SLUG — same product alag categories me repeat hota hai
    const seenSlugs = new Set();

    productPages = products
      .map((product) => {
        if (!product.slug) return null; // no slug — skip
        if (seenSlugs.has(product.slug)) return null; // duplicate — skip
        seenSlugs.add(product.slug);

        const route = getRoute(product.category);
        if (!route) return null; // unknown category — skip

        return {
          url: `${SITE_URL}${route}/${product.slug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        };
      })
      .filter(Boolean);

  } catch (err) {
    console.error("Sitemap product fetch failed:", err);
  }

  return [...staticPages, ...productPages];
}