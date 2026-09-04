/**
 * Moteur de simulation d'une journée Ombrair.
 *
 * Tout est en fonctions pures, sans React et sans horloge réelle : l'heure
 * simulée est toujours passée en argument. C'est ce qui rend le hero
 * testable et reproductible.
 *
 * ATTENTION — Rien ici n'est une mesure. Les températures, la luminosité et
 * la course du soleil sont un SCÉNARIO DE DÉMONSTRATION destiné à illustrer
 * la logique du produit. Ce ne sont ni des relevés météo, ni une
 * performance thermique d'Ombrair.
 */

/** Durée réelle d'un cycle complet de 24 h simulées, en millisecondes. */
export const DUREE_CYCLE_MS = 48_000; // 2 s de temps réel par heure simulée

/**
 * Heure à laquelle la simulation démarre.
 *
 * Le cycle commençait à 00:00 : un visiteur arrivant sur la page tombait
 * sur une scène de nuit presque vide, avec une petite lune, et devait
 * attendre une trentaine de secondes avant de voir le produit faire quoi
 * que ce soit. Le premier écran doit démontrer, pas patienter.
 *
 * Le choix de 09:30 mérite d'être expliqué, parce que l'heure la plus
 * CHAUDE est la moins démonstrative. En début d'après-midi, la logique
 * ferme le volet complètement : le cadre ne montre plus qu'un tablier
 * opaque, ni ciel, ni soleil, ni mouvement. Correct, mais illisible.
 *
 * S'ajoute une contrainte de géométrie : un volet roulant s'enroule en
 * haut, il dégage donc PAR LE BAS. Un soleil haut dans le ciel n'est
 * visible que tant que le tablier est encore peu descendu. Dès que le
 * volet fait son travail, il masque précisément ce qu'il faut montrer.
 *
 * 09:30 est le moment où les cinq éléments coexistent : soleil visible
 * dans la partie dégagée, écart extérieur/intérieur déjà installé, tablier
 * engagé, lames nettement inclinées. On voit la fermeture EN COURS —
 * c'est-à-dire exactement ce que le produit prétend faire : agir avant
 * que ça tape.
 *
 * La simulation continue ensuite normalement sur 24 h ; seule l'origine
 * est décalée.
 */
export const HEURE_DEPART = 9.5;

/** Ramène une heure quelconque dans [0, 24). */
export function normaliserHeure(heure: number): number {
  const modulo = heure % 24;
  return modulo < 0 ? modulo + 24 : modulo;
}

/** Convertit un temps réel écoulé en heure simulée, à partir de HEURE_DEPART. */
export function heureDepuisTempsEcoule(msEcoules: number): number {
  return normaliserHeure(HEURE_DEPART + (msEcoules / DUREE_CYCLE_MS) * 24);
}

/** `14.5` → `"14:30"`. */
export function formatHeure(heure: number): string {
  const h = normaliserHeure(heure);
  const heures = Math.floor(h);
  const minutes = Math.floor((h - heures) * 60);
  return `${String(heures).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Interpolation linéaire. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Adoucit une progression 0→1 pour éviter les ruptures brutales. */
function adoucir(t: number): number {
  const borne = Math.min(1, Math.max(0, t));
  return borne * borne * (3 - 2 * borne);
}

// ── Soleil et lune ────────────────────────────────────────────────────────

/** Heures de lever et de coucher retenues pour le scénario (journée d'été). */
export const LEVER_SOLEIL = 6.5;
export const COUCHER_SOLEIL = 21;

export interface PositionAstre {
  /** Visible dans le cadre de la fenêtre. */
  visible: boolean;
  /** Position horizontale, 0 (est, à gauche) → 1 (ouest, à droite). */
  x: number;
  /** Hauteur, 0 (horizon) → 1 (zénith). */
  hauteur: number;
}

/**
 * Course du soleil : il entre à l'est au lever, culmine à mi-parcours,
 * ressort à l'ouest au coucher. Trajectoire stylisée, pas astronomique.
 */
export function positionSoleil(heure: number): PositionAstre {
  const h = normaliserHeure(heure);
  if (h < LEVER_SOLEIL || h > COUCHER_SOLEIL) {
    return { visible: false, x: 0, hauteur: 0 };
  }
  const progression = (h - LEVER_SOLEIL) / (COUCHER_SOLEIL - LEVER_SOLEIL);
  return {
    visible: true,
    x: progression,
    // Sinus : nul aux deux extrémités, maximal au milieu de la course.
    hauteur: Math.sin(progression * Math.PI),
  };
}

/**
 * Course de la lune, sur la période complémentaire (du coucher au lever,
 * en passant par minuit).
 */
export function positionLune(heure: number): PositionAstre {
  const h = normaliserHeure(heure);
  const dureeNuit = 24 - COUCHER_SOLEIL + LEVER_SOLEIL;
  let ecoule: number;

  // Bornes strictes : aux instants exacts du lever et du coucher, le soleil
  // est encore (ou déjà) visible. Sans cela les deux astres apparaîtraient
  // ensemble à 06:30 et à 21:00.
  if (h > COUCHER_SOLEIL) ecoule = h - COUCHER_SOLEIL;
  else if (h < LEVER_SOLEIL) ecoule = 24 - COUCHER_SOLEIL + h;
  else return { visible: false, x: 0, hauteur: 0 };

  const progression = ecoule / dureeNuit;
  return { visible: true, x: progression, hauteur: Math.sin(progression * Math.PI) };
}

// ── Phases du ciel ────────────────────────────────────────────────────────

export type PhaseCiel = "nuit" | "aube" | "matin" | "midi" | "apres-midi" | "coucher" | "crepuscule";

/** Phase nommée, pour le texte et pour choisir les tokens de couleur. */
export function phaseCiel(heure: number): PhaseCiel {
  const h = normaliserHeure(heure);
  if (h < 5) return "nuit";
  if (h < LEVER_SOLEIL + 1) return "aube";
  if (h < 11) return "matin";
  if (h < 15) return "midi";
  if (h < 19) return "apres-midi";
  if (h < COUCHER_SOLEIL) return "coucher";
  if (h < 22.5) return "crepuscule";
  return "nuit";
}

/**
 * Heure « centrale » de chaque phase. Sert à fondre continûment une phase
 * dans la suivante plutôt qu'à basculer d'un coup.
 */
const ANCRES: { phase: PhaseCiel; heure: number }[] = [
  { phase: "nuit", heure: 1.5 },
  { phase: "aube", heure: 6.5 },
  { phase: "matin", heure: 9 },
  { phase: "midi", heure: 13 },
  { phase: "apres-midi", heure: 17 },
  { phase: "coucher", heure: 20.5 },
  { phase: "crepuscule", heure: 22 },
];

export interface MelangeCiel {
  de: PhaseCiel;
  vers: PhaseCiel;
  /** Avancement du fondu entre les deux phases, 0 → 1. */
  t: number;
}

/**
 * Les deux phases à mélanger à un instant donné, et leur proportion.
 * Le tour complet reboucle : après « crepuscule » on revient sur « nuit ».
 */
export function melangeCiel(heure: number): MelangeCiel {
  const h = normaliserHeure(heure);

  for (let i = 0; i < ANCRES.length; i += 1) {
    const courante = ANCRES[i];
    const suivante = ANCRES[(i + 1) % ANCRES.length];
    // Durée jusqu'à l'ancre suivante, en passant minuit si nécessaire.
    const duree = normaliserHeure(suivante.heure - courante.heure) || 24;
    const depuis = normaliserHeure(h - courante.heure);
    if (depuis < duree) {
      return { de: courante.phase, vers: suivante.phase, t: adoucir(depuis / duree) };
    }
  }

  // Inatteignable, les ancres couvrant les 24 h — filet de sécurité.
  return { de: "nuit", vers: "nuit", t: 0 };
}

// ── Luminosité ────────────────────────────────────────────────────────────

export type NiveauLuminosite = "nulle" | "faible" | "moyenne" | "forte";

/** Luminosité extérieure simulée, 0 → 1. */
export function luminosite(heure: number): number {
  const soleil = positionSoleil(heure);
  if (!soleil.visible) return 0;
  return adoucir(soleil.hauteur);
}

export function niveauLuminosite(valeur: number): NiveauLuminosite {
  if (valeur < 0.05) return "nulle";
  if (valeur < 0.35) return "faible";
  if (valeur < 0.7) return "moyenne";
  return "forte";
}

// ── Températures ──────────────────────────────────────────────────────────

/** Bornes du scénario de démonstration (journée de canicule). */
export const EXT_MIN = 21.6;
export const EXT_MAX = 37.2;
export const HEURE_EXT_MIN = 5.5;
export const HEURE_EXT_MAX = 16;

/**
 * Température extérieure simulée : minimum en fin de nuit, maximum en
 * milieu d'après-midi, transitions continues entre les deux.
 */
export function temperatureExterieure(heure: number): number {
  const h = normaliserHeure(heure);
  const amplitude = EXT_MAX - EXT_MIN;

  if (h >= HEURE_EXT_MIN && h <= HEURE_EXT_MAX) {
    // Montée du minimum matinal vers le pic de l'après-midi.
    const t = (h - HEURE_EXT_MIN) / (HEURE_EXT_MAX - HEURE_EXT_MIN);
    return EXT_MIN + amplitude * adoucir(t);
  }

  // Descente du pic vers le minimum du lendemain matin, en passant minuit.
  const depuisPic = h > HEURE_EXT_MAX ? h - HEURE_EXT_MAX : 24 - HEURE_EXT_MAX + h;
  const dureeDescente = 24 - HEURE_EXT_MAX + HEURE_EXT_MIN;
  return EXT_MAX - amplitude * adoucir(depuisPic / dureeDescente);
}

/** Bornes de la température intérieure du scénario. */
export const INT_MIN = 23.4;
export const INT_MAX = 26.6;
/** L'intérieur suit l'extérieur avec ce retard, en heures. */
export const INERTIE_HEURES = 3.5;

/**
 * Température intérieure simulée. Elle ne se déduit pas de l'extérieure par
 * un simple décalage : elle suit la même forme de courbe mais amortie et
 * retardée, ce qui imite grossièrement l'inertie d'un bâtiment.
 *
 * L'ouverture du volet module légèrement le résultat — un volet grand
 * ouvert en pleine chaleur laisse entrer davantage. C'est une illustration
 * du principe, en aucun cas un modèle thermique validé.
 */
export function temperatureInterieure(heure: number, ouverturePct = 0): number {
  const extRetardee = temperatureExterieure(heure - INERTIE_HEURES);
  const positionDansPlage = (extRetardee - EXT_MIN) / (EXT_MAX - EXT_MIN);
  const base = INT_MIN + (INT_MAX - INT_MIN) * positionDansPlage;

  // Au plus 1,2 °C d'écart entre volet fermé et volet grand ouvert, et
  // seulement quand l'extérieur est plus chaud que l'intérieur.
  const ecartExtInt = temperatureExterieure(heure) - base;
  const influence = ecartExtInt > 0 ? Math.min(1.2, ecartExtInt * 0.1) : 0;

  return base + influence * (Math.min(100, Math.max(0, ouverturePct)) / 100);
}

/** Humidité relative simulée : elle monte quand la température baisse. */
export function humiditeExterieure(heure: number): number {
  const t = (temperatureExterieure(heure) - EXT_MIN) / (EXT_MAX - EXT_MIN);
  return Math.round(lerp(62, 28, t));
}

// ── État complet à un instant donné ───────────────────────────────────────

export interface EtatSimulation {
  heure: number;
  heureFormatee: string;
  phase: PhaseCiel;
  soleil: PositionAstre;
  lune: PositionAstre;
  luminosite: number;
  niveauLuminosite: NiveauLuminosite;
  temperatureExterieure: number;
  temperatureInterieure: number;
  humiditeExterieure: number;
}

export function etatSimulation(heure: number, ouverturePct = 0): EtatSimulation {
  const h = normaliserHeure(heure);
  const lum = luminosite(h);
  return {
    heure: h,
    heureFormatee: formatHeure(h),
    phase: phaseCiel(h),
    soleil: positionSoleil(h),
    lune: positionLune(h),
    luminosite: lum,
    niveauLuminosite: niveauLuminosite(lum),
    temperatureExterieure: temperatureExterieure(h),
    temperatureInterieure: temperatureInterieure(h, ouverturePct),
    humiditeExterieure: humiditeExterieure(h),
  };
}
