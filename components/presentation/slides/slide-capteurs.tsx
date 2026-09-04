import { SlideFrame } from "@/components/presentation/slide-frame";

const ETAPES = ["Concevoir", "Fabriquer", "Installer", "Suivre"];

/** Grandeurs explicitement prévues par le brief — rien de plus. */
const MESURES = ["Température", "Humidité", "Luminosité", "Qualité de l'air"];

/**
 * Représentation conceptuelle du capteur : un boîtier schématique à
 * lames. Volontairement non photoréaliste — aucun design industriel réel
 * n'existe dans le projet, et une fausse photo produit induirait en erreur.
 */
function CapteurSchema() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      role="img"
      aria-label="Représentation schématique d'un capteur Ombrair : un boîtier carré à lames horizontales."
    >
      <rect
        x="34"
        y="34"
        width="132"
        height="132"
        rx="5"
        className="fill-persienne stroke-border"
        strokeWidth="1.5"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x="54"
          y={62 + i * 17}
          width="92"
          height="7"
          rx="2"
          className="fill-chaux/70"
        />
      ))}
      <circle cx="150" cy="50" r="4" className="fill-chaux anim-pulse-mesure" />
    </svg>
  );
}

export function SlideCapteurs() {
  return (
    <SlideFrame surtitre="Ce que nous concevons et fabriquons" titre="Les capteurs Ombrair">
      <div className="grid flex-1 grid-cols-1 items-center gap-[3vw] lg:grid-cols-[1fr_auto_1fr]">
        <ol className="flex flex-col gap-[1.6vh]">
          {ETAPES.map((etape, i) => (
            <li
              key={etape}
              className="anim-reveal-x flex items-center gap-[1.2vw] border-l-2 border-chaux/60 pl-[1.2vw]"
              style={{ ["--i" as string]: 3 + i }}
            >
              <span className="font-mono text-[clamp(0.65rem,0.85vw,0.95rem)] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[clamp(1.1rem,1.9vw,2rem)] font-bold">{etape}</span>
            </li>
          ))}
        </ol>

        <div
          className="anim-reveal mx-auto aspect-square w-[min(26vh,18vw)] shrink-0"
          style={{ ["--i" as string]: 4 }}
        >
          <CapteurSchema />
        </div>

        <ul className="flex w-full max-w-[20vw] flex-col gap-[1.4vh] justify-self-end">
          {MESURES.map((mesure, i) => (
            <li
              key={mesure}
              className="anim-reveal rounded-[var(--radius-sm)] border border-border px-[1.2vw] py-[1.2vh] text-[clamp(0.85rem,1.15vw,1.3rem)]"
              style={{ ["--i" as string]: 6 + i }}
            >
              {mesure}
            </li>
          ))}
        </ul>
      </div>

      <p
        className="anim-reveal mt-[3vh] shrink-0 text-[clamp(0.8rem,1.05vw,1.2rem)] text-muted-foreground"
        style={{ ["--i" as string]: 11 }}
      >
        Capteurs intérieurs et extérieurs, reliés par Ombrair Link. C&apos;est la seule partie
        matérielle dont nous maîtrisons la chaîne complète.
      </p>
    </SlideFrame>
  );
}
