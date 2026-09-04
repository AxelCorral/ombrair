/**
 * SOURCE DE VÉRITÉ de la démonstration `/app`.
 *
 * Toutes les données de l'application sont simulées et dérivent de ce
 * scénario unique : un épisode de canicule à Toulouse, du 21 au 23 août.
 * Aucun relevé n'est réel. Chaque écran doit lire ces valeurs (ou les
 * valeurs dérivées des autres fichiers de `lib/mock`) plutôt que de
 * redéfinir ses propres constantes : un même événement doit raconter la
 * même histoire partout.
 */

export const MENTION_DEMO = "Données simulées — démonstration, pas des relevés réels.";

/** Instant de référence de la démo : jeudi 21 août 2026, 16h20. */
export const instant = {
  libelleJour: "jeudi 21 août",
  heure: "16:20",
  iso: "2026-08-21T16:20:00+02:00",
} as const;

export const meteo = {
  ville: "Toulouse",
  exterieurC: 37.2,
  humiditeExterieurePct: 28,
  /** Prévision du minimum de la nuit à venir. */
  minimumNuitPrevuC: 21.6,
  heureMinimumNuit: "05:40",
} as const;

export const alerteCanicule = {
  active: true,
  niveau: "Vigilance orange (simulée)",
  message: "Épisode de chaleur intense jusqu'à samedi. Les volets exposés restent fermés en journée.",
  jusquAu: "samedi 23 août",
} as const;

/**
 * Prochaine action planifiée par le mode auto, telle qu'affichée sur
 * l'accueil de l'app et sur la page vitrine « L'application ».
 */
export const prochaineAction = {
  heure: "22:40",
  libelle: "Ouverture générale",
  raison: "l'air extérieur devrait repasser sous la température intérieure",
} as const;
