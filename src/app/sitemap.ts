import type { MetadataRoute } from "next";

const SITE_URL = "https://buildorbuy.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: "2026-10-12",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/build-vs-buy-framework`,
      lastModified: "2026-10-12",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/build-vs-buy-template`,
      lastModified: "2026-10-12",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/make-or-buy-decision`,
      lastModified: "2026-10-12",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
