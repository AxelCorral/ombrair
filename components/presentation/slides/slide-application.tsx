import { SlideFrame } from "@/components/presentation/slide-frame";
import { meteo, prochaineAction } from "@/lib/mock/scenario";
import { temperatureInterieureMoyenneC } from "@/lib/mock/logement";
import { optionOmbrairPlus } from "@/lib/tarifs";

const FAMILLES = [
  { titre: "Piloter", items: "Ouvrir, fermer, verrouiller chaque ouvrant." },
  { titre: "Surveiller", items: "Statut, capteurs, état des équipements, historique, notifications." },
  { titre: "Automatiser", items: "Mode auto, programmes et scénarios." },
  { titre: "Être assisté", items: "Réglages, appairage guidé, suivi et assistance." },
];

function fmt(valeur: number) {
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function SlideApplication() {
  const ecart = Math.round((meteo.exterieurC - temperatureInterieureMoyenneC) * 10) / 10;

  return (
    <SlideFrame surtitre="Accès inclus à vie avec l'achat" titre="Toute l'installation dans une seule application">
      <div className="grid flex-1 grid-cols-1 items-center gap-[3vw] lg:grid-cols-[auto_1fr]">
        {/* Reproduction de l'écran d'accueil, alimentée par les mêmes
            données simulées que la démo /app — pas d'invention. */}
        <div
          className="anim-reveal mx-auto flex h-[min(50vh,34vw)] w-[calc(min(50vh,34vw)*0.52)] flex-col overflow-hidden rounded-[var(--radius-lg)] border-4 border-persienne bg-nuit"
          style={{ ["--i" as string]: 3 }}
        >
          <div aria-hidden="true" className="mx-auto mt-[1vh] h-[0.5vh] w-8 rounded-full bg-chaux/25" />
          <div className="flex flex-1 flex-col gap-[1.4vh] p-[1vw]">
            <p className="font-mono text-[clamp(0.5rem,0.62vw,0.72rem)] text-muted-foreground">accueil</p>
            <div>
              <p className="font-mono text-[clamp(0.95rem,1.5vw,1.7rem)] text-[color:var(--color-etat-froid-texte)]">
                {fmt(temperatureInterieureMoyenneC)}&nbsp;°C
              </p>
              <p className="font-mono text-[clamp(0.6rem,0.85vw,0.95rem)] text-[color:var(--color-etat-chaud-texte)]">
                ext. {fmt(meteo.exterieurC)}&nbsp;°C
              </p>
            </div>
            <p className="text-[clamp(0.55rem,0.72vw,0.82rem)] leading-snug">
              Volets fermés — l&apos;extérieur est à {fmt(ecart)}&nbsp;°C au-dessus de l&apos;intérieur.
            </p>
            <div className="rounded-[var(--radius-sm)] border border-border p-[0.6vw]">
              <p className="font-mono text-[clamp(0.5rem,0.62vw,0.72rem)] text-muted-foreground">
                prochaine action
              </p>
              <p className="font-mono text-[clamp(0.6rem,0.85vw,0.95rem)]">
                {prochaineAction.heure} — {prochaineAction.libelle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[1.6vh]">
          {FAMILLES.map((famille, i) => (
            <div
              key={famille.titre}
              className="anim-reveal-x border-l-2 border-chaux/60 pl-[1.2vw]"
              style={{ ["--i" as string]: 4 + i }}
            >
              <p className="font-display text-[clamp(1rem,1.6vw,1.8rem)] font-bold">{famille.titre}</p>
              <p className="text-[clamp(0.75rem,1vw,1.15rem)] text-muted-foreground">{famille.items}</p>
            </div>
          ))}

          <div
            className="anim-reveal mt-[1vh] rounded-[var(--radius-sm)] bg-chaux px-[1.4vw] py-[1.4vh] text-nuit"
            style={{ ["--i" as string]: 9 }}
          >
            <p className="font-display text-[clamp(0.95rem,1.35vw,1.5rem)] font-bold">
              Accès à vie inclus — aucun abonnement obligatoire
            </p>
            <p className="mt-1 text-[clamp(0.7rem,0.88vw,1rem)] text-nuit/75">
              {optionOmbrairPlus.nom} ({optionOmbrairPlus.prix} {optionOmbrairPlus.unite}) reste une option
              facultative.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
