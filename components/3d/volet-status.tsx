"use client";

import { cn } from "@/lib/utils";
import { libelleInclinaison, tauxOuverture } from "@/lib/demo/shutter";
import {
  EXPLICATION_MODE,
  LIBELLE_MODE,
  type EtatSimulation,
} from "@/lib/volet-simulation";

/**
 * Ce que le système décide, et pourquoi.
 *
 * Sans ce panneau, la démonstration se réduit à « je bouge un curseur, un
 * objet bouge ». Avec lui, on relie le mouvement à une intention : c'est
 * exactement ce qu'Ombrair vend — une décision, pas un moteur.
 *
 * Les libellés d'ouverture et d'orientation viennent des mêmes fonctions que
 * l'application et le hero d'accueil : un même état s'y nomme partout pareil.
 */
export function VoletStatus({
  etat,
  className,
}: {
  etat: EtatSimulation;
  className?: string;
}) {
  const ouverture = tauxOuverture(etat);

  const lignes: [string, string][] = [
    ["Ouverture", `${ouverture} %`],
    ["Tablier", `${Math.round(etat.levee)} % relevé`],
    ["Lames", `${Math.round(etat.inclinaison)}° · ${libelleInclinaison(etat.inclinaison)}`],
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="t-eyebrow text-muted-foreground">Décision Ombrair</p>

      {/*
        `aria-live` : le panneau est la seule restitution TEXTUELLE de ce que
        fait la scène 3D. Sans annonce, quelqu'un qui n'en voit pas le rendu
        manipulerait les curseurs sans jamais savoir ce qu'ils produisent.
      */}
      <div aria-live="polite">
        <p className="t-h3 mt-4">{LIBELLE_MODE[etat.mode]}</p>
        <p className="t-support mt-2 max-w-md text-muted-foreground">
          {EXPLICATION_MODE[etat.mode]}
        </p>

        <dl className="mt-5">
          {lignes.map(([cle, valeur]) => (
            <div
              key={cle}
              className="flex items-baseline justify-between gap-4 border-t border-border py-2.5"
            >
              <dt className="t-caption text-muted-foreground">{cle}</dt>
              <dd className="t-data t-support">{valeur}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/*
        Mention obligatoire. La logique est plausible et documentée, mais elle
        n'est calibrée sur aucun logement : le dire là où la démo s'affiche
        évite de la faire passer pour une prédiction.
      */}
      <p className="t-caption mt-5 text-muted-foreground">
        Simulation de démonstration. Les seuils sont choisis pour illustrer le
        raisonnement d&apos;Ombrair, pas pour modéliser un logement réel.
      </p>
    </div>
  );
}
