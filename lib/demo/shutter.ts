/**
 * Modèle mécanique du volet à lames orientables.
 *
 * Deux degrés de liberté INDÉPENDANTS, qu'il ne faut pas confondre :
 *
 *  - `levee`      0-100 %  : de combien le tablier est physiquement remonté.
 *                            0 = tablier entièrement descendu, il couvre
 *                            toute la fenêtre ; 100 = tablier enroulé en
 *                            haut, la fenêtre est dégagée.
 *
 *  - `inclinaison` 0-90°   : angle des lames sur leur axe horizontal.
 *                            0° = lames jointives, occultant ; 90° = lames
 *                            à plat, ouverture maximale entre elles.
 *
 * Une levée de 0 % avec une inclinaison de 75° décrit donc un volet
 * entièrement descendu dont les lames sont presque ouvertes.
 */

export const LEVEE_MIN = 0;
export const LEVEE_MAX = 100;
export const INCLINAISON_MIN = 0;
export const INCLINAISON_MAX = 90;

export interface EtatVolet {
  levee: number;
  inclinaison: number;
}

export function bornerLevee(valeur: number): number {
  return Math.min(LEVEE_MAX, Math.max(LEVEE_MIN, valeur));
}

export function bornerInclinaison(valeur: number): number {
  return Math.min(INCLINAISON_MAX, Math.max(INCLINAISON_MIN, valeur));
}

/**
 * TAUX D'OUVERTURE affiché à l'utilisateur.
 *
 * C'est un INDICATEUR D'INTERFACE, pas une grandeur physique : il répond à
 * la question « quelle part de la fenêtre laisse passer la lumière ? » de
 * façon compréhensible, sans prétendre modéliser une transmission lumineuse.
 *
 * Règle retenue, volontairement simple et explicable :
 *  - la part de fenêtre dégagée par la levée compte pour ce qu'elle est,
 *    elle est totalement ouverte ;
 *  - la part encore couverte par le tablier ne laisse passer que ce que
 *    l'angle des lames autorise, soit `inclinaison / 90`.
 *
 * D'où : ouverture = levée + (1 − levée) × (inclinaison / 90).
 *
 * Conséquences vérifiables : levée 100 % → 100 % quel que soit l'angle ;
 * levée 0 % et lames fermées → 0 % ; levée 0 % et lames à plat → 100 %,
 * ce qui est cohérent avec un volet descendu mais grand ouvert entre lames.
 */
export function tauxOuverture({ levee, inclinaison }: EtatVolet): number {
  const l = bornerLevee(levee) / 100;
  const i = bornerInclinaison(inclinaison) / INCLINAISON_MAX;
  return Math.round((l + (1 - l) * i) * 100);
}

/** Libellé court de l'orientation, pour l'app et le hero. */
export function libelleInclinaison(inclinaison: number): string {
  const i = bornerInclinaison(inclinaison);
  if (i <= 10) return "Occultant";
  if (i <= 40) return "Lumière tamisée";
  if (i <= 70) return "Lumière filtrée";
  return "Ouvert";
}

/** Libellé court de la levée. */
export function libelleLevee(levee: number): string {
  const l = bornerLevee(levee);
  if (l <= 2) return "Tablier descendu";
  if (l >= 98) return "Tablier relevé";
  return `Tablier relevé à ${Math.round(l)} %`;
}

/**
 * Scénario automatique : ce que le mode auto ferait d'un volet exposé au
 * soleil au fil de la journée. Progressif par construction — aucune bascule
 * brutale d'une heure à l'autre.
 *
 * Le raisonnement, en clair :
 *  - nuit et petit matin frais → tablier relevé, on laisse entrer l'air ;
 *  - le soleil monte → les lames commencent à s'incliner ;
 *  - forte chaleur → tablier descendu et lames fermées ;
 *  - le soleil baisse → les lames se rouvrent ;
 *  - la nuit revient, plus fraîche → le tablier remonte.
 */
export function voletAutomatique(heure: number, luminosite: number, ecartExtInt: number): EtatVolet {
  // `chaleur` : 0 quand l'extérieur est plus frais que l'intérieur, 1 quand
  // il le dépasse nettement (8 °C d'écart ou plus).
  const chaleur = Math.min(1, Math.max(0, ecartExtInt / 8));
  // `soleil` : part de la contrainte due à la lumière directe.
  const soleil = Math.min(1, Math.max(0, luminosite));

  // La contrainte combine les deux, le thermique pesant davantage.
  const contrainte = Math.min(1, chaleur * 0.65 + soleil * 0.35);

  // Plus la contrainte est forte, plus le tablier descend et plus les lames
  // se ferment. Le tablier ne descend vraiment qu'au-delà d'une contrainte
  // moyenne : on préfère d'abord jouer sur l'angle des lames.
  const levee = bornerLevee(100 - Math.max(0, (contrainte - 0.35) / 0.65) * 100);
  const inclinaison = bornerInclinaison(INCLINAISON_MAX * (1 - contrainte));

  return { levee, inclinaison };
}

/**
 * État de la fenêtre motorisée dans le scénario automatique. Volontairement
 * en trois états discrets : l'actionneur ne justifie pas d'afficher un
 * pourcentage d'ouverture au centimètre.
 */
export type EtatFenetre = "fermee" | "entrouverte" | "ouverte";

export function fenetreAutomatique(ecartExtInt: number): EtatFenetre {
  // L'extérieur est plus chaud : on garde fermé.
  if (ecartExtInt > 0.5) return "fermee";
  // L'extérieur est nettement plus frais : on ouvre pour ventiler.
  if (ecartExtInt < -2) return "ouverte";
  return "entrouverte";
}

export const LIBELLE_FENETRE: Record<EtatFenetre, string> = {
  fermee: "Fermée",
  entrouverte: "Entrouverte",
  ouverte: "Ouverte",
};
