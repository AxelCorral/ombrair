import { SlideFrame } from "@/components/presentation/slide-frame";
import { accesAppInclus, gammes } from "@/lib/tarifs";
import { formatPrix, getPrixProduit, offreParId } from "@/lib/offres";

/** Qui fabrique quoi, en une ligne — le point à ne pas laisser flou. */
const ORIGINE: Record<string, string> = {
  capteur: "Conçu et fabriqué par Ombrair",
  volet: "Fabricant spécialisé, installé par Ombrair",
  fenetre: "Fabricant spécialisé, installé par Ombrair",
};

export function SlideGammes() {
  return (
    <SlideFrame surtitre="Trois produits qui fonctionnent ensemble" titre="Capteur · Volet · Fenêtre">
      <div className="grid flex-1 grid-cols-1 gap-[2vw] md:grid-cols-3">
        {gammes.map((gamme, i) => (
          <article
            key={gamme.id}
            className="anim-reveal flex flex-col rounded-[var(--radius-sm)] border border-border px-[1.5vw] py-[2.5vh]"
            style={{ ["--i" as string]: 3 + i }}
          >
            <div aria-hidden="true" className="mb-[2vh] flex flex-col gap-[0.4vh]">
              {[0, 1, 2].map((n) => (
                <span key={n} className="h-[0.4vh] w-full rounded-[2px] bg-chaux/25" />
              ))}
            </div>

            <h3 className="font-display text-[clamp(1.3rem,2.2vw,2.6rem)] font-bold">
              {gamme.nom.replace("Ombrair ", "")}
            </h3>

            <p className="mt-[0.6vh] font-mono text-[clamp(0.65rem,0.85vw,0.95rem)] text-muted-foreground">
              {gamme.role}
            </p>

            {/* Prix produit seul, lu depuis la grille centrale. */}
            <p className="mt-[1.5vh] font-mono text-[clamp(1.4rem,2.4vw,2.8rem)] leading-none">
              {formatPrix(getPrixProduit(gamme.offre))}
            </p>
            <p className="mt-[0.8vh] font-mono text-[clamp(0.65rem,0.85vw,0.95rem)] text-muted-foreground">
              {offreParId(gamme.offre).unite}
            </p>

            <div className="mt-[2vh] border-t border-border pt-[1.5vh]">
              <p className="font-mono text-[clamp(0.6rem,0.75vw,0.85rem)] tracking-[0.12em] text-muted-foreground uppercase">
                Origine
              </p>
              <p className="mt-[0.6vh] font-display text-[clamp(0.9rem,1.25vw,1.4rem)] font-bold">
                {ORIGINE[gamme.id]}
              </p>
              <p className="mt-[1.2vh] text-[clamp(0.72rem,0.95vw,1.1rem)] text-muted-foreground">
                {gamme.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div
        className="anim-reveal mt-[3vh] shrink-0 rounded-[var(--radius-sm)] bg-chaux px-[1.5vw] py-[1.6vh] text-center text-nuit"
        style={{ ["--i" as string]: 7 }}
      >
        <p className="font-display text-[clamp(0.95rem,1.4vw,1.6rem)] font-bold">{accesAppInclus}</p>
      </div>

      <p
        className="anim-reveal mt-[1.5vh] shrink-0 text-center text-[clamp(0.7rem,0.9vw,1rem)] text-muted-foreground"
        style={{ ["--i" as string]: 8 }}
      >
        Prix du produit seul ; l&apos;installation Ombrair s&apos;ajoute en option. Offre Pro sur devis pour bailleurs, EHPAD et
        établissements scolaires.
      </p>
    </SlideFrame>
  );
}
