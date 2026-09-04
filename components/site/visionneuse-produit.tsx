"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Visionneuse 3D d'un produit Ombrair.
 *
 * POURQUOI `<model-viewer>` ET PAS THREE.JS. Le besoin est : charger un glTF,
 * le faire tourner, zoomer, revenir à la vue initiale. `<model-viewer>` fait
 * exactement cela, gère le tactile, le clavier et le repli tout seul, et se
 * maintient sans écrire de boucle de rendu. Une scène Three.js maison
 * apporterait ici du code à entretenir sans rien ajouter de visible.
 *
 * CHARGEMENT. Le paquet touche `window` à l'import et enregistre un custom
 * element : il ne peut donc pas être importé au niveau du module dans une
 * page rendue côté serveur. Il est chargé dynamiquement à l'affichage, ce qui
 * a l'avantage de sortir ~300 ko du bundle initial de la page produit.
 *
 * REPLI. Trois cas mènent à l'image fixe : WebGL indisponible, échec du
 * chargement du module, échec du chargement du modèle. Dans les trois, la
 * page produit reste intacte — la 3D est un plus, jamais une dépendance.
 *
 * DIRECTION. Fond de la page, pas de sol réfléchissant, pas d'éclairage
 * spectaculaire : le boîtier doit être regardé comme un objet posé dans
 * l'atelier, pas exposé sur un stand.
 */

/*
 * Pose d'ouverture. `phi` à 78° place l'œil légèrement au-dessus de
 * l'horizontale — assez pour qu'on comprenne l'épaisseur du boîtier, pas
 * assez pour le regarder de haut comme un objet posé sur une table. Le rayon
 * cadre l'objet sans le coller aux bords.
 */
const ORBITE_INITIALE = "-24deg 78deg 0.27m";
const CHAMP_INITIAL = "24deg";

/*
 * Le modèle éclaté s'étale sur ~140 mm de profondeur contre 26 mm assemblé.
 * Réutiliser le même rayon de caméra le faisait déborder du cadre : on ne
 * voyait plus que la coque avant. `auto` laisse `<model-viewer>` recadrer sur
 * la boîte englobante réelle du modèle chargé.
 */
const ORBITE_ECLATEE = "-24deg 78deg auto";

type Etat = "chargement" | "pret" | "repli";

export function VisionneuseProduit({
  src,
  srcEclate,
  poster,
  alt,
  className,
}: {
  /** Modèle assemblé. */
  src: string;
  /** Modèle en vue éclatée. Absent = pas de bascule proposée. */
  srcEclate?: string;
  /** Image de repli, également utilisée comme affiche pendant le chargement. */
  poster: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [etat, setEtat] = useState<Etat>("chargement");
  const [eclate, setEclate] = useState(false);
  const [aInteragi, setAInteragi] = useState(false);

  /*
   * Le module s'importe une fois, à l'affichage. `annule` évite de basculer
   * l'état sur un composant démonté — cas courant en navigation rapide.
   */
  useEffect(() => {
    let annule = false;

    // Sans WebGL, inutile de télécharger 300 ko pour échouer ensuite.
    const canvas = document.createElement("canvas");
    const webgl = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
    if (!webgl) {
      setEtat("repli");
      return;
    }

    import("@google/model-viewer")
      .then(() => {
        if (!annule) setEtat("pret");
      })
      .catch(() => {
        if (!annule) setEtat("repli");
      });

    return () => {
      annule = true;
    };
  }, []);

  /*
   * L'auto-rotation s'arrête au premier geste, quel qu'il soit. Sans cela,
   * le modèle continuerait de tourner sous la main de l'utilisateur.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el || etat !== "pret") return;

    const stop = () => setAInteragi(true);
    el.addEventListener("camera-change", stop, { once: true });
    return () => el.removeEventListener("camera-change", stop);
  }, [etat]);

  const reinitialiser = useCallback(() => {
    const el = ref.current as (HTMLElement & {
      cameraOrbit?: string;
      fieldOfView?: string;
      resetTurntableRotation?: (n?: number) => void;
      jumpCameraToGoal?: () => void;
    }) | null;
    if (!el) return;
    el.resetTurntableRotation?.(0);
    el.cameraOrbit = eclate && srcEclate ? ORBITE_ECLATEE : ORBITE_INITIALE;
    el.fieldOfView = CHAMP_INITIAL;
  }, [eclate, srcEclate]);

  const modele = eclate && srcEclate ? srcEclate : src;
  const orbite = eclate && srcEclate ? ORBITE_ECLATEE : ORBITE_INITIALE;

  return (
    <figure className={cn("flex flex-col", className)}>
      {/* Le mur : même surface que l'ouverture en arche des pages produit. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface-panneau">
        {etat === "repli" ? (
          <Image
            src={poster}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 30rem"
            className="object-contain p-[6%]"
          />
        ) : (
          <>
            {/*
              `<model-viewer>` est un custom element : il n'existe pas dans
              les types JSX de React. Plutôt que de déclarer un module global —
              qui impose une `namespace` et sort du style du projet — on le
              référence localement comme un type d'élément. React 19 transmet
              les props inconnues en attributs, ce dont le composant a besoin.

              Le type est `ComponentType<Record<string, unknown>>` et non
              `ElementType` : depuis que `@react-three/fiber` augmente
              `JSX.IntrinsicElements` pour la scène du volet, un `ElementType`
              construit depuis une chaîne inconnue voit ses props résolues en
              `never`, et chaque attribut devient une erreur de typage.
            */}
            {(() => {
              const ModelViewer =
                "model-viewer" as unknown as React.ComponentType<Record<string, unknown>>;
              return (
                <ModelViewer
                  ref={ref}
                  src={modele}
                  poster={poster}
                  alt={alt}
                  camera-controls=""
                  touch-action="pan-y"
                  camera-orbit={orbite}
                  field-of-view={CHAMP_INITIAL}
                  min-field-of-view="12deg"
                  max-field-of-view="40deg"
                  interaction-prompt="none"
                  shadow-intensity="1"
                  shadow-softness="0.6"
                  /*
                   * Exposition sous 1 : le boîtier est en Chaux (#f4f1e9),
                   * soit 96 % de blanc. À l'exposition par défaut, l'objet
                   * entier montait dans les 6 % supérieurs de l'échelle de
                   * luminance et plus aucun relief ne se lisait. Le réglage
                   * d'exposition de Blender ne corrige que les rendus : il ne
                   * part pas dans le `.glb`, il fallait donc le refaire ici.
                   */
                  exposure="0.72"
                  tone-mapping="neutral"
                  environment-image="neutral"
                  /*
                   * Rotation d'attente très lente, coupée dès le premier geste
                   * et jamais lancée si l'utilisateur demande moins de
                   * mouvement — `<model-viewer>` respecte lui-même
                   * `prefers-reduced-motion` sur cet attribut.
                   */
                  auto-rotate={aInteragi ? undefined : ""}
                  auto-rotate-delay="1200"
                  rotation-per-second="12deg"
                  onLoad={() => setEtat("pret")}
                  onError={() => setEtat("repli")}
                  className="h-full w-full"
                  style={{ backgroundColor: "transparent" }}
                />
              );
            })()}

            {etat === "chargement" ? (
              <p
                role="status"
                className="t-caption absolute inset-x-0 bottom-4 text-center text-muted-foreground"
              >
                Chargement du modèle 3D…
              </p>
            ) : null}
          </>
        )}
      </div>

      {/* Barre de commande. Elle reste présente en repli, mais n'expose alors
          que ce qui a du sens : pas de bouton qui ne ferait rien. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="t-caption text-muted-foreground">
          {etat === "repli"
            ? "Vue fixe — la 3D n'a pas pu être affichée sur cet appareil."
            : "Glissez pour faire pivoter · molette ou pincement pour zoomer"}
        </p>

        {etat !== "repli" ? (
          <div className="flex items-center gap-2">
            {srcEclate ? (
              <button
                type="button"
                onClick={() => setEclate((v) => !v)}
                aria-pressed={eclate}
                className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-[0.8125rem] font-medium transition-colors hover:bg-surface-sourde focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {eclate ? "Vue assemblée" : "Vue éclatée"}
              </button>
            ) : null}

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
  );
}
