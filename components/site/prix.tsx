import { cn } from "@/lib/utils";
import { LienFleche } from "@/components/site/actions";
import {
  formatPrix,
  getBundleSavings,
  getPrixProduit,
  getSuggestions,
  offreParId,
  type OffreId,
} from "@/lib/offres";

/**
 * Affichage des prix — briques partagées.
 *
 * RÈGLE D'AFFICHAGE PRINCIPALE : le prix mis en avant est TOUJOURS celui du
 * produit seul. Le total installé n'est jamais le titre tarifaire d'une
 * carte ou d'un hero ; il n'apparaît qu'une fois l'installation choisie.
 *
 * Aucun montant n'est écrit ici : tout vient de `lib/offres.ts`, formaté par
 * `formatPrix`. Un composant qui afficherait « 349,99 € » en dur
 * réintroduirait exactement le problème que cette migration supprime.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Prix d'une offre
 * ───────────────────────────────────────────────────────────────────────── */

export function PrixOffre({
  id,
  taille = "normal",
  mentionInstallation = true,
  className,
}: {
  id: OffreId;
  taille?: "normal" | "grand" | "compact";
  /** Rappelle que la pose est disponible en option, sans en donner le prix. */
  mentionInstallation?: boolean;
  className?: string;
}) {
  const offre = offreParId(id);
  const tailles = {
    compact: "text-2xl",
    normal: "text-3xl",
    grand: "text-4xl",
  } as const;

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="flex flex-wrap items-baseline gap-x-3">
        <span className={cn("t-data whitespace-nowrap", tailles[taille])}>
          {formatPrix(offre.prixProduitCents)}
        </span>
        <span className="t-data t-caption text-muted-foreground">{offre.unite}</span>
      </p>

      {mentionInstallation ? (
        <p className="t-caption mt-2 text-muted-foreground">
          Installation Ombrair disponible en option.
        </p>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Détail produit + installation
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Les deux lignes, puis le total. Utilisé sur les pages produit, sous le
 * prix principal : on montre ce que coûte la pose sans la présenter comme
 * incluse.
 */
export function DetailInstallation({ id, className }: { id: OffreId; className?: string }) {
  const offre = offreParId(id);
  const total = offre.prixProduitCents + offre.prixInstallationCents;

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="t-eyebrow text-muted-foreground">Avec installation Ombrair</p>

      <dl className="mt-4">
        <div className="flex items-baseline justify-between gap-4 border-t border-border py-2.5">
          <dt className="t-support text-muted-foreground">{offre.nom}</dt>
          <dd className="t-data t-support">{formatPrix(offre.prixProduitCents)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-border py-2.5">
          <dt className="t-support text-muted-foreground">Installation Ombrair</dt>
          <dd className="t-data t-support">+{formatPrix(offre.prixInstallationCents)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t-2 border-foreground py-3">
          <dt className="t-support font-medium">Total</dt>
          <dd className="t-data text-lg">{formatPrix(total)}</dd>
        </div>
      </dl>

      <p className="t-caption mt-3 text-muted-foreground">
        L&apos;installation reste optionnelle : le prix affiché plus haut est celui du produit
        seul.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Économie d'un pack
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * L'économie, CALCULÉE et non écrite. Elle compare le prix du pack à la
 * somme de ses composants achetés séparément — donc elle suit d'elle-même un
 * changement de grille.
 *
 * Pas de pastille rouge, pas de « -30 % », pas de prix barré criard : un
 * montant et une phrase, dans la même typographie que le reste du site.
 */
export function EconomiePack({ id, className }: { id: OffreId; className?: string }) {
  const economie = getBundleSavings(id);
  if (economie <= 0) return null;

  // Somme des composants, recalculée depuis l'offre plutôt que via un cast :
  // `getPrixSepare` n'accepte qu'un PackId, et un `as never` masquerait une
  // vraie erreur de type le jour où un id changerait.
  const offre = offreParId(id);
  const separe = offre.produitsInclus.reduce((somme, p) => somme + getPrixProduit(p), 0);

  return (
    <p className={cn("t-caption text-muted-foreground", className)}>
      <span className="t-data text-foreground">{formatPrix(economie)}</span> de moins que les
      deux produits achetés séparément (
      <span className="t-data">{formatPrix(separe)}</span>).
    </p>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Suggestions — « Souvent choisi avec »
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Cross-sell contextuel.
 *
 * WORDING. « Souvent choisi avec » et non « les clients achètent souvent
 * ceci » : le projet est fictif et ne dispose d'aucune donnée de vente. La
 * première formule décrit une association logique, la seconde prétendrait
 * mesurer un comportement qui n'a jamais été observé.
 *
 * Deux suggestions au maximum, en lignes séparées par un filet — pas un
 * carrousel, pas de vignettes e-commerce.
 */
export function SuggestionsOffres({
  id,
  titre = "Souvent choisi avec",
  className,
}: {
  id: OffreId;
  titre?: string;
  className?: string;
}) {
  const suggestions = getSuggestions(id);
  if (suggestions.length === 0) return null;

  return (
    <section className={cn("flex flex-col", className)} aria-label={titre}>
      <h2 className="t-eyebrow border-b border-border pb-2 text-muted-foreground">{titre}</h2>

      <ul className="flex flex-col">
        {suggestions.map((offre) => {
          const economie = getBundleSavings(offre.id);
          return (
            <li
              key={offre.id}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border py-4"
            >
              <div>
                <p className="t-support font-medium">{offre.nom}</p>
                {economie > 0 ? (
                  <p className="t-caption mt-1 text-muted-foreground">
                    Économisez{" "}
                    <span className="t-data text-foreground">{formatPrix(economie)}</span> par
                    rapport aux produits séparés.
                  </p>
                ) : (
                  <p className="t-caption mt-1 text-muted-foreground">{offre.unite}</p>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <span className="t-data t-support whitespace-nowrap">
                  {formatPrix(offre.prixProduitCents)}
                </span>
                <LienFleche href={lienOffre(offre.id)} className="t-caption">
                  {offre.type === "pack" ? "Passer au pack" : "Découvrir"}
                </LienFleche>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Où mène une offre. Les packs n'ont pas de page dédiée : ils vivent dans la
 * section « Les packs » du catalogue, et le lien y renvoie par ancre plutôt
 * que de créer deux pages qui répéteraient les pages produit.
 */
export function lienOffre(id: OffreId): string {
  return offreParId(id).type === "pack" ? `/gammes#packs` : `/gammes/${id}`;
}
