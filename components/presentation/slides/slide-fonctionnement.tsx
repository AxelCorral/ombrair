"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { SlideFrame } from "@/components/presentation/slide-frame";
import { Lame } from "@/components/shared/lame";
import { meteo } from "@/lib/mock/scenario";
import { temperatureInterieureMoyenneC } from "@/lib/mock/logement";
import { cn } from "@/lib/utils";

const ECART = Math.round((meteo.exterieurC - temperatureInterieureMoyenneC) * 10) / 10;

function fmt(valeur: number) {
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

const ETAPES = [
  { titre: "Mesurer", detail: "Le capteur relève l'intérieur et l'extérieur." },
  { titre: "Analyser", detail: "Le système compare les deux valeurs." },
  { titre: "Agir", detail: "Le volet motorisé se ferme." },
  { titre: "Rendre compte", detail: "L'application affiche le nouvel état." },
];

const DELAIS = [700, 1400, 2200, 3200];

export function SlideFonctionnement() {
  const [etape, setEtape] = useState(0);
  const [cle, setCle] = useState(0);

  useEffect(() => {
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduit) {
      setEtape(ETAPES.length);
      return;
    }
    setEtape(0);
    const minuteries = DELAIS.map((delai, i) => setTimeout(() => setEtape(i + 1), delai));
    return () => minuteries.forEach(clearTimeout);
  }, [cle]);

  const ouverture = etape >= 3 ? 0 : 100;

  return (
    <SlideFrame surtitre="Comment le système fonctionne" titre="Du relevé à l'action">
      <div className="grid flex-1 grid-cols-1 items-center gap-[2.5vw] lg:grid-cols-[auto_1fr]">
        {/* Fenêtre à lames — le composant du site, réutilisé tel quel. */}
        <div
          className="anim-reveal mx-auto flex aspect-[4/5] h-[min(38vh,26vw)] flex-col overflow-hidden rounded-[var(--radius-sm)] border-2 border-persienne bg-persienne"
          style={{ ["--i" as string]: 3 }}
        >
          <div className="relative flex-1">
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 bg-nuit/60" />
              <div
                className={cn(
                  "h-1/3 transition-colors duration-700 motion-reduce:transition-none",
                  ouverture === 0 ? "bg-persienne" : "bg-ambre/45"
                )}
              />
            </div>
            <div className="absolute inset-0 p-[0.6vw]">
              <Lame
                ouverture={ouverture}
                nombre={12}
                remplir
                className="h-full text-chaux transition-[gap] duration-[900ms] ease-out motion-reduce:transition-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[2vh]">
          <ol className="flex flex-col gap-[1.2vh]">
            {ETAPES.map((e, i) => {
              const actif = etape > i;
              return (
                <li
                  key={e.titre}
                  className={cn(
                    "flex items-baseline gap-[1.2vw] rounded-[var(--radius-sm)] border px-[1.2vw] py-[1.2vh] transition-all duration-500",
                    actif ? "border-chaux/50 bg-chaux/5 opacity-100" : "border-border opacity-40"
                  )}
                >
                  <span className="font-mono text-[clamp(0.65rem,0.85vw,0.95rem)] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(0.95rem,1.4vw,1.5rem)] font-bold">
                    {e.titre}
                  </span>
                  <span className="text-[clamp(0.7rem,0.9vw,1rem)] text-muted-foreground">{e.detail}</span>
                </li>
              );
            })}
          </ol>

          {/* Relevés : Ambre et Fraîche encodent ici un état thermique réel. */}
          <div className="flex flex-wrap items-center gap-[1.5vw] font-mono text-[clamp(0.9rem,1.5vw,1.7rem)]">
            <span
              className={cn(
                "transition-opacity duration-500",
                etape >= 1 ? "text-[color:var(--color-etat-chaud-texte)] opacity-100" : "opacity-25"
              )}
            >
              ext. {fmt(meteo.exterieurC)}&nbsp;°C
            </span>
            <span
              className={cn(
                "transition-opacity duration-500",
                etape >= 1 ? "text-[color:var(--color-etat-froid-texte)] opacity-100" : "opacity-25"
              )}
            >
              int. {fmt(temperatureInterieureMoyenneC)}&nbsp;°C
            </span>
            <span
              className={cn(
                "text-[clamp(0.75rem,1vw,1.1rem)] text-muted-foreground transition-opacity duration-500",
                etape >= 2 ? "opacity-100" : "opacity-0"
              )}
            >
              écart +{fmt(ECART)}&nbsp;°C → on ferme
            </span>
          </div>

          <div
            className={cn(
              "rounded-[var(--radius-sm)] border border-border px-[1.2vw] py-[1.2vh] transition-opacity duration-500",
              etape >= 4 ? "opacity-100" : "opacity-0"
            )}
            aria-live="polite"
          >
            <p className="font-mono text-[clamp(0.65rem,0.85vw,0.95rem)] text-muted-foreground">
              application
            </p>
            <p className="text-[clamp(0.85rem,1.15vw,1.3rem)]">
              Volets fermés — prochaine ouverture prévue quand l&apos;air extérieur repassera sous
              l&apos;intérieur.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[2.5vh] flex shrink-0 flex-wrap items-center justify-between gap-[1.5vw]">
        <p className="text-[clamp(0.7rem,0.9vw,1rem)] text-muted-foreground italic">
          Scénario de démonstration — aucun gain de température n&apos;est garanti. Le soir, la règle
          s&apos;inverse : extérieur plus frais, on ouvre.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCle((k) => k + 1);
          }}
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border px-[1vw] py-[0.8vh] font-mono text-[clamp(0.65rem,0.85vw,0.95rem)] transition-colors hover:bg-chaux/10"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          rejouer
        </button>
      </div>
    </SlideFrame>
  );
}
