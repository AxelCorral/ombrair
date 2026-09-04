"use client";

import { useId, useState, type FormEvent } from "react";

interface FormulaireContactProps {
  /** Libellé du champ "sujet" (adapté selon la page). */
  libelleSujet?: string;
  optionsSujet?: string[];
}

export function FormulaireContact({ libelleSujet = "Sujet", optionsSujet }: FormulaireContactProps) {
  const [envoye, setEnvoye] = useState(false);
  const idBase = useId();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <div role="status" className="rounded-lg border border-border bg-card p-6">
        <p className="font-display text-xl font-bold">Message envoyé (simulation)</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Aucun message n&apos;a réellement été transmis — ce formulaire est une démonstration. Dans une version
          réelle, une réponse arriverait sous quelques jours ouvrés.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idBase}-nom`} className="t-support font-medium">
            Nom
          </label>
          <input
            id={`${idBase}-nom`}
            name="nom"
            type="text"
            required
            className="h-11 rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idBase}-email`} className="t-support font-medium">
            E-mail
          </label>
          <input
            id={`${idBase}-email`}
            name="email"
            type="email"
            required
            className="h-11 rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idBase}-sujet`} className="t-support font-medium">
          {libelleSujet}
        </label>
        {optionsSujet ? (
          <select
            id={`${idBase}-sujet`}
            name="sujet"
            required
            className="h-11 rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="">Choisir…</option>
            {optionsSujet.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={`${idBase}-sujet`}
            name="sujet"
            type="text"
            required
            className="h-11 rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idBase}-message`} className="t-support font-medium">
          Message
        </label>
        <textarea
          id={`${idBase}-message`}
          name="message"
          required
          rows={5}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <p className="t-caption text-muted-foreground">
        Démonstration — aucune donnée n&apos;est réellement transmise ni conservée.
      </p>

      <button
        type="submit"
        className="inline-flex h-11 w-fit items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
      >
        Envoyer
      </button>
    </form>
  );
}
