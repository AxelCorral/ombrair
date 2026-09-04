import type { GammeId } from "@/lib/tarifs";
import { SensorVisual } from "./sensor-visual";
import { ShutterVisual } from "./shutter-visual";
import { WindowVisual } from "./window-visual";
import { LinkVisual } from "./link-visual";

/**
 * Point d'entrée unique des visuels produit.
 *
 * Les trois illustrations existaient déjà mais s'importaient une par une,
 * sans rien qui les relie : aucun type commun, aucune correspondance
 * déclarée avec les identifiants de `lib/tarifs.ts`. Résultat, elles
 * n'avaient jamais quitté la vitrine de l'accueil, faute d'un « donne-moi
 * le visuel de ce produit ».
 *
 * Toute nouvelle page qui montre un produit passe par ici. Ajouter un
 * produit dans `lib/tarifs.ts` sans son visuel devient une erreur de
 * typage, ce qui est exactement le rappel voulu.
 */
export const VISUEL_PRODUIT: Record<GammeId, React.ReactNode> = {
  capteur: <SensorVisual />,
  volet: <ShutterVisual />,
  fenetre: <WindowVisual />,
};

export { SensorVisual, ShutterVisual, WindowVisual, LinkVisual };
