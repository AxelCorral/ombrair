import { BatteryLow, WifiOff } from "lucide-react";
import {
  BATTERIE_A_SURVEILLER_PCT,
  BATTERIE_FAIBLE_PCT,
  type Capteur,
} from "@/lib/mock/logement";

const LIBELLE_SIGNAL = {
  fort: "signal fort",
  moyen: "signal moyen",
  faible: "signal faible",
  "hors-ligne": "hors ligne",
} as const;

/**
 * Carte d'un capteur. Intérieur et extérieur n'affichent pas les mêmes
 * mesures : c'est le modèle de données qui le dit, la carte se contente de
 * rendre ce qui existe. Aucun indicateur d'usure ou de « santé » n'est
 * affiché — le projet n'en définit aucun.
 */
export function CapteurCard({ capteur }: { capteur: Capteur }) {
  const batterieFaible = capteur.batteriePct <= BATTERIE_FAIBLE_PCT;
  const batterieASurveiller = capteur.batteriePct <= BATTERIE_A_SURVEILLER_PCT;
  const horsLigne = capteur.signal === "hors-ligne";

  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border bg-surface-panneau p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium">{capteur.nom}</h3>
        <span className="rounded-[var(--radius-sm)] bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {capteur.emplacement === "exterieur" ? "extérieur" : "intérieur"}
        </span>
      </div>

      {horsLigne ? (
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <WifiOff className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>
            Hors ligne depuis {capteur.horsLigneDepuis}. Les valeurs ci-dessous sont les dernières reçues.
            Vérifiez la pile, puis relancez l&apos;appairage depuis Réglages.
          </span>
        </p>
      ) : null}

      <dl className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {capteur.mesures.map((mesure) => (
          <div key={mesure.label}>
            <dt className="text-[11px] text-muted-foreground">{mesure.label}</dt>
            <dd className="font-mono text-sm">{mesure.valeur}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-2">
        <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
          {batterieASurveiller ? (
            <BatteryLow
              className={`size-3.5 ${batterieFaible ? "text-[color:var(--color-alerte-texte)]" : ""}`}
              aria-hidden="true"
            />
          ) : null}
          batterie {capteur.batteriePct}&nbsp;%
          {batterieFaible ? (
            <span className="sr-only"> — niveau faible</span>
          ) : batterieASurveiller ? (
            <span className="sr-only"> — à surveiller</span>
          ) : null}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{LIBELLE_SIGNAL[capteur.signal]}</span>
      </div>
    </article>
  );
}
