import type { MetadataRoute } from "next";
import { gammes } from "@/lib/tarifs";
import { articles } from "@/lib/content/ressources";

/**
 * Le projet n'a pas de domaine de production : inventer une URL publique
 * donnerait un sitemap faux. `NEXT_PUBLIC_SITE_URL` permet d'en fournir une
 * le jour où le site est déployé ; à défaut on reste sur localhost, ce qui
 * est visiblement un environnement de développement plutôt qu'une adresse
 * fabriquée.
 */
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const PAGES_FIXES = [
  { chemin: "", priorite: 1 },
  { chemin: "/comment-ca-marche", priorite: 0.8 },
  { chemin: "/gammes", priorite: 0.9 },
  { chemin: "/application", priorite: 0.7 },
  { chemin: "/simulateur", priorite: 0.8 },
  { chemin: "/pro", priorite: 0.6 },
  { chemin: "/ressources", priorite: 0.6 },
  { chemin: "/pionniers", priorite: 0.5 },
  { chemin: "/a-propos", priorite: 0.4 },
  { chemin: "/devis", priorite: 0.8 },
  { chemin: "/contact", priorite: 0.4 },
  { chemin: "/faq", priorite: 0.5 },
  { chemin: "/mentions-legales", priorite: 0.2 },
  { chemin: "/confidentialite", priorite: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const maintenant = new Date();

  return [
    ...PAGES_FIXES.map(({ chemin, priorite }) => ({
      url: `${BASE}${chemin}`,
      lastModified: maintenant,
      priority: priorite,
    })),
    ...gammes.map((gamme) => ({
      url: `${BASE}${gamme.href}`,
      lastModified: maintenant,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${BASE}/ressources/${article.slug}`,
      lastModified: maintenant,
      priority: 0.5,
    })),
  ];
}
