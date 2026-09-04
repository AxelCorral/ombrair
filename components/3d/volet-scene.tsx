"use client";

import { Canvas } from "@react-three/fiber";
import { INCLINAISON_MAX } from "@/lib/demo/shutter";
import { Dormant, Enveloppe, OPACITE_VITRAGE, Vitrage } from "./shared/architecture";
import { CameraBaie, FOV, POSES, type AngleBaie, type CoteBaie } from "./shared/camera-baie";
import { Eclairage } from "./shared/eclairage";
import { BAIE_H, BAIE_L, DORMANT } from "./shared/geometrie";
import { useReducedMotion } from "./shared/use-reduced-motion";
import { VoletAssembly } from "./shared/volet-assembly";

/**
 * Scène 3D du volet Ombrair.
 *
 * ════════════════════════════════════════════════════════════════════════
 * POURQUOI PROCÉDURAL, ET PAS UN `.glb` COMME LE CAPTEUR
 *
 * Le capteur est un objet FIGÉ : un `.glb` chargé dans `<model-viewer>` y
 * suffit, et c'est la solution la plus simple à maintenir.
 *
 * Le volet est l'inverse. Il a deux degrés de liberté pilotés en continu par
 * l'état React — hauteur du tablier, angle de chaque lame — et le nombre de
 * lames visibles change avec la hauteur. Un `.glb` demanderait un rig, des
 * morph targets ou des animations à échantillonner, pour un résultat plus
 * lourd et bien plus difficile à corriger.
 *
 * Ici la géométrie est décrite en code : chaque lame est un objet, sa
 * rotation est une valeur, et modifier la mécanique revient à changer une
 * ligne. C'est aussi ce qui garde le poids réseau à zéro — aucun modèle à
 * télécharger.
 * ════════════════════════════════════════════════════════════════════════
 *
 * CE QUI A CHANGÉ AVEC LA DÉMO FENÊTRE. Le contenu de cette scène a été
 * déplacé dans `components/3d/shared/` — cotes, enveloppe architecturale,
 * dormant, vitrage, éclairage, caméra et volet lui-même. La démo Fenêtre
 * monte les mêmes briques dans la même baie ; c'est ce qui garantit que le
 * volet qu'on y voit apparaître est bien CE volet, et pas une seconde
 * implémentation qui divergerait au premier ajustement.
 *
 * Ce fichier ne décrit donc plus que l'assemblage propre à la page Volet :
 * une baie fermée par un vitrage fixe, avec le volet devant.
 *
 * Le repère et l'empilement en profondeur sont documentés dans
 * `shared/geometrie.ts`.
 */

export type CoteVolet = CoteBaie;
export type AngleVolet = AngleBaie;

export interface VoletSceneProps {
  levee: number;
  inclinaison: number;
  luminosite: number;
  /** De quel côté du mur on se place. */
  cote: CoteVolet;
  /** Vue de face ou trois-quarts. */
  vue: AngleVolet;
  /** Compteur de réinitialisation : incrémenté, il replace la caméra. */
  resetSignal: number;
}

export function VoletScene({
  levee,
  inclinaison,
  luminosite,
  cote,
  vue,
  resetSignal,
}: VoletSceneProps) {
  const reduireAnimation = useReducedMotion();

  return (
    <Canvas
      /*
       * `shadows` seul demande à three un `PCFSoftShadowMap`, déprécié depuis
       * la 0.183 : il retombe sur `PCFShadowMap` en écrivant un avertissement
       * dans la console à chaque montage. On demande donc directement le
       * filtrage retenu — même rendu, console propre.
       */
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ position: [...POSES[`${cote}-${vue}`]], fov: FOV }}
      /*
       * EXPOSITION DU TONE-MAPPING.
       *
       * fiber applique ACES par défaut, à exposition 1. ACES est fait pour
       * du rendu photoréaliste : il comprime les tons moyens, et la charte
       * en sortait délavée — l'enduit Chaux et le doublage intérieur, tous
       * deux très clairs, rendaient un gris franc. On remonte l'exposition
       * pour que les couleurs sortent là où elles sont écrites, en gardant
       * ACES pour l'écrêtage doux des hautes lumières quand le soleil est au
       * maximum.
       *
       * Valeur mesurée sur le rendu, pas choisie à l'œil : voir le rapport.
       */
      gl={{ antialias: true, toneMappingExposure: 1.55 }}
      /* Le fond vient du thème de la page, pas d'un ciel 3D : la scène doit
         se poser dans le site, pas ouvrir une fenêtre sur un autre univers.
         Ce que l'on voit PAR la baie, lui, est de la géométrie — voir les
         deux plans de fond dans `shared/architecture.tsx`. */
      style={{ background: "transparent" }}
    >
      <Eclairage luminosite={luminosite} />
      <Enveloppe />
      <Dormant />
      {/* Vitrage fixe : sur cette page, la fenêtre n'est pas le sujet. Elle
          n'est là que pour qu'on comprenne que le volet est DEHORS, et qu'on
          voie ce qu'il fait à la lumière qui entre. */}
      <Vitrage
        largeur={BAIE_L - DORMANT * 2}
        hauteur={BAIE_H - DORMANT * 2}
        opacite={OPACITE_VITRAGE[cote]}
      />
      <VoletAssembly
        levee={levee}
        inclinaison={inclinaison}
        reduireAnimation={reduireAnimation}
      />
      <CameraBaie cote={cote} vue={vue} resetSignal={resetSignal} />
    </Canvas>
  );
}

export { INCLINAISON_MAX };
