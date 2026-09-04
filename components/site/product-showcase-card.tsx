import Link from "next/link";
import { PrixOffre } from "@/components/site/prix";
import type { OffreId } from "@/lib/offres";
import { ArcheProduit } from "@/components/site/arche-produit";

/**
 * Carte vitrine produit. Le visuel domine (≈ 40 % de la hauteur), cadré
 * dans une ouverture en arche qui reprend la géométrie du signe de marque —
 * référence discrète, jamais un logo posé en fond.
 *
 * Le contenu est volontairement court : trois points clés au maximum, le
 * détail vit sur la page produit. L'accès à l'application n'est pas répété
 * ici, il est présenté une fois pour les trois dans la bande écosystème.
 */
export function ProductShowcaseCard({
  role,
  nom,
  description,
  offre,
  resume,
  points,
  href,
  ctaLabel,
  visuel,
  pionniers,
}: {
  role: string;
  nom: string;
  description: string;
  /** Offre tarifaire correspondante — le prix vient de `lib/offres.ts`. */
  offre: OffreId;
  /** Ce que le montant couvre réellement, en une ligne, sous le prix. */
  resume?: string;
  points: string[];
  href: string;
  ctaLabel: string;
  visuel: React.ReactNode;
  /**
   * Mention Ombrair Pionniers, quand le nombre de capteurs du produit est
   * connu. Volontairement une prop et non un calcul interne : la carte
   * n'a pas à connaître le programme, elle se contente de lui laisser une
   * ligne — et la fenêtre, dont le compte est indéterminable, ne reçoit
   * simplement rien.
   */
  pionniers?: React.ReactNode;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-[transform,border-color] duration-300 hover:-translate-y-[3px] hover:border-foreground/35 motion-reduce:hover:translate-y-0 motion-reduce:transition-none">
      {/* Scène produit dans une ouverture en arche — voir ArcheProduit. */}
      <ArcheProduit className="shrink-0">{visuel}</ArcheProduit>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="t-eyebrow text-muted-foreground">{role}</p>
          <h3 className="mt-1.5 font-display text-2xl font-medium tracking-tight">{nom}</h3>
        </div>

        <p className="t-support leading-relaxed text-muted-foreground">{description}</p>

        {/* PRIX PRODUIT SEUL, jamais le total installé : la vitrine
            compare des produits. `resume` dit ce que le montant couvre. */}
        <div className="flex flex-col gap-1">
          <PrixOffre id={offre} />
          {resume ? (
            <span className="t-caption mt-1 leading-relaxed text-muted-foreground">{resume}</span>
          ) : null}
        </div>

        <ul className="flex flex-col gap-1.5 border-t border-border pt-4 t-support">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true" className="text-muted-foreground">
                —
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* La mention Pionniers vient APRÈS le prix, les points et l'offre
            secondaire, en corps de légende : elle informe, elle ne vend
            pas. Elle ne doit rivaliser ni avec le prix ni avec le CTA. */}
        {pionniers}

        <Link
          href={href}
          className="mt-auto inline-flex h-11 items-center justify-center rounded-lg border border-foreground/25 px-5 t-support font-medium transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
