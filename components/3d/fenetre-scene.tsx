"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Dormant, Enveloppe, OPACITE_VITRAGE, Vitrage } from "./shared/architecture";
import { CameraBaie, FOV, POSES, type AngleBaie, type CoteBaie } from "./shared/camera-baie";
import { Eclairage } from "./shared/eclairage";
import { BAIE_H, BAIE_L, COULEURS, DORMANT, Z_MENUISERIE, Z_OUVRANT } from "./shared/geometrie";
import { useReducedMotion } from "./shared/use-reduced-motion";
import { VoletAssembly } from "./shared/volet-assembly";

/**
 * Scène 3D de la fenêtre Ombrair, avec le volet Ombrair en option.
 *
 * ════════════════════════════════════════════════════════════════════════
 * UNE SEULE BAIE, DEUX ÉQUIPEMENTS
 *
 * Quand l'option volet est active, rien n'est ajouté à côté : le volet
 * apparaît DANS cette scène, à sa place physique, devant le vitrage et
 * derrière la façade. C'est le composant `VoletAssembly` — exactement celui
 * qu'affiche `/gammes/volet`, pas une copie.
 *
 * L'empilement en profondeur est décidé une fois pour toutes dans
 * `shared/geometrie.ts` :
 *
 *     façade  →  VOLET (z = +0,06)  →  dormant (z = −0,02)
 *             →  OUVRANT et vitrage (z = −0,055)  →  pièce
 *
 * C'est ce qui rend la démonstration combinée possible sans truquage : un
 * volet roulant est dehors, une fenêtre à la française s'ouvre dedans, donc
 * les deux mécanismes travaillent de part et d'autre du dormant et ne
 * peuvent pas se traverser, quel que soit l'état de chacun.
 * ════════════════════════════════════════════════════════════════════════
 *
 * HYPOTHÈSE MÉCANIQUE — À NE PAS LIRE COMME UNE SPÉCIFICATION PRODUIT.
 *
 * Le catalogue Ombrair ne définit nulle part le type d'ouverture de la
 * fenêtre : `lib/tarifs.ts` parle d'une « fenêtre double vitrage à contrôle
 * solaire » et d'un « actionneur motorisé », sans préciser la menuiserie.
 * Cette scène retient donc, pour pouvoir montrer un mouvement :
 *
 *   **deux vantaux, celui de droite motorisé, ouvrant à la française vers
 *   l'intérieur, sur un angle de démonstration de 60°.**
 *
 * Ce choix suit l'illustration produit existante (`window-visual.tsx`, deux
 * battants dont un s'entrouvre) et la seule contrainte réellement imposée
 * par le projet : le volet est extérieur, donc la fenêtre ne peut pas ouvrir
 * dehors. Il ne présume d'aucune caractéristique industrielle définitive.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Cotes de la menuiserie
 * ───────────────────────────────────────────────────────────────────────── */

/** Passage libre à l'intérieur du dormant. */
const CLAIR_L = BAIE_L - DORMANT * 2;
const CLAIR_H = BAIE_H - DORMANT * 2;

/**
 * Meneau central : les deux vantaux se rejoignent dessus.
 *
 * Sa section, comme celle des profilés ci-dessous, a été REVUE À LA BAISSE
 * après le premier rendu. Cumulés — dormant, meneau, deux montants de
 * vantail — les 5 cm d'origine mangeaient un tiers de la largeur de la baie
 * et la fenêtre se lisait comme une grosse menuiserie peinte plutôt que
 * comme de l'aluminium contemporain. C'est le trait le plus efficace pour
 * rendre le produit crédible : une menuiserie moderne se reconnaît d'abord à
 * la finesse de ses profils.
 */
const MENEAU_L = 0.036;

/** Jeu de feuillure. Sans lui, l'ouvrant frotterait le dormant à l'amorce. */
const JEU = 0.004;

/** Un vantail : moitié du clair, moins le meneau, moins les jeux. */
const VANTAIL_L = (CLAIR_L - MENEAU_L) / 2 - JEU * 2;
const VANTAIL_H = CLAIR_H - JEU * 2;

/** Section des profilés de l'ouvrant, et leur épaisseur. Voir `MENEAU_L`. */
const PROFIL = 0.032;
const PROFIL_EP = 0.036;

/**
 * LE VANTAIL MOTORISÉ EST CELUI DE DROITE, gondé sur le montant droit et
 * s'ouvrant vers la pièce. Tout ce qui suit est écrit dans ce sens : les deux
 * vantaux se développent vers les x NÉGATIFS depuis leur bord droit.
 *
 * Ce n'est pas un détail de mise en scène, c'est ce qui rend le mouvement
 * lisible. La caméra trois-quarts par défaut regarde la baie depuis la droite.
 * Avec le gond à GAUCHE, l'ouvrant s'écartait vers le fond en s'éloignant de
 * la caméra : sa largeur projetée à l'écran restait la même à 0° et à 53°, et
 * la fenêtre grande ouverte rendait exactement la même image que fermée. Gondé
 * du côté de la caméra, le même mouvement divise sa largeur apparente par
 * trois et découvre le vide — on voit la fenêtre s'ouvrir.
 *
 * C'est aussi le sens de l'illustration produit (`window-visual.tsx`), donc du
 * repli affiché quand WebGL n'est pas disponible.
 */
/** Abscisse de l'axe de rotation : nu intérieur du montant droit. */
const X_GOND = CLAIR_L / 2 - JEU;
/** Abscisse du bord droit du vantail fixe, à gauche du meneau. */
const X_FIXE = -(MENEAU_L / 2 + JEU);

/** Hauteur de la traverse haute, où se loge l'actionneur. */
const Y_ACTIONNEUR = CLAIR_H / 2 - 0.05;

/* ─────────────────────────────────────────────────────────────────────────
 * Un vantail
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Les quatre profilés d'un vantail et son vitrage.
 *
 * Le repère local place l'origine sur le BORD DE GOND et le corps du vantail
 * vers les x NÉGATIFS : c'est ce qui permet au groupe parent de le faire
 * pivoter en posant simplement `rotation.y`, sans décalage à corriger.
 */
function Vantail({ opaciteVitrage, poignee = false }: { opaciteVitrage: number; poignee?: boolean }) {
  const barres = [
    // Traverses haute et basse.
    [-VANTAIL_L / 2, VANTAIL_H / 2 - PROFIL / 2, VANTAIL_L, PROFIL],
    [-VANTAIL_L / 2, -VANTAIL_H / 2 + PROFIL / 2, VANTAIL_L, PROFIL],
    // Montants de gond et de battée.
    [-PROFIL / 2, 0, PROFIL, VANTAIL_H],
    [-VANTAIL_L + PROFIL / 2, 0, PROFIL, VANTAIL_H],
  ] as const;

  return (
    <group>
      {barres.map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, PROFIL_EP]} />
          <meshStandardMaterial color={COULEURS.persienne} roughness={0.55} />
        </mesh>
      ))}

      <Vitrage
        largeur={VANTAIL_L - PROFIL * 2}
        hauteur={VANTAIL_H - PROFIL * 2}
        position={[-VANTAIL_L / 2, 0, 0]}
        opacite={opaciteVitrage}
      />

      {/*
        Poignée, côté pièce.

        Elle est sur la face intérieure parce que c'est de là qu'on
        manœuvrerait la fenêtre à la main — une menuiserie motorisée garde
        toujours sa commande manuelle. Elle n'est donc visible que depuis la
        vue intérieure, ce qui est correct : la mettre côté rue pour qu'on la
        voie mieux aurait été un mensonge d'objet.
      */}
      {poignee ? (
        <group position={[-VANTAIL_L + PROFIL / 2, -0.06, -PROFIL_EP / 2 - 0.008]}>
          <mesh castShadow>
            <boxGeometry args={[0.032, 0.08, 0.016]} />
            <meshStandardMaterial color={COULEURS.quincaillerie} roughness={0.4} metalness={0.35} />
          </mesh>
          <mesh position={[0, -0.075, 0.004]} castShadow>
            <boxGeometry args={[0.018, 0.1, 0.018]} />
            <meshStandardMaterial color={COULEURS.quincaillerie} roughness={0.4} metalness={0.35} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Actionneur
 * ───────────────────────────────────────────────────────────────────────── */

/** Point d'ancrage du bras sur le dormant. Il ne bouge jamais. */
const ANCRAGE = new THREE.Vector3(X_GOND - 0.14, Y_ACTIONNEUR, Z_OUVRANT - 0.02);
/** Point d'attache sur l'ouvrant, dans le repère local du vantail. */
const ATTACHE_LOCALE = new THREE.Vector3(-0.3, Y_ACTIONNEUR, -PROFIL_EP / 2 - 0.008);

/* ─────────────────────────────────────────────────────────────────────────
 * L'ouvrant motorisé
 * ───────────────────────────────────────────────────────────────────────── */

/** Poursuite exponentielle : ≈ 190 ms de constante de temps. */
const AMORTISSEMENT = 0.005;
/** Variante `prefers-reduced-motion` : ≈ 31 ms. */
const AMORTISSEMENT_REDUIT = 1e-14;

/**
 * Le vantail motorisé et son bras d'actionneur, animés ENSEMBLE.
 *
 * Les deux partagent forcément la même image : le bras relie un point fixe
 * du dormant à un point de l'ouvrant, donc sa longueur et son orientation se
 * déduisent de l'angle courant. Les séparer en deux composants aurait imposé
 * de faire remonter l'angle interpolé dans un état React à chaque image —
 * soixante rendus par seconde pour une valeur que personne n'affiche.
 *
 * L'interpolation vit ici et nulle part ailleurs : la CIBLE vient de React,
 * la valeur affichée la rejoint image par image. Mouvement amorti, sans
 * rebond — une motorisation silencieuse, pas un ressort.
 */
function OuvrantMotorise({
  angle,
  opaciteVitrage,
  reduireAnimation,
}: {
  /** Angle d'ouverture visé, en degrés. */
  angle: number;
  opaciteVitrage: number;
  reduireAnimation: boolean;
}) {
  const vantail = useRef<THREE.Group>(null);
  const bras = useRef<THREE.Mesh>(null);
  const courant = useRef(angle);

  // Vecteurs de travail réutilisés d'une image à l'autre : recalculer la
  // position du bras ne doit pas produire de déchets à chaque frame.
  const outils = useMemo(
    () => ({
      attache: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      milieu: new THREE.Vector3(),
      axeX: new THREE.Vector3(1, 0, 0),
    }),
    []
  );

  useFrame((_, delta) => {
    const base = reduireAnimation ? AMORTISSEMENT_REDUIT : AMORTISSEMENT;
    const k = 1 - Math.pow(base, Math.min(delta, 0.1));
    courant.current += (angle - courant.current) * k;

    /*
     * Gondé à droite, l'ouvrant pivote dans le sens NÉGATIF autour de Y pour
     * que son bord libre parte vers la pièce (z décroissant).
     */
    const theta = -THREE.MathUtils.degToRad(courant.current);
    if (vantail.current) vantail.current.rotation.y = theta;

    if (!bras.current) return;

    /*
     * Position de l'attache après rotation du vantail autour de l'axe Y
     * passant par le gond. On l'écrit à la main plutôt que via
     * `localToWorld` : ce calcul tourne à chaque image, et une rotation
     * plane autour d'un seul axe tient en deux lignes.
     */
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    outils.attache.set(
      X_GOND + ATTACHE_LOCALE.x * cos + ATTACHE_LOCALE.z * sin,
      ATTACHE_LOCALE.y,
      Z_OUVRANT + (-ATTACHE_LOCALE.x * sin + ATTACHE_LOCALE.z * cos)
    );

    outils.direction.subVectors(outils.attache, ANCRAGE);
    const longueur = outils.direction.length();
    if (longueur < 1e-4) return;

    outils.milieu.addVectors(ANCRAGE, outils.attache).multiplyScalar(0.5);
    bras.current.position.copy(outils.milieu);
    // La géométrie du bras mesure 1 m sur X : la mettre à l'échelle de la
    // longueur voulue évite de reconstruire un mesh à chaque image.
    bras.current.scale.x = longueur;
    bras.current.quaternion.setFromUnitVectors(
      outils.axeX,
      outils.direction.divideScalar(longueur)
    );
  });

  return (
    <group>
      {/* Le vantail, pivotant autour de son gond. */}
      <group ref={vantail} position={[X_GOND, 0, Z_OUVRANT]}>
        <Vantail opaciteVitrage={opaciteVitrage} poignee />
      </group>

      {/*
        Le mécanisme, SUGGÉRÉ et non détaillé : un carter plat sous la
        traverse haute et un bras qui s'allonge. C'est assez pour qu'on
        comprenne que la fenêtre est motorisée — ce que la démonstration doit
        faire passer en moins de dix secondes — sans prétendre représenter
        une quincaillerie précise que le projet ne définit pas.
      */}
      <mesh position={[X_GOND - 0.07, Y_ACTIONNEUR, Z_OUVRANT - 0.02]} castShadow>
        <boxGeometry args={[0.17, 0.036, 0.038]} />
        <meshStandardMaterial color={COULEURS.nuit} roughness={0.5} metalness={0.2} />
      </mesh>

      <mesh ref={bras} castShadow>
        <boxGeometry args={[1, 0.017, 0.017]} />
        <meshStandardMaterial color={COULEURS.quincaillerie} roughness={0.35} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * La menuiserie complète
 * ───────────────────────────────────────────────────────────────────────── */

function Menuiserie({
  angleOuvrant,
  opaciteVitrage,
  reduireAnimation,
}: {
  angleOuvrant: number;
  opaciteVitrage: number;
  reduireAnimation: boolean;
}) {
  return (
    <group>
      <Dormant profondeur={0.06} />

      {/* Meneau central, solidaire du dormant. */}
      <mesh position={[0, 0, Z_MENUISERIE]} castShadow receiveShadow>
        <boxGeometry args={[MENEAU_L, CLAIR_H, 0.06]} />
        <meshStandardMaterial color={COULEURS.persienne} roughness={0.6} />
      </mesh>

      {/* Vantail fixe, à gauche. */}
      <group position={[X_FIXE, 0, Z_OUVRANT]}>
        <Vantail opaciteVitrage={opaciteVitrage} />
      </group>

      <OuvrantMotorise
        angle={angleOuvrant}
        opaciteVitrage={opaciteVitrage}
        reduireAnimation={reduireAnimation}
      />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Scène
 * ───────────────────────────────────────────────────────────────────────── */

export type CoteFenetre = CoteBaie;
export type AngleFenetre = AngleBaie;

export interface FenetreSceneProps {
  /** Angle du vantail motorisé, en degrés. */
  angleOuvrant: number;
  /** Le volet est-il monté dans la baie ? */
  avecVolet: boolean;
  /** 0 = tablier descendu, 100 = relevé. Ignoré si `avecVolet` est faux. */
  levee: number;
  /** Orientation des lames, en degrés. Ignorée si `avecVolet` est faux. */
  inclinaison: number;
  luminosite: number;
  cote: CoteFenetre;
  vue: AngleFenetre;
  resetSignal: number;
}

export function FenetreScene({
  angleOuvrant,
  avecVolet,
  levee,
  inclinaison,
  luminosite,
  cote,
  vue,
  resetSignal,
}: FenetreSceneProps) {
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
      /* Même exposition que la scène Volet : les deux démonstrations doivent
         rendre la charte à la même valeur, sans quoi les deux produits ne
         sembleraient pas taillés dans le même aluminium. Voir le commentaire
         détaillé dans `volet-scene.tsx`. */
      gl={{ antialias: true, toneMappingExposure: 1.55 }}
      style={{ background: "transparent" }}
    >
      <Eclairage luminosite={luminosite} />
      <Enveloppe />
      <Menuiserie
        angleOuvrant={angleOuvrant}
        opaciteVitrage={OPACITE_VITRAGE[cote]}
        reduireAnimation={reduireAnimation}
      />

      {/*
        Le volet, monté ou non.

        Quand il est absent, TOUT disparaît d'un bloc — coffre, rails et
        tablier sont un seul composant — donc aucun rail ne reste à flotter
        dans une baie sans volet.
      */}
      {avecVolet ? (
        <VoletAssembly
          levee={levee}
          inclinaison={inclinaison}
          reduireAnimation={reduireAnimation}
        />
      ) : null}

      <CameraBaie cote={cote} vue={vue} resetSignal={resetSignal} />
    </Canvas>
  );
}
