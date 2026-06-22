// app/admin-blog/[slug]/page.js
import EditBlogPageClient from "./EditBlogPage";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  try {
    if (!API_URL) return [{ slug: "placeholder" }];

    const res = await fetch(`${API_URL}/api/blogs`, { cache: "no-store" });
    if (!res.ok) return [{ slug: "placeholder" }];

    const blogs = await res.json();
    if (!Array.isArray(blogs) || blogs.length === 0) return [{ slug: "placeholder" }];

    // placeholder PEHLE — guaranteed banega
    return [
      { slug: "placeholder" },
      ...blogs.map((blog) => ({ slug: blog.urlHandle || blog.slug })),
    ];
  } catch (error) {
    return [{ slug: "placeholder" }];
  }
}

export default function EditBlogPage() {
  return <EditBlogPageClient />;
}