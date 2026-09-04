"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Hypotheses } from "@/components/shared/hypotheses";
import {
  NB_OUVRANTS_MAX,
  NB_OUVRANTS_MIN,
  bornerOuvrants,
  formatEuros,
  simuler,
  type Orientation,
  type Situation,
  type TypeLogement,
} from "@/lib/simulateur";

const SITUATIONS: { valeur: Situation; label: string; aide: string }[] = [
  {
    valeur: "volets-motorises",
    label: "J'ai des volets roulants déjà motorisés",
    aide: "Ils se commandent avec un interrupteur ou une télécommande.",
  },
  {
    valeur: "volets-manuels",
    label: "J'ai des volets, mais manuels",
    aide: "Manivelle, sangle ou cordon.",
  },
  {
    valeur: "sans-volets",
    label: "Je n'ai pas de volets",
    aide: "Ou seulement des rideaux et stores intérieurs.",
  },
  {
    valeur: "renovation-fenetres",
    label: "Je prévois aussi de changer mes fenêtres",
    aide: "Rénovation des menuiseries en même temps.",
  },
];

const ORIENTATIONS: { valeur: Orientation; label: string }[] = [
  { valeur: "sud", label: "Sud" },
  { valeur: "ouest", label: "Ouest" },
  { valeur: "est", label: "Est" },
  { valeur: "nord", label: "Nord" },
];

const LOGEMENTS: { valeur: TypeLogement; label: string }[] = [
  { valeur: "appartement", label: "Appartement" },
  { valeur: "maison", label: "Maison" },
];

/**
 * Simulateur d'orientation. Il ne remplace pas un devis : il indique quel
 * produit correspond à la situation décrite et à partir de quel montant,
 * en multipliant les tarifs publiés.
 *
 * Il n'affiche volontairement ni gain de confort en °C ni économie de
 * climatisation — voir l'en-tête de `lib/simulateur.ts`. Le bloc « ce que
 * ce simulateur ne calcule pas » l'annonce à l'écran, plutôt que de
 * laisser croire à un oubli.
 */
export function SimulateurForm() {
  const [situation, setSituation] = useState<Situation | null>(null);
  const [nbOuvrants, setNbOuvrants] = useState(4);
  const [orientation, setOrientation] = useState<Orientation>("sud");
  const [typeLogement, setTypeLogement] = useState<TypeLogement>("maison");

  const groupeSituation = useId();
  const groupeOrientation = useId();
  const groupeLogement = useId();
  const champOuvrants = useId();

  const resultat = situation
    ? simuler({ situation, nbOuvrants, orientation, typeLogement })
    : null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ─── Saisie ─── */}
      <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="flex flex-col gap-3">
          <legend className="font-display text-lg font-bold">
            1. Où en êtes-vous aujourd&apos;hui&nbsp;?
          </legend>
          <p className="text-sm text-muted-foreground">
            C&apos;est ce qui détermine le produit : le reste affine la réponse.
          </p>
          <div className="mt-1 flex flex-col gap-2">
            {SITUATIONS.map((s) => (
              <label
                key={s.valeur}
                className="flex cursor-pointer gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-muted"
              >
                <input
                  type="radio"
                  name={groupeSituation}
                  value={s.valeur}
                  checked={situation === s.valeur}
                  onChange={() => setSituation(s.valeur)}
                  className="mt-1 shrink-0 accent-[color:var(--primary)]"
                />
                <span>
                  <span className="block text-sm font-medium">{s.label}</span>
                  <span className="block text-sm text-muted-foreground">{s.aide}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3">
          <label htmlFor={champOuvrants} className="font-display text-lg font-bold">
            2. Combien d&apos;ouvrants à équiper&nbsp;?
          </label>
          <p className="text-sm text-muted-foreground">
            Comptez les fenêtres et portes-fenêtres que vous voulez piloter.
          </p>
          <div className="mt-1 flex items-center gap-4">
            <input
              id={champOuvrants}
              type="range"
              min={NB_OUVRANTS_MIN}
              max={NB_OUVRANTS_MAX}
              value={nbOuvrants}
              onChange={(e) => setNbOuvrants(bornerOuvrants(Number(e.target.value)))}
              className="h-2 flex-1 accent-[color:var(--primary)]"
            />
            <output
              htmlFor={champOuvrants}
              className="w-16 shrink-0 rounded-lg border border-border bg-card py-1 text-center font-mono text-base tabular-nums"
            >
              {nbOuvrants}
            </output>
          </div>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="font-display text-lg font-bold">
            3. Orientation principale des ouvrants
          </legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {ORIENTATIONS.map((o) => (
              <label
                key={o.valeur}
                className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-muted has-checked:font-medium"
              >
                <input
                  type="radio"
                  name={groupeOrientation}
                  value={o.valeur}
                  checked={orientation === o.valeur}
                  onChange={() => setOrientation(o.valeur)}
                  className="sr-only"
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="font-display text-lg font-bold">4. Type de logement</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {LOGEMENTS.map((l) => (
              <label
                key={l.valeur}
                className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-muted has-checked:font-medium"
              >
                <input
                  type="radio"
                  name={groupeLogement}
                  value={l.valeur}
                  checked={typeLogement === l.valeur}
                  onChange={() => setTypeLogement(l.valeur)}
                  className="sr-only"
                />
                {l.label}
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      {/* ─── Résultat ─── */}
      <div aria-live="polite" className="lg:sticky lg:top-6 lg:self-start">
        {!resultat ? (
          <div className="flex h-full min-h-64 flex-col justify-center gap-2 rounded-lg border border-dashed border-border p-8 text-center">
            <p className="t-support font-medium">Votre orientation s&apos;affichera ici</p>
            <p className="text-sm text-muted-foreground">
              Commencez par indiquer où vous en êtes aujourd&apos;hui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6">
            <div>
              <p className="t-caption tracking-wide text-muted-foreground uppercase">
                Produit recommandé
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                {resultat.nomGamme}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{resultat.raison}</p>
            </div>

            {resultat.estimation ? (
              <div className="border-t border-border pt-5">
                <p className="t-caption tracking-wide text-muted-foreground uppercase">
                  À partir de
                </p>
                <p className="mt-1 font-mono text-3xl font-medium tabular-nums">
                  {formatEuros(resultat.estimation.montantMin)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{resultat.estimation.detail}</p>
              </div>
            ) : null}

            <div className="flex flex-col gap-2 border-t border-border pt-5">
              <p className="t-support font-medium">Ce qui reste à confirmer</p>
              <ul className="flex flex-col gap-1.5">
                {resultat.surDevis.map((point) => (
                  <li key={point} className="text-sm leading-relaxed text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-5">
              <p className="t-support font-medium">Dans votre cas</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {resultat.noteOrientation}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {resultat.noteLogement}
              </p>
            </div>

            <Hypotheses points={resultat.hypotheses} />

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
              <Link
                href="/devis"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Demander un devis
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={resultat.href}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Voir la fiche produit
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
