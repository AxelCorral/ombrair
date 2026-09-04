import type { Metadata } from "next";
import Link from "next/link";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { VisuelArticle } from "@/components/site/visuels-editoriaux";
import { articles, tempsLectureMinutes } from "@/lib/content/ressources";

export const metadata: Metadata = {
  title: "Ressources",
  description:
    "Canicule, confort thermique et logement : des articles sourcés sur ce qui marche vraiment.",
};

/**
 * Index des articles.
 *
 * Les quatre cartes étaient strictement identiques : rien ne distinguait
 * l'article le plus utile du dernier de la liste, et aucun repère ne
 * permettait de choisir. Deux ajouts, tous deux vérifiables :
 *
 *  - le temps de lecture, CALCULÉ à partir du texte de l'article ;
 *  - la source principale, qui existe déjà dans les données.
 *
 * Volontairement absentes : les dates de publication — le projet n'en a
 * pas, et en fabriquer serait exactement le genre de fausse précision que
 * ce site s'interdit — et les catégories, qui n'existent pas non plus dans
 * le modèle.
 *
 * CE QUI CHANGE VISUELLEMENT. Chaque article porte maintenant son visuel
 * éditorial — géométrie et architecture, jamais de photo ni de personnage —
 * et le premier occupe une composition en deux colonnes qui n'a rien à voir
 * avec celle des trois suivants. La hiérarchie se voit avant d'être lue.
 */
export default function RessourcesPage() {
  const [principal, ...autres] = articles;

  return (
    <main className="flex flex-1 flex-col">
      <Section rythme="ample">
        <OuvertureChapitre
          niveau="h1"
          surtitre="Ressources"
          titre="La canicule et le logement, avec des sources"
          chapo="Ce qui marche vraiment contre la chaleur d'été, expliqué à partir de travaux publics — pas de slogans."
        />
      </Section>

      {/* ─── L'article à lire en premier ─────────────────────────────────
          Composition en deux colonnes, visuel à droite : rien d'autre sur
          la page n'a cette forme, donc rien ne lui dispute la première
          place. */}
      <Section fond="sourde" rythme="ample">
        <article>
          <Link
            href={`/ressources/${principal.slug}`}
            className="group grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16"
          >
            <div>
              <p className="t-eyebrow text-muted-foreground">
                À lire en premier
                <span aria-hidden="true" className="px-2 opacity-40">
                  /
                </span>
                {tempsLectureMinutes(principal)} min
              </p>

              <h2 className="t-h1 mt-5 max-w-2xl text-balance underline-offset-[6px] group-hover:underline">
                {principal.titre}
              </h2>

              <p className="t-lead mt-5 max-w-xl text-muted-foreground">{principal.chapo}</p>

              <p className="t-caption mt-8 border-t border-border pt-5 text-muted-foreground">
                Source — {principal.sources[0].label}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-border">
              <VisuelArticle slug={principal.slug} />
            </div>
          </Link>
        </article>
      </Section>

      {/* ─── Les autres ─── */}
      <Section rythme="ample">
        <OuvertureChapitre surtitre="À lire aussi" titre="Trois autres repères" />

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {autres.map((article) => (
            <article key={article.slug}>
              <Link href={`/ressources/${article.slug}`} className="group flex h-full flex-col">
                <div className="overflow-hidden rounded-lg border border-border">
                  <VisuelArticle slug={article.slug} />
                </div>

                <p className="t-eyebrow mt-5 text-muted-foreground">
                  {tempsLectureMinutes(article)} min
                </p>

                <h3 className="t-h3 mt-3 underline-offset-[6px] group-hover:underline">
                  {article.titre}
                </h3>

                <p className="t-support mt-3 flex-1 text-muted-foreground">{article.chapo}</p>

                <p className="t-caption mt-6 border-t border-border pt-4 text-muted-foreground">
                  Source — {article.sources[0].label}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
