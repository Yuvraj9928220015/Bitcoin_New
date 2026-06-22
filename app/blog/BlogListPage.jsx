"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./blog.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BlogListPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/blogs?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  const openBlog = (e, blog) => {
    e.preventDefault();
    router.push(`/blog/${blog.urlHandle || blog.slug}`);
  };

  const getImageUrl = (blog) => {
    if (!blog.image) return "/placeholder.jpg";
    const src = blog.image.startsWith("http")
      ? blog.image
      : `${API_URL}${blog.image}`;
    const bust = blog.updatedAt
      ? new Date(blog.updatedAt).getTime()
      : Date.now();
    return `${src}?t=${bust}`;
  };

  return (
    <div className="Blog">
      <div className="Blog-line"></div>
      <div className="Blog-container-Box-Image">
        <div className="container">
          <div className="row">
            <div className="About-title">
              <h2>Latest Blogs</h2>
            </div>

            {loading ? (
              <p style={{ padding: "40px", textAlign: "center", width: "100%" }}>
                Loading...
              </p>
            ) : blogs.length === 0 ? (
              <p style={{ padding: "40px", textAlign: "center", width: "100%" }}>
                No blogs published yet.
              </p>
            ) : (
              blogs.map((blog) => (
                <div
                  className="col-lg-4 col-md-4 col-sm-12 col-12"
                  key={blog.urlHandle || blog.slug}
                >
                  
                   <a href={`/blog/${blog.urlHandle || blog.slug}`}
                    onClick={(e) => openBlog(e, blog)}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="Blog-Section">
                      <div className="blog-img-wrapper">
                        <img
                          src={getImageUrl(blog)}
                          alt={blog.altTag || blog.title}
                        />
                      </div>
                      <div className="blog-content">
                        <div className="Blog-title">{blog.title}</div>
                        <div className="Blog-des">
                          {blog.metaDescription || ""}
                        </div>
                        <div className="blog-btn">
                          <span>Read More →</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}