import type { Conditions } from "./volet-simulation.ts";

/**
 * Situations types de la démonstration.
 *
 * Elles existent parce qu'un visiteur ne sait pas quoi régler devant trois
 * curseurs : elles donnent des points d'entrée qui produisent chacun un
 * comportement nettement différent. Ce sont des conditions PLAUSIBLES, pas
 * des relevés — aucune n'est tirée d'une station météo.
 *
 * L'ordre suit une journée, ce qui rend la série lisible de gauche à droite.
 */

export interface PresetVolet {
  id: string;
  nom: string;
  /** Ce que la situation change, en une ligne. */
  intention: string;
  conditions: Conditions;
}

export const PRESETS: PresetVolet[] = [
  {
    id: "matin-doux",
    nom: "Matin doux",
    intention: "Rien à filtrer : le volet reste ouvert.",
    conditions: { temperature: 17, luminosite: 35, humidite: 55 },
  },
  {
    id: "apres-midi",
    nom: "Après-midi ensoleillé",
    intention: "La lumière gêne avant que la chaleur ne s'installe.",
    conditions: { temperature: 26, luminosite: 85, humidite: 40 },
  },
  {
    id: "canicule",
    nom: "Canicule",
    intention: "Chaleur et soleil au maximum : occultation.",
    conditions: { temperature: 38, luminosite: 95, humidite: 30 },
  },
  {
    id: "chaleur-humide",
    nom: "Chaleur humide",
    intention: "On protège, mais les lames laissent circuler l'air.",
    conditions: { temperature: 31, luminosite: 70, humidite: 85 },
  },
  {
    id: "soiree",
    nom: "Soirée",
    intention: "Le soleil tombe : le volet se rouvre.",
    conditions: { temperature: 21, luminosite: 12, humidite: 60 },
  },
];

export const PRESET_PAR_DEFAUT = PRESETS[1];
