const LAMES_RIDEAU = Array.from({ length: 9 });

const BRIQUES = ["Capteurs", "Équipements motorisés", "Application", "Installation", "Maintenance"];

export function SlideIntro() {
  return (
    <section className="relative flex h-full w-full flex-col justify-center px-[6vw]">
      {/* Rideau de lames : couvre l'écran puis se rétracte. En reduced
          motion il est simplement absent (scaleY 0), sans clignotement. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 flex flex-col">
        {LAMES_RIDEAU.map((_, i) => (
          <div
            key={i}
            className="anim-lame-ouvre flex-1 bg-persienne"
            style={{ ["--i" as string]: LAMES_RIDEAU.length - 1 - i }}
          />
        ))}
      </div>

      <p
        className="anim-reveal font-mono text-[clamp(0.7rem,0.9vw,1rem)] tracking-[0.2em] text-muted-foreground uppercase"
        style={{ ["--i" as string]: 7 }}
      >
        Ombrair — produits et services
      </p>

      <h1
        className="anim-reveal mt-[3vh] max-w-[18ch] font-display text-[clamp(2.4rem,5.4vw,5.6rem)] leading-[1.02] font-bold tracking-tight"
        style={{ ["--i" as string]: 8 }}
      >
        Une solution complète pour automatiser les ouvrants du logement
      </h1>

      <ul className="mt-[5vh] flex flex-wrap gap-x-[2vw] gap-y-3">
        {BRIQUES.map((brique, i) => (
          <li
            key={brique}
            className="anim-reveal flex items-center gap-[1vw] text-[clamp(0.85rem,1.15vw,1.35rem)] text-muted-foreground"
            style={{ ["--i" as string]: 9 + i }}
          >
            {i > 0 ? <span aria-hidden="true" className="text-border">·</span> : null}
            {brique}
          </li>
        ))}
      </ul>

    </section>
  );
}
