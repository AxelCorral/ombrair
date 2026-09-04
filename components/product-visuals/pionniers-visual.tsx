/**
 * Visuel du programme Ombrair Pionniers.
 *
 * CE QUI EST DESSINÉ. Une suite d'arches — le signe de la marque — dont les
 * trois premières sont pleines et les suivantes en contour. C'est une file
 * de contributions : les premiers sont marqués, la suite reste ouverte.
 * L'idée du programme tient dans cette image, sans qu'aucun mot financier
 * n'apparaisse.
 *
 * CE QUI N'EST PAS DESSINÉ, ET POURQUOI. Ni pièce, ni dollar, ni courbe, ni
 * chandelier, ni flèche de cours, ni maillage « blockchain ». Le programme
 * parle d'appartenance à une histoire, pas de spéculation : lui donner
 * l'esthétique d'un produit financier trahirait à la fois la charte et le
 * propos. Aucune couleur nouvelle non plus — Chaux, Persienne, Nuit — et ni
 * Fraîche ni Ambre, qui restent thermiques.
 *
 * La géométrie de l'arche est celle du signe : arc de rayon égal à la
 * demi-largeur, base à angles adoucis. Elle vient de `cheminArche`, la même
 * fonction que le logo, pour qu'aucune version approximative ne circule.
 */
import { cheminArche } from "@/components/brand/ombrair-logo";

const LARGEUR = 26;
const HAUTEUR = 34;
const PAS = 38;
const NOMBRE = 7;
/** Les trois premières arches sont pleines : ce sont les pionniers. */
const PREMIERS = 3;

export function PionniersVisual() {
  const chemin = cheminArche(LARGEUR, HAUTEUR, 2);

  return (
    <svg viewBox="0 0 280 90" className="h-full w-full" aria-hidden="true" fill="none">
      {/* Ligne d'assise : toutes les contributions reposent sur la même base. */}
      <line
        x1="0"
        y1="72"
        x2="280"
        y2="72"
        className="stroke-persienne/35 dark:stroke-chaux/25"
        strokeWidth="1.4"
      />

      {Array.from({ length: NOMBRE }).map((_, i) => {
        const premier = i < PREMIERS;
        return (
          <g key={i} transform={`translate(${14 + i * PAS} ${72 - HAUTEUR})`}>
            <path
              d={chemin}
              className={
                premier
                  ? "fill-persienne dark:fill-chaux"
                  : "fill-none stroke-persienne/35 dark:stroke-chaux/30"
              }
              strokeWidth="1.4"
            />
            {/* Les trois lames du signe, seulement sur les arches pleines. */}
            {premier
              ? [0.44, 0.6, 0.76].map((r, j) => (
                  <rect
                    key={r}
                    x={LARGEUR * 0.173}
                    y={HAUTEUR * r}
                    width={LARGEUR * 0.654}
                    height={HAUTEUR * 0.077}
                    rx={(HAUTEUR * 0.077) / 2}
                    className="fill-chaux dark:fill-persienne"
                    style={{ opacity: j === 2 ? 0.55 : 1 }}
                  />
                ))
              : null}
          </g>
        );
      })}

      {/* Cote sous les trois premières : ce sont elles qui sont comptées. */}
      <path
        d="M 14 80 L 14 84 M 14 84 L 92 84 M 92 84 L 92 80"
        className="stroke-persienne/45 dark:stroke-chaux/35"
        strokeWidth="1.2"
      />
    </svg>
  );
}
