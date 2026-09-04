"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, TriangleAlert } from "lucide-react";
import { SchemaAppairage } from "@/components/app-demo/ui";
import { pieces } from "@/lib/mock/logement";

type Resultat = "trouve" | "aucun" | "echec";

const ETAPES = ["Préparer", "Rechercher", "Placer", "Vérifier"] as const;

export default function AppairagePage() {
  const [etape, setEtape] = useState(0);
  const [resultat, setResultat] = useState<Resultat>("trouve");
  const [pieceChoisie, setPieceChoisie] = useState<string>("");
  const titreRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titreRef.current?.focus();
  }, [etape]);

  const peutAvancer =
    (etape === 0) || (etape === 1 && resultat === "trouve") || (etape === 2 && pieceChoisie !== "");

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <div className="flex flex-col gap-2">
        <Link href="/app/reglages" className="flex w-fit items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Réglages
        </Link>
        <p className="text-xs text-muted-foreground">
          Étape {etape + 1} sur {ETAPES.length} — {ETAPES[etape]}
        </p>
        <div className="flex gap-1" aria-hidden="true">
          {ETAPES.map((nom, i) => (
            <span key={nom} className={`h-1 flex-1 rounded-full ${i <= etape ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
      </div>

      {etape === 0 ? (
        <section className="flex flex-col gap-3">
          <h1 ref={titreRef} tabIndex={-1} className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight outline-none">
            Préparez le capteur
          </h1>
          <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>1. Retirez la languette de la pile, ou insérez deux piles AAA.</li>
            <li>2. Appuyez trois secondes sur le bouton au dos, jusqu&apos;à ce que la diode clignote.</li>
            <li>3. Restez à moins de cinq mètres d&apos;Ombrair Link pendant l&apos;appairage.</li>
          </ol>

          {/* Le dessin dit où appuyer ; les trois lignes ci-dessus disent
              quand et combien de temps. Voir SchemaAppairage. */}
          <div className="mt-4 rounded-lg bg-surface-panneau p-5 text-foreground">
            <SchemaAppairage />
          </div>
        </section>
      ) : null}

      {etape === 1 ? (
        <section className="flex flex-col gap-4">
          <h1 ref={titreRef} tabIndex={-1} className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight outline-none">
            Recherche des capteurs
          </h1>

          <fieldset className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-3">
            <legend className="px-1 text-[11px] tracking-wide text-muted-foreground uppercase">
              Contrôle de démonstration — choisir le cas à afficher
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["trouve", "Capteur trouvé"],
                  ["aucun", "Aucun capteur"],
                  ["echec", "Échec d'appairage"],
                ] as const
              ).map(([valeur, label]) => (
                <button
                  key={valeur}
                  type="button"
                  onClick={() => setResultat(valeur)}
                  aria-pressed={resultat === valeur}
                  className={`rounded-[var(--radius-sm)] border px-2.5 py-1 text-xs transition-colors ${
                    resultat === valeur
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          {resultat === "trouve" ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-panneau p-4">
              <Check className="size-4 shrink-0 text-[color:var(--color-etat-froid)]" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Capteur intérieur OMB-4821</p>
                <p className="text-xs text-muted-foreground">Signal fort · batterie 100 %</p>
              </div>
            </div>
          ) : null}

          {resultat === "aucun" ? (
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-panneau p-4">
              <p className="text-sm font-medium">Aucun capteur détecté</p>
              <p className="text-xs text-muted-foreground">
                La diode du capteur doit clignoter pendant la recherche. Si elle est éteinte, appuyez de nouveau
                trois secondes sur le bouton au dos. Si elle reste fixe, le capteur est déjà appairé à un autre
                foyer : maintenez le bouton dix secondes pour le réinitialiser.
              </p>
            </div>
          ) : null}

          {resultat === "echec" ? (
            <div
              role="alert"
              className="flex flex-col gap-2 rounded-lg border border-[color:var(--color-alerte)]/50 bg-[color:var(--color-alerte)]/10 p-4"
            >
              <p className="flex items-center gap-2 text-sm font-medium">
                <TriangleAlert className="size-4 shrink-0 text-[color:var(--color-alerte-texte)]" aria-hidden="true" />
                L&apos;appairage n&apos;a pas abouti
              </p>
              <p className="text-xs text-foreground/90">
                Le capteur a répondu, puis la liaison s&apos;est interrompue. Rapprochez-le d&apos;Ombrair Link, puis
                relancez la recherche. Si l&apos;échec se répète au même endroit, un mur porteur ou un tableau
                électrique bloque probablement le signal : essayez une autre position dans la pièce.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {etape === 2 ? (
        <section className="flex flex-col gap-4">
          <h1 ref={titreRef} tabIndex={-1} className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight outline-none">
            Dans quelle pièce ?
          </h1>
          <div className="flex flex-col gap-2">
            {pieces.map((piece) => (
              <label
                key={piece.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface-panneau px-4 py-3 text-sm"
              >
                <input
                  type="radio"
                  name="piece-capteur"
                  checked={pieceChoisie === piece.id}
                  onChange={() => setPieceChoisie(piece.id)}
                  className="accent-[color:var(--primary)]"
                />
                {piece.nom}
              </label>
            ))}
          </div>
        </section>
      ) : null}

      {etape === 3 ? (
        <section className="flex flex-col gap-3">
          <h1 ref={titreRef} tabIndex={-1} className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight outline-none">
            Capteur ajouté
          </h1>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-panneau p-4">
            <Check className="size-4 shrink-0 text-[color:var(--color-etat-froid)]" aria-hidden="true" />
            <p className="text-sm">
              OMB-4821 est associé à la pièce{" "}
              <span className="font-medium">{pieces.find((p) => p.id === pieceChoisie)?.nom}</span>.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Le premier relevé arrive sous une à deux minutes. Tant qu&apos;il n&apos;est pas reçu, la pièce
            n&apos;est pas encore pilotée automatiquement.
          </p>
          <p className="text-xs text-muted-foreground">
            Démonstration : aucun capteur n&apos;a réellement été ajouté au scénario.
          </p>
        </section>
      ) : null}

      <div className="mt-auto flex justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={() => setEtape((e) => Math.max(0, e - 1))}
          disabled={etape === 0}
          className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium disabled:opacity-40"
        >
          Précédent
        </button>
        {etape < ETAPES.length - 1 ? (
          <button
            type="button"
            onClick={() => setEtape((e) => e + 1)}
            disabled={!peutAvancer}
            className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            Suivant
          </button>
        ) : (
          <Link
            href="/app/reglages"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Terminer
          </Link>
        )}
      </div>
    </main>
  );
}
