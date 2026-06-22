// app/blog/[slug]/page.js
import BlogClient from "./BlogClient";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getBlogs() {
  try {
    if (!API_URL) return [];
    const res = await fetch(`${API_URL}/api/blogs`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const blogs = await getBlogs();

  const staticSlugs = blogs.map((blog) => ({
    slug: blog.urlHandle || blog.slug,
  }));

  return [{ slug: "placeholder" }, ...staticSlugs];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!slug || slug === "placeholder") {
    return { title: "Blog | Bitcoinbutik" };
  }

  try {
    const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return { title: "Blog | Bitcoinbutik" };
    const blog = await res.json();

    const imageUrl = blog.image
      ? blog.image.startsWith("http")
        ? blog.image
        : `${API_URL}${blog.image}`
      : null;

    return {
      title: blog.pageTitle || blog.title,
      description: blog.metaDescription,
      alternates: {
        canonical: `https://bitcoinbutik.com/blog/${blog.urlHandle || blog.slug}`,
      },
      openGraph: {
        title: blog.pageTitle || blog.title,
        description: blog.metaDescription,
        url: `https://bitcoinbutik.com/blog/${blog.urlHandle || blog.slug}`,
        ...(imageUrl && {
          images: [{ url: imageUrl, alt: blog.altTag || blog.title }],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: blog.pageTitle || blog.title,
        description: blog.metaDescription,
        ...(imageUrl && { images: [imageUrl] }),
      },
    };
  } catch {
    return { title: "Blog | Bitcoinbutik" };
  }
}

export default function Page() {
  return <BlogClient />;
}