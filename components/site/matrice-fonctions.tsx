import { gammes } from "@/lib/tarifs";

/**
 * Matrice de fonctions — remplace le tableau comparatif de `/gammes`.
 *
 * POURQUOI. Le tableau précédent avait la forme exacte d'une grille de
 * formules d'abonnement : une colonne par produit, des « Oui » et des
 * « Non » alignés. Or Capteur, Volet et Fenêtre ne sont pas trois offres
 * concurrentes entre lesquelles choisir — ce sont trois pièces d'un même
 * système, dont deux se posent volontiers ensemble. Comparer leurs prix
 * n'a pas de sens ; comparer ce qu'elles FONT en a un.
 *
 * La matrice ne dit donc rien de nouveau : elle porte exactement les mêmes
 * faits que le tableau précédent, réorganisés par fonction plutôt que par
 * produit. Aucun élément commercial n'est ajouté ni retiré.
 *
 * ACCESSIBILITÉ. Le repère visuel est un carré plein (assuré) ou un contour
 * (non assuré) ; il n'est jamais le seul canal — chaque cellule porte son
 * libellé en `sr-only`, et la nuance des lignes « conçu et fabriqué » vit
 * dans la note sous la matrice, pas dans une couleur.
 */

type Etat = "oui" | "non";

const LIGNES: { fonction: string; groupe: string; etats: Record<string, Etat> }[] = [
  {
    groupe: "Ce que le produit fait",
    fonction: "Mesurer la température et la lumière",
    etats: { capteur: "oui", volet: "non", fenetre: "non" },
  },
  {
    groupe: "Ce que le produit fait",
    fonction: "Protéger du soleil",
    etats: { capteur: "non", volet: "oui", fenetre: "non" },
  },
  {
    groupe: "Ce que le produit fait",
    fonction: "Ventiler quand l'air extérieur est plus frais",
    etats: { capteur: "non", volet: "non", fenetre: "oui" },
  },
  {
    groupe: "Ce que le produit fait",
    fonction: "Se piloter depuis l'application",
    etats: { capteur: "oui", volet: "oui", fenetre: "oui" },
  },
  {
    groupe: "Ce qu'Ombrair fait",
    fonction: "Conçoit et fabrique le produit",
    etats: { capteur: "oui", volet: "non", fenetre: "non" },
  },
  {
    groupe: "Ce qu'Ombrair fait",
    fonction: "Installe, intègre et assure le suivi",
    etats: { capteur: "oui", volet: "oui", fenetre: "oui" },
  },
  {
    groupe: "Ce qu'Ombrair fait",
    fonction: "Donne accès à l'application, à vie et sans abonnement",
    etats: { capteur: "oui", volet: "oui", fenetre: "oui" },
  },
  {
    groupe: "À définir avec vous",
    fonction: "Dimensions de l'ouvrant",
    etats: { capteur: "non", volet: "oui", fenetre: "oui" },
  },
];

function Marque({ etat, produit, fonction }: { etat: Etat; produit: string; fonction: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={
          etat === "oui"
            ? "inline-block size-3 bg-foreground"
            : "inline-block size-3 border border-foreground/30"
        }
      />
      <span className="sr-only">
        {produit} — {fonction} : {etat === "oui" ? "oui" : "non"}
      </span>
    </>
  );
}

export function MatriceFonctions() {
  const groupes = [...new Set(LIGNES.map((l) => l.groupe))];

  return (
    /*
     * `relative` n'est pas décoratif : `sr-only` positionne en absolu, et
     * sans ancêtre positionné les libellés masqués (la légende du tableau,
     * les « oui / non » de chaque cellule) prennent l'ICB pour référence.
     * Leur texte, non replié, élargissait alors `documentElement` à 526 px
     * sur un écran de 390 — un débordement horizontal invisible à l'œil et
     * pourtant bien réel. Ancré ici, tout est contenu par le conteneur de
     * défilement.
     */
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[38rem] border-collapse text-left">
        <caption className="sr-only">
          Ce que fait chaque produit Ombrair et ce qu&apos;Ombrair prend en charge
        </caption>
        <thead>
          <tr>
            <td className="w-[46%]" />
            {gammes.map((g) => (
              <th key={g.id} scope="col" className="px-4 pb-4 align-bottom">
                <span className="t-eyebrow block text-muted-foreground">{g.role}</span>
                <span className="t-h3 mt-1.5 block">{g.nom.replace(" Ombrair", "")}</span>
              </th>
            ))}
          </tr>
        </thead>

        {groupes.map((groupe) => (
          <tbody key={groupe}>
            <tr>
              <th
                scope="colgroup"
                colSpan={4}
                className="t-eyebrow border-t border-foreground/30 pt-5 pb-2 text-left text-muted-foreground"
              >
                {groupe}
              </th>
            </tr>
            {LIGNES.filter((l) => l.groupe === groupe).map((ligne) => (
              <tr key={ligne.fonction} className="border-t border-border">
                <th scope="row" className="t-support py-3.5 pr-6 font-normal">
                  {ligne.fonction}
                </th>
                {gammes.map((g) => (
                  <td key={g.id} className="px-4 py-3.5">
                    <Marque
                      etat={ligne.etats[g.id]}
                      produit={g.nom}
                      fonction={ligne.fonction}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
