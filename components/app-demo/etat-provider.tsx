"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { pieces as piecesMock, type ModePilotage, type Piece } from "@/lib/mock/logement";
import { tauxOuverture, type EtatFenetre } from "@/lib/demo/shutter";

/**
 * État partagé de la démonstration. Il part des données de `lib/mock` et
 * garde en mémoire les actions faites pendant la visite, pour que
 * l'accueil et l'écran Pièces racontent la même chose. Rien n'est
 * persisté : un rechargement remet le scénario dans son état initial.
 *
 * Les volets ont deux réglages indépendants — levée du tablier et
 * inclinaison des lames — et le taux d'ouverture affiché s'en déduit.
 */

interface ModifOuvrant {
  levee?: number;
  inclinaison?: number;
  mode?: ModePilotage;
  etatFenetre?: EtatFenetre;
}

interface EtatDemo {
  pieces: Piece[];
  temperatureInterieureMoyenneC: number;
  ouvertureMoyennePct: number;
  nbOuvrantsOuverts: number;
  nbOuvrantsTotal: number;
  reglerLevee: (ouvrantId: string, levee: number) => void;
  reglerInclinaison: (ouvrantId: string, inclinaison: number) => void;
  reglerFenetre: (ouvrantId: string, etat: EtatFenetre) => void;
  reglerMode: (ouvrantId: string, mode: ModePilotage) => void;
  toutOuvrir: () => void;
  toutFermer: () => void;
  /** Vrai dès qu'une commande a été passée pendant la visite. */
  modifieDepuisChargement: boolean;
}

const Contexte = createContext<EtatDemo | null>(null);

export function EtatDemoProvider({ children }: { children: React.ReactNode }) {
  const [pieces, setPieces] = useState<Piece[]>(piecesMock);
  const [modifie, setModifie] = useState(false);

  const majOuvrants = useCallback(
    (transformation: (ouvrantId: string) => ModifOuvrant) => {
      setPieces((actuelles) =>
        actuelles.map((piece) => ({
          ...piece,
          ouvrants: piece.ouvrants.map((ouvrant) => ({ ...ouvrant, ...transformation(ouvrant.id) })),
        }))
      );
      setModifie(true);
    },
    []
  );

  const reglerLevee = useCallback(
    (ouvrantId: string, levee: number) => {
      majOuvrants((id) => (id === ouvrantId ? { levee, mode: "manuel" } : {}));
    },
    [majOuvrants]
  );

  const reglerInclinaison = useCallback(
    (ouvrantId: string, inclinaison: number) => {
      majOuvrants((id) => (id === ouvrantId ? { inclinaison, mode: "manuel" } : {}));
    },
    [majOuvrants]
  );

  const reglerFenetre = useCallback(
    (ouvrantId: string, etatFenetre: EtatFenetre) => {
      majOuvrants((id) => (id === ouvrantId ? { etatFenetre, mode: "manuel" } : {}));
    },
    [majOuvrants]
  );

  const reglerMode = useCallback(
    (ouvrantId: string, mode: ModePilotage) => {
      majOuvrants((id) => (id === ouvrantId ? { mode } : {}));
    },
    [majOuvrants]
  );

  // Tout ouvrir : tablier relevé et lames à plat, l'ouverture est totale.
  const toutOuvrir = useCallback(() => {
    majOuvrants(() => ({ levee: 100, inclinaison: 90, mode: "manuel" }));
  }, [majOuvrants]);

  const toutFermer = useCallback(() => {
    majOuvrants(() => ({ levee: 0, inclinaison: 0, mode: "manuel", etatFenetre: "fermee" }));
  }, [majOuvrants]);

  const valeur = useMemo<EtatDemo>(() => {
    const tous = pieces.flatMap((p) => p.ouvrants);
    const taux = tous.map((o) => tauxOuverture({ levee: o.levee, inclinaison: o.inclinaison }));
    return {
      pieces,
      temperatureInterieureMoyenneC:
        Math.round((pieces.reduce((s, p) => s + p.temperatureC, 0) / pieces.length) * 10) / 10,
      ouvertureMoyennePct: Math.round(taux.reduce((s, t) => s + t, 0) / (taux.length || 1)),
      nbOuvrantsOuverts: taux.filter((t) => t > 0).length,
      nbOuvrantsTotal: tous.length,
      reglerLevee,
      reglerInclinaison,
      reglerFenetre,
      reglerMode,
      toutOuvrir,
      toutFermer,
      modifieDepuisChargement: modifie,
    };
  }, [pieces, modifie, reglerLevee, reglerInclinaison, reglerFenetre, reglerMode, toutOuvrir, toutFermer]);

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useEtatDemo() {
  const contexte = useContext(Contexte);
  if (!contexte) throw new Error("useEtatDemo doit être utilisé dans un EtatDemoProvider");
  return contexte;
}
