import { cn } from "@/lib/utils";

/**
 * Gabarit commun à toutes les diapositives : plein écran, marges
 * généreuses, titre en Outfit et échelle typographique en clamp() pour
 * rester lisible d'un fond de salle quel que soit le vidéoprojecteur.
 */
export function SlideFrame({
  surtitre,
  titre,
  children,
  className,
}: {
  surtitre?: string;
  titre?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="flex h-full w-full flex-col px-[5vw] py-[5vh]">
      {titre ? (
        <header className="shrink-0">
          {surtitre ? (
            <p
              className="anim-reveal font-mono text-[clamp(0.7rem,0.9vw,1rem)] tracking-[0.18em] text-muted-foreground uppercase"
              style={{ ["--i" as string]: 0 }}
            >
              {surtitre}
            </p>
          ) : null}
          <h2
            className="anim-reveal mt-2 font-display text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[1.05] font-bold tracking-tight"
            style={{ ["--i" as string]: 1 }}
          >
            {titre}
          </h2>
          <div
            className="anim-reveal mt-[2.5vh] h-px w-full bg-border"
            style={{ ["--i" as string]: 2 }}
          />
        </header>
      ) : null}
      <div className={cn("flex min-h-0 flex-1 flex-col justify-center", titre && "pt-[3vh]", className)}>
        {children}
      </div>
    </section>
  );
}
