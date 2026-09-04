/**
 * Contenu commercial des trois gammes Ombrair.
 *
 * ════════════════════════════════════════════════════════════════════════
 * LES PRIX NE SONT PLUS ICI.
 *
 * Depuis la migration vers le modèle « produit + installation optionnelle »,
 * toute la tarification vit dans `lib/offres.ts` : prix produit, prix de
 * pose, packs, économies, format monétaire. Ce fichier ne décrit plus que ce
 * qu'EST un produit — son rôle, ce qu'il contient, qui le fabrique, ses
 * formats, sa compatibilité.
 *
 * La séparation n'est pas cosmétique : c'est elle qui garantit qu'un prix ne
 * puisse pas exister à deux endroits. Un composant qui veut un montant passe
 * par `lib/offres.ts`, point.
 *
 * DISPARUS avec l'ancien modèle : `prixBase`, `prixEnsemble`, `pack`,
 * `optionsSupplementaires`, et les montants portés par `optionsInstallation`.
 * Les anciennes offres — kit capteur à 349 €, volet « à partir de 690 €
 * posé », fenêtre + volet à 1 590 €, packs 4 ouvrants à 2 890 € et 6 490 € —
 * n'existent plus.
 *
 * Les anciens tarifs à l'unité (capteur intérieur supplémentaire 49 €,
 * module de pilotage 39 €) ne figurent pas dans la nouvelle grille. Les
 * composants techniques correspondants restent mentionnés dans `inclus` là
 * où ils sont réellement livrés, mais AUCUN prix public ne leur est
 * réattribué — en inventer un serait fabriquer une donnée commerciale.
 * ════════════════════════════════════════════════════════════════════════
 *
 * UNITÉ DE VENTE. Le capteur se vend au capteur, le volet et la fenêtre à
 * l'ouvrant. Un « Capteur Ombrair » est donc UN capteur, et non plus un kit
 * en contenant plusieurs.
 *
 * Aucun prix ne dépend des dimensions : la grille n'en définit aucune
 * variation. Le format sélectionné cadre la demande, il ne chiffre rien.
 */

import type { ProduitId } from "./offres.ts";

export type GammeId = ProduitId;

/**
 * Un cas de figure d'installation. Ces entrées décrivent des SITUATIONS de
 * chantier — « vos volets sont déjà motorisés », « il faut déposer
 * l'existant » — et non des lignes tarifaires : depuis la nouvelle grille,
 * l'installation Ombrair a un prix unique par offre, porté par
 * `lib/offres.ts`. Elles ne comportent donc plus de montant.
 */
export interface OptionInstallation {
  id: string;
  label: string;
  description: string;
  /** Vrai quand l'option n'est pas réalisable dans tous les logements. */
  sousReserveCompatibilite?: boolean;
}

export interface DimensionOption {
  id: string;
  label: string;
  largeurCm: number;
  hauteurCm: number;
  type: "standard" | "sur-mesure";
}

/** Ce qu'Ombrair maîtrise réellement sur un produit donné. */
export interface Fabrication {
  concuParOmbrair: boolean;
  fabriqueParOmbrair: boolean;
  /** Formulation à réutiliser telle quelle dans les pages, sans la reformuler. */
  mention: string;
}

export interface Gamme {
  id: GammeId;
  nom: string;
  /** Deux verbes qui résument le rôle du produit — pas une performance. */
  role: string;
  accroche: string;
  description: string;
  /**
   * Ce que l'offre contient, en une ligne, à afficher juste sous le prix.
   * Sert à empêcher qu'un nom au singulier laisse croire à un objet unique.
   */
  resume: string;
  fabrication: Fabrication;
  /**
   * Identifiant de l'offre tarifaire correspondante dans `lib/offres.ts`.
   * C'est le seul lien entre le contenu produit et son prix.
   */
  offre: ProduitId;
  inclus: string[];
  optionsInstallation: OptionInstallation[];
  /** Renseigné seulement pour les produits qui se dimensionnent. */
  dimensions?: DimensionOption[];
  compatibilite?: string;
  href: `/gammes/${GammeId}`;
}

/**
 * Dimensions standard courantes des ouvrants en France. Elles servent à
 * cadrer une demande, pas à décrire un catalogue Ombrair : le sur-mesure
 * reste la règle dès qu'on sort de ces formats.
 */
const DIMENSIONS_VOLET: DimensionOption[] = [
  { id: "v-60x75", label: "Petite fenêtre", largeurCm: 60, hauteurCm: 75, type: "standard" },
  { id: "v-80x100", label: "Fenêtre courante", largeurCm: 80, hauteurCm: 100, type: "standard" },
  { id: "v-100x125", label: "Grande fenêtre", largeurCm: 100, hauteurCm: 125, type: "standard" },
  { id: "v-140x125", label: "Double vantail", largeurCm: 140, hauteurCm: 125, type: "standard" },
  { id: "v-180x215", label: "Porte-fenêtre", largeurCm: 180, hauteurCm: 215, type: "standard" },
  { id: "v-sur-mesure", label: "Sur mesure", largeurCm: 0, hauteurCm: 0, type: "sur-mesure" },
];

const DIMENSIONS_FENETRE: DimensionOption[] = [
  { id: "f-60x75", label: "Petite fenêtre", largeurCm: 60, hauteurCm: 75, type: "standard" },
  { id: "f-80x100", label: "Fenêtre courante", largeurCm: 80, hauteurCm: 100, type: "standard" },
  { id: "f-100x125", label: "Grande fenêtre", largeurCm: 100, hauteurCm: 125, type: "standard" },
  { id: "f-140x125", label: "Double vantail", largeurCm: 140, hauteurCm: 125, type: "standard" },
  { id: "f-180x215", label: "Porte-fenêtre", largeurCm: 180, hauteurCm: 215, type: "standard" },
  { id: "f-sur-mesure", label: "Sur mesure", largeurCm: 0, hauteurCm: 0, type: "sur-mesure" },
];

export const gammes: Gamme[] = [
  {
    id: "capteur",
    /*
     * « Kit Capteur Ombrair » est devenu « Capteur Ombrair » : la nouvelle
     * unité de vente est LE capteur, pas un kit en contenant plusieurs. Le
     * nom au singulier dit maintenant exactement ce qu'on achète.
     */
    nom: "Capteur Ombrair",
    role: "Mesurer · analyser",
    accroche: "La mesure, conçue par Ombrair",
    description:
      "Le capteur qui relève la température, l'humidité et la lumière — c'est lui qui permet au reste du système de décider du bon moment.",
    resume: "Un capteur Ombrair, relié au système et à l'application.",
    fabrication: {
      concuParOmbrair: true,
      fabriqueParOmbrair: true,
      mention:
        "Produit conçu et fabriqué par Ombrair — carte électronique, firmware et intégration logicielle compris. Les composants électroniques unitaires restent des composants fournisseurs.",
    },
    offre: "capteur",
    inclus: [
      "Un capteur Ombrair (température, humidité, luminosité)",
      "Fixation et pile",
      "Appairage guidé depuis l'application",
      "Intégration à Ombrair Link, la passerelle du système",
    ],
    optionsInstallation: [
      {
        id: "capteur-autonome",
        label: "Vous le posez",
        description:
          "Le capteur se place sans outil : on le fixe à l'emplacement voulu et l'appairage se fait dans l'application.",
      },
      {
        id: "capteur-technicien",
        label: "Un technicien Ombrair le pose",
        description:
          "Le technicien choisit l'emplacement de mesure, pose le capteur et vérifie la portée radio jusqu'à Ombrair Link.",
      },
      {
        id: "capteur-configuration",
        label: "Pose et réglage du mode auto",
        description:
          "Pose, puis réglage du mode automatique pièce par pièce et création des scénarios avec vous.",
      },
    ],
    compatibilite:
      "Le capteur dialogue en radio avec Ombrair Link, la passerelle du système. Les ouvrants pilotés doivent être motorisés, filaires ou radio.",
    href: "/gammes/capteur",
  },
  {
    id: "volet",
    nom: "Volet Ombrair",
    role: "Protéger · automatiser",
    accroche: "Le volet motorisé, connecté au système",
    description:
      "Un volet roulant motorisé, choisi chez un fabricant spécialisé et relié aux capteurs Ombrair.",
    resume: "Un volet roulant motorisé et connecté, par ouvrant.",
    fabrication: {
      concuParOmbrair: false,
      fabriqueParOmbrair: false,
      mention:
        "Volets et motorisations proviennent de fabricants spécialisés. Ombrair les sélectionne, les revend, les installe, les configure, les connecte et en assure la maintenance — mais ne les conçoit ni ne les fabrique.",
    },
    offre: "volet",
    inclus: [
      "Volet roulant motorisé",
      "Motorisation solaire ou filaire",
      "Coffre extérieur ou rénovation",
      "Module de commande Ombrair et intégration à l'application",
    ],
    dimensions: DIMENSIONS_VOLET,
    optionsInstallation: [
      {
        id: "volet-existant",
        label: "Vos volets sont déjà motorisés",
        description:
          "Le module de commande Ombrair se clipse dans le coffre existant : pas de nouveau volet à poser.",
        sousReserveCompatibilite: true,
      },
      {
        id: "volet-remplacement",
        label: "Il faut poser un volet",
        description: "Dépose de l'existant si besoin, pose du volet motorisé et raccordement.",
      },
      {
        id: "volet-complet",
        label: "Pose et mise en service complète",
        description:
          "Volet posé, capteur appairé, mode auto réglé avec vous pièce par pièce.",
      },
    ],
    compatibilite:
      "Les formats courants sont indiqués ci-dessous ; au-delà, la pose se fait sur mesure après relevé.",
    href: "/gammes/volet",
  },
  {
    id: "fenetre",
    nom: "Fenêtre Ombrair",
    role: "Ventiler · automatiser",
    accroche: "La fenêtre motorisée, intégrée au système",
    description:
      "Une fenêtre motorisée qui peut s'ouvrir seule quand l'air extérieur redevient plus frais que l'air intérieur.",
    resume: "Une fenêtre motorisée à contrôle solaire, par ouvrant.",
    fabrication: {
      concuParOmbrair: false,
      fabriqueParOmbrair: false,
      mention:
        "La menuiserie et l'actionneur proviennent de fabricants spécialisés. Ombrair les sélectionne, les revend, les installe, les configure et les intègre à son système — mais ne conçoit ni ne fabrique la fenêtre.",
    },
    offre: "fenetre",
    inclus: [
      "Fenêtre double vitrage à contrôle solaire (aluminium ou PVC)",
      "Actionneur motorisé",
      "Module de commande Ombrair et intégration à l'application",
    ],
    dimensions: DIMENSIONS_FENETRE,
    optionsInstallation: [
      {
        id: "fenetre-actionneur",
        label: "Motoriser une fenêtre existante",
        description:
          "Ajout d'un actionneur sur une menuiserie en bon état, quand le dormant et l'ouvrant s'y prêtent.",
        sousReserveCompatibilite: true,
      },
      {
        id: "fenetre-remplacement",
        label: "Remplacer par une fenêtre motorisée",
        description: "Dépose totale de l'ancien ouvrant et pose d'une fenêtre motorisée.",
      },
      {
        id: "fenetre-complete",
        label: "Pose et mise en service complète",
        description:
          "Fenêtre posée, capteur appairé, ouverture nocturne réglée avec vous.",
      },
    ],
    compatibilite:
      "La motorisation d'une fenêtre existante dépend du type de menuiserie : elle est confirmée lors de la visite technique.",
    href: "/gammes/fenetre",
  },
];

export function gammeParId(id: GammeId): Gamme {
  const gamme = gammes.find((g) => g.id === id);
  if (!gamme) throw new Error(`Gamme inconnue : ${id}`);
  return gamme;
}

/** Formate une dimension pour l'affichage, en gérant le cas sur-mesure. */
export function formatDimension(dimension: DimensionOption): string {
  if (dimension.type === "sur-mesure") return "dimensions à relever";
  return `${dimension.largeurCm} × ${dimension.hauteurCm} cm`;
}

export const offrePro = {
  nom: "Ombrair Pro",
  accroche: "Bailleurs, EHPAD, établissements scolaires",
  description:
    "Tableau de bord multi-sites, supervision de flotte, plan de gestion canicule, export de données pour les plans bleus.",
  prixAffiche: "Sur devis",
  href: "/pro" as const,
};

export const optionOmbrairPlus = {
  nom: "Ombrair+",
  prix: "4,99 €",
  unite: "par mois",
  facultatif: true,
  description:
    "Prévision météo 7 jours intégrée à l'algorithme, pilotage multi-résidences, rapports mensuels de confort, historique illimité (l'app gratuite garde 90 jours).",
};

export const accesAppInclus = "Accès à l'application inclus à vie, sans abonnement.";
