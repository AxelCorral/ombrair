import type { EtatSimulation, NiveauLuminosite } from "@/lib/demo/day-cycle";
import { LIBELLE_FENETRE, type EtatFenetre } from "@/lib/demo/shutter";

const LIBELLE_LUM: Record<NiveauLuminosite, string> = {
  nulle: "Nulle",
  faible: "Faible",
  moyenne: "Moyenne",
  forte: "Forte",
};

function temp(valeur: number) {
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/**
 * Relevés en direct. Tout est en IBM Plex Mono : ce sont des mesures
 * d'instrument.
 *
 * Deux registres visuels, dans cet ordre de priorité :
 *  1. les deux températures et l'heure — ce qui fait comprendre le produit ;
 *  2. humidité, luminosité, volet, fenêtre — contexte, volontairement plus
 *     discret.
 *
 * L'état thermique est porté par une PASTILLE en Fraîche / Ambre (couleurs
 * de la charte, rôle de signal) tandis que le chiffre utilise la variante
 * texte accessible. La couleur n'est donc jamais le seul canal : le libellé
 * « ext. » / « int. » dit la même chose.
 */
export function LiveMeasurements({
  etat,
  tauxOuverture,
  etatFenetre,
}: {
  etat: EtatSimulation;
  tauxOuverture: number;
  etatFenetre: EtatFenetre;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-3xl leading-none font-medium tabular-nums md:text-4xl">
        {etat.heureFormatee}
      </p>

      {/* Les deux mesures qui portent la démonstration. */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1">
        <div>
          <dt className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            extérieur
          </dt>
          <dd className="mt-0.5 flex items-baseline gap-1.5 font-mono text-xl font-medium tabular-nums text-[color:var(--color-etat-chaud-texte)] md:text-2xl">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 translate-y-[-0.15em] rounded-full bg-[color:var(--color-etat-chaud)]"
            />
            {temp(etat.temperatureExterieure)}&nbsp;°C
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            intérieur
          </dt>
          <dd className="mt-0.5 flex items-baseline gap-1.5 font-mono text-xl font-medium tabular-nums text-[color:var(--color-etat-froid-texte)] md:text-2xl">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 translate-y-[-0.15em] rounded-full bg-[color:var(--color-etat-froid)]"
            />
            {temp(etat.temperatureInterieure)}&nbsp;°C
          </dd>
        </div>
      </dl>

      {/* Contexte. Même police, un cran plus bas dans la hiérarchie. */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-3 font-mono text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">volet</dt>
          <dd className="tabular-nums">{tauxOuverture}&nbsp;%</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">fenêtre</dt>
          <dd>{LIBELLE_FENETRE[etatFenetre]}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">humidité</dt>
          <dd className="tabular-nums">{etat.humiditeExterieure}&nbsp;%</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">lum.</dt>
          <dd>{LIBELLE_LUM[etat.niveauLuminosite]}</dd>
        </div>
      </dl>
    </div>
  );
}
