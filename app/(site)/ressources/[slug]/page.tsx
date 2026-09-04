import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/content/ressources";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return { title: article.titre, description: article.chapo };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-16 sm:px-8">
      <article className="mx-auto flex w-full max-w-[38rem] flex-col gap-8">
        <Link href="/ressources" className="t-support w-fit text-muted-foreground underline underline-offset-4">
          ← Toutes les ressources
        </Link>

        <header className="flex flex-col gap-4">
          <h1 className="t-h1 text-balance">{article.titre}</h1>
          <p className="t-lead text-muted-foreground">{article.chapo}</p>
        </header>

        <div className="t-body flex flex-col gap-5">
          {article.contenu.map((paragraphe, i) => (
            <p key={i}>{paragraphe}</p>
          ))}
        </div>

        <footer className="flex flex-col gap-2 border-t border-border pt-6">
          <p className="t-eyebrow text-muted-foreground">Sources</p>
          <ul className="flex flex-col gap-1">
            {article.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-support underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </article>
    </main>
  );
}
