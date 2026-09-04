import { cn } from "@/lib/utils";

/**
 * Cadre en arche pour un visuel produit.
 *
 * L'arche est la signature du concept retenu, mais elle n'est pas un motif
 * décoratif : elle CADRE un produit, comme une ouverture de menuiserie. Elle
 * n'a donc rien à faire derrière un titre, un formulaire ou une carte
 * quelconque — seulement autour d'un objet.
 *
 * CE QUI CHANGE. La version précédente posait une arche `--background` sur
 * un fond `--muted/50`. Comme `--card` valait exactement `--background` en
 * thème clair, l'ouverture se lisait comme un halo pâle plutôt que comme un
 * percement : sur les captures d'audit, on ne distinguait pas le mur de
 * l'ouverture.
 *
 * Trois plans, tous à plat, aucun flou :
 *
 *   1. le MUR            surface panneau, la paroi percée
 *   2. l'EMBRASURE       une seconde arche décalée, un ton plus sombre —
 *                        c'est l'épaisseur du tableau de fenêtre, et c'est
 *                        elle qui donne la profondeur sans ombre portée
 *   3. l'OUVERTURE       le fond de page, où vit le produit
 *
 * La géométrie vient d'un `border-radius` elliptique plutôt que d'un
 * clipPath SVG : le rayon horizontal vaut la demi-largeur, comme l'impose la
 * construction du signe, et le rayon vertical est calé pour que le sommet
 * soit un vrai demi-cercle dans une boîte 4/3. Les angles bas gardent les
 * 5 px de la charte.
 */

/** Rayons de l'arche, partagés par l'embrasure et l'ouverture. */
const ARCHE = "50% 50% 5px 5px / 66.7% 66.7% 5px 5px";

export function ArcheProduit({
  children,
  className,
  /** Filet de lumière filtrée dans le haut de l'ouverture. Réservé aux
      scènes qui ne dessinent pas déjà leur propre lumière. */
  lumiere = false,
  /** Retire le mur : l'arche est alors posée directement sur la page. */
  sansMur = false,
}: {
  children: React.ReactNode;
  className?: string;
  lumiere?: boolean;
  sansMur?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full p-[7%]",
        sansMur ? "bg-transparent" : "bg-surface-panneau",
        className
      )}
    >
      {/* Embrasure : même arche, décalée d'un cheveu vers le haut-gauche.
          Le liseré visible est l'épaisseur du tableau. */}
      <div
        aria-hidden="true"
        className="absolute inset-[7%] -translate-x-[3px] -translate-y-[3px] bg-border/70"
        style={{ borderRadius: ARCHE }}
      />

      <div
        className="relative h-full w-full overflow-hidden bg-background"
        style={{ borderRadius: ARCHE }}
      >
        {children}

        {lumiere ? (
          <div
            aria-hidden="true"
            className="lumiere-lames pointer-events-none absolute inset-x-0 top-0 h-1/2 text-persienne dark:text-chaux"
          />
        ) : null}
      </div>
    </div>
  );
}
