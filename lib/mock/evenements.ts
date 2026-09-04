import { tousLesOuvrants } from "./logement";

/**
 * Journal des actions du 21 août — la source de vérité dont dérivent la
 * « dernière action » de chaque ouvrant, la superposition sur les courbes
 * d'historique et les notifications. Ne jamais réécrire une de ces trois
 * vues séparément : elles doivent toutes raconter la même histoire.
 */

export type TypeEvenement = "ouverture" | "fermeture" | "maintien" | "incident";

export interface Evenement {
  id: string;
  heure: string;
  type: TypeEvenement;
  /** Ouvrants concernés ; vide pour un incident matériel. */
  ouvrantIds: string[];
  libelle: string;
  raison: string;
  /** Renseigné quand l'action vient d'une personne et non du mode auto. */
  parQui?: string;
  /** Action survenue la veille au soir : elle explique l'état du matin,
   *  mais ne fait pas partie des actions de la journée en cours. */
  veille?: boolean;
}

export const evenementsDuJour: Evenement[] = [
  {
    id: "ev-2235-veille",
    heure: "22:35",
    type: "ouverture",
    ouvrantIds: tousLesOuvrants.map((o) => o.id),
    libelle: "Ouverture générale (la veille)",
    raison: "l'air extérieur est repassé sous la température intérieure (25,4 °C contre 26,0 °C)",
    veille: true,
  },
  {
    id: "ev-0730",
    heure: "07:30",
    type: "fermeture",
    ouvrantIds: ["chambre2-fenetre-est"],
    libelle: "Fermeture Chambre 2",
    raison: "soleil direct sur la façade est",
  },
  {
    id: "ev-0805",
    heure: "08:05",
    type: "fermeture",
    ouvrantIds: ["sejour-baie-sud", "chambre1-fenetre-sud"],
    libelle: "Fermeture Séjour et Chambre 1",
    raison: "l'extérieur a dépassé l'intérieur (24,1 °C contre 23,6 °C)",
  },
  {
    id: "ev-0915",
    heure: "09:15",
    type: "fermeture",
    ouvrantIds: ["bureau-fenetre-ouest"],
    libelle: "Fermeture Bureau",
    raison: "commande manuelle — l'ouvrant est resté en mode manuel depuis",
    parQui: "Sonia",
  },
  {
    id: "ev-1140",
    heure: "11:40",
    type: "fermeture",
    ouvrantIds: ["sejour-fenetre-ouest"],
    libelle: "Fermeture Séjour ouest",
    raison: "anticipation du soleil sur la façade ouest",
  },
  {
    id: "ev-1210",
    heure: "12:10",
    type: "maintien",
    ouvrantIds: ["cuisine-fenetre-nord"],
    libelle: "Cuisine maintenue à 30 %",
    raison: "façade nord sans soleil direct — l'air entrant reste plus frais que l'intérieur",
  },
  {
    id: "ev-1402",
    heure: "14:02",
    type: "incident",
    ouvrantIds: [],
    libelle: "Capteur Bureau hors ligne",
    raison: "plus de relevé reçu depuis 14:02 — dernière valeur connue conservée",
  },
];

/** Dernière action enregistrée pour un ouvrant donné. */
export function derniereActionPour(ouvrantId: string): Evenement | undefined {
  return [...evenementsDuJour].reverse().find((ev) => ev.ouvrantIds.includes(ouvrantId));
}

export type CategorieNotification = "alerte" | "materiel" | "action";

export interface Notification {
  id: string;
  heure: string;
  categorie: CategorieNotification;
  titre: string;
  detail: string;
  /** Événement d'origine, quand la notification en découle directement. */
  evenementId?: string;
  lue: boolean;
}

/**
 * Les notifications matérielles et d'action pointent vers l'événement dont
 * elles découlent : leur heure et leur libellé ne peuvent pas diverger.
 */
export const notifications: Notification[] = [
  {
    id: "notif-canicule",
    heure: "06:00",
    categorie: "alerte",
    titre: "Épisode de chaleur annoncé",
    detail:
      "Vigilance orange canicule simulée jusqu'à samedi. Le scénario Canicule a été activé automatiquement.",
    lue: true,
  },
  {
    id: "notif-fermeture-matin",
    heure: "08:05",
    categorie: "action",
    titre: "Séjour et Chambre 1 fermés",
    detail: "L'extérieur a dépassé l'intérieur (24,1 °C contre 23,6 °C).",
    evenementId: "ev-0805",
    lue: true,
  },
  {
    id: "notif-capteur-bureau",
    heure: "14:02",
    categorie: "materiel",
    titre: "Capteur Bureau hors ligne",
    detail:
      "Plus de relevé depuis 14:02. La pièce affiche sa dernière valeur connue et n'est plus pilotée automatiquement.",
    evenementId: "ev-1402",
    lue: false,
  },
  {
    id: "notif-batterie-chambre2",
    heure: "15:10",
    categorie: "materiel",
    titre: "Batterie faible — Chambre 2",
    detail: "Le module de la fenêtre est à 12 %. Prévoyez son remplacement dans les prochains jours.",
    lue: false,
  },
];

export const notificationsNonLues = notifications.filter((n) => !n.lue).length;
