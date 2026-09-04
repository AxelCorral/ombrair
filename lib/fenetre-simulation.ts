import { clamp, lerp } from "./volet-simulation.ts";

/**
 * SIMULATION DE DÉMONSTRATION — ouverture de la fenêtre Ombrair à partir de
 * quatre conditions : deux températures, la luminosité et l'humidité
 * intérieure.
 *
 * ════════════════════════════════════════════════════════════════════════
 * CE QUE C'EST, ET CE QUE CE N'EST PAS
 *
 * C'est une démonstration pédagogique du RAISONNEMENT d'Ombrair : montrer
 * qu'une fenêtre motorisée s'ouvre parce que l'air du dehors vaut mieux que
 * celui du dedans, et pas parce qu'il est 21 h. Les seuils sont choisis pour
 * être lisibles à l'écran.
 *
 * Ce n'est PAS un modèle thermique. Aucun coefficient ne vient d'une mesure,
 * rien n'est calibré sur un logement, et le résultat ne prédit rien. Le site
 * doit le dire là où la démo s'affiche.
 * ════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI DEUX TEMPÉRATURES, ALORS QUE LE VOLET N'EN DEMANDE QU'UNE.
 *
 * Un volet répond à ce qui ARRIVE SUR LA FAÇADE : la chaleur et la lumière
 * du dehors, point. Une fenêtre répond à un ÉCHANGE : ouvrir ne sert que si
 * l'air qu'on fait entrer est meilleur que celui qu'on chasse. Une seule
 * température ne peut pas répondre à cette question.
 *
 *   29 °C dedans / 19 °C dehors  → ouvrir rafraîchit.
 *   25 °C dedans / 36 °C dehors  → ouvrir réchauffe.
 *
 * Ces deux situations donneraient la même consigne à un système qui ne
 * regarderait que le dehors. C'est précisément l'erreur qu'Ombrair prétend
 * ne pas commettre, donc la démo doit la rendre visible.
 *
 * POURQUOI UN MODULE SÉPARÉ DE `fenetreAutomatique`.
 *
 * `lib/demo/shutter.ts` porte déjà une décision de fenêtre, mais en TROIS
 * ÉTATS discrets (fermée / entrouverte / ouverte) déduits d'un seul écart :
 * c'est ce qu'il faut pour dérouler une journée dans le hero d'accueil et
 * dans l'application, où afficher un pourcentage au centimètre n'aurait
 * aucun sens. La démo produit répond à une autre question — « et si je règle
 * moi-même les conditions ? » — et doit produire un angle d'ouvrant continu,
 * puisque c'est une mécanique qu'on regarde bouger.
 *
 * Deux entrées, deux granularités, une seule intention.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Entrées
 * ───────────────────────────────────────────────────────────────────────── */

export interface EnvironnementFenetre {
  /** Température de la pièce, °C. */
  temperatureInterieure: number;
  /** Température de l'air extérieur, °C. */
  temperatureExterieure: number;
  /** Ensoleillement direct sur la façade, 0–100 %. */
  luminosite: number;
  /** Humidité relative de la pièce, 20–100 %. */
  humidite: number;
}

export const BORNES_FENETRE = {
  temperatureInterieure: { min: 15, max: 35, pas: 1, unite: "°C" },
  temperatureExterieure: { min: 5, max: 45, pas: 1, unite: "°C" },
  luminosite: { min: 0, max: 100, pas: 1, unite: "%" },
  humidite: { min: 20, max: 100, pas: 1, unite: "%" },
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Grandeurs intermédiaires
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * BESOIN DE RAFRAÎCHISSEMENT — à quel point la pièce a trop chaud.
 *
 * Origine à 22 °C : en dessous, personne ne cherche à refroidir un logement.
 * Saturation à 30 °C, au-delà de laquelle le besoin est de toute façon
 * maximal et ouvrir davantage ne dépend plus que du dehors.
 */
export function besoinRafraichissement(env: EnvironnementFenetre): number {
  return clamp((env.temperatureInterieure - 22) / 8, 0, 1);
}

/** ÉCART THERMIQUE, en °C. Positif = l'extérieur est plus frais. */
export function ecartThermique(env: EnvironnementFenetre): number {
  return env.temperatureInterieure - env.temperatureExterieure;
}

/**
 * POTENTIEL DE RAFRAÎCHISSEMENT NATUREL — ce que le dehors peut apporter.
 *
 * Saturation à 8 °C d'écart : au-delà, l'air entrant est déjà largement
 * assez frais, et ouvrir plus grand ne change plus la nature de la réponse.
 */
export function potentielRafraichissement(env: EnvironnementFenetre): number {
  return clamp(ecartThermique(env) / 8, 0, 1);
}

/**
 * BESOIN D'AÉRATION — dérivé de la seule humidité intérieure.
 *
 * Origine à 60 % : en dessous, l'air de la pièce est confortable. Saturation
 * à 85 %, où l'on est dans le registre de la condensation.
 */
export function besoinAeration(env: EnvironnementFenetre): number {
  return clamp((env.humidite - 60) / 25, 0, 1);
}

/**
 * PÉNALITÉ THERMIQUE — combien ouvrir coûterait, quand le dehors est plus
 * chaud que le dedans.
 *
 * Elle existe pour une raison précise : sans elle, une pièce humide à 24 °C
 * un jour à 38 °C ferait ouvrir la fenêtre « pour assainir l'air », ce qui
 * réchaufferait le logement. L'aération doit céder devant la thermique, pas
 * l'inverse.
 */
export function penaliteThermique(env: EnvironnementFenetre): number {
  return clamp(-ecartThermique(env) / 6, 0, 1);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Décision
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * ZONE MORTE DE L'ACTIONNEUR.
 *
 * En dessous de 12 %, l'ouvrant ne bouge pas du tout. Deux raisons, l'une
 * physique et l'autre d'affichage :
 *
 *  - un vantail écarté de sept degrés ne renouvelle rien ; faire travailler
 *    un moteur pour ça n'a pas de sens, et aucun automatisme sérieux ne le
 *    ferait ;
 *
 *  - sans ce seuil, la démo affichait « Fenêtre 9 % · Entrebâillée » sous une
 *    stratégie « Conditions neutres » dont la phrase dit que la fenêtre reste
 *    fermée. Le texte et le chiffre se contredisaient à l'écran.
 *
 * Le seuil est franc plutôt que progressif : c'est un actionneur qui démarre,
 * pas une grandeur continue.
 */
export const OUVERTURE_MORTE = 0.12;

export interface EtatOuvrant {
  /** Ouverture de l'ouvrant, 0 = fermé, 1 = ouverture maximale de démo. */
  ouverture: number;
  besoinRafraichissement: number;
  potentielRafraichissement: number;
  besoinAeration: number;
  penaliteThermique: number;
  /** Écart intérieur − extérieur, en °C, tel quel. */
  ecart: number;
  /** Vrai si c'est l'humidité, et non la thermique, qui commande. */
  aerationDominante: boolean;
}

/**
 * DÉCISION FENÊTRE — de quatre conditions vers une ouverture.
 *
 * Trois principes, dans cet ordre :
 *
 *  1. **Ouvrir demande un besoin ET un moyen.** Le terme thermique est un
 *     PRODUIT, pas une somme : une pièce à 30 °C avec 38 °C dehors n'ouvre
 *     pas, et une pièce à 21 °C avec 5 °C dehors non plus. Il faut avoir
 *     trop chaud *et* avoir quelque chose de plus frais à faire entrer.
 *
 *  2. **L'humidité aère, elle ne rafraîchit pas.** Elle ouvre au maximum à
 *     45 % — de quoi renouveler l'air d'une pièce, pas de quoi la mettre en
 *     courant d'air — et elle s'efface quand l'extérieur est plus chaud.
 *
 *  3. **La luminosité n'ouvre jamais rien.** Elle n'apparaît pas dans ce
 *     calcul. Du soleil sur une façade n'est pas une raison d'ouvrir une
 *     fenêtre ; c'est une raison de baisser un volet — et c'est exactement
 *     la répartition des rôles que la démo combinée doit montrer.
 *     Voir `lib/ombrair-automation.ts`.
 */
export function computeWindowState(env: EnvironnementFenetre): EtatOuvrant {
  const besoin = besoinRafraichissement(env);
  const potentiel = potentielRafraichissement(env);
  const aeration = besoinAeration(env);
  const penalite = penaliteThermique(env);

  // Il faut le besoin ET le moyen. Le produit annule l'ouverture dès que
  // l'un des deux manque.
  const ouvertureThermique = besoin * potentiel;

  // L'aération plafonne à 45 % d'ouverture, et disparaît quand l'air
  // extérieur est plus chaud : on ne fait pas entrer 38 °C pour sécher une
  // salle de bain.
  const ouvertureAeration = aeration * 0.45 * (1 - penalite);

  const demande = clamp(Math.max(ouvertureThermique, ouvertureAeration), 0, 1);
  const ouverture = demande < OUVERTURE_MORTE ? 0 : demande;

  return {
    ouverture,
    besoinRafraichissement: besoin,
    potentielRafraichissement: potentiel,
    besoinAeration: aeration,
    penaliteThermique: penalite,
    ecart: ecartThermique(env),
    aerationDominante: ouvertureAeration > ouvertureThermique && ouverture > 0,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
 * De l'ouverture normalisée vers la mécanique
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Angle maximal de l'ouvrant, en degrés.
 *
 * 60° est une ouverture de démonstration : suffisamment franche pour qu'on
 * comprenne au premier coup d'œil que la fenêtre s'ouvre vraiment, et assez
 * contenue pour que l'ouvrant reste dans le cadrage de la caméra et ne
 * traverse pas le tableau de l'embrasure.
 */
export const ANGLE_OUVRANT_MAX = 60;

/**
 * Ouverture normalisée → angle de l'ouvrant.
 *
 * Volontairement LINÉAIRE. Une courbe donnerait peut-être un mouvement plus
 * flatteur, mais elle casserait la lecture : le panneau affiche « 47 %
 * ouverte », et le visiteur doit pouvoir relier ce chiffre à ce qu'il voit.
 */
export function angleOuvrant(ouverture: number): number {
  return lerp(0, ANGLE_OUVRANT_MAX, clamp(ouverture, 0, 1));
}

/** Libellé court de l'état d'ouverture, pour les textes de l'interface. */
export function libelleOuverture(ouverture: number): string {
  const o = clamp(ouverture, 0, 1);
  if (o <= 0.02) return "Fermée";
  if (o < 0.2) return "Entrebâillée";
  if (o < 0.55) return "Entrouverte";
  if (o < 0.85) return "Ouverte";
  return "Grande ouverte";
}
