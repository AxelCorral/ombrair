"use client";

import { useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * CAMÉRA DES DÉMONSTRATIONS DE BAIE.
 *
 * Extraite de `volet-scene.tsx` pour que les deux pages produit se
 * manipulent exactement pareil : mêmes poses, mêmes limites, même bouton de
 * réinitialisation. Un visiteur qui passe du volet à la fenêtre ne doit pas
 * avoir à réapprendre la scène.
 */

export type CoteBaie = "exterieur" | "interieur";
export type AngleBaie = "face" | "trois-quarts";

/**
 * Poses de caméra. Reculées par rapport au premier réglage : à 2,5–3 m avec
 * un champ de 32°, la baie remplissait le cadre et les murs se coupaient en
 * dalles. On recule et on rétrécit le champ — moins de déformation de
 * perspective, et l'ouverture se lit DANS un mur.
 *
 * Les poses intérieures sont les symétriques des extérieures : c'est la même
 * baie, regardée depuis l'autre face du mur.
 */
export const POSES: Record<`${CoteBaie}-${AngleBaie}`, readonly [number, number, number]> = {
  "exterieur-face": [0, 0.02, 4.1],
  "exterieur-trois-quarts": [1.75, 0.5, 3.5],
  "interieur-face": [0, 0.02, -4.1],
  "interieur-trois-quarts": [-1.7, 0.45, -3.5],
};

/** Champ de la caméra, commun aux deux démonstrations. */
export const FOV = 28;

/**
 * L'orbite reste bridée AUTOUR DU CÔTÉ COURANT. On regarde un produit
 * fonctionner dans une ouverture, on n'inspecte pas un objet isolé : laisser
 * tourner librement amènerait dans la tranche du mur, où il n'y a rien à
 * voir. Le changement de côté se fait donc au bouton, pas à la souris.
 *
 * L'azimut est mesuré depuis +Z : 0 regarde la façade, π regarde la pièce.
 */
const AZIMUTS: Record<CoteBaie, readonly [number, number]> = {
  exterieur: [-Math.PI / 4, Math.PI / 4],
  interieur: [Math.PI - Math.PI / 4, Math.PI + Math.PI / 4],
};

export function CameraBaie({
  cote,
  vue,
  resetSignal,
}: {
  cote: CoteBaie;
  vue: AngleBaie;
  /** Compteur de réinitialisation : incrémenté, il replace la caméra. */
  resetSignal: number;
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const pose = POSES[`${cote}-${vue}`];
  const [azMin, azMax] = AZIMUTS[cote];
  const coteAffiche = useRef(cote);

  /**
   * UN RECADRAGE EST UNE CONSIGNE PONCTUELLE, PAS UN RAPPEL PERMANENT.
   *
   * La première version rejoignait la pose à chaque image dès que la caméra
   * s'en écartait — donc aussi après un glissement de souris. On pouvait
   * tourner autour de la baie, mais l'angle choisi se défaisait tout seul en
   * quelques secondes : autant dire qu'on ne pouvait pas regarder le produit
   * sous l'angle qu'on voulait, ce qui est pourtant la raison d'être des
   * contrôles.
   *
   * Le déplacement ne s'arme donc plus que sur un ÉVÉNEMENT — changement de
   * côté, changement d'angle, bouton « Réinitialiser la vue » — et se désarme
   * dès que la caméra est arrivée, ou dès que la main de l'utilisateur reprend
   * la scène.
   */
  const enRoute = useRef(true);

  useEffect(() => {
    enRoute.current = true;
  }, [cote, vue, resetSignal]);

  /** Le geste de l'utilisateur annule un recadrage en cours. */
  const relacher = useCallback(() => {
    enRoute.current = false;
  }, []);

  useFrame(({ camera }) => {
    /*
     * CHANGEMENT DE CÔTÉ : COUPE FRANCHE, pas d'interpolation.
     *
     * Un lerp entre +4,1 et −4,1 passe par l'origine, donc À TRAVERS le mur
     * et le produit. Et comme les bornes d'azimut basculent en même temps,
     * `update()` recadrerait la caméra en plein mouvement. Passer de l'autre
     * côté est un déplacement, pas un travelling : on coupe.
     */
    if (coteAffiche.current !== cote) {
      coteAffiche.current = cote;
      camera.position.set(...pose);
      enRoute.current = false;
      controls.current?.update?.();
      return;
    }

    if (!enRoute.current) return;

    // À l'intérieur d'un même côté, la caméra rejoint la pose en continu :
    // changer d'angle ou réinitialiser produit un déplacement, jamais un saut.
    cible.set(...pose);
    if (camera.position.distanceTo(cible) < 0.01) {
      enRoute.current = false;
      return;
    }
    camera.position.lerp(cible, 0.12);
    controls.current?.update?.();
  });

  return (
    <OrbitControls
      ref={controls}
      target={[0, 0, 0]}
      enablePan={false}
      onStart={relacher}
      minAzimuthAngle={azMin}
      maxAzimuthAngle={azMax}
      minPolarAngle={Math.PI / 2 - 0.5}
      maxPolarAngle={Math.PI / 2 + 0.35}
      minDistance={2.6}
      maxDistance={5.5}
      enableDamping
      dampingFactor={0.08}
    />
  );
}

/** Vecteur de travail : le recadrage tourne à chaque image, il n'alloue rien. */
const cible = new THREE.Vector3();
