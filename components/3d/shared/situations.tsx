"use client";

import { cn } from "@/lib/utils";

/**
 * La rangée de situations types, commune aux deux démonstrations.
 *
 * POURQUOI ELLE EXISTE. Personne ne sait quoi régler devant trois ou quatre
 * curseurs. Les situations donnent des points d'entrée qui produisent chacun
 * un comportement nettement différent — c'est le seul critère de sélection.
 *
 * Le contenu diffère d'une page à l'autre (le volet expose trois conditions,
 * la fenêtre quatre), mais le composant est le même : une rangée de boutons,
 * celui en cours marqué `aria-pressed`, l'intention en `title`.
 */
export interface Situation {
  id: string;
  nom: string;
  /** Ce que la situation démontre, en une ligne. */
  intention: string;
}

export function Situations<T extends Situation>({
  situations,
  actif,
  onChoisir,
  className,
}: {
  situations: readonly T[];
  /** Identifiant de la situation dont les valeurs sont exactement affichées. */
  actif: string | null;
  onChoisir: (situation: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <p className="t-eyebrow text-muted-foreground">Situations</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {situations.map((situation) => {
          const estActif = actif === situation.id;
          return (
            <button
              key={situation.id}
              type="button"
              onClick={() => onChoisir(situation)}
              aria-pressed={estActif}
              title={situation.intention}
              className={cn(
                "inline-flex h-9 items-center rounded-lg border px-3.5 text-[0.8125rem] font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                estActif
                  ? "border-foreground bg-surface-panneau"
                  : "border-border hover:border-foreground/40"
              )}
            >
              {situation.nom}
            </button>
          );
        })}
      </div>
    </div>
  );
}
