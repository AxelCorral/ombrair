"use client";

import { useEffect, useState } from "react";

/**
 * `prefers-reduced-motion` lu au moment du rendu, et suivi s'il change.
 *
 * POURQUOI UN HOOK ET PAS UNE MEDIA QUERY CSS. Les mouvements de ces
 * démonstrations sont calculés image par image dans `useFrame` : ils
 * n'existent pas en CSS, et aucune règle `@media` ne peut les atteindre. Il
 * faut donc que le JavaScript connaisse la préférence.
 *
 * La valeur initiale est `false` — la même côté serveur et à la première
 * image côté client — pour ne pas provoquer d'écart d'hydratation. La
 * préférence réelle est appliquée juste après le montage ; le seul effet
 * possible est une première interpolation à vitesse normale, ce qui est sans
 * conséquence puisque la scène arrive à l'état de repos.
 */
export function useReducedMotion(): boolean {
  const [reduit, setReduit] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduit(requete.matches);

    const suivre = (e: MediaQueryListEvent) => setReduit(e.matches);
    requete.addEventListener("change", suivre);
    return () => requete.removeEventListener("change", suivre);
  }, []);

  return reduit;
}
