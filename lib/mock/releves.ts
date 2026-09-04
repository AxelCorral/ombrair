/**
 * Séries de relevés simulées, dérivées du même scénario que le reste de
 * `lib/mock`. La courbe 24 h est la référence : ses valeurs à 08:00 et à
 * 22:00 correspondent aux croisements int/ext qui déclenchent les
 * événements d'ouverture et de fermeture du journal.
 */

export interface PointHoraire {
  heure: string;
  ext: number;
  int: number;
}

export const serie24h: PointHoraire[] = [
  { heure: "00h", ext: 25.9, int: 25.6 },
  { heure: "02h", ext: 23.8, int: 24.9 },
  { heure: "04h", ext: 22.3, int: 24.2 },
  { heure: "06h", ext: 21.8, int: 23.6 },
  { heure: "08h", ext: 24.1, int: 23.6 },
  { heure: "10h", ext: 28.9, int: 24.1 },
  { heure: "12h", ext: 32.7, int: 24.7 },
  { heure: "14h", ext: 35.6, int: 25.3 },
  { heure: "16h", ext: 37.2, int: 25.8 },
  { heure: "18h", ext: 35.4, int: 26.2 },
  { heure: "20h", ext: 31.2, int: 26.2 },
  { heure: "22h", ext: 26.4, int: 26.0 },
  { heure: "23h", ext: 25.2, int: 25.8 },
];

export interface PointJournalier {
  jour: string;
  ext: number;
  int: number;
}

/** Maximums quotidiens, du 15 au 21 août. */
export const serie7j: PointJournalier[] = [
  { jour: "15/08", ext: 31.4, int: 24.9 },
  { jour: "16/08", ext: 33.0, int: 25.1 },
  { jour: "17/08", ext: 34.6, int: 25.4 },
  { jour: "18/08", ext: 35.8, int: 25.6 },
  { jour: "19/08", ext: 36.5, int: 25.9 },
  { jour: "20/08", ext: 36.9, int: 26.2 },
  { jour: "21/08", ext: 37.2, int: 26.2 },
];

/** Maximums quotidiens, du 23 juillet au 21 août. */
export const serie30j: PointJournalier[] = [
  { jour: "23/07", ext: 30.1, int: 24.4 },
  { jour: "24/07", ext: 31.6, int: 24.7 },
  { jour: "25/07", ext: 32.9, int: 25.0 },
  { jour: "26/07", ext: 29.4, int: 24.6 },
  { jour: "27/07", ext: 27.2, int: 24.1 },
  { jour: "28/07", ext: 28.8, int: 24.2 },
  { jour: "29/07", ext: 31.1, int: 24.5 },
  { jour: "30/07", ext: 33.4, int: 25.0 },
  { jour: "31/07", ext: 34.2, int: 25.3 },
  { jour: "01/08", ext: 33.8, int: 25.4 },
  { jour: "02/08", ext: 30.6, int: 24.9 },
  { jour: "03/08", ext: 26.9, int: 24.0 },
  { jour: "04/08", ext: 25.4, int: 23.6 },
  { jour: "05/08", ext: 27.8, int: 23.9 },
  { jour: "06/08", ext: 30.2, int: 24.3 },
  { jour: "07/08", ext: 32.5, int: 24.8 },
  { jour: "08/08", ext: 34.0, int: 25.2 },
  { jour: "09/08", ext: 35.1, int: 25.5 },
  { jour: "10/08", ext: 33.6, int: 25.3 },
  { jour: "11/08", ext: 29.9, int: 24.7 },
  { jour: "12/08", ext: 28.4, int: 24.3 },
  { jour: "13/08", ext: 29.7, int: 24.5 },
  { jour: "14/08", ext: 30.8, int: 24.7 },
  { jour: "15/08", ext: 31.4, int: 24.9 },
  { jour: "16/08", ext: 33.0, int: 25.1 },
  { jour: "17/08", ext: 34.6, int: 25.4 },
  { jour: "18/08", ext: 35.8, int: 25.6 },
  { jour: "19/08", ext: 36.5, int: 25.9 },
  { jour: "20/08", ext: 36.9, int: 26.2 },
  { jour: "21/08", ext: 37.2, int: 26.2 },
];

/**
 * Indicateurs de surchauffe évitée. Ce sont des ESTIMATIONS issues d'une
 * comparaison avec un scénario simulé, pas des mesures : le logement de
 * référence n'existe pas, il est modélisé. La méthode est affichée à côté
 * du chiffre partout où il apparaît.
 */
export const surchauffeEvitee = {
  ecartMaxEviteC: 4.2,
  heureEcartMax: "16h",
  degresHeuresEvitesJour: 34,
  degresHeuresEvites7j: 212,
  seuilInconfortC: 26,
  methode: [
    "Un « degré-heure de surchauffe » compte chaque heure passée au-dessus de 26 °C, multipliée par le nombre de degrés au-dessus de ce seuil.",
    "Le chiffre affiché est la différence entre le logement piloté par Ombrair et un scénario de comparaison où les volets resteraient ouverts toute la journée.",
    "Ce scénario de comparaison est modélisé, pas mesuré : il repose sur l'hypothèse qu'un logement de même inertie, volets ouverts, suivrait la température extérieure avec un retard d'environ deux heures.",
    "Le résultat est donc un ordre de grandeur pour situer l'effet du pilotage, pas une performance garantie.",
  ],
} as const;
