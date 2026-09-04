import { cn } from "@/lib/utils";

/** Écartements de référence (px), alignés sur --spacing-lame-0..100 de globals.css. */
const GAP_STOPS = [0, 4, 8, 14, 22];

function ecartLame(ouverture: number) {
  const clamped = Math.min(100, Math.max(0, ouverture));
  const scaled = (clamped / 100) * (GAP_STOPS.length - 1);
  const index = Math.floor(scaled);
  const t = scaled - index;
  const from = GAP_STOPS[index];
  const to = GAP_STOPS[Math.min(index + 1, GAP_STOPS.length - 1)];
  return from + (to - from) * t;
}

interface LameProps {
  /** Taux d'ouverture, 0 (fermé) à 100 (ouvert). */
  ouverture: number;
  /** Nombre de lames affichées. */
  nombre?: number;
  className?: string;
  lameClassName?: string;
  /**
   * true : les lames se partagent toute la hauteur du conteneur (flex-1),
   * l'écartement grandit au détriment de leur épaisseur — utile pour un
   * volet qui doit couvrir toute une fenêtre. false (défaut) : lames
   * d'épaisseur fixe, pour un usage décoratif court (séparateur, accent).
   */
  remplir?: boolean;
}

/**
 * Le motif signature du système graphique Ombrair : des bandes horizontales
 * dont l'écartement encode le taux d'ouverture. Purement visuel — la
 * sémantique (pourcentage, état) doit être portée par le composant parent
 * via aria-label/texte, pas par ces lames.
 */
export function Lame({ ouverture, nombre = 8, className, lameClassName, remplir = false }: LameProps) {
  const gap = ecartLame(ouverture);
  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col", className)}
      style={{ gap: `${gap}px` }}
    >
      {Array.from({ length: nombre }).map((_, i) => (
        <div
          key={i}
          className={cn(
            remplir ? "min-h-0 flex-1" : "h-3 shrink-0",
            "w-full rounded-[var(--radius-sm)] bg-current",
            lameClassName
          )}
        />
      ))}
    </div>
  );
}
