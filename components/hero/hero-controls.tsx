"use client";

import { useId } from "react";
import { RotateCcw } from "lucide-react";
import { INCLINAISON_MAX, LEVEE_MAX, libelleInclinaison, libelleLevee } from "@/lib/demo/shutter";

/**
 * Contrôles manuels du hero. Deux `input[type=range]` natifs : le clavier
 * (flèches, Home, End) et le tactile fonctionnent sans code supplémentaire,
 * et `aria-valuetext` énonce l'état en clair plutôt qu'un nombre nu.
 */
export function HeroControls({
  levee,
  inclinaison,
  auto,
  onLevee,
  onInclinaison,
  onReprendreAuto,
}: {
  levee: number;
  inclinaison: number;
  auto: boolean;
  onLevee: (valeur: number) => void;
  onInclinaison: (valeur: number) => void;
  onReprendreAuto: () => void;
}) {
  const idLevee = useId();
  const idInclinaison = useId();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={idLevee} className="flex justify-between text-sm font-medium">
          <span>Ouverture du volet</span>
          <span className="font-mono text-muted-foreground">{Math.round(levee)}&nbsp;%</span>
        </label>
        <input
          id={idLevee}
          type="range"
          min={0}
          max={LEVEE_MAX}
          step={1}
          value={Math.round(levee)}
          onChange={(e) => onLevee(Number(e.target.value))}
          aria-valuetext={`${Math.round(levee)} pour cent — ${libelleLevee(levee)}`}
          className="h-2 w-full cursor-pointer accent-[color:var(--primary)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={idInclinaison} className="flex justify-between text-sm font-medium">
          <span>Orientation des lames</span>
          <span className="font-mono text-muted-foreground">{Math.round(inclinaison)}°</span>
        </label>
        <input
          id={idInclinaison}
          type="range"
          min={0}
          max={INCLINAISON_MAX}
          step={1}
          value={Math.round(inclinaison)}
          onChange={(e) => onInclinaison(Number(e.target.value))}
          aria-valuetext={`${Math.round(inclinaison)} degrés — ${libelleInclinaison(inclinaison)}`}
          className="h-2 w-full cursor-pointer accent-[color:var(--primary)]"
        />
        {/* L'angle seul ne suffit pas à comprendre l'état : on le nomme. */}
        <p className="font-mono text-xs text-muted-foreground">{libelleInclinaison(inclinaison)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-[var(--radius-sm)] border px-2.5 py-1 font-mono text-xs ${
            auto ? "border-transparent bg-primary text-primary-foreground" : "border-border text-muted-foreground"
          }`}
        >
          {auto ? "mode auto" : "mode manuel"}
        </span>
        {!auto ? (
          <button
            type="button"
            onClick={onReprendreAuto}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reprendre la journée automatique
          </button>
        ) : null}
      </div>
    </div>
  );
}
