"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShutterVisual } from "@/components/product-visuals";
import { VoletControls, VoletPresets } from "@/components/3d/volet-controls";
import { VoletStatus } from "@/components/3d/volet-status";
import { computeShutterState, type Conditions } from "@/lib/volet-simulation";
import { PRESET_PAR_DEFAUT, PRESETS } from "@/lib/volet-presets";

/**
 * Démonstration interactive du volet Ombrair.
 *
 * Trois conditions extérieures en entrée, un volet 3D qui réagit en sortie.
 * La logique vit dans `lib/volet-simulation.ts` — testée séparément, sans
 * aucune dépendance au rendu.
 *
 * COMPOSANT AUTONOME. Il ne reçoit rien d'obligatoire et porte son propre
 * état : le poser sur l'accueil demanderait une seule ligne. C'est la raison
 * pour laquelle les réglages ne remontent pas à la page.
 *
 * CHARGEMENT. La scène est importée dynamiquement, sans rendu serveur :
 * three et fiber pèsent l'essentiel du poids et ne servent à rien tant que
 * personne n'a fait défiler jusqu'ici. La page produit garde son bundle.
 */

/*
 * `ssr: false` est indispensable : la scène crée un contexte WebGL et touche
 * `window` au montage. `loading` occupe la même boîte que le canvas, ce qui
 * évite que la page saute quand la scène arrive.
 */
const VoletScene = dynamic(
  () => import("@/components/3d/volet-scene").then((m) => m.VoletScene),
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

/*
 * DEUX AXES DE POINT DE VUE, volontairement séparés.
 *
 * `cote` répond à « de quel côté du mur suis-je ? », `vue` à « sous quel
 * angle ? ». Les mélanger en une seule liste de quatre poses obligerait le
 * visiteur à retrouver son angle après chaque passage d'un côté à l'autre.
 */
type Cote = "exterieur" | "interieur";
type Vue = "face" | "trois-quarts";

export function Volet3DDemo({ className }: { className?: string }) {
  const [conditions, setConditions] = useState<Conditions>(PRESET_PAR_DEFAUT.conditions);
  const [cote, setCote] = useState<Cote>("exterieur");
  const [vue, setVue] = useState<Vue>("trois-quarts");
  const [resetSignal, setResetSignal] = useState(0);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  /*
   * Test WebGL avant de charger three : inutile de télécharger la scène pour
   * échouer ensuite. `null` = pas encore testé, on n'affiche donc ni la
   * scène ni le repli tant qu'on ne sait pas.
   */
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  const etat = useMemo(() => computeShutterState(conditions), [conditions]);

  /** Situation dont les valeurs correspondent exactement aux curseurs. */
  const presetActif = useMemo(() => {
    const trouve = PRESETS.find(
      (p) =>
        p.conditions.temperature === conditions.temperature &&
        p.conditions.luminosite === conditions.luminosite &&
        p.conditions.humidite === conditions.humidite
    );
    return trouve?.id ?? null;
  }, [conditions]);

  const reinitialiser = useCallback(() => setResetSignal((n) => n + 1), []);

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      {/*
        ─── PREMIER REGISTRE : ce qu'on voit, et ce que le système en dit ───

        Même composition que la démo Fenêtre : la scène et le panneau de
        décision côte à côte, les entrées en dessous sur toute la largeur.
        Deux pages produit qui se lisent différemment se liraient comme deux
        sites.

        Hauteur fixe sur grand écran plutôt qu'un ratio : le cadre couvre la
        colonne de droite, et ce qui reste en dessous se compte en dizaines de
        pixels là où un 4/3 laissait trois cents pixels vides.
      */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-14">
        {/* ─── La scène ─── */}
        <figure className="flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-panneau sm:aspect-[4/3] lg:aspect-auto lg:h-[32rem] xl:h-[34rem]">
            {webgl === false ? (
              /*
               * Repli : l'illustration produit déjà utilisée par le catalogue.
               * Elle ne réagit pas aux curseurs — mais la page reste entière et
               * le visiteur voit tout de même un volet.
               */
              <div className="flex h-full w-full items-center justify-center p-[8%]">
                <ShutterVisual />
              </div>
            ) : webgl ? (
              <VoletScene
                levee={etat.levee}
                inclinaison={etat.inclinaison}
                luminosite={conditions.luminosite}
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
                  : "Côté pièce · le volet est dehors, derrière le vitrage"}
            </p>

            {webgl ? (
              <div className="flex flex-wrap items-center gap-2">
                {/*
                  Passer de l'autre côté du mur. Le libellé annonce la
                  DESTINATION, pas l'état courant : un bouton dit ce qu'il va
                  faire.
                */}
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
                  onClick={reinitialiser}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3.5 text-[0.8125rem] font-medium transition-colors hover:bg-surface-sourde focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Réinitialiser la vue
                </button>
              </div>
            ) : null}
          </div>
        </figure>

        {/* ─── Ce que le système décide ─── */}
        <VoletStatus etat={etat} className="border-t border-border pt-7" />
      </div>

      {/* ─── SECOND REGISTRE : les entrées, pleine largeur ─── */}
      <div className="flex flex-col gap-9 border-t border-border pt-10">
        <VoletPresets actif={presetActif} onChoisir={(p) => setConditions(p.conditions)} />
        <VoletControls conditions={conditions} onChange={setConditions} />
      </div>
    </div>
  );
}
