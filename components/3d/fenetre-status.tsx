"use client";

import { cn } from "@/lib/utils";
import { libelleInclinaison } from "@/lib/demo/shutter";
import { libelleOuverture } from "@/lib/fenetre-simulation";
import { LIBELLE_STRATEGIE, type EtatOmbrair } from "@/lib/ombrair-automation";
import type { ModePilotage } from "./fenetre-controls";

/**
 * ÉTAT OMBRAIR — ce que le système décide, et pourquoi.
 *
 * Sans ce panneau, la démonstration se réduit à « je bouge un curseur, un
 * objet bouge ». Avec lui, on relie le mouvement à une intention : c'est
 * exactement ce qu'Ombrair vend — une décision, pas un moteur.
 *
 * C'est aussi la SEULE RESTITUTION TEXTUELLE de la scène 3D. Quelqu'un qui
 * n'en voit pas le rendu — lecteur d'écran, WebGL indisponible, image trop
 * petite — doit pouvoir suivre la démonstration ici, chiffre par chiffre.
 * D'où `aria-live`, et d'où le fait que chaque grandeur affichée soit celle
 * qui pilote réellement la scène, jamais une paraphrase.
 */
export function FenetreStatus({
  etat,
  mode,
  className,
}: {
  etat: EtatOmbrair;
  mode: ModePilotage;
  className?: string;
}) {
  const ouverturePct = Math.round(etat.fenetre.ouverture * 100);

  /*
   * Les lignes du volet n'apparaissent que si le volet est monté. Laisser
   * « Volet — » ou une valeur figée quand il est masqué décrirait un organe
   * absent de l'écran (§70).
   */
  const lignes: [string, string][] = [
    [
      "Fenêtre",
      ouverturePct === 0
        ? libelleOuverture(0)
        : `${ouverturePct} % ouverte · ${libelleOuverture(etat.fenetre.ouverture)}`,
    ],
  ];

  if (etat.avecVolet) {
    lignes.push(["Volet", `${Math.round(etat.volet.levee)} % relevé`]);
    lignes.push([
      "Lames",
      `${Math.round(etat.volet.inclinaison)}° · ${libelleInclinaison(etat.volet.inclinaison)}`,
    ]);
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="t-eyebrow text-muted-foreground">État Ombrair</p>

      <div aria-live="polite">
        {mode === "auto" ? (
          <>
            <p className="t-h3 mt-4">{LIBELLE_STRATEGIE[etat.strategie]}</p>
            <p className="t-support mt-2 max-w-md text-muted-foreground">{etat.raison}</p>
          </>
        ) : (
          /*
           * En manuel, aucune stratégie n'est annoncée : il n'y en a pas.
           * Afficher malgré tout « Rafraîchissement naturel » alors que
           * l'utilisateur vient de fermer la fenêtre à la main ferait dire au
           * panneau le contraire de ce que montre la scène.
           */
          <>
            <p className="t-h3 mt-4">Commande manuelle</p>
            <p className="t-support mt-2 max-w-md text-muted-foreground">
              Vous commandez directement la mécanique. Repassez en automatique pour rendre la
              main à Ombrair et retrouver les conditions.
            </p>
          </>
        )}

        <dl className="mt-5">
          {lignes.map(([cle, valeur]) => (
            <div
              key={cle}
              className="flex items-baseline justify-between gap-4 border-t border-border py-2.5"
            >
              <dt className="t-caption text-muted-foreground">{cle}</dt>
              <dd className="t-data t-support text-right">{valeur}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/*
        La répartition des rôles, dite une fois, et seulement quand les deux
        équipements sont à l'écran. C'est le message central de la page
        combinée — inutile de le répéter ailleurs, inutile de l'afficher
        quand il n'y a rien à répartir.
      */}
      {etat.avecVolet ? (
        <p className="t-support mt-5 max-w-md border-t border-border pt-5">
          La fenêtre décide de l&apos;air, le volet décide de l&apos;ombre. Ombrair arbitre
          entre les deux.
        </p>
      ) : null}

      {/*
        Mention obligatoire, à l'endroit même où les chiffres apparaissent —
        pas reléguée en bas de page. La logique est plausible et documentée,
        mais elle n'est calibrée sur aucun logement.
      */}
      <p className="t-caption mt-5 text-muted-foreground">
        Simulation de démonstration. Les seuils illustrent le raisonnement d&apos;Ombrair ; ils
        ne modélisent pas le comportement thermique d&apos;un logement réel.
      </p>
    </div>
  );
}
