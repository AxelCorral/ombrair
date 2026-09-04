"use client";

import { useId } from "react";
import { BatteryLow, WifiOff } from "lucide-react";
import { useEtatDemo } from "@/components/app-demo/etat-provider";
import { derniereActionPour } from "@/lib/mock/evenements";
import { BATTERIE_FAIBLE_PCT, type Ouvrant } from "@/lib/mock/logement";
import {
  INCLINAISON_MAX,
  LEVEE_MAX,
  LIBELLE_FENETRE,
  libelleInclinaison,
  tauxOuverture,
  type EtatFenetre,
} from "@/lib/demo/shutter";

const LIBELLE_TYPE = {
  volet: "Volet",
  fenetre: "Fenêtre",
  "volet-fenetre": "Volet + fenêtre",
} as const;

const LIBELLE_SIGNAL = {
  fort: "signal fort",
  moyen: "signal moyen",
  faible: "signal faible",
  "hors-ligne": "hors ligne",
} as const;

const ETATS_FENETRE: EtatFenetre[] = ["fermee", "entrouverte", "ouverte"];

/**
 * Carte d'un ouvrant.
 *
 * HIÉRARCHIE. Un habitant pense « Salon → baie vitrée → volet », pas
 * « capteur 2 → batterie → radio → actionneur ». La carte affiche donc par
 * défaut ce qui sert à décider — état du volet, état de la fenêtre, mode —
 * et range derrière « Détails » ce qui relève du diagnostic : angle des
 * lames, batterie, signal, dernière action, réglages fins.
 *
 * RÈGLE DU CALME. Une batterie à 91 % et un signal fort n'apprennent rien :
 * ils ne sortent du repli que lorsqu'ils posent problème. Le normal reste
 * silencieux, l'anormal remonte — jusqu'en haut de l'écran Pièces, via la
 * liste d'anomalies dérivée dans `lib/mock/logement.ts`.
 *
 * Rien n'est supprimé : tout reste atteignable en un geste.
 */
export function OuvrantCard({ ouvrant, piece }: { ouvrant: Ouvrant; piece: string }) {
  const { reglerLevee, reglerInclinaison, reglerFenetre, reglerMode } = useEtatDemo();
  const idBase = useId();
  const derniereAction = derniereActionPour(ouvrant.id);
  const batterieFaible = ouvrant.batteriePct <= BATTERIE_FAIBLE_PCT;
  const horsLigne = ouvrant.signal === "hors-ligne";
  const ouverture = tauxOuverture({ levee: ouvrant.levee, inclinaison: ouvrant.inclinaison });
  const aVolet = ouvrant.type !== "fenetre";
  const aFenetre = ouvrant.etatFenetre !== undefined;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface-panneau p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{ouvrant.nom}</h3>
          <p className="text-xs text-muted-foreground">
            {LIBELLE_TYPE[ouvrant.type]} · façade {ouvrant.orientation}
          </p>
        </div>
        {aVolet ? (
          <div className="text-right">
            <p className="font-mono text-lg leading-none">{ouverture}&nbsp;%</p>
            <p className="text-xs text-muted-foreground">ouvert</p>
          </div>
        ) : null}
      </div>

      {/* Anomalies : seul cas où l'état technique s'affiche sans être demandé. */}
      {batterieFaible || horsLigne ? (
        <p className="flex items-center gap-1.5 text-xs text-[color:var(--color-alerte-texte)]">
          {horsLigne ? (
            <WifiOff className="size-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <BatteryLow className="size-3.5 shrink-0" aria-hidden="true" />
          )}
          {horsLigne ? "Hors ligne" : `Batterie faible — ${ouvrant.batteriePct} %`}
        </p>
      ) : null}

      {aFenetre ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Fenêtre</span>
          <div
            className="flex rounded-lg border border-border p-0.5"
            role="group"
            aria-label={`Fenêtre — ${ouvrant.nom}`}
          >
            {ETATS_FENETRE.map((etat) => (
              <button
                key={etat}
                type="button"
                onClick={() => reglerFenetre(ouvrant.id, etat)}
                aria-pressed={ouvrant.etatFenetre === etat}
                className={`rounded-[var(--radius-sm)] px-2 py-1 text-xs transition-colors ${
                  ouvrant.etatFenetre === etat
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {LIBELLE_FENETRE[etat]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex rounded-lg border border-border p-0.5"
          role="group"
          aria-label={`Mode de pilotage — ${ouvrant.nom}`}
        >
          {(["auto", "manuel"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => reglerMode(ouvrant.id, mode)}
              aria-pressed={ouvrant.mode === mode}
              className={`rounded-[var(--radius-sm)] px-2.5 py-1 text-xs capitalize transition-colors ${
                ouvrant.mode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Détails : réglage fin et diagnostic ─── */}
      <details className="border-t border-border pt-2">
        <summary className="cursor-pointer list-none text-xs font-medium marker:content-none">
          Détails
        </summary>

        <div className="mt-3 flex flex-col gap-3">
          {aVolet ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idBase}-levee`} className="flex justify-between text-xs">
                  <span>Ouverture du tablier</span>
                  <span className="font-mono">{Math.round(ouvrant.levee)}&nbsp;%</span>
                </label>
                <input
                  id={`${idBase}-levee`}
                  type="range"
                  min={0}
                  max={LEVEE_MAX}
                  step={5}
                  value={Math.round(ouvrant.levee)}
                  onChange={(e) => reglerLevee(ouvrant.id, Number(e.target.value))}
                  aria-label={`Ouverture du tablier — ${ouvrant.nom}, ${piece}`}
                  aria-valuetext={`${Math.round(ouvrant.levee)} pour cent`}
                  className="h-2 w-full cursor-pointer accent-[color:var(--primary)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idBase}-inclinaison`} className="flex justify-between text-xs">
                  <span>Orientation des lames</span>
                  <span className="font-mono">{Math.round(ouvrant.inclinaison)}°</span>
                </label>
                <input
                  id={`${idBase}-inclinaison`}
                  type="range"
                  min={0}
                  max={INCLINAISON_MAX}
                  step={5}
                  value={Math.round(ouvrant.inclinaison)}
                  onChange={(e) => reglerInclinaison(ouvrant.id, Number(e.target.value))}
                  aria-label={`Orientation des lames — ${ouvrant.nom}, ${piece}`}
                  aria-valuetext={`${Math.round(ouvrant.inclinaison)} degrés — ${libelleInclinaison(ouvrant.inclinaison)}`}
                  className="h-2 w-full cursor-pointer accent-[color:var(--primary)]"
                />
                <p className="font-mono text-xs text-muted-foreground">
                  {libelleInclinaison(ouvrant.inclinaison)}
                </p>
              </div>
            </>
          ) : null}

          <dl className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-2 font-mono text-xs text-muted-foreground">
            <div className="flex gap-1.5">
              <dt>batterie</dt>
              <dd className={batterieFaible ? "text-[color:var(--color-alerte-texte)]" : undefined}>
                {ouvrant.batteriePct}&nbsp;%
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt>liaison</dt>
              <dd className={horsLigne ? "text-[color:var(--color-alerte-texte)]" : undefined}>
                {LIBELLE_SIGNAL[ouvrant.signal]}
              </dd>
            </div>
          </dl>

          {derniereAction ? (
            <p className="text-xs text-muted-foreground">
              <span className="font-mono">{derniereAction.heure}</span> —{" "}
              {derniereAction.libelle.toLowerCase()} : {derniereAction.raison}
              {derniereAction.parQui ? ` (${derniereAction.parQui})` : ""}.
            </p>
          ) : null}
        </div>
      </details>
    </article>
  );
}
