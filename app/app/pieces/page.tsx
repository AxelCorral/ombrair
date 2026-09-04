"use client";

import { WifiOff } from "lucide-react";
import { useEtatDemo } from "@/components/app-demo/etat-provider";
import { OuvrantCard } from "@/components/app-demo/ouvrant-card";
import { CapteurCard } from "@/components/app-demo/capteur-card";
import { EnTeteEcran, Statut } from "@/components/app-demo/ui";
import { anomalies, capteurs } from "@/lib/mock/logement";

function formate(valeur: number) {
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/**
 * Écran Pièces — organisé PAR PIÈCE, pas par équipement.
 *
 * L'écran ouvrait sur la liste des capteurs, ce qui donnait à l'ensemble
 * l'allure d'un inventaire technique : un habitant cherche « le volet du
 * salon », pas « le capteur 2 ». L'ordre suit donc désormais la façon dont
 * on se représente son logement :
 *
 *   1. ce qui demande une action (uniquement s'il y en a) ;
 *   2. les pièces et leurs ouvrants ;
 *   3. les capteurs, repliés, pour qui veut vérifier le matériel.
 *
 * Les anomalies sont dérivées des données (voir `lib/mock/logement.ts`) :
 * aucune panne n'est ajoutée pour l'occasion, et si le scénario ne
 * contient rien à signaler, le bloc n'existe pas.
 */
export default function PiecesPage() {
  const { pieces } = useEtatDemo();

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <EnTeteEcran
        titre="Pièces et ouvrants"
        meta={`${pieces.length} pièces · ${pieces.reduce((s, p) => s + p.ouvrants.length, 0)} ouvrants`}
      />

      {anomalies.length > 0 ? (
        <section aria-labelledby="titre-attention" className="border-l-2 border-alerte pl-4">
          <h2 id="titre-attention" className="flex items-center gap-2">
            <Statut
              etat="alerte"
              libelle={`${anomalies.length} équipement${anomalies.length > 1 ? "s" : ""} à vérifier`}
            />
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {anomalies.map((anomalie) => (
              <li key={anomalie.id} className="t-support">
                <span className="font-medium">{anomalie.ou}</span> — {anomalie.quoi}
                <span className="t-caption block text-muted-foreground">{anomalie.consequence}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pieces.map((piece) => (
        /*
         * Chapitre de pièce. Le nom passe en display et le relevé se range
         * sous lui, séparés du reste par un filet plein : sur un écran très
         * long, il faut voir où commence une pièce sans lire. La batterie et
         * le signal d'un ouvrant n'ont pas à avoir la même présence que le
         * nom de la pièce — ils restent dans le repli des cartes d'ouvrant.
         */
        <section key={piece.id} className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-foreground/70 pb-2">
            <h2 className="font-display text-lg font-semibold tracking-tight">{piece.nom}</h2>
            <p className="t-data t-caption">
              {formate(piece.temperatureC)}&nbsp;°C
              <span className="ml-2 text-muted-foreground">{piece.humiditePct}&nbsp;% HR</span>
            </p>
          </div>

          {piece.capteurHorsLigneDepuis ? (
            <p className="t-caption flex items-start gap-2 border-l-2 border-alerte pl-3 text-muted-foreground">
              <WifiOff className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <span>
                Capteur hors ligne depuis {piece.capteurHorsLigneDepuis}. La valeur affichée est la
                dernière connue, et la pièce n&apos;est plus pilotée automatiquement. Vérifiez la
                pile du capteur, puis relancez l&apos;appairage depuis Réglages.
              </span>
            </p>
          ) : null}

          <div className="flex flex-col gap-3">
            {piece.ouvrants.map((ouvrant) => (
              <OuvrantCard key={ouvrant.id} ouvrant={ouvrant} piece={piece.nom} />
            ))}
          </div>
        </section>
      ))}

      {/* Matériel : utile, mais pas ce qu'on vient chercher ici. */}
      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer list-none px-4 py-3 font-display text-base font-bold marker:content-none">
          Capteurs et matériel
          <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
            {capteurs.length} appareils
          </span>
        </summary>
        <div className="flex flex-col gap-3 border-t border-border p-4">
          {capteurs.map((capteur) => (
            <CapteurCard key={capteur.id} capteur={capteur} />
          ))}
        </div>
      </details>
    </main>
  );
}
