/**
 * OFFRES COMMERCIALES — source unique de vérité tarifaire.
 *
 * ════════════════════════════════════════════════════════════════════════
 * DEUX PRIX DISTINCTS, JAMAIS CONFONDUS
 *
 *   PRIX PRODUIT        ce que coûte l'équipement
 *   PRIX INSTALLATION   ce que coûte la pose par Ombrair, TOUJOURS optionnelle
 *
 * L'installation n'est jamais incluse dans le prix affiché d'un produit, et
 * il n'existe pas deux références « volet seul » et « volet installé » : il
 * existe UN volet, puis un choix de pose.
 * ════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI DES CENTIMES ENTIERS ET PAS DES EUROS FLOTTANTS.
 *
 * En virgule flottante, `79.99 + 349.99` vaut `429.98000000000002`. L'écart
 * est invisible tant qu'on affiche deux décimales, et il fausse le calcul
 * dérivé de l'économie du pack — qui vaudrait `29.990000000000009 €`. Tous
 * les montants sont donc stockés en CENTIMES ENTIERS, additionnés en
 * entiers, et convertis en euros au seul moment de l'affichage.
 *
 * AUCUN PRIX N'EST DÉRIVÉ D'UN AUTRE, sauf les totaux et l'économie des
 * packs. En particulier, l'installation d'un pack a son propre tarif : elle
 * ne s'obtient pas en additionnant les installations des produits qui le
 * composent (119,99 + 179,99 = 299,98, alors que le tarif officiel du pack
 * Capteur + Volet est 179,99).
 */

export type ProduitId = "capteur" | "volet" | "fenetre";
export type PackId = "pack-capteur-volet" | "pack-capteur-fenetre";
export type OffreId = ProduitId | PackId;

export interface OffreCommerciale {
  id: OffreId;
  nom: string;
  /** Prix de l'équipement seul, en centimes. */
  prixProduitCents: number;
  /**
   * Prix de la pose par Ombrair, en centimes. Propre à l'offre : pour un
   * pack, ce n'est PAS la somme des installations de ses composants.
   */
  prixInstallationCents: number;
  type: "produit" | "pack";
  /** Les produits réellement livrés par cette offre. */
  produitsInclus: ProduitId[];
  /** L'unité de vente, telle qu'elle s'affiche sous le prix. */
  unite: string;
}

/**
 * La grille. Ces cinq entrées sont les seules offres tarifées du projet.
 *
 * UNITÉS DE VENTE : le capteur se vend au capteur, le volet et la fenêtre à
 * l'ouvrant. Un pack couvre un capteur et un ouvrant.
 */
export const OFFRES: Record<OffreId, OffreCommerciale> = {
  capteur: {
    id: "capteur",
    nom: "Capteur Ombrair",
    prixProduitCents: 7_999,
    prixInstallationCents: 11_999,
    type: "produit",
    produitsInclus: ["capteur"],
    unite: "par capteur",
  },
  volet: {
    id: "volet",
    nom: "Volet Ombrair",
    prixProduitCents: 34_999,
    prixInstallationCents: 17_999,
    type: "produit",
    produitsInclus: ["volet"],
    unite: "par ouvrant",
  },
  fenetre: {
    id: "fenetre",
    nom: "Fenêtre Ombrair",
    prixProduitCents: 149_999,
    prixInstallationCents: 49_999,
    type: "produit",
    produitsInclus: ["fenetre"],
    unite: "par ouvrant",
  },
  "pack-capteur-volet": {
    id: "pack-capteur-volet",
    nom: "Pack Capteur + Volet",
    prixProduitCents: 39_999,
    prixInstallationCents: 17_999,
    type: "pack",
    produitsInclus: ["capteur", "volet"],
    unite: "un capteur et un ouvrant",
  },
  "pack-capteur-fenetre": {
    id: "pack-capteur-fenetre",
    nom: "Pack Capteur + Fenêtre",
    prixProduitCents: 154_999,
    prixInstallationCents: 49_999,
    type: "pack",
    produitsInclus: ["capteur", "fenetre"],
    unite: "un capteur et un ouvrant",
  },
};

export const PRODUITS: ProduitId[] = ["capteur", "volet", "fenetre"];
export const PACKS: PackId[] = ["pack-capteur-volet", "pack-capteur-fenetre"];

export function offreParId(id: OffreId): OffreCommerciale {
  const offre = OFFRES[id];
  if (!offre) throw new Error(`Offre inconnue : ${id}`);
  return offre;
}

export function estPack(id: OffreId): id is PackId {
  return OFFRES[id]?.type === "pack";
}

/* ─────────────────────────────────────────────────────────────────────────
 * Calculs — tous en centimes entiers
 * ───────────────────────────────────────────────────────────────────────── */

export function getPrixProduit(id: OffreId): number {
  return offreParId(id).prixProduitCents;
}

export function getPrixInstallation(id: OffreId): number {
  return offreParId(id).prixInstallationCents;
}

/**
 * Total d'une configuration : le produit, plus l'installation si elle est
 * retenue. `quantite` multiplie l'ensemble — un volet posé sur trois
 * ouvrants, c'est trois fois le couple produit + pose.
 */
export function getTotalConfigure(
  id: OffreId,
  options: { avecInstallation: boolean; quantite?: number } = { avecInstallation: false }
): number {
  const quantite = Math.max(1, Math.floor(options.quantite ?? 1));
  const unitaire =
    getPrixProduit(id) + (options.avecInstallation ? getPrixInstallation(id) : 0);
  return unitaire * quantite;
}

/**
 * Économie d'un pack par rapport à l'achat séparé de ses composants.
 *
 * DÉRIVÉE, jamais écrite en dur : si un prix de la grille change, l'économie
 * affichée suit sans qu'on ait à y penser. Elle porte sur le PRODUIT seul —
 * l'installation du pack étant un tarif propre, la comparer à la somme des
 * installations individuelles n'aurait pas de sens commercial.
 *
 * Rend `0` pour un produit simple, et jamais un nombre négatif.
 */
export function getBundleSavings(id: OffreId): number {
  const offre = offreParId(id);
  if (offre.type !== "pack") return 0;
  const separe = offre.produitsInclus.reduce((somme, p) => somme + getPrixProduit(p), 0);
  return Math.max(0, separe - offre.prixProduitCents);
}

/** Prix cumulé des composants d'un pack achetés séparément. */
export function getPrixSepare(id: PackId): number {
  return offreParId(id).produitsInclus.reduce((somme, p) => somme + getPrixProduit(p), 0);
}

/**
 * Le pack qui contient exactement cet ensemble de produits, s'il existe.
 *
 * Sert à la bascule automatique : quelqu'un qui a un capteur et ajoute un
 * volet doit se voir proposer le pack plutôt que la somme des deux.
 */
export function trouverPack(produits: ProduitId[]): OffreCommerciale | null {
  const cherche = [...new Set(produits)].sort().join("+");
  return (
    PACKS.map(offreParId).find(
      (pack) => [...pack.produitsInclus].sort().join("+") === cherche
    ) ?? null
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Suggestions — « Souvent choisi avec »
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Offres à suggérer après une sélection.
 *
 * AUCUNE STATISTIQUE. Le projet est fictif et ne dispose d'aucune donnée de
 * vente : écrire « 74 % des clients ajoutent » serait inventer une mesure.
 * Ces suggestions sont des associations logiques — la mesure complète un
 * ouvrant — et le libellé de section le dit ainsi.
 *
 * RÈGLES :
 *  - un pack déjà sélectionné ne repropose ni lui-même, ni ses composants ;
 *  - deux suggestions au maximum, pour ne pas virer au carrousel ;
 *  - un pack qui contient l'offre sélectionnée passe en premier, parce que
 *    c'est la suggestion qui fait économiser.
 */
export function getSuggestions(id: OffreId): OffreCommerciale[] {
  const offre = offreParId(id);
  const dejaCouverts = new Set(offre.produitsInclus);

  const candidats = (Object.keys(OFFRES) as OffreId[])
    .map(offreParId)
    .filter((c) => c.id !== offre.id)
    // Rien qui soit déjà entièrement couvert par la sélection.
    .filter((c) => !c.produitsInclus.every((p) => dejaCouverts.has(p)));

  const packsPertinents = candidats.filter(
    (c) => c.type === "pack" && c.produitsInclus.some((p) => dejaCouverts.has(p))
  );
  const autres = candidats.filter((c) => !packsPertinents.includes(c));

  return [...packsPertinents, ...autres].slice(0, 2);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Format monétaire
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Centimes → « 1 499,99 € ».
 *
 * Une seule fonction pour tout le site : séparateur de milliers en espace
 * insécable étroit, virgule décimale, symbole après le montant. Jamais
 * « 1499.99 € » ni « €1499 ».
 */
export function formatPrix(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** Variante sans décimales inutiles, pour les libellés « +0 € ». */
export function formatSupplement(cents: number): string {
  if (cents === 0) return "+0 €";
  return `+${formatPrix(cents)}`;
}
