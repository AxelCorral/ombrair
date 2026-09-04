"use client";

import { useState } from "react";
import Link from "next/link";
import { scenarios } from "@/lib/mock/programmes";

const JOURS = ["L", "M", "M", "J", "V", "S", "D"] as const;

/** Programmation hebdomadaire simulée : plage de rafraîchissement nocturne active. */
const PROGRAMMATION = [true, true, true, true, true, true, true];

export default function ProgrammesPage() {
  const [actifs, setActifs] = useState<Record<string, boolean>>(
    Object.fromEntries(scenarios.map((s) => [s.id, s.actif]))
  );

  function basculer(id: string) {
    setActifs((prec) => ({ ...prec, [id]: !prec[id] }));
  }

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <div>
        <h1 className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight">Programmes et scénarios</h1>
        <p className="text-xs text-muted-foreground">
          Des ensembles de règles activables. Un seul scénario prioritaire s&apos;applique à la fois.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        {scenarios.map((scenario) => (
          <article key={scenario.id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface-panneau p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold">{scenario.nom}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{scenario.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={actifs[scenario.id]}
                aria-label={`Activer le scénario ${scenario.nom}`}
                onClick={() => basculer(scenario.id)}
                className={`shrink-0 rounded-[var(--radius-sm)] border px-2.5 py-1 text-xs font-medium transition-colors ${
                  actifs[scenario.id]
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {actifs[scenario.id] ? "Actif" : "Inactif"}
              </button>
            </div>

            <details className="border-t border-border pt-2">
              <summary className="cursor-pointer list-none text-xs font-medium marker:content-none">
                Règles ({scenario.regles.length})
              </summary>
              <ul className="mt-2 flex flex-col gap-2">
                {scenario.regles.map((regle) => (
                  <li key={regle.declencheur} className="rounded-lg bg-muted/40 p-3 text-xs">
                    <p>
                      <span className="text-muted-foreground">Si </span>
                      {regle.declencheur}
                    </p>
                    <p>
                      <span className="text-muted-foreground">et </span>
                      {regle.condition}
                    </p>
                    <p>
                      <span className="text-muted-foreground">alors </span>
                      {regle.action}
                    </p>
                  </li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface-panneau p-4">
        <h2 className="font-display text-base font-bold">Programmation hebdomadaire</h2>
        <p className="text-xs text-muted-foreground">
          Jours où la plage de rafraîchissement nocturne s&apos;applique.
        </p>
        <ul className="flex gap-1.5">
          {JOURS.map((jour, i) => (
            <li key={i} className="flex-1">
              <span
                className={`flex h-9 items-center justify-center rounded-lg border font-mono text-xs ${
                  PROGRAMMATION[i]
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {jour}
                <span className="sr-only">{PROGRAMMATION[i] ? " — actif" : " — inactif"}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/app/mode-auto"
        className="rounded-lg border border-border px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-muted"
      >
        Régler le mode auto
      </Link>
      <Link
        href="/app/securite"
        className="rounded-lg border border-border px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-muted"
      >
        Sécurité
      </Link>
    </main>
  );
}
