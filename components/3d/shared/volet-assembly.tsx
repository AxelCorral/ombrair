"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  BAIE_H,
  BAIE_L,
  COULEURS,
  DORMANT,
  LAME_EP,
  LAME_H,
  NB_LAMES,
  poserLame,
  Z_VOLET,
} from "./geometrie";

/**
 * LE VOLET OMBRAIR — coffre, rails, tablier à lames orientables.
 *
 * ════════════════════════════════════════════════════════════════════════
 * C'EST LE MÊME VOLET SUR LES DEUX PAGES
 *
 * Ce composant est le volet de `/gammes/volet`, déplacé ici sans changement
 * de géométrie, de matériaux ni de mécanique. La démo Fenêtre ne dessine pas
 * un second volet : elle monte celui-ci dans sa propre baie, à la même
 * profondeur, avec les mêmes lames.
 *
 * C'est la seule façon honnête de tenir la promesse de la page Fenêtre — le
 * visiteur y voit l'équipement qu'on lui vend ailleurs, pas une illustration
 * approchante.
 * ════════════════════════════════════════════════════════════════════════
 *
 * DEUX MOUVEMENTS INDÉPENDANTS, comme le modèle mécanique du projet :
 *
 *  - `levee` remonte le tablier. Les lames du haut s'escamotent dans le
 *    coffre : on ne les fait pas disparaître d'un coup, on les écrase
 *    verticalement à mesure qu'elles y entrent, ce qui évite le clignotement
 *    d'une lame qui s'éteindrait brutalement.
 *
 *  - `inclinaison` fait pivoter chaque lame sur son axe horizontal. 0° =
 *    jointives, 90° = à plat.
 *
 * L'INTERPOLATION EST FAITE ICI, dans `useFrame`, et non par une transition
 * CSS : la cible vient de React, la valeur affichée la rejoint image par
 * image. Le mouvement reste mécanique — pas de rebond, pas de ressort.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Amortissement
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Base de la poursuite exponentielle : la valeur affichée couvre `1 − base^δt`
 * de l'écart restant à chaque image. Écrit sous cette forme, le mouvement ne
 * dépend pas de la fréquence d'affichage — un écran à 144 Hz et un écran à
 * 60 Hz produisent la même durée.
 *
 * La constante de temps vaut −1 / ln(base), soit ≈ 145 ms : le tablier rejoint
 * sa position en une demi-seconde environ. C'est la valeur d'origine de la
 * démo Volet, conservée telle quelle pour ne rien changer à son rendu.
 */
const AMORTISSEMENT = 0.001;

/**
 * Variante `prefers-reduced-motion` : ≈ 31 ms, soit deux ou trois images.
 *
 * On RACCOURCIT au lieu de supprimer. Le changement d'état reste visible —
 * c'est ce que la démonstration enseigne — mais il cesse d'être un
 * déplacement qu'on suit des yeux.
 */
const AMORTISSEMENT_REDUIT = 1e-14;

/* ─────────────────────────────────────────────────────────────────────────
 * Le tablier
 * ───────────────────────────────────────────────────────────────────────── */

function Tablier({
  levee,
  inclinaison,
  reduireAnimation,
}: {
  levee: number;
  inclinaison: number;
  reduireAnimation: boolean;
}) {
  const lames = useRef<(THREE.Group | null)[]>([]);

  // Valeurs affichées, poursuivant les cibles.
  const courant = useRef({ levee, inclinaison });

  /*
   * UNE géométrie et UN matériau pour les 22 lames.
   *
   * Chaque lame a sa propre position et sa propre rotation, donc l'instancing
   * n'apporterait rien ici en nombre d'objets — mais partager la géométrie et
   * le matériau évite 22 uploads GPU et 22 compilations de shader. C'est
   * l'optimisation qui compte à cette échelle, et la démo Fenêtre en hérite
   * telle quelle.
   */
  const geometrieLame = useMemo(
    () => new THREE.BoxGeometry(BAIE_L - DORMANT * 2 - 0.01, LAME_H * 0.92, LAME_EP),
    []
  );
  const materiauLame = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COULEURS.chaux,
        roughness: 0.72,
        metalness: 0,
      }),
    []
  );

  useFrame((_, delta) => {
    /*
     * Poursuite exponentielle : rapide au début, douce à l'arrivée. Le
     * facteur est borné pour rester stable si une image est très longue.
     *
     * `prefers-reduced-motion` raccourcit la poursuite au lieu de la
     * supprimer : le CHANGEMENT D'ÉTAT reste fonctionnel — c'est ce que la
     * démo enseigne — seul le trajet cesse d'être un spectacle.
     */
    const base = reduireAnimation ? AMORTISSEMENT_REDUIT : AMORTISSEMENT;
    const k = 1 - Math.pow(base, Math.min(delta, 0.1));
    courant.current.levee += (levee - courant.current.levee) * k;
    courant.current.inclinaison += (inclinaison - courant.current.inclinaison) * k;

    const angle = THREE.MathUtils.degToRad(courant.current.inclinaison);

    lames.current.forEach((lame, i) => {
      if (!lame) return;

      // La géométrie du déroulé est une fonction pure, testée à part : voir
      // `poserLame` dans `shared/geometrie.ts`.
      const pose = poserLame(i, courant.current.levee);

      lame.position.y = pose.y;
      lame.rotation.x = angle;
      lame.scale.y = pose.echelle;
      lame.visible = pose.visible;
    });
  });

  return (
    <group position={[0, 0, Z_VOLET]}>
      {Array.from({ length: NB_LAMES }).map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            lames.current[i] = el;
          }}
        >
          <mesh geometry={geometrieLame} material={materiauLame} castShadow receiveShadow />
        </group>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Coffre et rails
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Coffre du volet, EN TÊTE DE TABLEAU et non au-dessus du mur.
 *
 * Posé sur l'allège haute, il se retrouvait noyé dans l'épaisseur du mur et
 * n'apparaissait nulle part. À l'intérieur du percement, devant le tablier,
 * il joue son vrai rôle : c'est lui qui masque les lames enroulées, et il
 * rend le mécanisme lisible — on voit où le tablier disparaît quand il
 * remonte.
 *
 * Les rails latéraux vont avec : sans eux, le coffre serait un caisson posé
 * dans le vide et le tablier glisserait sans guide. Ils ne sont jamais rendus
 * l'un sans l'autre, ce qui écarte par construction le défaut du « rail
 * flottant » quand le volet est masqué (§70).
 */
/**
 * JEU SOUS LINTEAU. Le coffre et les rails montaient exactement à
 * `BAIE_H / 2`, donc leur face supérieure était COPLANAIRE avec le tableau du
 * percement : deux surfaces au même z que le moteur départage au hasard,
 * c'est-à-dire une ligne pointillée qui clignote en travers de la baie. Deux
 * millimètres de jeu suffisent à les séparer, et ce jeu existe de toute façon
 * sur une pose réelle.
 */
const JEU_TABLEAU = 0.002;

function CoffreEtRails() {
  const hauteurCoffre = 0.15;

  return (
    <group>
      {/*
        Le caisson va d'un rail à l'autre. Plus étroit, il flottait entre eux
        et le mécanisme ne se lisait plus comme un ensemble.
      */}
      <mesh
        position={[0, BAIE_H / 2 - JEU_TABLEAU - hauteurCoffre / 2, Z_VOLET]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[BAIE_L - 0.02, hauteurCoffre, 0.085]} />
        <meshStandardMaterial color={COULEURS.chauxOmbre} roughness={0.8} />
      </mesh>

      {/*
        SOUS-FACE DU COFFRE, en saillie de deux centimètres.
        Le caisson affleure la façade : sans arête, il rendait un aplat clair
        de la même valeur que l'enduit, et rien ne disait d'où sortait le
        tablier. Ce bandeau tire la ligne d'ombre qui manquait.
      */}
      <mesh
        position={[0, BAIE_H / 2 - JEU_TABLEAU - hauteurCoffre + 0.012, Z_VOLET + 0.012]}
        castShadow
      >
        <boxGeometry args={[BAIE_L - 0.02, 0.024, 0.105]} />
        <meshStandardMaterial color={COULEURS.murOmbre} roughness={0.85} />
      </mesh>

      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (BAIE_L / 2 - 0.022), 0, Z_VOLET]} castShadow>
          <boxGeometry args={[0.026, BAIE_H - JEU_TABLEAU * 2, 0.06]} />
          <meshStandardMaterial color={COULEURS.chauxOmbre} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * L'ensemble
 * ───────────────────────────────────────────────────────────────────────── */

export interface VoletAssemblyProps {
  /** 0 = tablier entièrement descendu, 100 = enroulé dans le coffre. */
  levee: number;
  /** 0° = lames jointives, 90° = lames à plat. */
  inclinaison: number;
  /** Raccourcit les interpolations sous `prefers-reduced-motion`. */
  reduireAnimation?: boolean;
}

export function VoletAssembly({
  levee,
  inclinaison,
  reduireAnimation = false,
}: VoletAssemblyProps) {
  return (
    <group>
      <CoffreEtRails />
      <Tablier levee={levee} inclinaison={inclinaison} reduireAnimation={reduireAnimation} />
    </group>
  );
}
