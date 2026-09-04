import { cn } from "@/lib/utils";
import { LienFleche } from "@/components/site/actions";
import {
  disclaimerPionniers,
  getCreditsPionniers,
  wordingPionniers,
} from "@/lib/pionniers";

/**
 * Ombrair Pionniers — briques partagées.
 *
 * La mécanique du programme est écrite ICI et nulle part ailleurs : accueil,
 * page produit, page dédiée et récapitulatif de devis consomment ces
 * composants plutôt que de recopier « 1 capteur = 1 Crédit Pionnier » dans
 * six fichiers.
 *
 * DIRECTION VISUELLE. Aucune identité secondaire n'est créée. Mêmes tokens,
 * même mesure, même typographie que le reste du site : Chaux, Persienne,
 * Nuit. Fraîche et Ambre restent strictement thermiques et ne servent donc
 * jamais ici — un crédit n'est ni chaud ni froid.
 *
 * Aucun signe financier : pas de pièce, pas de dollar, pas de courbe, pas de
 * chandelier. Le programme parle d'appartenance, pas de spéculation. Le seul
 * motif est celui de la marque — l'arche et les lames.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Badge
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Marqueur discret. Mono, petit, Persienne, contour simple — l'étiquette
 * d'un programme client, pas une récompense dorée ni un badge de jeu.
 */
export function BadgePionnier({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "t-eyebrow inline-flex items-center gap-2 border border-border px-2.5 py-1 text-muted-foreground",
        className
      )}
    >
      <span aria-hidden="true" className="block size-1.5 bg-foreground" />
      Pionnier
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Mention compacte
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Une ligne, à poser sous un prix ou dans une carte produit.
 *
 * `capteurs` à `null` — cas de la fenêtre, dont le catalogue ne chiffre pas
 * les capteurs — bascule sur la formule générique. Jamais de nombre inventé.
 *
 * Volontairement sans fond, sans bordure et en corps de soutien : la mention
 * ne doit rivaliser ni avec le prix, ni avec le nom du produit, ni avec
 * l'appel à l'action.
 */
export function MentionPionniers({
  capteurs,
  className,
}: {
  capteurs?: number | null;
  className?: string;
}) {
  const credits = capteurs != null ? getCreditsPionniers(capteurs) : null;

  return (
    <p className={cn("t-caption text-muted-foreground", className)}>
      {credits != null && credits > 0 ? (
        <>
          <span className="t-data text-foreground">{capteurs}</span> capteurs inclus ·{" "}
          <span className="t-data text-foreground">{credits}</span>{" "}
          {credits > 1 ? "Crédits Pionniers" : "Crédit Pionnier"}
        </>
      ) : (
        wordingPionniers.mentionCourte
      )}
    </p>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Décompte détaillé
 * ───────────────────────────────────────────────────────────────────────── */

export interface LignePionnier {
  /**
   * Identifiant de ligne. Nécessaire parce que deux lignes portent
   * légitimement le même libellé — le kit contient bien DEUX « Capteur
   * intérieur », et les afficher séparément est ce qui rend « 1 capteur =
   * 1 crédit » évident. Le libellé ne peut donc pas servir de clé.
   */
  id: string;
  label: string;
  /** Nombre d'unités de cette ligne. */
  quantite: number;
  /** Cette ligne compte-t-elle comme capteur ? Ombrair Link : non. */
  eligible: boolean;
}

/**
 * Le décompte, article par article, comme un bordereau.
 *
 * C'est la pièce qui rend la mécanique évidente en cinq secondes : on voit
 * ce qui compte, ce qui ne compte pas, et le total. Les lignes non éligibles
 * sont AFFICHÉES avec un tiret plutôt que masquées — c'est ainsi qu'on
 * comprend qu'Ombrair Link n'est pas un capteur, au lieu de se demander
 * pourquoi il a disparu.
 *
 * Les quantités sont en IBM Plex Mono, comme toute donnée chiffrée du site.
 */
export function DecomptePionniers({
  lignes,
  titre,
  className,
}: {
  lignes: LignePionnier[];
  titre?: string;
  className?: string;
}) {
  const capteurs = lignes.reduce((n, l) => n + (l.eligible ? l.quantite : 0), 0);
  const credits = getCreditsPionniers(capteurs);

  return (
    <div className={cn("flex flex-col", className)}>
      {titre ? <p className="t-eyebrow mb-4 text-muted-foreground">{titre}</p> : null}

      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Décompte des capteurs éligibles et des Crédits Pionniers correspondants
        </caption>
        <tbody>
          {lignes.map((ligne) => (
            <tr key={ligne.id} className="border-t border-border first:border-t-0">
              <th scope="row" className="t-support py-3 pr-4 font-normal">
                {ligne.label}
              </th>
              <td className="t-data t-support py-3 text-right whitespace-nowrap">
                {ligne.eligible ? (
                  `+${getCreditsPionniers(ligne.quantite)}`
                ) : (
                  <>
                    <span aria-hidden="true" className="text-muted-foreground">
                      —
                    </span>
                    <span className="sr-only">aucun crédit</span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {/* Le filet du total se pose AU-DESSUS de la ligne, comme sur un
              bordereau : c'est lui qui sépare le détail de la somme. */}
          <tr className="border-t-2 border-foreground">
            <th scope="row" className="t-support py-3 pr-4 font-medium">
              {credits > 1 ? "Crédits Pionniers" : "Crédit Pionnier"}
            </th>
            <td className="t-data py-3 text-right text-xl">{credits}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Encart de programme
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Renvoi vers le programme, à poser dans une page produit.
 *
 * `compact` réduit l'encart à son strict nécessaire — utilisé là où le
 * programme ne doit surtout pas prendre le pas sur le produit.
 */
export function EncartPionniers({
  lignes,
  compact = false,
  className,
}: {
  lignes?: LignePionnier[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      <BadgePionnier />

      <p className={cn("mt-5 text-balance", compact ? "t-h3" : "t-h2 max-w-xl")}>
        {wordingPionniers.accroche}
      </p>

      <p className="t-support mt-3 max-w-md text-muted-foreground">
        {wordingPionniers.sousTitre}
      </p>

      {lignes?.length ? <DecomptePionniers lignes={lignes} className="mt-7 w-full max-w-sm" /> : null}

      <LienFleche href="/pionniers" className="mt-6">
        {wordingPionniers.cta}
      </LienFleche>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Avertissement
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * L'avertissement, en corps de lecture normal.
 *
 * Il n'est pas relégué en 10 px sous la page : le brief l'interdit
 * explicitement, et une réserve illisible ne réserve rien. Il est porté par
 * un montant vertical, le même repère que les alertes de l'application.
 */
export function AvertissementPionniers({ className }: { className?: string }) {
  return (
    <aside
      className={cn("border-l-2 border-foreground/40 pl-5", className)}
      aria-label="Avertissement sur le programme Ombrair Pionniers"
    >
      <p className="t-support font-medium">{disclaimerPionniers.titre}</p>
      <p className="t-support mt-2 max-w-2xl text-muted-foreground">
        {disclaimerPionniers.texte}
      </p>
    </aside>
  );
}
