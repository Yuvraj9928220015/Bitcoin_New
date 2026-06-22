"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./admin.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MDXEditorComponent = dynamic(
  () => import("../../components/admin/MDXEditorComponent"),
  { ssr: false }
);

function toUrlHandle(str) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Barosche");
  const [image, setImage] = useState(null);
  const [altTag, setAltTag] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [seoOpen, setSeoOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [urlHandle, setUrlHandle] = useState("");
  const [urlHandleEdited, setUrlHandleEdited] = useState(false);
  const [script, setScript] = useState("");

  useEffect(() => { fetchBlogs(); }, []);

  // Title type hone par auto-sync (jab tak user ne khud edit nahi kiya)
  useEffect(() => {
    if (!urlHandleEdited) setUrlHandle(toUrlHandle(title));
    if (title && !pageTitle) setPageTitle(title);
  }, [title]);

  const fetchBlogs = () => {
    fetch(`${API_URL}/api/blogs`)
      .then((r) => r.json())
      .then((d) => { setBlogs(Array.isArray(d) ? d : []); setLoadingBlogs(false); })
      .catch(() => { setBlogs([]); setLoadingBlogs(false); });
  };

  const handleUrlChange = (e) => {
    setUrlHandle(toUrlHandle(e.target.value));
    setUrlHandleEdited(true);
  };

  const resetUrl = () => { setUrlHandle(toUrlHandle(title)); setUrlHandleEdited(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !image) {
      alert("Title, Content aur Image required hain!");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("author", author);
    fd.append("content", content);
    fd.append("image", image);
    fd.append("altTag", altTag || title);
    fd.append("pageTitle", pageTitle || title);
    fd.append("metaDescription", metaDescription);
    fd.append("urlHandle", urlHandle || toUrlHandle(title));
    fd.append("script", script);

    try {
      const res = await fetch(`${API_URL}/api/blogs`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        alert("Blog Published! 🎉");
        setTitle(""); setContent(""); setImage(null); setAltTag("");
        setPageTitle(""); setMetaDescription(""); setUrlHandle("");
        setUrlHandleEdited(false); setScript(""); setSeoOpen(false);
        fetchBlogs();
      } else {
        alert("Error: " + data.message);
      }
    } catch {
      alert("Server error!");
    }
  };

  const handleDelete = async (identifier) => {
    if (!confirm("Yeh blog delete karna chahte ho?")) return;
    try {
      const res = await fetch(`${API_URL}/api/blogs/${identifier}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { alert("Blog deleted!"); fetchBlogs(); }
      else alert("Delete failed: " + data.message);
    } catch {
      alert("Server error!");
    }
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-layout">

        {/* ── LEFT: Create Form ── */}
        <div className="admin-card">
          <div className="admin-header"><h2>New Blog Article</h2></div>

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="admin-input-group">
              <label>Blog Title</label>
              <input
                className="admin-input-field"
                type="text"
                placeholder="e.g. What is Bitcoin?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* URL Handle — title ke neeche, prominent */}
            <div className="admin-input-group">
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                URL Handle
                {urlHandleEdited && (
                  <button type="button" onClick={resetUrl}
                    style={{
                      fontSize: "0.7rem", padding: "2px 8px", background: "#333",
                      color: "#aaa", border: "1px solid #444", borderRadius: "4px", cursor: "pointer"
                    }}>
                    ↺ Reset
                  </button>
                )}
              </label>
              <div style={{ display: "flex" }}>
                <span style={{
                  padding: "10px 12px", background: "#1a1a1a", border: "1px solid #333",
                  borderRight: "none", borderRadius: "6px 0 0 6px", color: "#666",
                  fontSize: "0.875rem", whiteSpace: "nowrap"
                }}>
                  blog/
                </span>
                <input
                  className="admin-input-field"
                  type="text"
                  value={urlHandle}
                  onChange={handleUrlChange}
                  placeholder="custom-url-yahan"
                  style={{ borderRadius: "0 6px 6px 0", marginBottom: 0 }}
                />
              </div>
              <small style={{ color: "#666", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Live URL:{" "}
                <span style={{ color: "#888" }}>
                  https://bitcoinbutik.com/blog/{urlHandle || "url-handle"}
                </span>
              </small>
            </div>

            {/* Author */}
            <div className="admin-input-group">
              <label>Author</label>
              <input className="admin-input-field" type="text" value={author}
                onChange={(e) => setAuthor(e.target.value)} />
            </div>

            {/* Image */}
            <div className="admin-input-group">
              <label>Cover Image</label>
              <input className="admin-input-field" type="file" accept="image/*"
                onChange={(e) => setImage(e.target.files[0])} required />
            </div>

            {/* Alt Tag */}
            <div className="admin-input-group">
              <label>Image Alt Tag</label>
              <input className="admin-input-field" type="text"
                placeholder="e.g. Bitcoin explained diagram"
                value={altTag} onChange={(e) => setAltTag(e.target.value)} />
            </div>

            {/* Content */}
            <div className="admin-input-group">
              <label>Article Content</label>
              <div className="admin-editor-box">
                <MDXEditorComponent onChange={setContent} />
              </div>
            </div>

            {/* SEO */}
            <div className="admin-seo-section">
              <button type="button" className="admin-seo-toggle" onClick={() => setSeoOpen(!seoOpen)}>
                <div className="admin-seo-toggle-left">
                  <span className="admin-seo-title">Search engine listing</span>
                  <span className="admin-seo-subtitle">
                    Meta title, description aur script add karo
                  </span>
                </div>
                <span className="admin-seo-arrow">{seoOpen ? "▲" : "▼"}</span>
              </button>

              {seoOpen && (
                <div className="admin-seo-content">
                  <div className="admin-seo-group">
                    <label>Meta Title</label>
                    <input className="admin-seo-input" type="text" maxLength={70}
                      value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
                    <span className="admin-seo-char-count">{pageTitle.length} of 70 characters used</span>
                  </div>
                  <div className="admin-seo-group">
                    <label>Meta Description</label>
                    <textarea className="admin-seo-textarea" maxLength={160}
                      value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                    <span className="admin-seo-char-count">{metaDescription.length} of 160 characters used</span>
                  </div>
                  <div className="admin-seo-group">
                    <label>Script (JSON-LD / Custom)</label>
                    <textarea className="admin-seo-textarea" value={script}
                      onChange={(e) => setScript(e.target.value)}
                      style={{ minHeight: "120px", fontFamily: "monospace", fontSize: "0.85rem" }} />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="admin-submit-btn">Publish Blog</button>
          </form>
        </div>

        {/* ── RIGHT: Blog List ── */}
        <div className="admin-card admin-blog-list-card">
          <div className="admin-header">
            <h2>Published Blogs</h2>
            <span className="admin-blog-count">{blogs.length}</span>
          </div>

          {loadingBlogs ? (
            <p className="admin-empty">Loading...</p>
          ) : blogs.length === 0 ? (
            <div className="admin-empty"><p>No blogs published yet.</p></div>
          ) : (
            <div className="admin-blog-list">
              {blogs.map((blog) => {
                const identifier = blog.urlHandle || blog.slug;
                return (
                  <div key={blog._id} className="admin-blog-item">
                    <div className="admin-blog-info">
                      <h3>{blog.title}</h3>
                      <p>
                        By {blog.author} ·{" "}
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#555", marginTop: "2px" }}>
                        /blog/{identifier}
                      </p>
                    </div>
                    <div className="admin-blog-actions">
                      <Link href={`/admin-blog/${identifier}`} className="admin-edit-btn">
                        Edit
                      </Link>
                      <button className="admin-delete-btn" onClick={() => handleDelete(identifier)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}