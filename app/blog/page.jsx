import BlogListPage from "./BlogListPage";

export const metadata = {
  title: "Blog | Bitcoinbutik",
  description: "Read the latest blogs on jewellery, styling tips, gemstones and more.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return <BlogListPage />;
}