/** Logement de démonstration : maison des années 1980, Toulouse. Données simulées. */

import type { EtatFenetre } from "@/lib/demo/shutter";

export type TypeOuvrant = "volet" | "fenetre" | "volet-fenetre";
export type ModePilotage = "auto" | "manuel";
export type ForceSignal = "fort" | "moyen" | "faible" | "hors-ligne";

export interface Ouvrant {
  id: string;
  nom: string;
  type: TypeOuvrant;
  orientation: "nord" | "sud" | "est" | "ouest";
  /**
   * Volet : levée du tablier, 0 (descendu) à 100 (relevé), et inclinaison
   * des lames, 0° (occultant) à 90° (ouvert). Les deux sont indépendantes ;
   * le taux d'ouverture affiché s'en déduit (voir lib/demo/shutter.ts).
   */
  levee: number;
  inclinaison: number;
  /** Fenêtre motorisée : trois états, pas de faux pourcentage. */
  etatFenetre?: EtatFenetre;
  mode: ModePilotage;
  batteriePct: number;
  signal: ForceSignal;
}

export interface Piece {
  id: string;
  nom: string;
  /** Température intérieure relevée à l'instant de référence. */
  temperatureC: number;
  humiditePct: number;
  /** Température cible réglée dans le mode auto. */
  cibleC: number;
  /** Renseigné quand le capteur de la pièce ne répond plus. */
  capteurHorsLigneDepuis?: string;
  ouvrants: Ouvrant[];
}

export const pieces: Piece[] = [
  {
    id: "sejour",
    nom: "Séjour",
    temperatureC: 26.1,
    humiditePct: 46,
    cibleC: 26,
    ouvrants: [
      {
        id: "sejour-baie-sud",
        nom: "Baie vitrée sud",
        type: "volet-fenetre",
        orientation: "sud",
        levee: 0,
        inclinaison: 0,
        etatFenetre: "fermee",
        mode: "auto",
        batteriePct: 84,
        signal: "fort",
      },
      {
        id: "sejour-fenetre-ouest",
        nom: "Fenêtre ouest",
        type: "volet",
        orientation: "ouest",
        levee: 0,
        inclinaison: 0,
        mode: "auto",
        batteriePct: 76,
        signal: "fort",
      },
    ],
  },
  {
    id: "chambre-1",
    nom: "Chambre 1",
    temperatureC: 24.9,
    humiditePct: 48,
    cibleC: 24,
    ouvrants: [
      {
        id: "chambre1-fenetre-sud",
        nom: "Fenêtre sud",
        type: "volet-fenetre",
        orientation: "sud",
        levee: 0,
        inclinaison: 15,
        etatFenetre: "fermee",
        mode: "auto",
        batteriePct: 91,
        signal: "fort",
      },
    ],
  },
  {
    id: "chambre-2",
    nom: "Chambre 2",
    temperatureC: 26.6,
    humiditePct: 44,
    cibleC: 24,
    ouvrants: [
      {
        id: "chambre2-fenetre-est",
        nom: "Fenêtre est",
        type: "volet-fenetre",
        orientation: "est",
        levee: 0,
        inclinaison: 0,
        etatFenetre: "fermee",
        mode: "auto",
        batteriePct: 12,
        signal: "moyen",
      },
    ],
  },
  {
    id: "cuisine",
    nom: "Cuisine",
    temperatureC: 24.5,
    humiditePct: 51,
    cibleC: 25,
    ouvrants: [
      {
        id: "cuisine-fenetre-nord",
        nom: "Fenêtre nord",
        type: "volet",
        orientation: "nord",
        levee: 30,
        inclinaison: 60,
        mode: "auto",
        batteriePct: 68,
        signal: "fort",
      },
    ],
  },
  {
    id: "bureau",
    nom: "Bureau",
    temperatureC: 26.9,
    humiditePct: 43,
    cibleC: 25,
    capteurHorsLigneDepuis: "14:02",
    ouvrants: [
      {
        id: "bureau-fenetre-ouest",
        nom: "Fenêtre ouest",
        type: "volet-fenetre",
        orientation: "ouest",
        levee: 0,
        inclinaison: 0,
        etatFenetre: "fermee",
        mode: "manuel",
        batteriePct: 55,
        signal: "fort",
      },
    ],
  },
];

export const tousLesOuvrants: Ouvrant[] = pieces.flatMap((piece) => piece.ouvrants);

/**
 * Capteurs installés. Intérieur et extérieur ne mesurent pas la même chose :
 * la luminosité n'a de sens qu'à l'extérieur, la qualité de l'air qu'à
 * l'intérieur. Aucun indicateur de « durée de vie » n'est affiché : aucun
 * modèle d'usure n'existe dans le projet, en inventer un serait une fausse
 * précision. Le niveau de batterie, lui, est une donnée du scénario.
 */
export type EmplacementCapteur = "interieur" | "exterieur";

export interface Capteur {
  id: string;
  nom: string;
  emplacement: EmplacementCapteur;
  /** Pièce rattachée, pour les capteurs intérieurs. */
  pieceId?: string;
  batteriePct: number;
  signal: ForceSignal;
  horsLigneDepuis?: string;
  mesures: { label: string; valeur: string }[];
}

export const capteurs: Capteur[] = [
  {
    id: "cap-ext-jardin",
    nom: "Capteur extérieur — façade sud",
    emplacement: "exterieur",
    batteriePct: 88,
    signal: "fort",
    mesures: [
      { label: "Température", valeur: "37,2 °C" },
      { label: "Humidité", valeur: "28 %" },
      { label: "Luminosité", valeur: "Forte" },
    ],
  },
  {
    id: "cap-int-sejour",
    nom: "Capteur intérieur — Séjour",
    emplacement: "interieur",
    pieceId: "sejour",
    batteriePct: 79,
    signal: "fort",
    mesures: [
      { label: "Température", valeur: "26,1 °C" },
      { label: "Humidité", valeur: "46 %" },
      { label: "Qualité de l'air", valeur: "Bonne" },
    ],
  },
  {
    id: "cap-int-chambre1",
    nom: "Capteur intérieur — Chambre 1",
    emplacement: "interieur",
    pieceId: "chambre-1",
    batteriePct: 64,
    signal: "fort",
    mesures: [
      { label: "Température", valeur: "24,9 °C" },
      { label: "Humidité", valeur: "48 %" },
      { label: "Qualité de l'air", valeur: "Bonne" },
    ],
  },
  {
    id: "cap-int-bureau",
    nom: "Capteur intérieur — Bureau",
    emplacement: "interieur",
    pieceId: "bureau",
    batteriePct: 31,
    signal: "hors-ligne",
    horsLigneDepuis: "14:02",
    mesures: [
      { label: "Température", valeur: "26,9 °C (dernière connue)" },
      { label: "Humidité", valeur: "43 % (dernière connue)" },
    ],
  },
];

// ── Anomalies ─────────────────────────────────────────────────────────────

/**
 * Seuils de batterie.
 *
 * Ils étaient écrits en dur dans deux composants, et ils divergeaient :
 * 15 % pour les ouvrants, 35 % pour les capteurs. Un même niveau de charge
 * était donc « faible » sur un écran et normal sur l'autre. Les deux
 * valeurs sont conservées, mais nommées et distinguées :
 *
 *  - À SURVEILLER : la charge baisse, ce n'est pas encore un problème.
 *    Mention discrète sur la fiche de l'appareil, jamais une alerte.
 *  - FAIBLE : il faut agir. Remonte dans le bloc « à vérifier ».
 *
 * Seul le seuil FAIBLE alimente la liste d'anomalies : crier au loup à
 * 31 % de charge rendrait le bloc inutile.
 */
export const BATTERIE_FAIBLE_PCT = 15;
export const BATTERIE_A_SURVEILLER_PCT = 35;

export interface Anomalie {
  id: string;
  /** Où : nom de pièce, ou « Extérieur » pour un capteur de façade. */
  ou: string;
  /** Ce qui ne va pas, en quelques mots. */
  quoi: string;
  /** Ce que ça implique concrètement pour l'utilisateur. */
  consequence: string;
}

/**
 * Anomalies du logement, DÉRIVÉES de l'état ci-dessus — jamais écrites à la
 * main. Le principe UX est simple : le normal doit rester calme, l'anormal
 * doit ressortir. Un équipement en bon état n'a pas à afficher en
 * permanence sa batterie et sa force de signal ; un équipement en défaut,
 * lui, doit se voir depuis le haut de l'écran.
 *
 * Cette dérivation garantit aussi qu'aucune panne fictive ne s'ajoute au
 * scénario : s'il n'y a rien à signaler dans les données, la liste est
 * vide et le bloc disparaît.
 */
export const anomalies: Anomalie[] = [
  ...pieces.flatMap((piece) =>
    piece.capteurHorsLigneDepuis
      ? [
          {
            id: `${piece.id}-capteur-hors-ligne`,
            ou: piece.nom,
            quoi: `Capteur hors ligne depuis ${piece.capteurHorsLigneDepuis}`,
            consequence: "La pièce n'est plus pilotée automatiquement.",
          },
        ]
      : []
  ),
  ...pieces.flatMap((piece) =>
    piece.ouvrants
      .filter((ouvrant) => ouvrant.batteriePct <= BATTERIE_FAIBLE_PCT)
      .map((ouvrant) => ({
        id: `${ouvrant.id}-batterie`,
        ou: piece.nom,
        quoi: `Batterie faible sur ${ouvrant.nom.toLowerCase()} (${ouvrant.batteriePct} %)`,
        consequence: "À remplacer avant que l'ouvrant cesse de répondre.",
      }))
  ),
  ...capteurs
    .filter((capteur) => capteur.batteriePct <= BATTERIE_FAIBLE_PCT && !capteur.horsLigneDepuis)
    .map((capteur) => ({
      id: `${capteur.id}-batterie`,
      ou: capteur.emplacement === "exterieur" ? "Extérieur" : (capteur.nom.split("—")[1]?.trim() ?? capteur.nom),
      quoi: `Batterie faible (${capteur.batteriePct} %)`,
      consequence: "À remplacer avant que le capteur cesse d'émettre.",
    })),
];

/** Moyenne des températures des pièces, arrondie au dixième. */
export const temperatureInterieureMoyenneC =
  Math.round((pieces.reduce((somme, p) => somme + p.temperatureC, 0) / pieces.length) * 10) / 10;

export const profilLogement = {
  nom: "Maison — Toulouse",
  type: "Maison individuelle",
  anneeConstruction: 1983,
  surfaceM2: 112,
  niveaux: 1,
  orientationPrincipale: "Sud / ouest",
  surfaceVitreeM2: 18,
} as const;

export type RoleMembre = "administrateur" | "adulte" | "acces-limite";

export interface MembreFoyer {
  id: string;
  prenom: string;
  role: RoleMembre;
  droits: string;
}

export const membresFoyer: MembreFoyer[] = [
  {
    id: "sonia",
    prenom: "Sonia",
    role: "administrateur",
    droits: "Tous les droits, y compris la gestion des membres et les réglages sensibles.",
  },
  {
    id: "julien",
    prenom: "Julien",
    role: "adulte",
    droits: "Pilotage de tous les ouvrants, modification des programmes.",
  },
  {
    id: "lena",
    prenom: "Léna",
    role: "acces-limite",
    droits: "Pilotage des ouvrants de sa chambre uniquement, pas d'accès aux réglages.",
  },
];
