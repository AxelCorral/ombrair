"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COULEURS } from "./geometrie";

/**
 * LUMIÈRE DE LA BAIE, dont l'intensité suit la luminosité réglée.
 *
 * C'est le seul endroit où un paramètre de la simulation touche autre chose
 * que la mécanique : quand on pousse la luminosité, la scène s'éclaire. Cela
 * évite l'incohérence d'un volet qui se ferme « à cause du soleil » dans une
 * scène restée grise, et donne à la démo Fenêtre son ambiance nocturne sur le
 * preset « Rafraîchissement nocturne ».
 *
 * LE SOLEIL EST DEHORS, en +Z. Ce n'était pas le cas tant que la scène
 * n'avait qu'un côté ; ça le devient dès qu'on entre dans la pièce, où toute
 * la lecture repose sur le fait que la lumière vient de la baie.
 *
 * Extrait de `volet-scene.tsx`, inchangé.
 */
export function Eclairage({ luminosite }: { luminosite: number }) {
  const soleil = useRef<THREE.DirectionalLight>(null);
  const ambiant = useRef<THREE.AmbientLight>(null);
  const ciel = useRef<THREE.HemisphereLight>(null);
  const appointFacade = useRef<THREE.DirectionalLight>(null);
  const cible = THREE.MathUtils.clamp(luminosite / 100, 0, 1);
  const courant = useRef(cible);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.01, Math.min(delta, 0.1));
    courant.current += (cible - courant.current) * k;
    const l = courant.current;

    /*
     * TOUT CE QUI VIENT DU DEHORS SUIT LA LUMINOSITÉ, pas seulement le
     * soleil. Avec un seul projecteur variable et trois appoints constants,
     * le preset « Rafraîchissement nocturne » — 5 % de luminosité — rendait
     * une façade de plein jour : la scène ne disait pas qu'il faisait nuit,
     * alors que c'est précisément ce qui justifie d'ouvrir la fenêtre.
     *
     * L'appoint INTÉRIEUR, lui, ne bouge pas : une pièce éclairée le soir
     * reste éclairée. C'est ce contraste — façade sombre, pièce chaude — qui
     * fait lire la nuit, bien mieux qu'un assombrissement général qui rendrait
     * simplement le produit illisible.
     */
    if (soleil.current) soleil.current.intensity = 0.35 + l * 2.35;
    if (ambiant.current) ambiant.current.intensity = 0.32 + l * 0.24;
    if (ciel.current) ciel.current.intensity = 0.2 + l * 0.28;
    if (appointFacade.current) appointFacade.current.intensity = 0.16 + l * 0.28;
  });

  return (
    <>
      <ambientLight ref={ambiant} intensity={0.5} />
      <hemisphereLight ref={ciel} args={[COULEURS.ciel, COULEURS.murOmbre, 0.45]} />
      <directionalLight
        ref={soleil}
        /*
         * LE SOLEIL VIENT DE GAUCHE, la caméra trois-quarts regarde depuis la
         * droite. C'est ce contre-jour léger qui creuse le tableau : la joue
         * du percement que l'on voit depuis la droite est celle qui reste dans
         * l'ombre, et c'est elle qui donne au mur son épaisseur.
         */
        position={[-2.4, 2.8, 3.0]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        /* Le volume d'ombre doit englober le sol de la pièce, où tombe la
           lumière filtrée par les lames — pas seulement la baie. */
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-camera-far={14}
        /* `normalBias` plutôt qu'un `bias` plus fort : c'est le remède aux
           rayures d'acné sur les surfaces plates — l'appui et la tablette en
           étaient couverts — sans décoller les ombres de leur objet. */
        shadow-bias={-0.0002}
        shadow-normalBias={0.025}
      />
      {/*
        Appoints doux, un par côté : ni la façade ni la pièce ne doivent
        jamais tomber dans le noir.

        Celui de la pièce a d'abord été réglé à 0,3, par souci de réalisme —
        une pièce EST plus sombre qu'une façade au soleil. Le résultat était
        illisible : l'enduit intérieur, pourtant très clair, rendait un gris
        franc. Une pièce éclairée par une baie reste claire, c'est le
        CONTRASTE avec l'extérieur qui la fait paraître sombre — et ce
        contraste, le fond de ciel et le tablier rétroéclairé le donnent
        déjà.
      */}
      <directionalLight ref={appointFacade} position={[1.6, 1.2, 3]} intensity={0.42} />
      <directionalLight position={[1.2, 1.4, -3.2]} intensity={0.72} />
    </>
  );
}
