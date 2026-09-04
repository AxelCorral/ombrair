import { BatteryLow, TriangleAlert, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Primitives d'interface de la démonstration `/app`.
 *
 * POURQUOI. Presque toute l'information de l'application vivait dans le même
 * contenant : un rectangle `rounded-lg border border-border bg-card`. Sur un
 * écran, cela donnait cinq à huit blocs identiques empilés, sans qu'aucun ne
 * dise « je suis plus important que le voisin ». En thème nuit le défaut
 * était plus net encore : `--card` est une Persienne assombrie, donc l'écran
 * entier devenait une pile de blocs verts — alors que la charte veut que
 * Persienne reste une couleur de MARQUE, pas la couleur de toutes les
 * surfaces. Les surfaces de l'app passent donc à `--surface-panneau`, qui
 * monte en Chaux et non en Persienne ; `--card` reste disponible pour le
 * site, où sa teinte fait l'ambiance nocturne saluée par l'audit.
 *
 * Cinq niveaux, du plus fort au plus discret :
 *
 *   EnTeteEcran   ce qu'on regarde et quand
 *   Panneau       la lecture principale de l'écran — un seul par écran
 *   Groupe        un chapitre : surtitre + filet, aucune bordure
 *   Ligne         une donnée dans un groupe
 *   Statut        un état, jamais porté par la seule couleur
 *
 * L'app reste compacte, utilitaire et technique : ces primitives ne
 * l'aèrent pas, elles la hiérarchisent.
 */

/* ── En-tête d'écran ──────────────────────────────────────────────────── */

export function EnTeteEcran({
  titre,
  meta,
  action,
}: {
  titre: string;
  meta?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight">
          {titre}
        </h1>
        {meta ? <p className="t-data t-caption mt-1.5 text-muted-foreground">{meta}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ── Panneau : la lecture principale ──────────────────────────────────── */

export function Panneau({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg bg-surface-panneau p-5", className)}>{children}</section>
  );
}

/* ── Groupe : un chapitre, porté par un filet et non par une bordure ──── */

export function Groupe({
  titre,
  action,
  children,
  className,
}: {
  titre: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col", className)}>
      <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
        <h2 className="t-eyebrow text-muted-foreground">{titre}</h2>
        {action}
      </div>
      <div className="pt-4">{children}</div>
    </section>
  );
}

/* ── Ligne de données ─────────────────────────────────────────────────── */

export function Ligne({
  label,
  valeur,
  className,
}: {
  label: React.ReactNode;
  valeur: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-border/70 py-2.5 last:border-b-0",
        className
      )}
    >
      <span className="t-caption text-muted-foreground">{label}</span>
      <span className="t-data t-caption text-foreground">{valeur}</span>
    </div>
  );
}

/* ── Statuts ──────────────────────────────────────────────────────────── */

/**
 * Système de statuts unique. La forme du repère porte l'information — carré
 * plein, carré vide, triangle d'alerte — et la couleur ne fait que la
 * soutenir. Chaque statut reste donc lisible en niveaux de gris, et pour
 * quelqu'un qui ne distingue pas le vert du rouge.
 *
 * Pas de capsule iOS : un repère, un libellé, rien d'autre.
 */
export type EtatStatut =
  | "auto"
  | "manuel"
  | "ouvert"
  | "ferme"
  | "hors-ligne"
  | "batterie-faible"
  | "alerte";

const STATUTS: Record<EtatStatut, { libelle: string; classe: string }> = {
  auto: { libelle: "Auto", classe: "text-foreground" },
  manuel: { libelle: "Manuel", classe: "text-muted-foreground" },
  ouvert: { libelle: "Ouvert", classe: "text-foreground" },
  ferme: { libelle: "Fermé", classe: "text-muted-foreground" },
  "hors-ligne": { libelle: "Hors ligne", classe: "text-alerte-texte" },
  "batterie-faible": { libelle: "Batterie faible", classe: "text-alerte-texte" },
  alerte: { libelle: "Alerte", classe: "text-alerte-texte" },
};

function RepereStatut({ etat }: { etat: EtatStatut }) {
  if (etat === "hors-ligne") return <WifiOff className="size-3.5 shrink-0" aria-hidden="true" />;
  if (etat === "batterie-faible")
    return <BatteryLow className="size-3.5 shrink-0" aria-hidden="true" />;
  if (etat === "alerte")
    return <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />;

  // Plein = actif ou ouvert ; contour = passif ou fermé.
  const plein = etat === "auto" || etat === "ouvert";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block size-2 shrink-0",
        plein ? "bg-current" : "border border-current bg-transparent"
      )}
    />
  );
}

export function Statut({
  etat,
  libelle,
  className,
}: {
  etat: EtatStatut;
  /** Remplace le libellé par défaut, quand le contexte le précise. */
  libelle?: string;
  className?: string;
}) {
  const { libelle: defaut, classe } = STATUTS[etat];
  return (
    <span className={cn("inline-flex items-center gap-1.5", classe, className)}>
      <RepereStatut etat={etat} />
      <span className="t-eyebrow">{libelle ?? defaut}</span>
    </span>
  );
}

/* ── Bande d'alerte ───────────────────────────────────────────────────── */

/**
 * Une alerte doit se distinguer immédiatement d'une information de routine,
 * sans pour autant remplir un grand aplat rouge : Braise est une couleur de
 * signal, pas une couleur de fond. Le repère est un montant vertical plein,
 * l'icône et le titre — la surface reste calme.
 */
export function BandeAlerte({
  titre,
  children,
  className,
}: {
  titre: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div role="status" className={cn("flex gap-3 border-l-2 border-alerte pl-4", className)}>
      <TriangleAlert
        className="mt-0.5 size-4 shrink-0 text-alerte-texte"
        aria-hidden="true"
      />
      <div>
        <p className="t-support font-medium text-alerte-texte">{titre}</p>
        {children ? <div className="t-caption mt-1.5 text-foreground">{children}</div> : null}
      </div>
    </div>
  );
}

/* ── Schéma d'appairage ───────────────────────────────────────────────── */

/**
 * Le dos du capteur, son bouton d'appairage, sa diode, et Ombrair Link à
 * portée radio.
 *
 * POURQUOI. L'écran d'appairage décrivait en trois lignes un geste physique
 * — retirer la languette, appuyer trois secondes, rester à moins de cinq
 * mètres — et laissait ensuite les deux tiers inférieurs de l'écran vides.
 * Un assistant d'installation est exactement l'endroit où le dessin
 * technique sert : il montre OÙ appuyer, ce qu'aucune phrase ne fait aussi
 * vite.
 *
 * La diode pulse pour dire ce qu'on doit voir se produire ; l'impulsion est
 * neutralisée sous `prefers-reduced-motion` par la classe du design system.
 */
export function SchemaAppairage() {
  return (
    <svg viewBox="0 0 300 120" className="w-full" role="img" aria-labelledby="titre-appairage">
      <title id="titre-appairage">
        Le bouton d&apos;appairage se trouve au dos du capteur, sous la diode. Ombrair Link doit se
        trouver à moins de cinq mètres.
      </title>

      {/* Capteur, vu de dos */}
      <rect
        x="18"
        y="20"
        width="74"
        height="86"
        rx="4"
        className="fill-none stroke-foreground"
        strokeWidth="1.6"
      />
      {/* Trappe à piles */}
      <rect
        x="30"
        y="34"
        width="50"
        height="34"
        rx="2"
        className="fill-none stroke-foreground/40"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      {/* Bouton d'appairage — le point du dessin */}
      <circle cx="55" cy="84" r="7" className="fill-foreground" />
      <circle cx="55" cy="84" r="12" className="fill-none stroke-foreground/35" strokeWidth="1.2" />
      {/* Diode */}
      <circle cx="78" cy="28" r="3" className="anim-pulse-mesure fill-alerte" />

      {/* Cote : le geste, trois secondes */}
      <path d="M 55 103 L 55 112 M 30 112 L 96 112" className="stroke-foreground/40" strokeWidth="1" />
      <text x="100" y="115" className="fill-current font-mono text-[9px] text-muted-foreground">
        3 s
      </text>

      {/* Portée radio : trois arcs, pas une antenne Wi-Fi générique */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${112 + i * 12} ${52 - i * 8} q 10 ${10 + i * 8} 0 ${20 + i * 16}`}
          className="stroke-foreground/45"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ))}

      {/* Ombrair Link */}
      <rect x="196" y="46" width="76" height="34" rx="3" className="fill-foreground" />
      {[56, 63].map((y) => (
        <rect key={y} x="208" y={y} width="34" height="2.6" rx="1.3" className="fill-background" />
      ))}
      <rect x="208" y="70" width="34" height="2.6" rx="1.3" className="fill-background/50" />
      {/* Ancré à droite : le libellé complet, cadré à gauche depuis x=196,
          dépassait la viewBox et se retrouvait coupé au rendu. */}
      <text
        x="272"
        y="96"
        textAnchor="end"
        className="fill-current font-mono text-[9px] text-muted-foreground"
      >
        Ombrair Link · 5 m
      </text>
    </svg>
  );
}
