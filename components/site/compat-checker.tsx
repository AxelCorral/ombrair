"use client";

import { useId, useState } from "react";
import Link from "next/link";

type Motorisation = "electrique" | "manuel" | null;
type Commande = "filaire" | "radio" | "sais-pas" | null;

/**
 * Vérificateur basé sur des critères techniques génériques (motorisation,
 * type de commande) plutôt que sur une liste de marques réelles : Ombrair
 * étant fictif, associer une marque existante à une compatibilité inventée
 * serait une fausse affirmation sur un produit réel.
 */
export function CompatChecker() {
  const [motorisation, setMotorisation] = useState<Motorisation>(null);
  const [commande, setCommande] = useState<Commande>(null);
  const groupeMotorisation = useId();
  const groupeCommande = useId();

  let resultat: { titre: string; texte: string; ton: "ok" | "info" | "non" } | null = null;

  if (motorisation === "manuel") {
    resultat = {
      titre: "Un module de pilotage ne suffira pas",
      texte:
        "Le module se clipse dans le coffre d'un volet déjà motorisé. Pour des volets manuels, il faut poser un volet motorisé.",
      ton: "non",
    };
  } else if (motorisation === "electrique" && commande === "sais-pas") {
    resultat = {
      titre: "Informations insuffisantes",
      texte:
        "On ne peut pas conclure sans savoir comment vos volets sont pilotés aujourd'hui. Un technicien peut vérifier sur place lors du devis.",
      ton: "info",
    };
  } else if (motorisation === "electrique" && (commande === "filaire" || commande === "radio")) {
    resultat = {
      titre: "Compatible (démonstration)",
      texte:
        "Sur la base des critères indiqués, vos volets relèvent du cas prévu par le module de pilotage. Ceci est une simulation à titre d'exemple, pas une validation technique de votre installation réelle.",
      ton: "ok",
    };
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
      <div>
        <p className="t-caption tracking-wide text-muted-foreground uppercase">Données de démonstration fictives</p>
        <h3 className="font-display text-xl font-bold">Vérificateur de compatibilité</h3>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="t-support font-medium">Vos volets roulants sont-ils déjà motorisés électriquement ?</legend>
        {(
          [
            ["electrique", "Oui, ils sont électriques"],
            ["manuel", "Non, ils sont manuels (manivelle ou sangle)"],
          ] as const
        ).map(([valeur, label]) => (
          <label key={valeur} className="flex items-center gap-2 t-support">
            <input
              type="radio"
              name={groupeMotorisation}
              value={valeur}
              checked={motorisation === valeur}
              onChange={() => {
                setMotorisation(valeur);
                setCommande(null);
              }}
              className="accent-[color:var(--primary)]"
            />
            {label}
          </label>
        ))}
      </fieldset>

      {motorisation === "electrique" ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="t-support font-medium">Comment sont-ils pilotés aujourd&apos;hui ?</legend>
          {(
            [
              ["filaire", "Avec un interrupteur filaire"],
              ["radio", "Avec une télécommande radio"],
              ["sais-pas", "Je ne sais pas"],
            ] as const
          ).map(([valeur, label]) => (
            <label key={valeur} className="flex items-center gap-2 t-support">
              <input
                type="radio"
                name={groupeCommande}
                value={valeur}
                checked={commande === valeur}
                onChange={() => setCommande(valeur)}
                className="accent-[color:var(--primary)]"
              />
              {label}
            </label>
          ))}
        </fieldset>
      ) : null}

      {resultat ? (
        <div role="status" className="rounded-lg border border-border bg-muted p-4">
          <p className="t-support font-medium">{resultat.titre}</p>
          <p className="mt-1 t-support text-muted-foreground">{resultat.texte}</p>
          {resultat.ton === "non" ? (
            <Link href="/gammes/volet" className="mt-2 inline-block t-support font-medium underline underline-offset-4">
              Voir le volet Ombrair →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
