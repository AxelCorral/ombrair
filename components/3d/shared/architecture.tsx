"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  BAIE_H,
  BAIE_L,
  COULEURS,
  DORMANT,
  MUR_EP,
  MUR_H,
  MUR_L,
  Y_SOL,
  Z_FACE_EXT,
  Z_FACE_INT,
  Z_MENUISERIE,
} from "./geometrie";

/**
 * L'ARCHITECTURE AUTOUR DU PRODUIT — mur percé, embrasure, appui, tablette,
 * sol, lointains.
 *
 * Ces pièces ne bougent jamais et ne dépendent d'aucun état. Elles existent
 * pour que le produit soit regardé DANS une ouverture, et pas comme un objet
 * flottant : c'est ce qui rend la démonstration lisible et la scène crédible.
 *
 * Extrait de `volet-scene.tsx` pour la démo Fenêtre, qui a besoin de la même
 * baie au millimètre près. Le contenu est inchangé — seul son emplacement a
 * bougé.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Lointains
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * DEUX FONDS, CHACUN DERRIÈRE UNE CAMÉRA.
 *
 * Le ciel est posé à z = +6, au-delà de la pose extérieure (z = +4,1) :
 * depuis dehors il est dans le dos de la caméra, donc invisible, et depuis la
 * pièce il est ce qu'on aperçoit par la baie. Le fond de pièce fait l'exact
 * symétrique à z = −6.
 *
 * C'est ce qui permet de garder le canevas transparent — la scène se pose
 * dans le thème du site au lieu d'ouvrir une fenêtre sur un autre univers —
 * tout en donnant quelque chose à voir des deux côtés.
 */
function Lointains() {
  return (
    <>
      <mesh position={[0, 0, 6]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial color={COULEURS.ciel} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -6]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial color={COULEURS.piece} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * La façade percée
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Le mur est UNE SEULE pièce percée, pas quatre panneaux assemblés.
 *
 * La version en quatre boîtes laissait une couture nette au niveau du
 * linteau : deux faces coplanaires que le moteur n'éclaire pas exactement
 * pareil dessinent une ligne qui traverse toute la façade. Un contour extrudé
 * avec un trou n'a aucun raccord à trahir.
 */
function useFacade() {
  return useMemo(() => {
    const contour = new THREE.Shape();
    contour.moveTo(-MUR_L / 2, -MUR_H / 2);
    contour.lineTo(MUR_L / 2, -MUR_H / 2);
    contour.lineTo(MUR_L / 2, MUR_H / 2);
    contour.lineTo(-MUR_L / 2, MUR_H / 2);
    contour.closePath();

    const percement = new THREE.Path();
    percement.moveTo(-BAIE_L / 2, -BAIE_H / 2);
    percement.lineTo(-BAIE_L / 2, BAIE_H / 2);
    percement.lineTo(BAIE_L / 2, BAIE_H / 2);
    percement.lineTo(BAIE_L / 2, -BAIE_H / 2);
    percement.closePath();
    contour.holes.push(percement);

    const extrude = new THREE.ExtrudeGeometry(contour, {
      depth: MUR_EP,
      bevelEnabled: false,
    });
    // L'extrusion part de z = 0 : on la recentre pour que l'origine tombe au
    // milieu du mur, et que les deux faces soient symétriques.
    extrude.translate(0, 0, -MUR_EP / 2);

    // Le même contour, à plat : c'est le doublage intérieur.
    return { murGeo: extrude, doublageGeo: new THREE.ShapeGeometry(contour) };
  }, []);
}

/* ─────────────────────────────────────────────────────────────────────────
 * L'enveloppe complète
 * ───────────────────────────────────────────────────────────────────────── */

export function Enveloppe() {
  const { murGeo, doublageGeo } = useFacade();

  return (
    <group>
      <Lointains />

      {/* Sol de la pièce. Il part du nu intérieur et file vers le fond : vu
          de dehors il donne de la profondeur derrière la baie, vu de dedans
          il reçoit la lumière que les lames laissent passer.

          Sa largeur ne dépasse JAMAIS celle de la façade : plus large, il
          apparaissait sur le côté du mur quand l'orbite atteignait sa butée,
          comme une dalle beige flottant dans le vide. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, Y_SOL, Z_FACE_INT - 3]} receiveShadow>
        <planeGeometry args={[MUR_L, 6]} />
        <meshStandardMaterial color={COULEURS.sol} roughness={1} />
      </mesh>

      {/* La façade percée. Deux matériaux : les faces (groupe 0) portent
          l'enduit, le tableau du percement (groupe 1) est plus sourd — c'est
          lui qui donne son épaisseur au mur. */}
      <mesh geometry={murGeo} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" color={COULEURS.mur} roughness={0.95} />
        <meshStandardMaterial attach="material-1" color={COULEURS.murOmbre} roughness={1} />
      </mesh>

      {/* Doublage intérieur : un enduit plus clair que la façade, plaqué sur
          le nu intérieur. Sans lui les deux côtés du mur étaient identiques,
          et rien ne distinguait la pièce de la rue. */}
      <mesh geometry={doublageGeo} position={[0, 0, Z_FACE_INT - 0.003]}>
        <meshStandardMaterial color={COULEURS.doublage} roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Appui de fenêtre, débordant de part et d'autre. Côté rue. */}
      <mesh position={[0, -BAIE_H / 2 - 0.035, Z_FACE_EXT - 0.04]} castShadow receiveShadow>
        <boxGeometry args={[BAIE_L + 0.22, 0.055, MUR_EP + 0.1]} />
        <meshStandardMaterial color={COULEURS.chauxOmbre} roughness={0.9} />
      </mesh>

      {/* Tablette intérieure. Le pendant de l'appui, côté pièce. */}
      <mesh position={[0, -BAIE_H / 2 - 0.02, Z_FACE_INT - 0.06]} castShadow receiveShadow>
        <boxGeometry args={[BAIE_L + 0.14, 0.04, 0.15]} />
        <meshStandardMaterial color={COULEURS.doublage} roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Dormant
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Les quatre profilés du dormant, en Persienne — le seul accent coloré de la
 * scène, et le lien visuel entre les deux démonstrations : la fenêtre et le
 * volet appartiennent à la même gamme parce qu'ils partagent ce dormant.
 */
export function Dormant({ profondeur = 0.05 }: { profondeur?: number }) {
  const barres = [
    [0, BAIE_H / 2 - DORMANT / 2, BAIE_L, DORMANT],
    [0, -BAIE_H / 2 + DORMANT / 2, BAIE_L, DORMANT],
    [-BAIE_L / 2 + DORMANT / 2, 0, DORMANT, BAIE_H],
    [BAIE_L / 2 - DORMANT / 2, 0, DORMANT, BAIE_H],
  ] as const;

  return (
    <group>
      {barres.map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, Z_MENUISERIE]} castShadow receiveShadow>
          <boxGeometry args={[w, h, profondeur]} />
          <meshStandardMaterial color={COULEURS.persienne} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Vitrage
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Un panneau de verre.
 *
 * Il devient indispensable dès qu'on regarde depuis la pièce : sans lui le
 * volet flotterait dans un trou, et on ne comprendrait plus qu'il est DEHORS.
 *
 * `depthWrite` est désactivé pour que ce qui est derrière — le tablier, ou
 * l'autre vantail — ne soit pas découpé par le tri de transparence. C'est
 * aussi ce qui permet à deux vitrages de coexister dans la démo Fenêtre sans
 * que l'un n'efface l'autre selon l'angle de caméra.
 */
export function Vitrage({
  largeur,
  hauteur,
  position = [0, 0, Z_MENUISERIE],
  opacite = OPACITE_VITRAGE.exterieur,
}: {
  largeur: number;
  hauteur: number;
  position?: [number, number, number];
  /** Voir `OPACITE_VITRAGE` : ce n'est pas la même valeur des deux côtés. */
  opacite?: number;
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={[largeur, hauteur]} />
      <meshStandardMaterial
        color={COULEURS.vitrage}
        transparent
        /*
         * `roughness` très basse pour que le soleil accroche un reflet : c'est
         * le reflet, pas la teinte, qui fait lire une surface comme du verre.
         *
         * `metalness` reste à zéro : sans carte d'environnement, un matériau
         * métallique dans three ne réfléchit rien et vire au noir. Le
         * spéculaire d'un diélectrique suffit ici, et il ne coûte rien.
         */
        opacity={opacite}
        roughness={0.03}
        metalness={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * DEUX OPACITÉS DE VITRAGE, SELON LE CÔTÉ D'OÙ ON REGARDE.
 *
 * Ce n'est pas un truquage, c'est ce que fait un vitrage. Depuis la rue, il
 * renvoie le ciel et masque largement la pièce, plus sombre. Depuis la pièce,
 * on regarde vers la lumière : il devient transparent. Un moteur avec carte
 * d'environnement produirait cet écart tout seul par le Fresnel ; sans carte,
 * on le pose à la main.
 *
 * L'enjeu est loin d'être cosmétique. Avec une valeur unique et basse, un
 * vantail FERMÉ et un vantail GRAND OUVERT rendaient la même image depuis la
 * rue — dans les deux cas on voyait la pièce, à peine voilée. La
 * démonstration centrale de la page ne se voyait donc pas. Avec un vitrage
 * qui porte sa propre valeur, le panneau fermé est une surface claire, et
 * l'ouvrant écarté laisse voir le vide : le mouvement se lit d'un coup d'œil.
 *
 * Côté pièce, la valeur basse est indispensable pour l'autre démonstration :
 * c'est à travers ce vitrage qu'on regarde le volet faire de l'ombre.
 */
export const OPACITE_VITRAGE = {
  exterieur: 0.72,
  interieur: 0.18,
} as const;
