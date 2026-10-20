import type { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/data";
import { practiceAreas } from "@/lib/practice-areas";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/about", "/practice-areas", "/news", "/reviews", "/booking", "/contact", "/privacy"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );
  const areaRoutes = practiceAreas.map((area) => ({
    url: `${site.url}/practice-areas/${area.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const posts = await getAllPublishedSlugs();
  const postRoutes = posts.map((post) => ({
    url: `${site.url}/news/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...areaRoutes, ...postRoutes];
}
