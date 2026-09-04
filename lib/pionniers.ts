import { type GammeId } from "./tarifs.ts";

/**
 * OMBRAIR PIONNIERS — source unique de vérité du programme.
 *
 * ════════════════════════════════════════════════════════════════════════
 * NATURE DU PROGRAMME
 *
 * Ombrair est un PROJET ÉTUDIANT FICTIF, et ce programme est lui aussi un
 * concept marketing fictif. Un Crédit Pionnier n'est pas un titre financier,
 * pas une action, pas une promesse de rendement. Aucune valeur monétaire
 * n'existe dans ce fichier, et il ne doit jamais en apparaître : ni prix du
 * crédit, ni valeur future estimée, ni multiplicateur, ni projection.
 *
 * C'est une règle d'architecture autant qu'une règle éditoriale — s'il n'y a
 * aucun montant dans la source de vérité, aucune page ne peut en afficher.
 * ════════════════════════════════════════════════════════════════════════
 *
 * LE PRINCIPE, EN UNE LIGNE
 *
 *   1 capteur Ombrair acheté = 1 Crédit Pionnier
 *
 * Ombrair Link n'est PAS un capteur : c'est la passerelle qui les relie.
 * Les modules de pilotage ne sont PAS des capteurs : ils actionnent un
 * volet, ils ne mesurent rien. Ni l'un ni l'autre ne génère de crédit.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Configuration
 * ───────────────────────────────────────────────────────────────────────── */

export interface ProgrammePionniers {
  nom: string;
  /** Nombre de crédits accordés par capteur éligible. */
  creditsParCapteur: number;
  /** Un crédit est-il présenté comme cessible ? Non : ce n'est pas un actif. */
  cessible: boolean;
  /**
   * Valeur financière actuelle d'un crédit. Volontairement `null`, et
   * volontairement typé `null` : le type interdit d'y mettre un nombre.
   */
  valeurFinanciereActuelle: null;
}

export const programmePionniers: ProgrammePionniers = {
  nom: "Ombrair Pionniers",
  creditsParCapteur: 1,
  cessible: false,
  valeurFinanciereActuelle: null,
};

/* ─────────────────────────────────────────────────────────────────────────
 * Calcul
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Crédits générés par un nombre de capteurs éligibles.
 *
 * Fonction pure, sans dépendance à React, testée à côté. Les entrées
 * absurdes — négatif, fractionnaire, NaN — rendent 0 plutôt que de propager
 * une valeur douteuse jusqu'à l'affichage.
 */
export function getCreditsPionniers(nombreCapteurs: number): number {
  if (!Number.isFinite(nombreCapteurs) || nombreCapteurs <= 0) return 0;
  return Math.floor(nombreCapteurs) * programmePionniers.creditsParCapteur;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Capteurs éligibles par produit
 *
 * POURQUOI CES NOMBRES SONT ÉCRITS ICI, ET PAS DÉDUITS PAR ANALYSE DE TEXTE.
 *
 * Les quantités vivent dans des phrases de `lib/tarifs.ts` (« 1 capteur
 * extérieur », « 2 capteurs intérieurs »). Les extraire par expression
 * régulière marcherait aujourd'hui et casserait silencieusement à la
 * première reformulation — en affichant un mauvais nombre de crédits, ce qui
 * est pire que de ne rien afficher.
 *
 * Ils sont donc déclarés explicitement, chacun avec la phrase exacte dont il
 * est tiré. Un test de garde relit `lib/tarifs.ts` et échoue si ces phrases
 * changent : la divergence devient une erreur de build, pas un défaut
 * silencieux en production.
 *
 * `null` signifie « indéterminable » et non « zéro ». Une page qui reçoit
 * `null` n'affiche RIEN — c'est la règle du brief : ne montrer le nombre de
 * crédits que s'il peut être établi sans ambiguïté.
 * ───────────────────────────────────────────────────────────────────────── */

export interface CapteursProduit {
  /** Capteurs compris dans l'offre de base. `null` = indéterminable. */
  base: number | null;
  /** Capteurs compris dans le pack, quand le pack en annonce un nombre. */
  pack: number | null;
  /** La phrase de `lib/tarifs.ts` d'où vient le compte, pour le test de garde. */
  source: string;
}

export const CAPTEURS_PAR_GAMME: Record<GammeId, CapteursProduit> = {
  /*
   * Capteur Ombrair — la nouvelle unité de vente est LE capteur. Un produit
   * « Capteur » acheté vaut donc UN capteur, et un seul Crédit Pionnier.
   *
   * C'est un changement par rapport au modèle précédent, où le « Kit
   * Capteur » en contenait trois et valait trois crédits. Le programme n'a
   * pas changé de règle — c'est le produit qui a changé de définition.
   */
  capteur: {
    base: 1,
    pack: null,
    source: "Un capteur Ombrair (température, humidité, luminosité)",
  },

  /*
   * Volet Ombrair — aucun capteur : le produit apporte un « Module de
   * commande Ombrair », qui actionne sans mesurer. Le pack Capteur + Volet,
   * lui, contient un capteur : voir CAPTEURS_PAR_PACK.
   */
  volet: {
    base: 0,
    pack: null,
    source: "Module de commande Ombrair et intégration à l'application",
  },

  /*
   * Fenêtre Ombrair — même situation que le volet : un actionneur et un
   * module de commande, aucun capteur.
   */
  fenetre: {
    base: 0,
    pack: null,
    source: "Module de commande Ombrair et intégration à l'application",
  },
};

/**
 * Capteurs compris dans les packs.
 *
 * Chaque pack associe UN capteur à un ouvrant — c'est ce que dit
 * `produitsInclus` dans `lib/offres.ts`. Le compte est donc dérivé, pas
 * déclaré : si la composition d'un pack changeait, le nombre de crédits
 * suivrait sans intervention.
 */
export function capteursDuPack(produitsInclus: readonly GammeId[]): number {
  return produitsInclus.filter((p) => (CAPTEURS_PAR_GAMME[p]?.base ?? 0) > 0).length;
}

/*
 * Il n'existe plus d'options vendues à l'unité : les anciens tarifs
 * « capteur intérieur supplémentaire » et « module de pilotage
 * supplémentaire » ne figurent pas dans la nouvelle grille, et aucun prix ne
 * leur a été réattribué. Un capteur de plus s'achète simplement comme un
 * capteur de plus — et vaut donc un crédit de plus, par la règle générale.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Wording — une seule formulation principale, réutilisée partout
 * ───────────────────────────────────────────────────────────────────────── */

export const wordingPionniers = {
  surtitre: "Ombrair Pionniers",
  /** La formulation principale. Une seule, pour ne pas saturer le site. */
  accroche: "Les premiers devraient compter davantage.",
  principe: "1 capteur = 1 Crédit Pionnier",
  /** Sous-titre du hero de `/pionniers` et de la section d'accueil. */
  sousTitre:
    "Chaque capteur Ombrair acheté génère un Crédit Pionnier associé à votre compte.",
  /** Formule courte pour les emplacements contraints (carte produit). */
  mentionCourte: "+ 1 Crédit Pionnier par capteur",
  cta: "Découvrir le programme",
} as const;

/**
 * L'introduction en Bourse, expliquée à quelqu'un qui n'est pas financier.
 * Une phrase, pas un cours de finance.
 */
export const definitionIpo =
  "Une introduction en Bourse correspond au moment où une entreprise décide de rendre une partie de son capital accessible sur un marché financier.";

/**
 * Réponse à la question qu'il serait malhonnête d'éviter. Aucun
 * remboursement n'est promis, aucune valeur de repli n'est suggérée.
 */
export const siPasDIpo =
  "Les Crédits Pionniers ne garantissent aucune introduction en Bourse. Si aucune opération permettant leur conversion n'a lieu, ils restent simplement la trace de votre participation au programme Pionniers et n'ont pas de valeur financière garantie.";

/**
 * Avertissement affiché en toutes lettres, jamais en corps minuscule.
 *
 * Aucune prétention juridique : le texte ne dit pas que le mécanisme est
 * validé, conforme à un article précis ou approuvé par une autorité. Il
 * reste au conditionnel, ce qui est la seule formulation honnête pour un
 * dispositif qui n'existe pas.
 */
export const disclaimerPionniers = {
  titre: "Programme conceptuel — projet étudiant fictif.",
  texte:
    "Les Crédits Pionniers ne constituent pas aujourd'hui des actions, des titres financiers ou une promesse de rendement. Toute éventuelle attribution future resterait conditionnée à la réalisation d'une opération permettant cette attribution et au cadre juridique, fiscal et opérationnel applicable à cette date.",
} as const;

/** Mention accompagnant l'exemple pédagogique, pour qu'il ne se lise pas comme une offre. */
export const mentionExemple =
  "Cet exemple illustre uniquement le fonctionnement du programme. Il ne représente aucune valeur financière future.";

/* ─────────────────────────────────────────────────────────────────────────
 * Les trois temps du programme
 * ───────────────────────────────────────────────────────────────────────── */

export const etapesPionniers = [
  {
    titre: "Vous équipez votre logement",
    texte:
      "Chaque capteur Ombrair acheté est enregistré au titre du programme, qu'il vienne du kit ou d'un ajout ultérieur.",
  },
  {
    titre: "Vous accumulez des Crédits Pionniers",
    texte:
      "Un capteur éligible donne un Crédit Pionnier. Le crédit reste associé à votre compte client : il n'est ni vendu, ni échangé, ni transféré.",
  },
  {
    titre: "Si Ombrair entre un jour en Bourse",
    texte:
      "Ces crédits pourraient ouvrir droit à une attribution d'actions, selon la structure de l'opération et les conditions juridiques, fiscales et opérationnelles applicables à cette date.",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
 * FAQ
 * ───────────────────────────────────────────────────────────────────────── */

export const faqPionniers = [
  {
    question: "Une action m'est-elle attribuée dès l'achat ?",
    reponse:
      "Non. Aucune action n'est attribuée aujourd'hui. Un Crédit Pionnier enregistre votre participation au programme, rien de plus.",
  },
  {
    question: "Une introduction en Bourse est-elle prévue ou garantie ?",
    reponse:
      "Non. Aucune opération n'est planifiée ni garantie. Le programme est écrit au conditionnel parce que c'est la seule formulation honnête.",
  },
  {
    question: "Combien de Crédits Pionniers puis-je recevoir ?",
    reponse:
      "Un par capteur éligible acheté. Ombrair Link et les modules de pilotage ne sont pas des capteurs : ils ne génèrent pas de crédit.",
  },
  {
    question: "Trois capteurs donnent-ils trois crédits ?",
    reponse:
      "Oui. Le compte suit les capteurs, pas les commandes : trois capteurs achetés donnent trois Crédits Pionniers, qu'ils figurent sur une seule commande ou sur plusieurs.",
  },
  {
    question: "Un pack donne-t-il plusieurs crédits ?",
    reponse:
      "Non. Le Pack Capteur + Volet et le Pack Capteur + Fenêtre comprennent chacun un capteur, donc un Crédit Pionnier. Le volet et la fenêtre actionnent, ils ne mesurent pas.",
  },
  {
    question: "Les crédits ont-ils une valeur financière aujourd'hui ?",
    reponse:
      "Non. Un Crédit Pionnier n'a aucune valeur financière garantie, ni aujourd'hui ni à terme. Aucune valorisation n'est publiée, parce qu'il n'en existe aucune.",
  },
  {
    question: "Puis-je vendre un Crédit Pionnier ?",
    reponse:
      "Non. Dans ce concept, le crédit est associé au client et n'est pas présenté comme un actif négociable.",
  },
  {
    question: "Que se passerait-il en cas d'introduction en Bourse ?",
    reponse:
      "Les modalités seraient déterminées à ce moment-là, selon la structure de l'opération et le cadre juridique, fiscal et opérationnel applicable. Rien n'en est fixé aujourd'hui.",
  },
] as const;
