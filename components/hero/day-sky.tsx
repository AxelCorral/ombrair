import { melangeCiel, type PhaseCiel } from "@/lib/demo/day-cycle";

/**
 * Fond de ciel derrière la fenêtre. Deux couches superposées — la phase
 * courante et la suivante — fondues l'une dans l'autre selon l'avancement.
 * Aucune couleur n'est écrite ici : tout vient des tokens `--ciel-*`.
 */

const TOKEN_PHASE: Record<PhaseCiel, string> = {
  nuit: "var(--ciel-nuit)",
  aube: "var(--ciel-aube)",
  matin: "var(--ciel-matin)",
  midi: "var(--ciel-midi)",
  "apres-midi": "var(--ciel-apres-midi)",
  coucher: "var(--ciel-coucher)",
  crepuscule: "var(--ciel-crepuscule)",
};

export function DaySky({ heure }: { heure: number }) {
  const { de, vers, t } = melangeCiel(heure);

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: TOKEN_PHASE[de] }} />
      <div className="absolute inset-0" style={{ background: TOKEN_PHASE[vers], opacity: t }} />
    </div>
  );
}
