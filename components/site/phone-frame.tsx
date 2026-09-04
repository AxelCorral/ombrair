import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Hauteur de l'écran. `courte` sert aux vues recadrées, qui montrent le
      haut d'un écran plutôt que l'écran entier. */
  taille?: "pleine" | "courte";
  /** Coupe franche en bas : l'écran continue au-delà du cadre. Le filet de
      lames sert de marque de coupure — une lumière filtrée, pas un fondu. */
  coupe?: boolean;
}

/**
 * Cadre de téléphone pour présenter la démo /app dans le site vitrine.
 * Chrome d'appareil (illustration d'objet réel) : le radius généreux est
 * volontaire ici, il représente un objet physique et ne fait pas partie
 * du système d'UI produit (qui reste à 4-6px).
 */
export function PhoneFrame({
  children,
  className,
  taille = "pleine",
  coupe = false,
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[390px] overflow-hidden rounded-[32px] border-[6px] border-persienne bg-nuit",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute top-2 left-1/2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-chaux/25"
      />
      <div className={cn("overflow-y-auto", taille === "pleine" ? "h-[640px]" : "h-[400px]")}>
        {children}
      </div>
      {coupe ? (
        <div
          aria-hidden="true"
          className="lumiere-lames absolute inset-x-0 bottom-0 h-10 border-t border-chaux/15 text-chaux/70"
        />
      ) : null}
    </div>
  );
}
