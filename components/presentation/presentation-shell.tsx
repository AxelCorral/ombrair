"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from "lucide-react";
import { notesSlides } from "@/lib/presentation/slides";
import { cn } from "@/lib/utils";

interface PresentationShellProps {
  slides: React.ReactNode[];
}

export function PresentationShell({ slides }: PresentationShellProps) {
  const [index, setIndex] = useState(0);
  const [pleinEcran, setPleinEcran] = useState(false);
  const [notesVisibles, setNotesVisibles] = useState(false);
  const conteneurRef = useRef<HTMLDivElement>(null);

  const total = slides.length;
  const suivant = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);
  const precedent = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  const basculerPleinEcran = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    function onChangement() {
      setPleinEcran(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onChangement);
    return () => document.removeEventListener("fullscreenchange", onChangement);
  }, []);

  useEffect(() => {
    function onTouche(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          event.preventDefault();
          suivant();
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          precedent();
          break;
        case "Home":
          event.preventDefault();
          setIndex(0);
          break;
        case "End":
          event.preventDefault();
          setIndex(total - 1);
          break;
        case "f":
        case "F":
          basculerPleinEcran();
          break;
        case "n":
        case "N":
          setNotesVisibles((v) => !v);
          break;
        case "Escape":
          setNotesVisibles(false);
          break;
      }
    }
    window.addEventListener("keydown", onTouche);
    return () => window.removeEventListener("keydown", onTouche);
  }, [suivant, precedent, total, basculerPleinEcran]);

  // Le focus reste sur la scène pour que le clavier fonctionne sans souris.
  useEffect(() => {
    conteneurRef.current?.focus();
  }, []);

  function onClicScene(event: React.MouseEvent<HTMLDivElement>) {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const position = (event.clientX - left) / width;
    if (position < 0.2) precedent();
    else suivant();
  }

  const note = notesSlides[index];

  return (
    <div
      ref={conteneurRef}
      tabIndex={-1}
      className="dark fixed inset-0 flex flex-col overflow-hidden bg-nuit text-chaux outline-none"
    >
      <div
        role="presentation"
        onClick={onClicScene}
        className="relative flex-1 cursor-pointer overflow-hidden"
      >
        {/* Seule la diapositive courante est montée : c'est ce qui garantit
            que ses animations d'entrée se jouent à l'arrivée, et non toutes
            en même temps au chargement de la page. */}
        <div key={index} className="anim-fondu absolute inset-0">
          {slides[index]}
        </div>
      </div>

      {/* Barre de contrôle — le clic ne doit pas faire avancer la scène. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex shrink-0 items-center gap-4 border-t border-border px-6 py-2.5"
      >
        <ol className="flex flex-1 gap-1.5" aria-label="Progression">
          {slides.map((_, i) => (
            <li key={i} className="flex-1">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Aller à la diapositive ${i + 1} : ${notesSlides[i]?.titreCourt ?? ""}`}
                aria-current={i === index ? "step" : undefined}
                className={cn(
                  "h-1.5 w-full rounded-[var(--radius-sm)] transition-colors",
                  i <= index ? "bg-chaux" : "bg-chaux/20 hover:bg-chaux/40"
                )}
              />
            </li>
          ))}
        </ol>

        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={precedent}
            disabled={index === 0}
            aria-label="Diapositive précédente"
            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] border border-border transition-colors hover:bg-chaux/10 disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={suivant}
            disabled={index === total - 1}
            aria-label="Diapositive suivante"
            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] border border-border transition-colors hover:bg-chaux/10 disabled:opacity-30"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setNotesVisibles((v) => !v)}
            aria-pressed={notesVisibles}
            aria-label="Afficher les notes du présentateur"
            className="inline-flex h-8 items-center rounded-[var(--radius-sm)] border border-border px-2.5 font-mono text-xs transition-colors hover:bg-chaux/10"
          >
            notes
          </button>
          <button
            type="button"
            onClick={basculerPleinEcran}
            aria-label={pleinEcran ? "Quitter le plein écran" : "Passer en plein écran"}
            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] border border-border transition-colors hover:bg-chaux/10"
          >
            {pleinEcran ? (
              <Minimize className="size-4" aria-hidden="true" />
            ) : (
              <Maximize className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Notes du présentateur — pour la répétition, pas pour la projection. */}
      {notesVisibles && note ? (
        <aside
          onClick={(e) => e.stopPropagation()}
          className="absolute right-4 bottom-16 z-20 max-h-[60vh] w-[min(26rem,90vw)] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-card p-5 text-card-foreground shadow-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")} · {note.duree}&nbsp;s
              </p>
              <h2 className="font-display text-lg font-bold">{note.titreCourt}</h2>
            </div>
            <button
              type="button"
              onClick={() => setNotesVisibles(false)}
              aria-label="Fermer les notes"
              className="inline-flex size-7 items-center justify-center rounded-[var(--radius-sm)] border border-border"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-sm">{note.message}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {note.points.map((point) => (
              <li key={point} className="text-xs text-muted-foreground">
                — {point}
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-border pt-3 text-xs italic text-muted-foreground">
            {note.transition}
          </p>
        </aside>
      ) : null}
    </div>
  );
}
