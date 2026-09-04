/** Scénarios, règles et réglages de la démonstration. Données simulées. */

export interface Regle {
  declencheur: string;
  condition: string;
  action: string;
}

export interface Scenario {
  id: string;
  nom: string;
  actif: boolean;
  description: string;
  regles: Regle[];
}

export const scenarios: Scenario[] = [
  {
    id: "canicule",
    nom: "Canicule",
    actif: true,
    description: "Activé automatiquement à l'annonce d'un épisode de chaleur. Fermeture anticipée, ouverture nocturne prolongée.",
    regles: [
      {
        declencheur: "Température extérieure prévue > 33 °C",
        condition: "entre 7 h et 10 h",
        action: "fermer les ouvrants exposés au soleil",
      },
      {
        declencheur: "Extérieur plus frais que l'intérieur",
        condition: "après 21 h",
        action: "ouvrir tous les ouvrants non verrouillés",
      },
    ],
  },
  {
    id: "absence",
    nom: "Absence",
    actif: false,
    description: "Volets fermés et verrouillés, simulation de présence le soir.",
    regles: [
      {
        declencheur: "Activation du scénario",
        condition: "immédiat",
        action: "fermer et verrouiller tous les ouvrants",
      },
      {
        declencheur: "Tombée de la nuit",
        condition: "tous les jours",
        action: "simuler une présence (ouverture partielle aléatoire du séjour)",
      },
    ],
  },
  {
    id: "nuit-fraiche",
    nom: "Nuit fraîche",
    actif: false,
    description: "Rafraîchissement nocturne maximal quand la nuit le permet.",
    regles: [
      {
        declencheur: "Extérieur < intérieur − 2 °C",
        condition: "entre 22 h et 7 h",
        action: "ouvrir en grand les chambres et le séjour",
      },
    ],
  },
  {
    id: "teletravail",
    nom: "Télétravail",
    actif: false,
    description: "Garde le bureau lumineux sans le laisser surchauffer.",
    regles: [
      {
        declencheur: "Luminosité du bureau < seuil",
        condition: "entre 9 h et 18 h",
        action: "entrouvrir le volet du bureau à 40 %",
      },
    ],
  },
  {
    id: "vacances",
    nom: "Vacances",
    actif: false,
    description: "Absence longue durée : sécurité renforcée, alertes réduites au strict nécessaire.",
    regles: [
      {
        declencheur: "Activation du scénario",
        condition: "jusqu'à désactivation",
        action: "verrouiller tous les ouvrants et n'envoyer que les alertes de sécurité",
      },
    ],
  },
];

/** Réglages du mode auto, tels qu'affichés sur l'écran dédié. */
export const reglagesAuto = {
  plageRafraichissementNocturne: { debut: "21:30", fin: "07:00" },
  seuilEcartOuvertureC: 1.5,
  priorite: "confort" as "confort" | "economie",
  toleranceLuminosite:
    "Ne pas plonger le séjour dans le noir avant 14 h : le volet sud reste au minimum à 20 % tant que la pièce est occupée.",
};

export const reglagesSecurite = {
  verrouillageOuvrants: true,
  simulationPresence: false,
  detectionOuvertureForcee: true,
  fermetureSurAlerteVent: true,
  fermetureSurAlertePluie: true,
  codePinReglagesSensibles: true,
  seuilVentKmh: 60,
};

export interface AccesJournal {
  horodatage: string;
  qui: string;
  action: string;
}

export const journalAcces: AccesJournal[] = [
  { horodatage: "21/08 · 09:15", qui: "Sonia", action: "Fermeture manuelle du volet Bureau" },
  { horodatage: "21/08 · 06:02", qui: "Ombrair (auto)", action: "Activation du scénario Canicule" },
  { horodatage: "20/08 · 21:47", qui: "Julien", action: "Modification de la plage de rafraîchissement nocturne" },
  { horodatage: "19/08 · 18:30", qui: "Sonia", action: "Ajout de Léna au foyer (accès limité)" },
];
