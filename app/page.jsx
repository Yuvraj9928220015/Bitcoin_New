import Home from "@/components/Home/Home";

import siteReview from "@/data/siteReview";
import { generateOrganizationSchema } from "@/lib/schema/organizationSchema";
import SeoSchema from "@/components/SeoSchema";

export default function Page() {
  const schema = generateOrganizationSchema({
    rating: siteReview.rating,
    reviewCount: siteReview.reviewCount,
  });

  return (
    <>
      {/* SEO Schema Inject (IMPORTANT) */}
      <SeoSchema schema={schema} />

      <Home />
    </>
  );
}