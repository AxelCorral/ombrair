/**
 * Logique du simulateur d'orientation. Fonctions pures, testées.
 *
 * ────────────────────────────────────────────────────────────────────────
 * CE QUE CE SIMULATEUR CALCULE — ET CE QU'IL REFUSE DE CALCULER
 *
 * Le brief demandait quatre sorties : gamme recommandée, fourchette de
 * prix, gain de confort en °C et économie de climatisation en euros.
 *
 * Deux sont produites ici :
 *
 *  - LA RECOMMANDATION découle d'une règle explicite et vérifiable : elle
 *    dépend de ce que le logement possède déjà. Aucune part d'invention.
 *
 *  - LA FOURCHETTE DE PRIX est une multiplication des tarifs publiés dans
 *    `lib/tarifs.ts` par le nombre d'ouvrants. Ces tarifs sont donnés « par
 *    ouvrant posé » : les multiplier n'invente rien, c'est l'arithmétique
 *    de leur propre unité. Aucun prix au cm², aucune remise fabriquée.
 *
 * Deux sont volontairement ABSENTES :
 *
 *  - LE GAIN DE CONFORT EN °C supposerait un modèle thermique du bâtiment
 *    (inertie, surface vitrée, facteur solaire, renouvellement d'air). Le
 *    projet n'en a aucun. Afficher « −4,2 °C » donnerait à une invention
 *    l'apparence d'une mesure.
 *
 *  - L'ÉCONOMIE DE CLIMATISATION supposerait en plus un équipement, un
 *    usage et un prix du kWh. Même raison, en pire.
 *
 * L'interface dit explicitement pourquoi ces deux chiffres manquent. Un
 * blanc assumé vaut mieux qu'un nombre fabriqué.
 * ────────────────────────────────────────────────────────────────────────
 */

// Import relatif avec extension : ce module est aussi chargé par le runner
// de tests de Node, qui ne connaît pas l'alias `@/`.
import { gammeParId, type GammeId } from "./tarifs.ts";
import {
  formatPrix,
  getBundleSavings,
  getPrixInstallation,
  getPrixProduit,
  getTotalConfigure,
  offreParId,
  trouverPack,
  type OffreId,
} from "./offres.ts";

/** Ce que le logement possède déjà — le seul critère qui décide du produit. */
export type Situation =
  | "volets-motorises"
  | "volets-manuels"
  | "sans-volets"
  | "renovation-fenetres";

export type Orientation = "sud" | "ouest" | "est" | "nord";
export type TypeLogement = "appartement" | "maison";

export interface EntreeSimulation {
  situation: Situation;
  /** Nombre d'ouvrants à équiper. Borné à [1, 20] par `bornerOuvrants`. */
  nbOuvrants: number;
  orientation: Orientation;
  typeLogement: TypeLogement;
}

export interface Estimation {
  /** Total « à partir de », en euros. */
  montantMin: number;
  /** Détail du calcul, affiché tel quel sous le montant. */
  detail: string;
}

export interface Resultat {
  gammeId: GammeId;
  nomGamme: string;
  href: string;
  /** Pourquoi ce produit, en une phrase. */
  raison: string;
  /** `null` quand aucun tarif publié ne couvre le cas → sur devis. */
  estimation: Estimation | null;
  /** Ce qui ne peut pas être chiffré à ce stade. */
  surDevis: string[];
  /** Remarque qualitative liée à l'orientation. Jamais un chiffre. */
  noteOrientation: string;
  /** Remarque qualitative liée au type de logement. */
  noteLogement: string;
  hypotheses: string[];
}

export const NB_OUVRANTS_MIN = 1;
export const NB_OUVRANTS_MAX = 20;

export function bornerOuvrants(n: number): number {
  if (!Number.isFinite(n)) return NB_OUVRANTS_MIN;
  return Math.min(NB_OUVRANTS_MAX, Math.max(NB_OUVRANTS_MIN, Math.round(n)));
}

export function formatEuros(montant: number): string {
  // Espace fine insécable avant le symbole : typographie française, et le
  // montant ne se coupe jamais en fin de ligne.
  return `${montant.toLocaleString("fr-FR")} €`;
}

/*
 * ════════════════════════════════════════════════════════════════════════
 * PLUS AUCUN TARIF RECOPIÉ ICI.
 *
 * Ce fichier portait un `TARIFS_NUMERIQUES` qui redéclarait 349, 39, 690 et
 * 1590 « parce que `lib/tarifs.ts` stocke des chaînes prêtes à afficher ».
 * Un test vérifiait la correspondance, ce qui limitait les dégâts sans
 * supprimer la duplication.
 *
 * La nouvelle grille stocke des CENTIMES ENTIERS dans `lib/offres.ts` : le
 * simulateur les lit directement, et la duplication n'a plus de raison
 * d'être. Deux montants vivaient aussi en toutes lettres dans des phrases
 * (« 149 € forfait », « pack 4 ouvrants à 2 890 € ») ; ils sont désormais
 * construits à partir du modèle ou ont disparu avec les offres qu'ils
 * décrivaient.
 * ════════════════════════════════════════════════════════════════════════
 */

const NOTES_ORIENTATION: Record<Orientation, string> = {
  sud: "Une façade sud reçoit le soleil au plus haut, autour de la mi-journée. C'est l'orientation où la fermeture anticipée du matin change le plus les choses.",
  ouest:
    "Une façade ouest surchauffe en fin d'après-midi, souvent au moment où l'on rentre. Le pilotage automatique agit pendant que le logement est encore vide.",
  est: "Une façade est prend le soleil tôt. La chaleur s'installe dès la matinée, puis la pièce reste chaude toute la journée si rien n'a été fermé.",
  nord: "Une façade nord reçoit peu de soleil direct. Le bénéfice viendra surtout de la ventilation nocturne, moins de la protection solaire.",
};

const NOTES_LOGEMENT: Record<TypeLogement, string> = {
  appartement:
    "En appartement, la ventilation traversante n'est pas toujours possible : le rafraîchissement nocturne dépend du nombre de façades ouvrables.",
  maison:
    "En maison, plusieurs façades permettent en général une circulation d'air nocturne d'une pièce à l'autre.",
};

const RAISONS: Record<Situation, { gammeId: GammeId; raison: string }> = {
  "volets-motorises": {
    gammeId: "capteur",
    raison:
      "Vos volets sont déjà motorisés : il ne manque que la mesure et la décision. Les capteurs se greffent sur l'existant, sans remplacer un seul volet.",
  },
  "volets-manuels": {
    gammeId: "volet",
    raison:
      "Des volets manuels ne peuvent pas être pilotés à distance : il faut d'abord poser des volets motorisés, que le système Ombrair commande ensuite.",
  },
  "sans-volets": {
    gammeId: "volet",
    raison:
      "Sans protection solaire, la priorité est de poser des volets motorisés. Ils apportent l'ombre, et le système leur donne le bon moment.",
  },
  "renovation-fenetres": {
    gammeId: "fenetre",
    raison:
      "Puisque les menuiseries sont de toute façon à changer, une fenêtre motorisée évite un second chantier et permet la ventilation automatique.",
  },
};

const HYPOTHESES_COMMUNES = [
  "L'estimation multiplie le prix du produit par le nombre d'ouvrants indiqué, puis ajoute l'installation Ombrair si elle est retenue. Le montant réel dépend de l'état du support et du type de pose.",
  "Aucun prix n'est calculé au centimètre ou au mètre carré : Ombrair ne publie pas de barème dimensionnel.",
  "Ce simulateur ne donne ni gain de confort en °C ni économie de climatisation en euros. Les deux exigeraient un modèle thermique du logement que ce projet n'a pas ; un chiffre inventé ressemblerait à une mesure.",
  "Aucune donnée climatique locale n'est utilisée : la recommandation dépend de votre installation actuelle, pas de votre commune.",
  "Le résultat est une orientation, pas un devis. Seule une visite technique permet de confirmer la faisabilité et le montant.",
];

/**
 * Estimation pour le capteur.
 *
 * L'ancienne formule « kit de base + modules au-delà des deux inclus » n'a
 * plus d'objet : la nouvelle unité de vente est LE capteur, et il en faut un
 * par ouvrant suivi. Le calcul devient donc le même que pour les autres
 * produits — ce qui est aussi plus facile à expliquer.
 */
export function estimationCapteur(nbOuvrants: number, avecInstallation = false): Estimation {
  return estimationParOuvrant("capteur", nbOuvrants, avecInstallation);
}

/**
 * Estimation pour une offre facturée à l'unité.
 *
 * `montantMin` reste le nom du champ : c'est bien un plancher, puisque
 * l'estimation ignore les contraintes de chantier. Il est calculé en
 * centimes puis converti, pour ne pas réintroduire de dérive de virgule
 * flottante entre le simulateur et le reste du site.
 */
export function estimationParOuvrant(
  offre: OffreId,
  nbOuvrants: number,
  avecInstallation = false
): Estimation {
  const n = bornerOuvrants(nbOuvrants);
  const cents = getTotalConfigure(offre, { avecInstallation, quantite: n });
  const unitaire = getPrixProduit(offre);
  const pose = getPrixInstallation(offre);

  const detail = avecInstallation
    ? `${n} × (${formatPrix(unitaire)} + ${formatPrix(pose)} d'installation Ombrair).`
    : `${n} × ${formatPrix(unitaire)}, sans installation Ombrair.`;

  return { montantMin: cents / 100, detail };
}

export function simuler(entree: EntreeSimulation): Resultat {
  const n = bornerOuvrants(entree.nbOuvrants);
  const { gammeId, raison } = RAISONS[entree.situation];
  const gamme = gammeParId(gammeId);

  /*
   * L'estimation porte sur le PRODUIT SEUL : le simulateur oriente vers une
   * gamme, il ne présume pas du choix d'installation, qui se fait au devis.
   * Le coût de la pose est annoncé à part, dérivé de la grille.
   */
  const estimation: Estimation = estimationParOuvrant(gammeId, n, false);
  const surDevis: string[] = [
    `L'installation Ombrair est optionnelle : ${formatPrix(getPrixInstallation(gammeId))} ${offreParId(gammeId).unite}, à décider après le choix du produit.`,
  ];

  /*
   * Bascule vers le pack. Si un pack associe la gamme recommandée à un
   * capteur, il est signalé avec son économie CALCULÉE — jamais un montant
   * écrit à la main.
   */
  const pack = gammeId === "capteur" ? null : trouverPack(["capteur", gammeId]);
  if (pack) {
    surDevis.push(
      `${pack.nom} — ${formatPrix(pack.prixProduitCents)} : ${formatPrix(getBundleSavings(pack.id))} de moins que le capteur et l'ouvrant achetés séparément.`
    );
  }

  if (gammeId === "volet") {
    surDevis.push(
      "La dépose de l'existant, l'accès en hauteur et les formats hors standard peuvent faire varier le montant."
    );
  } else if (gammeId === "fenetre") {
    surDevis.push(
      "TVA 5,5 % et aides à la rénovation énergétique (MaPrimeRénov', CEE) sous conditions, à confirmer selon votre situation."
    );
  }

  return {
    gammeId,
    nomGamme: gamme.nom,
    href: gamme.href,
    raison,
    estimation,
    surDevis,
    noteOrientation: NOTES_ORIENTATION[entree.orientation],
    noteLogement: NOTES_LOGEMENT[entree.typeLogement],
    hypotheses: HYPOTHESES_COMMUNES,
  };
}
