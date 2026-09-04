/**
 * Signe et logotype Ombrair — identité retenue, concept 07 « arche
 * méditerranéenne ».
 *
 * La géométrie n'est pas approximée : elle a été relevée sur la planche de
 * charte (`Ombrair - Identité concept 07-selection.png`).
 *
 *   Signe            4 × 5 modules (ratio mesuré : 0,800 exactement)
 *   Arc              demi-cercle de rayon = demi-largeur
 *   Angles bas       5 px à l'échelle 100 % de la planche
 *   Lames            65,4 % de la largeur, centrées ; hauteur 7,7 %
 *   Position (haut)  41,5 % · 58,5 % · 75,4 % de la hauteur
 *   Lame 3           plus sourde que les deux autres — Chaux mélangée à
 *                    45 % de Persienne, valeur relevée : #9db3a9
 *
 * Règles de la charte appliquées ici :
 *  - logotype toujours en bas de casse, Outfit Light, interlettrage +0,06 em ;
 *  - aplats pleins : aucun dégradé, contour, ombre ni rotation ;
 *  - trois lames au-dessus de 26 px, deux en dessous (voir `lamesVisibles`) ;
 *  - le signe n'est jamais recoloré en Fraîche ni en Ambre.
 */

export const SIGNE_W = 40;
export const SIGNE_H = 50;

const LAME_X = SIGNE_W * 0.173;
const LAME_W = SIGNE_W * 0.654;
const LAME_H = SIGNE_H * 0.077;
const LAMES_Y = [0.415, 0.585, 0.754].map((r) => SIGNE_H * r);
const RAYON_BAS = 2;

/** Contour de l'arche, réutilisable comme cadre architectural. */
export function cheminArche(w = SIGNE_W, h = SIGNE_H, rayonBas = RAYON_BAS) {
  const r = w / 2;
  return [
    `M 0 ${h - rayonBas}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - rayonBas}`,
    `Q ${w} ${h} ${w - rayonBas} ${h}`,
    `L ${rayonBas} ${h}`,
    `Q 0 ${h} 0 ${h - rayonBas}`,
    "Z",
  ].join(" ");
}

export type VarianteLogo = "horizontal" | "stacked" | "symbol" | "wordmark";
export type TailleLogo = "xs" | "sm" | "md" | "lg";

/** Hauteur du signe par taille. En dessous de 26 px, la charte n'en garde que deux lames. */
const HAUTEUR_SIGNE: Record<TailleLogo, string> = {
  xs: "1rem",
  sm: "1.4rem",
  md: "1.9rem",
  lg: "3rem",
};

const TAILLE_MOT: Record<TailleLogo, string> = {
  xs: "0.9rem",
  sm: "1.15rem",
  md: "1.5rem",
  lg: "2.4rem",
};

/**
 * Le signe seul. `lames` permet d'appliquer la simplification de la charte
 * aux très petites tailles.
 */
export function SigneOmbrair({
  className,
  style,
  lames = 3,
  decoratif = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  lames?: 2 | 3;
  decoratif?: boolean;
}) {
  const visibles = lames === 2 ? [LAMES_Y[0], LAMES_Y[1]] : LAMES_Y;

  return (
    <svg
      viewBox={`0 0 ${SIGNE_W} ${SIGNE_H}`}
      className={className}
      style={style}
      role={decoratif ? undefined : "img"}
      aria-hidden={decoratif || undefined}
      aria-label={decoratif ? undefined : "Ombrair"}
      fill="none"
    >
      <path d={cheminArche()} fill="currentColor" />
      {visibles.map((y, i) => (
        <rect
          key={y}
          x={LAME_X}
          y={y}
          width={LAME_W}
          height={LAME_H}
          rx={LAME_H / 2}
          // La troisième lame est volontairement plus sourde : c'est ce qui
          // évoque la lame dans l'ombre. Exprimée en mélange de tokens.
          fill={
            i === 2 && lames === 3
              ? "color-mix(in oklch, var(--color-chaux) 55%, var(--color-persienne))"
              : "var(--color-chaux)"
          }
        />
      ))}
    </svg>
  );
}

/**
 * Logo Ombrair, toutes variantes. Point d'entrée unique : aucun composant
 * ne doit redessiner le signe de son côté.
 *
 * La couleur est héritée (`currentColor`) : sur fond clair on l'utilise en
 * Persienne, sur fond sombre en Chaux.
 */
export function OmbrairLogo({
  variant = "horizontal",
  size = "md",
  className,
  /** Passe le logo en élément d'image nommé plutôt qu'en décor. */
  titre,
}: {
  variant?: VarianteLogo;
  size?: TailleLogo;
  className?: string;
  titre?: string;
}) {
  const hauteurSigne = HAUTEUR_SIGNE[size];
  const tailleMot = TAILLE_MOT[size];
  const lames = size === "xs" ? 2 : 3;

  const mot = (
    <span
      className="font-display leading-none font-light lowercase"
      style={{ fontSize: tailleMot, letterSpacing: "0.06em" }}
    >
      ombrair
    </span>
  );

  if (variant === "wordmark") {
    return (
      <span className={className} aria-label={titre}>
        {mot}
      </span>
    );
  }

  const signe = (
    <SigneOmbrair
      className="w-auto shrink-0"
      style={{ height: hauteurSigne }}
      lames={lames}
      decoratif={!titre}
    />
  );

  if (variant === "symbol") {
    return (
      <SigneOmbrair
        className={className}
        style={{ height: hauteurSigne }}
        lames={lames}
        decoratif={!titre}
      />
    );
  }

  if (variant === "stacked") {
    return (
      <span className={`inline-flex flex-col items-center gap-2 ${className ?? ""}`} aria-label={titre}>
        {signe}
        {mot}
      </span>
    );
  }

  // Horizontal : l'écart vaut environ la largeur d'une lame, conformément à
  // la zone de respiration prévue par la charte.
  return (
    <span className={`inline-flex items-center gap-[0.45em] ${className ?? ""}`} aria-label={titre}>
      {signe}
      {mot}
    </span>
  );
}
