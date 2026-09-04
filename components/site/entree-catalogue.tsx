import { cn } from "@/lib/utils";
import { ArcheProduit } from "@/components/site/arche-produit";
import { LienFleche } from "@/components/site/actions";
import { VISUEL_PRODUIT } from "@/components/product-visuals";
import { PrixOffre } from "@/components/site/prix";
import type { Gamme, GammeId } from "@/lib/tarifs";

/**
 * Libellé de l'appel à l'action, par produit. C'est de la présentation, pas
 * une donnée commerciale : il n'a rien à faire dans `lib/tarifs.ts`. Écrit
 * en toutes lettres plutôt que dérivé du nom — « Découvrir volet ombrair »,
 * ce que produisait la dérivation automatique, n'est pas du français.
 */
const CTA: Record<GammeId, string> = {
  capteur: "Découvrir le capteur",
  volet: "Découvrir le volet",
  fenetre: "Découvrir la fenêtre",
};

/**
 * Entrée de catalogue produit — la brique de `/gammes`.
 *
 * POURQUOI PAS TROIS CARTES. La page reprenait le gabarit d'une grille de
 * tarifs : trois colonnes de hauteurs inégales, coiffées de bandes
 * horizontales qui ressemblaient à des chargements en attente, et aucune
 * illustration alors que les trois visuels produit existaient déjà. Capteur,
 * Volet et Fenêtre ne sont pas trois formules d'abonnement à comparer : ce
 * sont trois objets d'un même système.
 *
 * La page devient donc une planche de catalogue : une entrée par produit,
 * pleine mesure, l'ouverture en arche d'un côté et la fiche de l'autre, le
 * côté s'inversant à chaque entrée. Le regard descend en zigzag au lieu de
 * balayer trois colonnes — c'est la lecture d'un catalogue, pas d'un
 * comparateur de prix.
 *
 * L'accueil garde sa vitrine en trois cartes : les deux pages ne se
 * répètent plus, et chacune fait ce qu'elle sait faire.
 *
 * Les points affichés sont volontairement limités à trois : le détail vit
 * sur la page produit.
 */
export function EntreeCatalogue({
  gamme,
  index,
  inverse = false,
}: {
  gamme: Gamme;
  /** Référence de planche : « 01 », « 02 »… L'ordre est celui du système. */
  index: string;
  inverse?: boolean;
}) {
  const points = gamme.inclus.slice(0, 3);

  return (
    /*
     * Le côté du visuel s'inverse une entrée sur deux. L'inversion se fait
     * par PLACEMENT EXPLICITE et non par `order` : avec `order`, l'ouverture
     * changeait de colonne mais héritait de la largeur de sa nouvelle
     * colonne — l'arche passait de 24 rem à toute la place restante, et les
     * trois entrées n'avaient plus la même échelle. La colonne étroite reste
     * celle du visuel dans les deux sens.
     */
    <article
      className={cn(
        "grid grid-cols-1 items-center gap-8 lg:gap-16",
        inverse
          ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]"
          : "lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]"
      )}
    >
      <ArcheProduit className={inverse ? "lg:col-start-2 lg:row-start-1" : undefined}>
        {VISUEL_PRODUIT[gamme.id]}
      </ArcheProduit>

      <div className={inverse ? "lg:col-start-1 lg:row-start-1" : undefined}>
        <p className="t-eyebrow text-muted-foreground">
          <span className="text-foreground">{index}</span>
          <span aria-hidden="true" className="px-2 opacity-40">
            /
          </span>
          {gamme.role}
        </p>

        <h3 className="t-h2 mt-4">
          <a href={gamme.href} className="underline-offset-4 hover:underline">
            {gamme.nom}
          </a>
        </h3>

        <p className="t-lead mt-3 max-w-xl text-muted-foreground">{gamme.description}</p>

        {/* PRIX PRODUIT SEUL. L'installation est mentionnée comme une
            option, sans son montant : le catalogue compare des produits, et
            le tarif de pose se lit sur la page produit ou au devis. */}
        <div className="mt-6 border-t border-border pt-5">
          <PrixOffre id={gamme.offre} />
          <p className="t-caption mt-3 max-w-md text-muted-foreground">{gamme.resume}</p>
        </div>

        <ul className="mt-5 flex flex-col gap-2">
          {points.map((point) => (
            <li key={point} className="t-support flex gap-2.5">
              <span aria-hidden="true" className="text-muted-foreground">
                —
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <LienFleche href={gamme.href} className="mt-7">
          {CTA[gamme.id]}
        </LienFleche>
      </div>
    </article>
  );
}
