"use client";

import { useId, useState } from "react";
import { formatDimension, type DimensionOption } from "@/lib/tarifs";
import { cn } from "@/lib/utils";

/**
 * Sélection d'un format d'ouvrant.
 *
 * Volontairement sans incidence tarifaire affichée : aucune règle de prix au
 * centimètre n'existe dans le projet, et en inventer une donnerait une fausse
 * précision. Le format choisi sert à cadrer la demande de devis.
 *
 * CE QUI CHANGE VISUELLEMENT. C'était une liste de boutons radio dans un
 * encadré — la forme d'un formulaire administratif, alors que la question
 * posée est géométrique. Chaque format porte désormais sa SILHOUETTE, mise à
 * l'échelle les unes par rapport aux autres : on voit qu'une porte-fenêtre
 * n'a rien à voir avec une petite fenêtre avant même d'avoir lu les
 * centimètres.
 *
 * Les silhouettes ne sont pas à l'échelle absolue, seulement entre elles :
 * la plus grande remplit la case, les autres se déduisent. C'est une aide à
 * la comparaison, pas un plan coté.
 *
 * L'`<input type="radio">` reste présent et opérant sous chaque case ; il est
 * masqué visuellement mais reçoit le focus, et l'anneau de focus est reporté
 * sur la case par `peer-focus-visible`.
 */

/** Format de référence pour l'échelle relative : la porte-fenêtre. */
const REF_HAUTEUR = 215;

function Silhouette({ dimension, actif }: { dimension: DimensionOption; actif: boolean }) {
  if (dimension.type === "sur-mesure") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "block h-full w-full border border-dashed",
          actif ? "border-foreground" : "border-foreground/35"
        )}
      />
    );
  }

  /*
   * La hauteur est relative au plus grand format ; la largeur se déduit du
   * RAPPORT RÉEL du format, pas de la largeur de la case. Dimensionner les
   * deux côtés en pourcentage d'une case bien plus large que haute
   * écrasait toutes les silhouettes en paysage : une petite fenêtre de
   * 60 × 75 cm, qui est un portrait, s'affichait couchée. Une silhouette
   * fausse est pire que pas de silhouette.
   */
  const h = (dimension.hauteurCm / REF_HAUTEUR) * 100;

  return (
    <span aria-hidden="true" className="flex h-full w-full items-end justify-center">
      <span
        className={cn(
          "block border",
          actif ? "border-foreground bg-foreground/10" : "border-foreground/40"
        )}
        style={{ height: `${h}%`, aspectRatio: `${dimension.largeurCm} / ${dimension.hauteurCm}` }}
      />
    </span>
  );
}

export function SelecteurDimensions({
  dimensions,
  legende,
}: {
  dimensions: DimensionOption[];
  legende: string;
}) {
  const [choisie, setChoisie] = useState<string>(dimensions[0]?.id ?? "");
  const nom = useId();
  const selection = dimensions.find((d) => d.id === choisie);

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-4">
        <legend className="t-eyebrow text-muted-foreground">{legende}</legend>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {dimensions.map((dimension) => {
            const actif = choisie === dimension.id;
            return (
              <label
                key={dimension.id}
                className="group flex cursor-pointer flex-col gap-3"
              >
                <input
                  type="radio"
                  name={nom}
                  value={dimension.id}
                  checked={actif}
                  onChange={() => setChoisie(dimension.id)}
                  className="peer sr-only"
                />

                {/* La case de silhouette. Hauteur fixe pour que les formats
                    se comparent réellement d'une case à l'autre. */}
                <span
                  className={cn(
                    "flex h-28 items-end justify-center rounded-lg border p-3 transition-colors",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                    actif
                      ? "border-foreground bg-surface-panneau"
                      : "border-border group-hover:border-foreground/40"
                  )}
                >
                  <Silhouette dimension={dimension} actif={actif} />
                </span>

                <span className="flex flex-col gap-0.5">
                  <span className={cn("t-caption", actif && "font-medium")}>{dimension.label}</span>
                  <span className="t-data t-caption text-muted-foreground">
                    {formatDimension(dimension)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {selection ? (
        <p role="status" className="t-support max-w-2xl text-muted-foreground">
          {selection.type === "sur-mesure"
            ? "Les dimensions sont relevées lors de la visite technique, et le devis est établi ensuite."
            : `Format sélectionné : ${selection.label}, ${formatDimension(selection)}. Le prix final dépend du type de pose et se confirme au devis.`}
        </p>
      ) : null}
    </div>
  );
}
