import type { EnvironnementFenetre } from "./fenetre-simulation.ts";

/**
 * Situations types de la démonstration Fenêtre.
 *
 * Même raison d'être que `lib/volet-presets.ts` : personne ne sait quoi
 * régler devant quatre curseurs. Chaque situation produit un comportement
 * nettement différent des autres — c'est le critère de sélection, pas le
 * réalisme météorologique. Ce sont des conditions PLAUSIBLES, pas des
 * relevés.
 *
 * L'ordre suit une journée d'été, ce qui rend la série lisible de gauche à
 * droite : matin frais, après-midi, canicule, nuit, puis les deux cas où
 * l'arbitrage devient intéressant.
 */

export interface PresetFenetre {
  id: string;
  nom: string;
  /** Ce que la situation démontre, en une ligne. */
  intention: string;
  environnement: EnvironnementFenetre;
}

export const PRESETS_FENETRE: PresetFenetre[] = [
  {
    id: "matin-frais",
    nom: "Matin frais",
    intention: "Rien à corriger : Ombrair n'ouvre pas sans raison.",
    environnement: {
      temperatureInterieure: 23,
      temperatureExterieure: 17,
      luminosite: 35,
      humidite: 55,
    },
  },
  {
    id: "apres-midi-ete",
    nom: "Après-midi d'été",
    intention: "L'extérieur est plus chaud : ouvrir réchaufferait la pièce.",
    environnement: {
      temperatureInterieure: 25,
      temperatureExterieure: 34,
      luminosite: 95,
      humidite: 45,
    },
  },
  {
    id: "canicule",
    nom: "Canicule",
    intention: "Fenêtre fermée, volet en occultation : on tient la chaleur dehors.",
    environnement: {
      temperatureInterieure: 29,
      temperatureExterieure: 39,
      luminosite: 100,
      humidite: 40,
    },
  },
  {
    id: "rafraichissement-nocturne",
    nom: "Rafraîchissement nocturne",
    intention: "10 °C de moins dehors : la fenêtre s'ouvre en grand.",
    environnement: {
      temperatureInterieure: 29,
      temperatureExterieure: 19,
      luminosite: 5,
      humidite: 50,
    },
  },
  {
    id: "air-humide",
    nom: "Air intérieur humide",
    intention: "Ce n'est pas la chaleur qui commande, c'est l'humidité.",
    environnement: {
      temperatureInterieure: 24,
      temperatureExterieure: 20,
      luminosite: 30,
      humidite: 82,
    },
  },
  {
    /*
     * LE SCÉNARIO HÉROS. C'est le seul preset où les deux équipements
     * décident des choses différentes en même temps : la fenêtre s'entrouvre
     * pour l'air, le volet descend pour l'ombre. Sans lui, la démo combinée
     * ne serait qu'un volet et une fenêtre qui bougent ensemble.
     */
    id: "soleil-air-frais",
    nom: "Soleil + air frais",
    intention: "L'air du dehors est bon, le soleil ne l'est pas : ombre et air.",
    environnement: {
      temperatureInterieure: 27,
      temperatureExterieure: 21,
      luminosite: 95,
      humidite: 50,
    },
  },
];

/**
 * Situation affichée à l'arrivée sur la page.
 *
 * « Soleil + air frais » est retenu même si le volet est masqué par défaut :
 * la fenêtre y est franchement entrouverte, donc la démonstration est déjà
 * complète sans le volet, et activer le switch révèle immédiatement l'autre
 * moitié du raisonnement au lieu de ne rien changer.
 */
export const PRESET_FENETRE_PAR_DEFAUT =
  PRESETS_FENETRE.find((p) => p.id === "soleil-air-frais") ?? PRESETS_FENETRE[0];
