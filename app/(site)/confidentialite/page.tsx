import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment le produit Ombrair (fictif) traite les données de capteurs et de compte, telles que conçues pour ce projet.",
};

const sections = [
  {
    titre: "Ce qui serait collecté",
    texte:
      "Les relevés des capteurs (température, humidité, luminosité, qualité d'air), l'état des ouvrants, et les préférences renseignées dans l'application (scénarios, seuils, membres du foyer). Aucune donnée de navigation externe n'est croisée avec ces relevés.",
  },
  {
    titre: "Pourquoi",
    texte:
      "Ces données servent exclusivement au pilotage automatique des ouvrants et à l'affichage de l'historique dans l'application. Elles ne serviraient jamais à du ciblage publicitaire.",
  },
  {
    titre: "Durée de conservation",
    texte:
      "90 jours d'historique dans l'usage inclus à vie. Historique illimité avec l'option facultative Ombrair+. Passé ce délai, les relevés détaillés seraient supprimés automatiquement.",
  },
  {
    titre: "Hébergement",
    texte: "Hébergement prévu au sein de l'Union européenne, pour rester sous le seul cadre du RGPD.",
  },
  {
    titre: "Droit à l'effacement et à la portabilité",
    texte:
      "Un foyer pourrait demander l'export ou la suppression complète de ses données à tout moment, via les réglages de l'application ou le formulaire de contact.",
  },
];

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-16 sm:px-8">
      <section className="flex flex-col gap-4">
        <h1 className="t-display max-w-2xl text-balance">
          Politique de confidentialité
        </h1>
        <p className="max-w-lg text-sm text-muted-foreground">
          Ombrair est un projet étudiant fictif : aucune donnée n&apos;est réellement collectée par ce site. Ce qui
          suit décrit les principes de traitement des données <strong>tels qu&apos;ils ont été conçus</strong> pour
          le produit imaginé, à titre d&apos;exercice — pas une politique en vigueur sur un service réel.
        </p>
      </section>

      <section className="flex max-w-2xl flex-col gap-8">
        {sections.map((section) => (
          <div key={section.titre} className="flex flex-col gap-2">
            <h2 className="t-h3">{section.titre}</h2>
            <p className="text-sm text-muted-foreground">{section.texte}</p>
          </div>
        ))}
      </section>

      <section className="max-w-2xl">
        <Link href="/contact" className="text-sm font-medium underline underline-offset-4">
          Une question sur ces principes ? →
        </Link>
      </section>
    </main>
  );
}
