import {
  bornerInclinaison,
  bornerLevee,
  INCLINAISON_MAX,
  type EtatVolet,
} from "./demo/shutter.ts";

/**
 * SIMULATION DE DÉMONSTRATION — réaction du volet Ombrair à trois conditions
 * extérieures : température, luminosité, humidité.
 *
 * ════════════════════════════════════════════════════════════════════════
 * CE QUE C'EST, ET CE QUE CE N'EST PAS
 *
 * C'est une démonstration pédagogique du RAISONNEMENT d'Ombrair : montrer
 * qu'une décision d'ouverture se déduit de conditions mesurées, et non d'un
 * horaire. Les seuils sont choisis pour être lisibles à l'écran.
 *
 * Ce n'est PAS un modèle thermique. Aucun coefficient ne vient d'une mesure,
 * aucune valeur n'est calibrée sur un logement réel, et le résultat ne
 * prédit rien. Le site doit le dire là où la démo s'affiche.
 * ════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI UN MODULE SÉPARÉ DE `voletAutomatique`.
 *
 * `lib/demo/shutter.ts` porte déjà une logique automatique, mais elle prend
 * une HEURE et un ÉCART de température intérieur/extérieur : c'est ce qu'il
 * faut pour dérouler une journée dans le hero d'accueil. La démo produit
 * répond à une autre question — « et si je règle moi-même les conditions ? »
 * — et travaille donc sur un espace d'entrée différent.
 *
 * En revanche la SORTIE est le même `EtatVolet { levee, inclinaison }` que
 * tout le reste du projet, et les libellés viennent des mêmes fonctions.
 * Deux entrées, une seule mécanique.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Bornes des réglages
 * ───────────────────────────────────────────────────────────────────────── */

export interface Conditions {
  /** Température extérieure, °C. */
  temperature: number;
  /** Luminosité extérieure, 0–100 %. */
  luminosite: number;
  /** Humidité relative extérieure, 20–100 %. */
  humidite: number;
}

export const BORNES = {
  temperature: { min: 0, max: 45, pas: 1, unite: "°C" },
  luminosite: { min: 0, max: 100, pas: 1, unite: "%" },
  humidite: { min: 20, max: 100, pas: 1, unite: "%" },
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Outils numériques
 * ───────────────────────────────────────────────────────────────────────── */

export function clamp(valeur: number, min: number, max: number): number {
  if (!Number.isFinite(valeur)) return min;
  return Math.min(max, Math.max(min, valeur));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Transition douce entre deux seuils. Préférée à une rampe linéaire parce
 * qu'elle évite deux ruptures de pente visibles : le volet démarre et
 * s'arrête progressivement au lieu de « prendre » d'un coup.
 */
export function smoothstep(bas: number, haut: number, valeur: number): number {
  if (haut === bas) return valeur >= haut ? 1 : 0;
  const t = clamp((valeur - bas) / (haut - bas), 0, 1);
  return t * t * (3 - 2 * t);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Normalisations
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Part thermique de la contrainte.
 *
 * Origine à 18 °C : en dessous, la chaleur n'est pas un problème et fermer
 * n'aurait aucun sens. Saturation à 38 °C, au-delà de laquelle le volet est
 * de toute façon à sa protection maximale.
 */
export function normaliserTemperature(temperature: number): number {
  return clamp((temperature - 18) / 20, 0, 1);
}

/** Part lumineuse. Directement proportionnelle : 0 % nuit, 100 % plein soleil. */
export function normaliserLuminosite(luminosite: number): number {
  return clamp(luminosite / 100, 0, 1);
}

/**
 * Besoin de ventilation.
 *
 * Origine à 45 % d'humidité — en dessous, l'air est confortable et rien ne
 * justifie de ventiler. Saturation à 85 %, où le besoin est maximal.
 */
export function normaliserHumidite(humidite: number): number {
  return clamp((humidite - 45) / 40, 0, 1);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Grandeurs intermédiaires
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * PRESSION SOLAIRE — combien il est urgent de protéger la pièce.
 *
 * Le thermique pèse davantage que la lumière (60 / 40) : une journée
 * lumineuse mais fraîche ne demande pas de fermer, alors qu'une journée
 * chaude et voilée le demande. C'est la même hiérarchie que
 * `voletAutomatique`, où le thermique pèse 65 %.
 */
export function computeSolarPressure(conditions: Conditions): number {
  const t = normaliserTemperature(conditions.temperature);
  const l = normaliserLuminosite(conditions.luminosite);
  return clamp(0.6 * t + 0.4 * l, 0, 1);
}

/** BESOIN DE VENTILATION — dérivé de la seule humidité. */
export function computeVentilationNeed(conditions: Conditions): number {
  return normaliserHumidite(conditions.humidite);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Décision
 * ───────────────────────────────────────────────────────────────────────── */

export interface EtatSimulation extends EtatVolet {
  /** Pression solaire retenue, 0–1. */
  pressionSolaire: number;
  /** Besoin de ventilation retenu, 0–1. */
  besoinVentilation: number;
  /** Part du tablier effectivement descendue, 0–1 — l'inverse de `levee`. */
  fermeture: number;
  /** Régime de fonctionnement, pour l'affichage. */
  mode: ModeVolet;
}

export type ModeVolet =
  | "ouverture"
  | "filtrage"
  | "protection"
  | "protection-renforcee"
  | "ventilation";

export const LIBELLE_MODE: Record<ModeVolet, string> = {
  ouverture: "Ouverture — rien à filtrer",
  filtrage: "Filtrage de la lumière",
  protection: "Protection solaire",
  "protection-renforcee": "Protection solaire renforcée",
  ventilation: "Protection avec ventilation",
};

export const EXPLICATION_MODE: Record<ModeVolet, string> = {
  ouverture:
    "Ni la chaleur ni la lumière ne justifient de fermer. Le tablier reste relevé.",
  filtrage:
    "La lumière commence à gêner sans que la chaleur ne pose problème. Les lames s'inclinent, le tablier ne bouge pas encore.",
  protection:
    "La chaleur s'installe. Le tablier descend et les lames se referment pour limiter l'apport solaire.",
  "protection-renforcee":
    "Chaleur et ensoleillement sont tous deux élevés. Le volet occulte au maximum.",
  ventilation:
    "L'air est humide : les lames gardent une ouverture pour laisser circuler l'air, malgré la protection solaire.",
};

/**
 * DÉCISION COMPLÈTE — de trois conditions vers un état mécanique.
 *
 * Deux principes, dans cet ordre :
 *
 *  1. **On joue d'abord sur les lames, ensuite sur le tablier.** Incliner
 *     les lames coûte peu — on garde la vue et une part de lumière. Baisser
 *     le tablier plonge la pièce dans le noir. Le tablier ne commence donc à
 *     descendre qu'au-delà d'une pression moyenne (seuil bas du smoothstep).
 *
 *  2. **La ventilation rouvre les lames, jamais le tablier.** Quand l'air
 *     est humide, on veut le laisser circuler sans pour autant rouvrir la
 *     fenêtre au soleil : l'humidité relève donc le plancher de l'angle des
 *     lames, sans toucher à la hauteur du tablier.
 */
export function computeShutterState(conditions: Conditions): EtatSimulation {
  const pressionSolaire = computeSolarPressure(conditions);
  const besoinVentilation = computeVentilationNeed(conditions);

  // Le tablier ne réagit qu'à partir d'une pression de 0,35 et sature à
  // 0,85 : entre les deux, il descend progressivement.
  const fermeture = smoothstep(0.35, 0.85, pressionSolaire);
  const levee = bornerLevee((1 - fermeture) * 100);

  // Angle « naturel » : grand ouvert quand rien ne presse, presque joint
  // quand tout presse. On ne descend pas à 0° — un volet en protection
  // garde une inclinaison résiduelle plutôt que de se souder.
  const angleNaturel = lerp(INCLINAISON_MAX * 0.85, 6, pressionSolaire);

  // La ventilation relève le plancher de l'angle, sans jamais le baisser.
  const angleVentile = Math.max(angleNaturel, lerp(angleNaturel, 30, besoinVentilation));
  const inclinaison = bornerInclinaison(angleVentile);

  return {
    levee,
    inclinaison,
    pressionSolaire,
    besoinVentilation,
    fermeture,
    mode: determinerMode(pressionSolaire, besoinVentilation, fermeture),
  };
}

/**
 * Régime affiché. Il décrit ce que le système est en train de faire, pour
 * que l'utilisateur relie le mouvement du volet à une intention.
 */
function determinerMode(
  pression: number,
  ventilation: number,
  fermeture: number
): ModeVolet {
  if (pression >= 0.75) {
    // Sous forte pression, l'humidité change la nature de la réponse :
    // on protège toujours, mais on laisse respirer.
    return ventilation >= 0.5 ? "ventilation" : "protection-renforcee";
  }
  if (fermeture > 0.05) return ventilation >= 0.5 ? "ventilation" : "protection";
  if (pression >= 0.2) return "filtrage";
  return "ouverture";
}
