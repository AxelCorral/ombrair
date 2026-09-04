import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Système d'actions du site.
 *
 * POURQUOI. « Demander un devis » existait en cinq variantes légèrement
 * différentes (h-9 / h-10 / h-11, px-4 / px-5 / px-6, `border-foreground/25`
 * ici, `border-border` là), recopiées à la main dans chaque page. Le CTA
 * principal du site n'avait donc pas de forme stable.
 *
 * Trois niveaux, pas plus :
 *
 *   principal   l'action que la page veut vraiment (un seul par écran)
 *   second      alternative de même nature, de poids inférieur
 *   discret     sortie latérale, jamais mise en avant
 *
 * Rayon 5 px (`rounded-lg` = `--radius`), aucune ombre, aucun dégradé.
 */

type Niveau = "principal" | "second" | "discret";

const BASE =
  "inline-flex h-11 w-fit items-center justify-center rounded-lg px-6 text-[0.9375rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const NIVEAUX: Record<Niveau, string> = {
  principal: "bg-primary text-primary-foreground hover:bg-primary/85",
  second: "border border-border text-foreground hover:bg-surface-panneau",
  discret: "px-0 text-foreground underline-offset-4 hover:underline",
};

/**
 * Variante posée sur un fond Encre : les couleurs d'action normales
 * disparaîtraient dessus.
 */
const NIVEAUX_ENCRE: Record<Niveau, string> = {
  principal: "bg-encre-foreground text-encre hover:bg-encre-foreground/85",
  second: "border border-encre-border text-encre-foreground hover:bg-encre-foreground/10",
  discret: "px-0 text-encre-foreground underline-offset-4 hover:underline",
};

export function ActionLien({
  href,
  children,
  niveau = "principal",
  surEncre = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  niveau?: Niveau;
  surEncre?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(BASE, (surEncre ? NIVEAUX_ENCRE : NIVEAUX)[niveau], className)}
    >
      {children}
    </Link>
  );
}

/**
 * Lien textuel avec flèche. La flèche avance de 3 px au survol — c'est la
 * seule micro-interaction des liens du site, et elle est neutralisée sous
 * `prefers-reduced-motion`.
 */
export function LienFleche({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex w-fit items-center gap-2 text-[0.9375rem] font-medium text-foreground",
        "underline decoration-border decoration-1 underline-offset-[6px] transition-colors hover:decoration-foreground",
        className
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="translate-x-0 transition-transform duration-200 group-hover:translate-x-[3px] motion-reduce:transform-none motion-reduce:transition-none"
      >
        →
      </span>
    </Link>
  );
}
