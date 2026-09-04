"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Le curseur des démonstrations produit.
 *
 * Extrait de `volet-controls.tsx` pour que la démo Fenêtre présente
 * exactement les mêmes réglages — même hauteur de piste, même position de la
 * valeur, même comportement clavier. Deux pages produit qui se manipulent
 * différemment se liraient comme deux sites.
 *
 * DIRECTION. Pas de composant de configurateur : un libellé, une valeur en
 * IBM Plex Mono comme partout où le site affiche une donnée chiffrée, une
 * piste, et une ligne d'aide qui dit ce que le réglage change. Le bloc doit
 * ressembler au reste d'Ombrair, pas à un widget importé.
 */
export function Curseur({
  label,
  aide,
  valeur,
  min,
  max,
  pas,
  unite,
  onChange,
  className,
}: {
  label: string;
  /** Ce que ce réglage change, en une ligne. Facultatif. */
  aide?: string;
  valeur: number;
  min: number;
  max: number;
  pas: number;
  unite: string;
  onChange: (v: number) => void;
  className?: string;
}) {
  const id = useId();
  const progression = ((valeur - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="t-support font-medium">
          {label}
        </label>
        <output htmlFor={id} className="t-data t-support whitespace-nowrap">
          {valeur} {unite}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={pas}
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value))}
        /*
         * `accent-color` suffit pour la poignée et la piste remplie sur les
         * navigateurs modernes, et garde le contrôle natif — donc le clavier,
         * le tactile et les technologies d'assistance sans code en plus.
         * Le dégradé de piste rend la progression lisible même là où
         * `accent-color` ne colore pas la partie remplie.
         *
         * `touch-action: manipulation` : sans lui, un glissement démarré sur
         * la piste peut être interprété comme un défilement de page sur
         * certains mobiles, et le réglage devient impossible à ajuster.
         */
        className="mt-3 h-2 w-full cursor-pointer touch-manipulation appearance-none rounded-full accent-[color:var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        style={{
          background: `linear-gradient(to right, var(--primary) ${progression}%, var(--border) ${progression}%)`,
        }}
      />

      {aide ? <p className="t-caption mt-2 text-muted-foreground">{aide}</p> : null}
    </div>
  );
}
