import type { Metadata } from "next";
import { EntreeCatalogue } from "@/components/site/entree-catalogue";
import { MatriceFonctions } from "@/components/site/matrice-fonctions";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { ActionLien, LienFleche } from "@/components/site/actions";
import { EconomiePack, PrixOffre } from "@/components/site/prix";
import { PACKS, offreParId } from "@/lib/offres";
import { accesAppInclus, gammes, offrePro, optionOmbrairPlus } from "@/lib/tarifs";

export const metadata: Metadata = {
  title: "Produits",
  description:
    "Capteur, volet, fenêtre : les trois produits Ombrair, ce que l'entreprise conçoit elle-même, ce qu'elle installe, et les options d'installation selon votre logement.",
};

/**
 * Catalogue produit.
 *
 * La page n'est plus une grille de tarifs mais une planche de catalogue :
 * trois entrées pleine mesure, ouverture en arche alternée, puis une matrice
 * de fonctions à la place du tableau de comparaison. Voir les notes de
 * `EntreeCatalogue` et `MatriceFonctions` pour le détail du parti pris.
 *
 * Aucun contenu commercial n'a changé : mêmes produits, mêmes prix, mêmes
 * mentions, même ordre.
 */
export default function GammesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section rythme="ample" className="pb-0 md:pb-0">
        <OuvertureChapitre
          niveau="h1"
          surtitre="Catalogue"
          titre="Trois objets, un même système"
          chapo={
            <>
              Les capteurs mesurent, les volets protègent, les fenêtres ventilent. On peut commencer
              par n&apos;importe lequel : ils se complètent au lieu de se remplacer.
            </>
          }
        />
      </Section>

      {/* Les trois entrées de catalogue. Le côté du visuel s'inverse à chaque
          entrée : la lecture descend en zigzag plutôt qu'en balayage. */}
      <Section rythme="normal" interieurClassName="flex flex-col gap-20 md:gap-28">
        {gammes.map((gamme, i) => (
          <EntreeCatalogue
            key={gamme.id}
            gamme={gamme}
            index={String(i + 1).padStart(2, "0")}
            inverse={i % 2 === 1}
          />
        ))}
      </Section>

      {/* ─── Les packs ───────────────────────────────────────────────────
          Section SECONDAIRE, et c'est délibéré : les trois produits restent
          les catégories principales d'Ombrair. Les packs sont une façon de
          les associer, pas deux offres de plus à mettre sur le même rang —
          d'où un traitement en deux entrées de liste plutôt qu'en cartes qui
          concurrenceraient les trois planches du dessus. */}
      <Section id="packs" fond="sourde" rythme="ample">
        <OuvertureChapitre
          surtitre="Les packs"
          titre="Deux associations, à prix plus juste"
          chapo="Un capteur seul mesure sans agir ; un ouvrant seul agit sans savoir quand. Les deux packs associent les deux, pour moins que la somme des produits."
        />

        <ul className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {PACKS.map((id) => {
            const pack = offreParId(id);
            return (
              <li key={id} className="border-t-2 border-foreground pt-6">
                {/* L'unité est déjà portée par PrixOffre, sous le montant :
                    la répéter ici en sous-titre disait deux fois la même
                    chose à deux lignes d'écart. */}
                <h3 className="t-h3">{pack.nom}</h3>

                <div className="mt-5">
                  <PrixOffre id={id} />
                </div>

                <EconomiePack id={id} className="mt-4" />
              </li>
            );
          })}
        </ul>
      </Section>

      <Section rythme="ample">
        <OuvertureChapitre
          surtitre="Comparaison"
          titre="Qui fait quoi"
          chapo="Ce ne sont pas trois formules à départager, mais trois pièces d'un même système. La question utile n'est donc pas laquelle coûte le moins, mais laquelle fait quoi."
        />
        <div className="mt-12">
          <MatriceFonctions />
        </div>
        <p className="t-support mt-8 max-w-2xl text-muted-foreground">
          {accesAppInclus} Les volets et les fenêtres proviennent de fabricants spécialisés :
          Ombrair les sélectionne, les revend, les installe et les intègre à son système, mais ne
          les fabrique pas.
        </p>
      </Section>

      {/* Deux offres qui ne sont pas des produits : une option et une offre
          destinée à d'autres interlocuteurs. Elles restent séparées du
          catalogue, sur une ligne partagée plutôt que dans deux cartes. */}
      <Section fond="sourde" rythme="normal">
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 border-t border-border pt-10 md:grid-cols-2">
          <div>
            <p className="t-eyebrow text-muted-foreground">Option</p>
            <h2 className="t-h3 mt-2">{optionOmbrairPlus.nom}</h2>
            <p className="t-support mt-3 text-muted-foreground">
              <span className="t-data text-foreground">{optionOmbrairPlus.prix}</span>{" "}
              {optionOmbrairPlus.unite} — jamais requise pour le fonctionnement de base.{" "}
              {optionOmbrairPlus.description}
            </p>
          </div>

          <div className="md:border-l md:border-border md:pl-16">
            <p className="t-eyebrow text-muted-foreground">Autres interlocuteurs</p>
            <h2 className="t-h3 mt-2">{offrePro.nom}</h2>
            <p className="t-support mt-3 text-muted-foreground">{offrePro.description}</p>
            <LienFleche href={offrePro.href} className="mt-4">
              Découvrir l&apos;offre Pro
            </LienFleche>
          </div>
        </div>
      </Section>

      <Section fond="encre" rythme="ample">
        <div className="flex flex-col items-start gap-6">
          <h2 className="t-h2 max-w-2xl text-balance">Voir ce que ça donne chez vous</h2>
          <p className="t-lead max-w-xl text-encre-muted">
            Une visite technique confirme la faisabilité et le montant. En attendant, le simulateur
            indique en quatre questions le produit adapté à votre situation.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ActionLien href="/devis" surEncre>
              Demander un devis
            </ActionLien>
            <ActionLien href="/simulateur" niveau="second" surEncre>
              Essayer le simulateur
            </ActionLien>
          </div>
        </div>
      </Section>
    </main>
  );
}
