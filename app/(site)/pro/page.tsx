import type { Metadata } from "next";
import { FormulaireContact } from "@/components/site/formulaire-contact";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { ParcVisual } from "@/components/product-visuals/parc-visual";
import { offrePro } from "@/lib/tarifs";

export const metadata: Metadata = {
  title: offrePro.nom,
  description: offrePro.description,
};

/**
 * Ombrair Pro.
 *
 * CE QUI CHANGE. La page était un titre, quatre rectangles bordés et un
 * formulaire, avec une moitié droite vide sur toute sa hauteur. Elle ne
 * montrait jamais ce qui fait la différence de l'offre : un PARC, et un
 * seul endroit d'où on le regarde.
 *
 * Le schéma d'élévation multi-sites tient ce rôle. Il ne porte aucun
 * chiffre — le projet n'a ni référence client ni volume à annoncer, et une
 * illustration chiffrée serait une statistique inventée.
 *
 * Ombrair Pro n'est pas une seconde marque : mêmes tokens, même mesure,
 * même typographie que le reste du site. Seule la composition change,
 * parce que l'objet regardé change d'échelle.
 */

const fonctionnalites = [
  {
    titre: "Tableau de bord multi-sites",
    texte: "Vue d'ensemble de tous les bâtiments équipés, par site ou par zone géographique.",
  },
  {
    titre: "Supervision de flotte",
    texte: "État de chaque ouvrant, batteries, capteurs hors ligne, sur l'ensemble du parc.",
  },
  {
    titre: "Plan de gestion canicule",
    texte: "Scénarios coordonnés à l'échelle d'un établissement, activables en un geste.",
  },
  {
    titre: "Export de données",
    texte: "Historiques exportables pour appuyer un plan bleu ou un reporting interne.",
  },
];

export default function ProPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* ─── Promesse + parc ─── */}
      <Section rythme="ample">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
          <div className="flex flex-col items-start">
            <p className="t-eyebrow text-muted-foreground">{offrePro.accroche}</p>

            <h1 className="t-display mt-5 text-balance">{offrePro.nom}</h1>

            <p className="t-lead mt-6 max-w-lg text-muted-foreground">{offrePro.description}</p>

            <div className="mt-9 border-t border-border pt-6">
              <p className="t-data text-3xl">{offrePro.prixAffiche}</p>
              <p className="t-support mt-3 max-w-md text-muted-foreground">
                Le périmètre — nombre de sites, nombre d&apos;ouvrants, niveau de supervision —
                se définit à l&apos;étude. Aucun montant type n&apos;est publié.
              </p>
            </div>
          </div>

          <figure className="flex flex-col gap-4 lg:order-2">
            <div className="rounded-lg bg-surface-panneau p-6">
              <ParcVisual />
            </div>
            <figcaption className="t-caption flex items-baseline gap-3 text-muted-foreground">
              <span aria-hidden="true" className="h-px w-8 shrink-0 translate-y-[-0.25em] bg-border" />
              Schéma — plusieurs sites, un seul tableau de bord. Ouvrant plein : fermé.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ─── Ce que l'offre ajoute ───────────────────────────────────────
          Quatre entrées sur des filets plutôt que quatre cartes : le
          contenu est une liste, pas quatre objets distincts. */}
      <Section fond="sourde" rythme="ample">
        <OuvertureChapitre
          surtitre="Ce que Pro ajoute"
          titre="Regarder un parc, pas un logement"
          chapo="Les produits et l'installation sont les mêmes. Ce qui change, c'est l'échelle à laquelle on les observe et on les commande."
        />

        <ol className="mt-12 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {fonctionnalites.map((f, i) => (
            <li
              key={f.titre}
              className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-5 md:first:border-t md:[&:nth-child(2)]:border-t"
            >
              <span className="t-data t-caption text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="t-h3 block">{f.titre}</span>
                <span className="t-support mt-2 block text-muted-foreground">{f.texte}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── Demander une étude ──────────────────────────────────────────
          Formulaire à gauche, panneau contextuel à droite : la moitié
          droite qui restait vide dit maintenant ce qui se passe après
          l'envoi. */}
      <Section rythme="ample">
        <OuvertureChapitre surtitre="Prendre contact" titre="Demander une étude" />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-20">
          <div>
            <FormulaireContact
              libelleSujet="Type d'établissement"
              optionsSujet={[
                "Bailleur social",
                "EHPAD",
                "École / établissement scolaire",
                "Autre collectivité",
              ]}
            />
          </div>

          <aside className="lg:border-l lg:border-border lg:pl-20">
            <p className="t-eyebrow text-muted-foreground">Ce qui suit une demande</p>
            <ol className="mt-6 flex flex-col">
              {[
                ["Un échange", "Périmètre, contraintes du bâti, calendrier de l'établissement."],
                ["Une visite", "Relevé des ouvrants, vérification de l'existant, points d'accès réseau."],
                ["Une étude chiffrée", "Le montant se construit sur ce relevé, pas sur un barème."],
              ].map(([titre, texte], i) => (
                <li
                  key={titre}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-border py-4 first:border-t"
                >
                  <span className="t-data t-caption text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="t-support block font-medium">{titre}</span>
                    <span className="t-caption mt-1.5 block text-muted-foreground">{texte}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="t-caption mt-6 text-muted-foreground">
              Formulaire de démonstration — dans le cadre de ce projet fictif, aucune donnée
              n&apos;est transmise ni conservée.
            </p>
          </aside>
        </div>
      </Section>
    </main>
  );
}
