/**
 * COTES ET COULEURS DE LA BAIE — partagées par les deux démonstrations 3D.
 *
 * ════════════════════════════════════════════════════════════════════════
 * POURQUOI CE FICHIER EXISTE
 *
 * La démo Volet a été écrite d'abord, avec toutes ses cotes en tête de
 * `volet-scene.tsx`. La démo Fenêtre a besoin EXACTEMENT de la même baie :
 * même mur, même percement, même épaisseur, même appui, et surtout le même
 * volet à la même profondeur — puisque c'est le même volet qu'on y fait
 * apparaître.
 *
 * Recopier ces nombres aurait garanti la dérive : un mur épaissi d'un côté,
 * un volet à 6 cm ici et 7 cm là, et deux produits qui ne semblent plus
 * appartenir à la même gamme. Ils sont donc décidés ici, une fois.
 * ════════════════════════════════════════════════════════════════════════
 *
 * REPÈRE. X = largeur de la baie, Y = hauteur, Z = profondeur.
 * L'origine est au centre de l'ouverture.
 *
 *   +Z  E X T É R I E U R
 *   ├─ ciel                      z = +6    (derrière la caméra extérieure)
 *   ├─ appui de fenêtre
 *   ├─ face extérieure du mur    z = +0,11
 *   ├─ VOLET : coffre, rails, tablier      z = +0,06
 *   ├─ dormant                   z = −0,02
 *   ├─ OUVRANT et vitrage        z = −0,055  (démo Fenêtre)
 *   ├─ face intérieure du mur    z = −0,11
 *   ├─ doublage, tablette, sol
 *   └─ fond de pièce             z = −6    (derrière la caméra intérieure)
 *   −Z  I N T É R I E U R
 *
 * Cet ordre n'est pas décoratif. Un volet roulant est DEHORS et une fenêtre
 * à la française s'ouvre DEDANS : c'est ce qui permet aux deux mécanismes de
 * fonctionner dans la même baie sans jamais se traverser.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Baie — en mètres, échelle réelle
 * ───────────────────────────────────────────────────────────────────────── */

export const BAIE_L = 1.2;
export const BAIE_H = 1.5;
/** Section des profilés du dormant. */
export const DORMANT = 0.06;

/* ─────────────────────────────────────────────────────────────────────────
 * Tablier du volet
 * ───────────────────────────────────────────────────────────────────────── */

export const NB_LAMES = 22;
export const LAME_H = BAIE_H / NB_LAMES;
export const LAME_EP = 0.012;

/* ─────────────────────────────────────────────────────────────────────────
 * Profondeurs
 * ───────────────────────────────────────────────────────────────────────── */

export const MUR_EP = 0.22;
export const Z_FACE_EXT = MUR_EP / 2;
export const Z_FACE_INT = -MUR_EP / 2;

/** Le volet coulisse en applique extérieure, dans l'épaisseur du tableau. */
export const Z_VOLET = 0.06;

/** Dormant de la menuiserie, en retrait de 13 cm sous le nu extérieur. */
export const Z_MENUISERIE = -0.02;

/**
 * Plan de l'OUVRANT, 3,5 cm derrière le dormant.
 *
 * Ce décalage n'est pas cosmétique : c'est lui qui permet au vantail de
 * pivoter vers la pièce sans que ses profilés ne rentrent dans ceux du
 * dormant à l'amorce du mouvement. Il correspond à la feuillure d'une
 * menuiserie réelle.
 */
export const Z_OUVRANT = -0.055;

/** Sol de la pièce : allège de 90 cm sous l'appui. */
export const Y_SOL = -BAIE_H / 2 - 0.9;

/* ─────────────────────────────────────────────────────────────────────────
 * Façade
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Le mur doit DÉBORDER du cadrage, y compris au zoom arrière maximal et
 * caméra pivotée : à `maxDistance` la scène montre environ 3,7 m de large,
 * et une façade plus étroite laisse voir le ciel par-dessus ses bords — le
 * mur se lit alors comme une dalle posée devant un fond, pas comme une
 * façade.
 *
 * Élargi une seconde fois après avoir poussé l'orbite jusqu'à sa butée de
 * ±45° : à cet azimut, le sol de la pièce dépassait du bord de la façade et
 * flottait dans le vide à mi-hauteur. Tout ce qui appartient à l'intérieur
 * doit tenir DERRIÈRE le mur, à tous les angles atteignables.
 */
export const MUR_L = BAIE_L + 3.6;
export const MUR_H = BAIE_H + 3.0;

/* ─────────────────────────────────────────────────────────────────────────
 * Couleurs
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Palette de la charte, telle que three l'attend.
 *
 * Elle ne peut pas venir des tokens CSS : `globals.css` les expose au DOM,
 * pas au moteur de rendu, et une couleur de matériau n'est pas une couleur
 * de texte. Les valeurs sont donc recopiées de la charte — et c'est le seul
 * endroit du projet où elles le sont.
 */
export const COULEURS = {
  chaux: "#f4f1e9",
  chauxOmbre: "#ddd8cc",
  persienne: "#33665a",
  nuit: "#161d23",
  // Le mur reste dans la famille Chaux, un ton en dessous du tablier : sans
  // cet écart, tablier et mur se confondaient en un même gris.
  mur: "#e9e4d7",
  murOmbre: "#c3bcab",
  ciel: "#aebfc4",
  // Côté pièce : un enduit plus clair que la façade, un sol plus chaud, et
  // un fond franchement sourd — vue de dehors, une pièce est toujours plus
  // sombre que la façade qui l'entoure.
  doublage: "#f1ede3",
  sol: "#b3a894",
  piece: "#6f675c",
  /* Le verre porte la couleur qu'il RENVOIE — le ciel — et non celle qu'il
     laisse passer. C'est ce qui le rend plus clair que la pièce derrière lui,
     donc lisible comme une surface fermée. */
  vitrage: "#dde6e5",
  /** Quincaillerie : poignée, bras d'actionneur. Aluminium anodisé mat. */
  quincaillerie: "#9aa0a0",
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Déroulé du tablier
 * ───────────────────────────────────────────────────────────────────────── */

/** Pose d'une lame du tablier, dans le repère de la baie. */
export interface PoseLame {
  /** Ordonnée du CENTRE de la lame, une fois l'écrasement appliqué. */
  y: number;
  /** Part de la lame sortie du coffre, 0 → 1. Sert d'échelle verticale. */
  echelle: number;
  /** Faux quand la lame est entièrement enroulée : inutile de la rendre. */
  visible: boolean;
}

/**
 * OÙ SE TROUVE LA LAME `index` QUAND LE TABLIER EST RELEVÉ À `levee` %.
 *
 * Fonction pure, sortie du composant de rendu pour une raison précise : le
 * seul défaut sérieux qu'ait connu cette démonstration était ici, et il était
 * invisible en lisant le code. Un décalage vertical parasite poussait tout le
 * tablier AU-DESSUS du linteau dès qu'il n'était pas complètement descendu —
 * à 73 % relevé, la baie paraissait vide alors que le panneau annonçait un
 * tablier à un quart descendu. La scène et le texte se contredisaient.
 *
 * Le principe tient en une phrase : **le tablier pend du coffre, il ne monte
 * pas.** Chaque lame garde sa place dans la baie ; seul le NOMBRE de lames
 * sorties varie, et la dernière sort progressivement.
 *
 * `index` 0 est la lame du haut, celle qui sort la première.
 */
export function poserLame(index: number, levee: number): PoseLame {
  const l = Math.min(1, Math.max(0, (Number.isFinite(levee) ? levee : 0) / 100));

  /** Longueur de tablier actuellement déployée sous le linteau. */
  const hauteurDeployee = BAIE_H * (1 - l);
  /** Bord haut de la lame, si elle est entièrement sortie. */
  const yHaut = BAIE_H / 2 - index * LAME_H;
  /** Longueur de tablier sortie une fois cette lame entièrement déroulée. */
  const sortieComplete = (index + 1) * LAME_H;

  const enroulee = Math.max(0, sortieComplete - hauteurDeployee) / LAME_H;
  const echelle = Math.min(1, Math.max(0, 1 - enroulee));

  return {
    // L'écrasement se fait autour du centre du groupe : on remonte la lame de
    // ce qu'elle perd en hauteur, car c'est son BORD HAUT qui est solidaire de
    // la lame précédente.
    y: yHaut - (LAME_H * echelle) / 2,
    echelle,
    visible: echelle > 0.02,
  };
}
