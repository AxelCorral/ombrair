"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { WindowVisual } from "@/components/product-visuals";
import {
  ControlesManuels,
  FenetreControls,
  FenetrePresets,
  OptionVolet,
  SelecteurMode,
  type CommandesManuelles,
  type ModePilotage,
} from "@/components/3d/fenetre-controls";
import { FenetreStatus } from "@/components/3d/fenetre-status";
import { angleOuvrant, type EnvironnementFenetre } from "@/lib/fenetre-simulation";
import { computeCombinedState } from "@/lib/ombrair-automation";
import { PRESETS_FENETRE, PRESET_FENETRE_PAR_DEFAUT } from "@/lib/fenetre-presets";

/**
 * Démonstration interactive de la fenêtre Ombrair, volet en option.
 *
 * Quatre conditions en entrée, une fenêtre motorisée qui réagit en sortie —
 * et, si le visiteur l'active, le volet Ombrair monté dans la MÊME baie.
 *
 * La logique vit dans `lib/fenetre-simulation.ts` et `lib/ombrair-automation.ts`,
 * testées séparément, sans aucune dépendance au rendu.
 *
 * COMPOSANT AUTONOME. Il ne reçoit rien d'obligatoire et porte son propre
 * état : le poser ailleurs — accueil, page « comment ça marche » — demanderait
 * une seule ligne. C'est la raison pour laquelle les réglages ne remontent
 * pas à la page.
 *
 * CHARGEMENT. La scène est importée dynamiquement, sans rendu serveur : three
 * et fiber pèsent l'essentiel du poids et ne servent à rien tant que personne
 * n'a fait défiler jusqu'ici. La page produit garde son bundle.
 */

/*
 * `ssr: false` est indispensable : la scène crée un contexte WebGL et touche
 * `window` au montage. `loading` occupe la même boîte que le canvas, ce qui
 * évite que la page saute quand la scène arrive.
 */
const FenetreScene = dynamic(
  () => import("@/components/3d/fenetre-scene").then((m) => m.FenetreScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <p role="status" className="t-caption text-muted-foreground">
          Chargement de la scène 3D…
        </p>
      </div>
    ),
  }
);

type Cote = "exterieur" | "interieur";
type Vue = "face" | "trois-quarts";

export function Fenetre3DDemo({ className }: { className?: string }) {
  const [environnement, setEnvironnement] = useState<EnvironnementFenetre>(
    PRESET_FENETRE_PAR_DEFAUT.environnement
  );

  /*
   * VOLET MASQUÉ PAR DÉFAUT. La fenêtre est le produit de cette page : elle
   * doit être immédiatement identifiable comme le sujet, et le volet doit se
   * lire comme une démonstration d'écosystème qu'on ajoute, pas comme un
   * élément livré avec.
   */
  const [avecVolet, setAvecVolet] = useState(false);
  const [mode, setMode] = useState<ModePilotage>("auto");
  const [commandes, setCommandes] = useState<CommandesManuelles>({
    ouverture: 0,
    levee: 100,
    inclinaison: 60,
  });

  const [cote, setCote] = useState<Cote>("exterieur");
  const [vue, setVue] = useState<Vue>("trois-quarts");
  const [resetSignal, setResetSignal] = useState(0);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  /*
   * Test WebGL avant de charger three : inutile de télécharger la scène pour
   * échouer ensuite. `null` = pas encore testé, on n'affiche donc ni la scène
   * ni le repli tant qu'on ne sait pas.
   */
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  const etat = useMemo(
    () => computeCombinedState(environnement, avecVolet),
    [environnement, avecVolet]
  );

  /*
   * PASSAGE AUTO → MANUEL. Les commandes sont amorcées sur l'état courant :
   * sans cela, la fenêtre sauterait de son ouverture automatique à la
   * dernière valeur laissée dans les curseurs. Le sens inverse ne demande
   * rien — la scène interpole vers la décision automatique retrouvée.
   */
  const changerMode = useCallback(
    (nouveau: ModePilotage) => {
      if (nouveau === "manuel" && mode === "auto") {
        setCommandes({
          ouverture: Math.round(etat.fenetre.ouverture * 100),
          levee: Math.round(etat.volet.levee),
          inclinaison: Math.round(etat.volet.inclinaison),
        });
      }
      setMode(nouveau);
    },
    [mode, etat]
  );

  /** Ce qui est réellement envoyé à la scène, selon le mode. */
  const mecanique = useMemo(() => {
    if (mode === "manuel") {
      return {
        angleOuvrant: angleOuvrant(commandes.ouverture / 100),
        levee: commandes.levee,
        inclinaison: commandes.inclinaison,
      };
    }
    return {
      angleOuvrant: etat.angleOuvrant,
      levee: etat.volet.levee,
      inclinaison: etat.volet.inclinaison,
    };
  }, [mode, commandes, etat]);

  /**
   * En manuel, le panneau doit décrire ce qu'on VOIT, pas ce que le moteur
   * aurait décidé. On lui passe donc l'état recomposé à partir des commandes.
   */
  const etatAffiche = useMemo(() => {
    if (mode === "auto") return etat;
    return {
      ...etat,
      fenetre: { ...etat.fenetre, ouverture: commandes.ouverture / 100 },
      volet: { ...etat.volet, levee: commandes.levee, inclinaison: commandes.inclinaison },
    };
  }, [mode, etat, commandes]);

  /** Situation dont les valeurs correspondent exactement aux curseurs. */
  const presetActif = useMemo(() => {
    const trouve = PRESETS_FENETRE.find(
      (p) =>
        p.environnement.temperatureInterieure === environnement.temperatureInterieure &&
        p.environnement.temperatureExterieure === environnement.temperatureExterieure &&
        p.environnement.luminosite === environnement.luminosite &&
        p.environnement.humidite === environnement.humidite
    );
    return trouve?.id ?? null;
  }, [environnement]);

  const reinitialiserVue = useCallback(() => setResetSignal((n) => n + 1), []);

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      {/*
        ─── PREMIER REGISTRE : ce qu'on voit, et ce que le système en dit ───

        La scène et le panneau d'état sont côte à côte parce qu'ils disent la
        même chose de deux façons : l'un montre la mécanique, l'autre la
        nomme. Les séparer obligerait à faire l'aller-retour entre le haut et
        le bas de la section pour relier un mouvement à une décision.

        SUR TÉLÉPHONE, LE CADRE EST CARRÉ. Un 4/3 sur 390 px donnait une bande
        de 256 px de haut : la fenêtre y tenait, mais l'inclinaison des lames
        et l'écartement de l'ouvrant n'étaient plus lisibles. Le carré rend
        cent trente pixels de hauteur sans rien coûter en largeur, et la
        caméra — dont le champ est vertical — garde de la marge de chaque côté.

        HAUTEUR FIXE SUR GRAND ÉCRAN, et non un cadre qui suivrait la colonne
        voisine : le panneau d'état grandit de trois lignes quand le volet
        entre dans la simulation, et la scène se serait redimensionnée sous le
        curseur au moment précis où le visiteur regarde ce qui change. Une
        hauteur posée une fois vaut mieux qu'un cadre qui bouge.

        Elle est choisie pour couvrir la colonne de droite : ce qui reste en
        dessous se compte en dizaines de pixels, là où un ratio 4/3 laissait
        cinq cents pixels vides.
      */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-14">
        {/* ─── La scène ─── */}
        <figure className="flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-panneau sm:aspect-[4/3] lg:aspect-auto lg:h-[32rem] xl:h-[34rem]">
          {webgl === false ? (
              /*
               * Repli : l'illustration produit déjà utilisée par le catalogue.
               * Elle ne réagit pas aux curseurs — mais la page reste entière, le
               * visiteur voit tout de même une fenêtre, et le panneau d'état
               * continue d'énoncer la décision en toutes lettres.
               */
              <div className="flex h-full w-full items-center justify-center p-[8%]">
                <WindowVisual />
              </div>
            ) : webgl ? (
              <FenetreScene
                angleOuvrant={mecanique.angleOuvrant}
                avecVolet={avecVolet}
                levee={mecanique.levee}
                inclinaison={mecanique.inclinaison}
                luminosite={environnement.luminosite}
                cote={cote}
                vue={vue}
                resetSignal={resetSignal}
              />
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="t-caption text-muted-foreground">
              {webgl === false
                ? "Vue fixe — la 3D n'a pas pu être affichée sur cet appareil."
                : cote === "exterieur"
                  ? "Côté rue · glissez pour pivoter, molette pour zoomer"
                  : "Côté pièce · l'ouvrant s'ouvre vers vous"}
            </p>

            {webgl ? (
              <div className="flex flex-wrap items-center gap-2">
                {/* Les libellés annoncent la DESTINATION, pas l'état courant :
                    un bouton dit ce qu'il va faire. */}
                <button
                  type="button"
                  onClick={() => setCote(cote === "exterieur" ? "interieur" : "exterieur")}
                  className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-[0.8125rem] font-medium transition-colors hover:bg-surface-sourde focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {cote === "exterieur" ? "Voir de l'intérieur" : "Voir de l'extérieur"}
                </button>
                <button
                  type="button"
                  onClick={() => setVue(vue === "face" ? "trois-quarts" : "face")}
                  className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-[0.8125rem] font-medium transition-colors hover:bg-surface-sourde focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {vue === "face" ? "Vue 3/4" : "Vue de face"}
                </button>
                <button
                  type="button"
                  onClick={reinitialiserVue}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3.5 text-[0.8125rem] font-medium transition-colors hover:bg-surface-sourde focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Réinitialiser la vue
                </button>
              </div>
            ) : null}
          </div>

          {/*
            L'hypothèse mécanique, dite là où on la voit. Le catalogue Ombrair ne
            définit pas le type d'ouverture de la fenêtre : la scène en retient
            un pour pouvoir montrer un mouvement, et doit le dire plutôt que de
            le faire passer pour une caractéristique du produit.
          */}
          <figcaption className="t-caption mt-3 text-muted-foreground">
            Hypothèse de démonstration : deux vantaux, celui de droite motorisé, ouvrant vers
            l&apos;intérieur. Le type d&apos;ouverture réel est déterminé lors de la visite
            technique.
          </figcaption>
        </figure>

        {/* ─── Ce que le système décide, et les deux options de la démo ───

            L'option volet et le pilotage sont ici, contre la scène, parce que
            ce sont les deux réglages qui changent CE QU'ON VOIT — un organe
            apparaît, ou la main passe d'Ombrair à l'utilisateur. Les
            conditions, elles, changent seulement la décision : elles vivent
            au registre suivant. */}
        <div className="flex flex-col gap-8">
          <FenetreStatus etat={etatAffiche} mode={mode} className="border-t border-border pt-7" />
          <OptionVolet
            actif={avecVolet}
            onChange={setAvecVolet}
            className="border-t border-border pt-7"
          />
          <SelecteurMode
            mode={mode}
            onChange={changerMode}
            className="border-t border-border pt-7"
          />
        </div>
      </div>

      {/*
        ─── SECOND REGISTRE : les entrées ───

        Pleine largeur, sous la scène. Les situations d'abord — c'est le point
        d'entrée de qui ne veut pas manipuler quatre curseurs — puis les
        curseurs eux-mêmes, sur une rangée. Cette rangée est ce qui remplit
        les grands écrans : empilée dans une colonne étroite, elle laissait la
        moitié droite de la section vide.
      */}
      <div className="flex flex-col gap-9 border-t border-border pt-10">
        <FenetrePresets actif={presetActif} onChoisir={(p) => setEnvironnement(p.environnement)} />

        {mode === "auto" ? (
          <FenetreControls environnement={environnement} onChange={setEnvironnement} />
        ) : (
          <ControlesManuels commandes={commandes} onChange={setCommandes} avecVolet={avecVolet} />
        )}
      </div>
    </div>
  );
}
