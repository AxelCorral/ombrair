import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'origine du projet Ombrair, son équipe (personas fictifs) et sa position sur les données personnelles.",
};

const equipe = [
  {
    nom: "Camille R.",
    role: "Conception produit",
    texte: "Imagine le comportement de l'algorithme et les scénarios de l'application.",
  },
  {
    nom: "Younes T.",
    role: "Ingénierie capteurs",
    texte: "Définit ce que mesurent Ombrair Link et les capteurs, et leurs limites techniques.",
  },
  {
    nom: "Léa F.",
    role: "Design",
    texte: "Porte la direction artistique — la menuiserie plutôt que la domotique lisse.",
  },
];

export default function AProposPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-16 sm:px-8">
      <section className="flex flex-col gap-4">
        <h1 className="t-display max-w-2xl text-balance">À propos</h1>
        <p className="t-lead max-w-lg text-muted-foreground">
          Ombrair est un projet fictif, conçu dans le cadre d&apos;un exercice de création d&apos;entreprise du
          Master MIASHS de l&apos;Université Toulouse Jean Jaurès, sur la problématique des canicules et du confort
          thermique du logement. Aucune vente réelle n&apos;est associée à ce site.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="t-h2">L&apos;origine</h2>
        <p className="max-w-lg text-sm text-muted-foreground">
          Le point de départ de l&apos;exercice : pendant les épisodes de canicule, le bon réflexe (fermer avant que
          le soleil ne tape, ouvrir quand l&apos;air redevient frais) existe déjà — mais peu de foyers le font au bon
          moment, tous les jours, sans y penser. Ombrair imagine ce que donnerait un produit qui automatise
          uniquement ce geste-là, sans complexifier le reste du logement.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="t-h2">L&apos;équipe (personas fictifs)</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {equipe.map((membre) => (
            <div key={membre.nom} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-6">
              <h3 className="t-h3">{membre.nom}</h3>
              <p className="text-sm text-muted-foreground">{membre.role}</p>
              <p className="text-sm text-muted-foreground">{membre.texte}</p>
              <span className="mt-1 w-fit rounded-[var(--radius-sm)] bg-muted px-2 py-0.5 t-caption tracking-wide text-muted-foreground uppercase">
                Persona fictif
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="t-h2">Notre position sur les données</h2>
        <p className="max-w-lg text-sm text-muted-foreground">
          Un produit qui mesure l&apos;intérieur d&apos;un logement en continu doit être clair sur ce qu&apos;il fait
          de ces données. Dans la conception du projet, la règle est simple : seules les données nécessaires au
          pilotage sont collectées, elles ne sont jamais revendues, et leur durée de conservation est annoncée
          d&apos;avance plutôt que laissée floue.
        </p>
        <Link href="/confidentialite" className="w-fit text-sm font-medium underline underline-offset-4">
          Lire la politique de confidentialité →
        </Link>
      </section>
    </main>
  );
}
