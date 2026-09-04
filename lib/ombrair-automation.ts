import {
  computeShutterState,
  normaliserLuminosite,
  clamp,
  lerp,
  type Conditions,
  type EtatSimulation,
} from "./volet-simulation.ts";
import { bornerInclinaison, bornerLevee } from "./demo/shutter.ts";
import {
  angleOuvrant,
  computeWindowState,
  type EnvironnementFenetre,
  type EtatOuvrant,
} from "./fenetre-simulation.ts";

/**
 * COORDINATION FENÊTRE + VOLET — le moteur qui fait d'Ombrair autre chose
 * que deux produits posés côte à côte.
 *
 * ════════════════════════════════════════════════════════════════════════
 * LE PROBLÈME QUE CE MODULE RÉSOUT
 *
 * Les deux logiques métier existent déjà et fonctionnent séparément :
 *
 *   `computeWindowState`   quatre conditions → une ouverture d'ouvrant
 *   `computeShutterState`  trois conditions → une levée et un angle de lames
 *
 * Les appeler l'une à côté de l'autre donnerait un résultat FAUX sur le
 * scénario le plus important du produit.
 *
 * Prenons 27 °C dedans, 21 °C dehors, 95 % de soleil. La fenêtre s'entrouvre
 * à 47 % — l'air du dehors est bon, il faut le prendre. Le volet, lui, ne
 * voit qu'une façade à 21 °C : sa pression solaire tombe à 0,47, et il ne
 * descend son tablier que de 14 %. Autrement dit : on ouvre grand une baie
 * en plein soleil, et on n'ombrage rien.
 *
 * Ce n'est pas un défaut de la logique du volet — sur `/gammes/volet`, où la
 * fenêtre est fermée, elle est juste. C'est un effet de bord de l'ouverture :
 *
 *   **fenêtre fermée**  → le vitrage à contrôle solaire filtre le
 *                         rayonnement, le volet n'a qu'à compléter ;
 *   **fenêtre ouverte** → il n'y a plus de vitrage dans le passage, et le
 *                         volet devient le SEUL organe de protection solaire.
 *
 * D'où la coordination : ce que la fenêtre cesse de filtrer en s'ouvrant, le
 * volet le reprend à son compte. C'est littéralement le nom du produit —
 * l'ombre confiée au volet, l'air confié à la fenêtre.
 * ════════════════════════════════════════════════════════════════════════
 *
 * SIMULATION DE DÉMONSTRATION. Comme les deux modules qu'il assemble, celui-ci
 * illustre un raisonnement ; il ne dimensionne rien et n'est calibré sur
 * aucun logement.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * De l'environnement Fenêtre vers les conditions du Volet
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * La démo Volet travaille sur trois conditions EXTÉRIEURES. La démo Fenêtre
 * en expose quatre, dont deux températures et une humidité intérieure. La
 * traduction n'est pas arbitraire :
 *
 *  - `temperature`  ← la température EXTÉRIEURE. Un volet est dehors ; ce
 *    qu'il subit, c'est la façade, pas le salon.
 *
 *  - `luminosite`   ← identique, c'est la même grandeur.
 *
 *  - `humidite`     ← l'humidité INTÉRIEURE. C'est le seul point où les deux
 *    pages ne parlent pas de la même mesure, et c'est volontaire : dans la
 *    logique du volet, l'humidité sert uniquement à décider s'il faut garder
 *    un passage d'air entre les lames. Or ce qu'on veut évacuer, c'est
 *    l'humidité de la pièce — pas celle de la rue. Le mapping rend donc la
 *    règle plus juste ici qu'elle ne l'est sur la page Volet, où l'on ne
 *    dispose que d'une mesure extérieure.
 */
export function conditionsVolet(env: EnvironnementFenetre): Conditions {
  return {
    temperature: env.temperatureExterieure,
    luminosite: env.luminosite,
    humidite: env.humidite,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
 * Stratégies
 * ───────────────────────────────────────────────────────────────────────── */

export type StrategieOmbrair =
  | "neutre"
  | "aeration"
  | "confort-naturel"
  | "rafraichissement-naturel"
  | "ombre-et-air"
  | "protection-solaire"
  | "protection-thermique"
  | "protection-renforcee";

export const LIBELLE_STRATEGIE: Record<StrategieOmbrair, string> = {
  neutre: "Conditions neutres",
  aeration: "Aération",
  "confort-naturel": "Confort naturel",
  "rafraichissement-naturel": "Rafraîchissement naturel",
  "ombre-et-air": "Ombre et ventilation",
  "protection-solaire": "Protection solaire",
  "protection-thermique": "Protection thermique",
  "protection-renforcee": "Protection thermique renforcée",
};

/* ─────────────────────────────────────────────────────────────────────────
 * État combiné
 * ───────────────────────────────────────────────────────────────────────── */

export interface EtatVoletCoordonne extends EtatSimulation {
  /** Levée que la démo Volet seule produirait, avant coordination. */
  leveeAutonome: number;
  /** Angle de lames que la démo Volet seule produirait. */
  inclinaisonAutonome: number;
}

export interface EtatOmbrair {
  fenetre: EtatOuvrant;
  /** Angle de l'ouvrant en degrés, prêt à être envoyé à la scène. */
  angleOuvrant: number;
  volet: EtatVoletCoordonne;
  strategie: StrategieOmbrair;
  /** Justification courte, affichée telle quelle. */
  raison: string;
  /** Le volet a-t-il été pris en compte dans la stratégie annoncée ? */
  avecVolet: boolean;
}

/**
 * Part du rayonnement qui entre SANS filtre parce que l'ouvrant est écarté.
 *
 * Produit de l'ensoleillement et de l'ouverture : plein soleil sur une
 * fenêtre fermée ne vaut rien ici (le vitrage travaille), et une fenêtre
 * grande ouverte la nuit non plus.
 */
export function expositionDirecte(env: EnvironnementFenetre, ouverture: number): number {
  return normaliserLuminosite(env.luminosite) * clamp(ouverture, 0, 1);
}

/**
 * Le facteur 0,75 borne ce que la coordination peut exiger du volet : même à
 * exposition maximale, elle ne demande jamais plus de 75 % de tablier
 * descendu. Au-delà, on masquerait la fenêtre qu'on vient d'ouvrir — et la
 * démonstration ne serait plus lisible (voir §83 du cahier des charges :
 * le produit doit rester visible pendant les mouvements).
 */
const AUTORITE_COORDINATION = 0.75;

/**
 * Angle de lames minimal quand l'ouvrant est grand ouvert.
 *
 * Il garantit la règle de cohérence la plus importante de la démo : on ne
 * doit jamais lire « ventilation maximale » devant un volet muré. 38° laisse
 * un passage franc entre les lames tout en gardant une inclinaison qui
 * coupe le rayonnement direct.
 */
const ANGLE_PASSAGE_MAX = 38;

/**
 * DÉCISION COMPLÈTE. Deux logiques indépendantes, puis deux règles de
 * coordination — pas un troisième moteur qui referait leur travail.
 *
 *  1. **Le volet reprend la protection que la fenêtre abandonne.** Voir
 *     l'en-tête du module. La levée ne peut que DESCENDRE par coordination,
 *     jamais remonter : le volet garde toujours au moins la protection qu'il
 *     aurait décidée seul.
 *
 *  2. **Les lames gardent un passage proportionnel à l'ouverture.** Une
 *     fenêtre ouverte derrière un tablier aux lames jointives serait un état
 *     absurde. L'angle ne peut que MONTER par coordination.
 *
 * La fenêtre, elle, n'est jamais corrigée par le volet. Elle décide de l'air ;
 * l'ombre est le problème du volet. Inverser cette hiérarchie ferait fermer
 * une fenêtre à cause du soleil, ce que le cahier des charges interdit
 * explicitement (§14).
 */
export function computeCombinedState(
  env: EnvironnementFenetre,
  avecVolet = true
): EtatOmbrair {
  const fenetre = computeWindowState(env);
  const base = computeShutterState(conditionsVolet(env));

  // ── Règle 1 : reprise de la protection solaire ──
  const exposition = expositionDirecte(env, fenetre.ouverture);
  const fermeture = Math.max(base.fermeture, exposition * AUTORITE_COORDINATION);
  const levee = bornerLevee((1 - fermeture) * 100);

  // ── Règle 2 : passage d'air garanti entre les lames ──
  const anglePassage = lerp(0, ANGLE_PASSAGE_MAX, fenetre.ouverture);
  const inclinaison = bornerInclinaison(Math.max(base.inclinaison, anglePassage));

  const volet: EtatVoletCoordonne = {
    ...base,
    levee,
    inclinaison,
    fermeture,
    leveeAutonome: base.levee,
    inclinaisonAutonome: base.inclinaison,
  };

  const strategie = choisirStrategie(env, fenetre, avecVolet);

  return {
    fenetre,
    angleOuvrant: angleOuvrant(fenetre.ouverture),
    volet,
    strategie,
    raison: justifier(strategie, env, fenetre),
    avecVolet,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
 * Choix de la stratégie
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Seuil de fermeture. Il vaut zéro par construction : `computeWindowState`
 * applique déjà la zone morte de l'actionneur (`OUVERTURE_MORTE`), donc une
 * ouverture est soit nulle, soit franche. Le comparer à une petite valeur
 * plutôt qu'à `=== 0` évite seulement de dépendre de l'arithmétique flottante.
 */
const OUVERTURE_FERMEE = 0.005;
/** Seuil au-dessus duquel on parle de rafraîchissement, pas d'entrebâillement. */
const OUVERTURE_LARGE = 0.55;
/** Ensoleillement à partir duquel l'ombre devient un sujet. */
const SOLEIL_MARQUE = 0.55;

/**
 * La stratégie annoncée décrit CE QUE LE VISITEUR VOIT, pas ce que le moteur
 * a calculé en interne. C'est pourquoi elle dépend de `avecVolet` : annoncer
 * « protection renforcée » alors qu'aucun volet n'est affiché ferait
 * référence à un organe absent de l'écran.
 */
export function choisirStrategie(
  env: EnvironnementFenetre,
  fenetre: EtatOuvrant,
  avecVolet: boolean
): StrategieOmbrair {
  const soleil = normaliserLuminosite(env.luminosite);
  const exterieurPlusChaud =
    fenetre.besoinRafraichissement >= 0.15 && fenetre.potentielRafraichissement <= 0.02;

  if (fenetre.ouverture < OUVERTURE_FERMEE) {
    if (exterieurPlusChaud) {
      return avecVolet && soleil >= SOLEIL_MARQUE
        ? "protection-renforcee"
        : "protection-thermique";
    }
    if (avecVolet && soleil >= SOLEIL_MARQUE) return "protection-solaire";
    return "neutre";
  }

  // La fenêtre est ouverte. Si le volet est de la partie et que le soleil est
  // marqué, c'est le scénario emblématique : les deux organes font des choses
  // différentes en même temps.
  if (avecVolet && soleil >= SOLEIL_MARQUE) return "ombre-et-air";

  if (fenetre.aerationDominante) return "aeration";
  if (fenetre.ouverture >= OUVERTURE_LARGE) return "rafraichissement-naturel";
  return "confort-naturel";
}

/* ─────────────────────────────────────────────────────────────────────────
 * Justification
 * ───────────────────────────────────────────────────────────────────────── */

/** Écart absolu arrondi, en degrés — jamais de décimale à l'écran. */
function ecartArrondi(env: EnvironnementFenetre): number {
  return Math.abs(Math.round(env.temperatureInterieure - env.temperatureExterieure));
}

/**
 * Une phrase, pas un paragraphe. Elle relie le mouvement observé à la mesure
 * qui l'a provoqué : sans elle, la démo se réduit à « je bouge un curseur, un
 * objet bouge ».
 */
export function justifier(
  strategie: StrategieOmbrair,
  env: EnvironnementFenetre,
  fenetre: EtatOuvrant
): string {
  const d = ecartArrondi(env);
  const humidite = Math.round(env.humidite);

  switch (strategie) {
    case "rafraichissement-naturel":
      return `L'air extérieur est ${d} °C plus frais : la fenêtre s'ouvre pour évacuer la chaleur.`;

    case "ombre-et-air":
      return fenetre.potentielRafraichissement > 0
        ? `L'air extérieur est ${d} °C plus frais mais le soleil est fort : la fenêtre s'entrouvre, le volet fait l'ombre.`
        : `Le soleil est fort : le volet protège pendant que la fenêtre renouvelle l'air.`;

    case "confort-naturel":
      return `L'air extérieur est ${d} °C plus frais : la fenêtre s'entrouvre sans mettre la pièce en courant d'air.`;

    case "aeration":
      return `Humidité intérieure à ${humidite} % : la fenêtre s'entrouvre pour renouveler l'air.`;

    case "protection-renforcee":
      return `L'extérieur est ${d} °C plus chaud et le soleil est au maximum : fenêtre fermée, volet en occultation.`;

    case "protection-thermique":
      // À écart nul, « 0 °C plus chaud » ne veut rien dire.
      return d === 0
        ? "L'air extérieur n'est pas plus frais : ouvrir n'apporterait rien."
        : `L'extérieur est ${d} °C plus chaud : ouvrir réchaufferait la pièce, la fenêtre reste fermée.`;

    case "protection-solaire":
      return "Rien à ventiler, mais le soleil est fort : le volet filtre, la fenêtre reste fermée.";

    case "neutre":
      return "Ni la chaleur ni l'humidité ne demandent d'ouvrir : la fenêtre reste fermée.";
  }
}
