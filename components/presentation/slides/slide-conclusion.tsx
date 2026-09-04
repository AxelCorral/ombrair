const BRIQUES = [
  { nom: "Capteurs", detail: "conçus et fabriqués" },
  { nom: "Volets et fenêtres", detail: "sélectionnés et posés" },
  { nom: "Application", detail: "incluse à vie" },
  { nom: "Installation", detail: "pose et configuration" },
  { nom: "Maintenance", detail: "suivi et assistance" },
];

export function SlideConclusion() {
  return (
    <section className="flex h-full w-full flex-col justify-center px-[6vw] py-[5vh]">
      <ul className="flex flex-wrap justify-center gap-[1.2vw]">
        {BRIQUES.map((brique, i) => (
          <li
            key={brique.nom}
            className="anim-reveal flex min-w-[9vw] flex-col items-center rounded-[var(--radius-sm)] border border-border px-[1.4vw] py-[1.8vh] text-center"
            style={{ ["--i" as string]: i }}
          >
            <span className="font-display text-[clamp(0.9rem,1.3vw,1.5rem)] font-bold">{brique.nom}</span>
            <span className="mt-1 text-[clamp(0.65rem,0.85vw,0.95rem)] text-muted-foreground">
              {brique.detail}
            </span>
          </li>
        ))}
      </ul>

      {/* Convergence : les traits descendent des briques vers Ombrair. */}
      <div aria-hidden="true" className="my-[2vh] flex justify-center">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="h-[6vh] w-[60vw]">
          {[40, 120, 200, 280, 360].map((x, i) => (
            <path
              key={x}
              d={`M ${x} 0 L 200 58`}
              className="anim-trace stroke-border"
              strokeWidth="1"
              fill="none"
              style={{ ["--trace-longueur" as string]: 220, ["--i" as string]: 5 + i }}
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-col items-center text-center">
        <p
          className="anim-reveal font-display text-[clamp(2.2rem,5vw,5rem)] leading-none font-bold tracking-tight"
          style={{ ["--i" as string]: 11 }}
        >
          Ombrair
        </p>
        <p
          className="anim-reveal mt-[3vh] max-w-[24ch] font-display text-[clamp(1.1rem,2vw,2.4rem)] leading-tight font-bold"
          style={{ ["--i" as string]: 12 }}
        >
          Du capteur au service, une solution intégrée.
        </p>
        <p
          className="anim-reveal mt-[2.5vh] text-[clamp(0.85rem,1.2vw,1.4rem)] text-muted-foreground"
          style={{ ["--i" as string]: 13 }}
        >
          La fraîcheur, avant la chaleur.
        </p>
      </div>

    </section>
  );
}
