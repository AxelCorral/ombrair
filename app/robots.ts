import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // La démo de l'application et la présentation projetée n'ont pas
      // vocation à être indexées : ce sont des outils, pas du contenu.
      disallow: ["/app", "/presentation"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
