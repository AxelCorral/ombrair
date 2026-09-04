"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  formatPrix,
  formatSupplement,
  getPrixInstallation,
  getTotalConfigure,
  offreParId,
  type OffreId,
} from "@/lib/offres";

/**
 * Choix de l'installation, après sélection d'un produit.
 *
 * POURQUOI UN CHOIX ET NON DEUX RÉFÉRENCES. Le catalogue ne contient pas
 * « Volet seul » et « Volet installé » : il contient UN volet, puis une
 * décision de pose. C'est ce que reproduit ce composant — deux boutons
 * radio sur une même offre, jamais deux produits concurrents.
 *
 * WORDING. « Sans installation Ombrair » plutôt que « Je l'installe
 * moi-même » : nous ne voulons pas laisser entendre que chaque équipement
 * se prête à une pose par le client. Une fenêtre motorisée n'est pas un
 * capteur qu'on clipse.
 *
 * Le total se recalcule à chaque changement, et il est annoncé aux
 * technologies d'assistance par `aria-live` — sans quoi le montant changerait
 * en silence pour qui n'a pas l'écran sous les yeux.
 *
 * Aucun montant n'est écrit ici : produit, pose et total viennent tous de
 * `lib/offres.ts`.
 */
export function ChoixInstallation({
  id,
  avecInstallation,
  onChange,
  quantite = 1,
  className,
}: {
  id: OffreId;
  avecInstallation: boolean;
  onChange: (valeur: boolean) => void;
  /** Nombre d'unités — le total multiplie produit et pose ensemble. */
  quantite?: number;
  className?: string;
}) {
  const nom = useId();
  const offre = offreParId(id);
  const total = getTotalConfigure(id, { avecInstallation, quantite });

  const options = [
    {
      valeur: false,
      label: "Sans installation Ombrair",
      supplement: 0,
      aide: "Vous recevez le produit et le posez vous-même ou par l'installateur de votre choix.",
    },
    {
      valeur: true,
      label: "Avec installation Ombrair",
      supplement: getPrixInstallation(id),
      aide: "Pose, raccordement au système et mise en service par un technicien Ombrair.",
    },
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="t-eyebrow text-muted-foreground">Installation</legend>
        <p className="t-support mb-1 text-muted-foreground">Comment souhaitez-vous poursuivre ?</p>

        {options.map((option) => {
          const actif = avecInstallation === option.valeur;
          return (
            <label key={option.label} className="group flex cursor-pointer">
              <input
                type="radio"
                name={nom}
                checked={actif}
                onChange={() => onChange(option.valeur)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-lg border p-4 transition-colors",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                  actif
                    ? "border-foreground bg-surface-panneau"
                    : "border-border group-hover:border-foreground/40"
                )}
              >
                <span className="flex items-baseline gap-3">
                  {/* Repère plein / vide : la forme porte l'état, pas la couleur. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block size-2.5 shrink-0 translate-y-[-0.1em] rounded-full border border-foreground",
                      actif ? "bg-foreground" : "bg-transparent"
                    )}
                  />
                  <span>
                    <span className={cn("t-support block", actif && "font-medium")}>
                      {option.label}
                    </span>
                    <span className="t-caption mt-1 block text-muted-foreground">
                      {option.aide}
                    </span>
                  </span>
                </span>

                <span className="t-data t-support whitespace-nowrap">
                  {formatSupplement(option.supplement)}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {/* Le total, recalculé et annoncé. */}
      <div
        aria-live="polite"
        className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-foreground pt-4"
      >
        <span className="t-support font-medium">
          Total{quantite > 1 ? ` — ${quantite} ouvrants` : ""}
        </span>
        <span className="t-data text-2xl">{formatPrix(total)}</span>
      </div>

      <p className="t-caption mt-3 text-muted-foreground">
        {offre.nom} · {offre.unite}
        {avecInstallation ? " · installation Ombrair comprise" : " · sans installation"}
      </p>
    </div>
  );
}
