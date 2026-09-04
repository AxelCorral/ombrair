import { SlideFrame } from "@/components/presentation/slide-frame";

const PHASES = [
  {
    titre: "Avant",
    items: ["Conseil", "Vérification de compatibilité", "Choix de la solution"],
  },
  {
    titre: "Installation",
    items: ["Fourniture des équipements", "Pose", "Configuration", "Mise en service"],
  },
  {
    titre: "Après",
    items: ["Application incluse", "Service client et assistance", "Maintenance", "Suivi des capteurs"],
  },
];

export function SlideServices() {
  return (
    <SlideFrame surtitre="Ce que nous fournissons au-delà du matériel" titre="Avant, pendant, après l'installation">
      {/* Frise : le trait se dessine, puis les colonnes apparaissent. */}
      <div aria-hidden="true" className="mb-[3vh] shrink-0">
        <svg viewBox="0 0 1000 12" preserveAspectRatio="none" className="h-3 w-full">
          <line
            x1="0"
            y1="6"
            x2="1000"
            y2="6"
            className="anim-trace stroke-border"
            strokeWidth="2"
            style={{ ["--trace-longueur" as string]: 1000, ["--i" as string]: 2 }}
          />
          {[0, 500, 1000].map((x, i) => (
            <circle
              key={x}
              cx={x === 0 ? 6 : x === 1000 ? 994 : x}
              cy="6"
              r="5"
              className="anim-reveal fill-chaux"
              style={{ ["--i" as string]: 4 + i * 2 }}
            />
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-1 items-start gap-[2vw] md:grid-cols-3">
        {PHASES.map((phase, i) => (
          <div
            key={phase.titre}
            className={`anim-reveal flex flex-col rounded-[var(--radius-sm)] px-[1.4vw] py-[2vh] ${
              i === 2 ? "bg-chaux text-nuit" : "border border-border"
            }`}
            style={{ ["--i" as string]: 4 + i * 2 }}
          >
            <p
              className={`font-mono text-[clamp(0.65rem,0.85vw,0.95rem)] tracking-[0.15em] uppercase ${
                i === 2 ? "text-nuit/60" : "text-muted-foreground"
              }`}
            >
              {phase.titre}
            </p>
            <ul className="mt-[1.5vh] flex flex-col gap-[1.2vh]">
              {phase.items.map((item) => (
                <li
                  key={item}
                  className={`text-[clamp(0.85rem,1.2vw,1.4rem)] ${
                    i === 2 ? "border-b border-nuit/15 pb-[1vh] last:border-0" : "border-b border-border pb-[1vh] last:border-0"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p
        className="anim-reveal mt-[3vh] shrink-0 text-center font-display text-[clamp(1rem,1.7vw,2rem)] font-bold"
        style={{ ["--i" as string]: 11 }}
      >
        Ombrair reste votre interlocuteur après la pose.
      </p>
    </SlideFrame>
  );
}
