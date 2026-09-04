/**
 * Ombrair Link — le boîtier local.
 *
 * L'audit a relevé qu'Ombrair Link est cité partout mais n'est jamais
 * montré : il n'existait qu'en réduction, à l'arrière-plan du visuel
 * capteur. Ce dessin en fait un objet à part entière, réutilisable sur
 * l'accueil, la page Capteur, « Comment ça marche » et la bande écosystème.
 *
 * DIRECTION. Un boîtier compact de matériel professionnel : coque pleine en
 * Persienne, grille de lames reprenant le signe, bornier visible sur le
 * flanc, une seule diode d'état. Volontairement PAS une box domotique —
 * ni antennes, ni façade brillante, ni rangée de LED multicolores.
 *
 * `anime` fait battre la diode ; l'impulsion est neutralisée sous
 * `prefers-reduced-motion` par la classe utilitaire du design system.
 */
export function LinkVisual({ anime = false }: { anime?: boolean }) {
  return (
    /* Cadrage serré sur l'objet, même raison que pour le capteur. */
    <svg viewBox="26 42 148 86" className="h-full w-full" aria-hidden="true" fill="none">
      {/* Plan de pose — une tablette, pour donner une assise à l'objet */}
      <rect x="0" y="112" width="200" height="1.4" className="fill-persienne/25 dark:fill-chaux/20" />

      {/* Ombre portée par la géométrie, pas par un flou */}
      <path d="M 62 112 L 150 112 L 158 118 L 70 118 Z" className="fill-persienne/12 dark:fill-chaux/10" />

      {/* Coque */}
      <rect
        x="56"
        y="52"
        width="88"
        height="60"
        rx="4"
        className="fill-persienne dark:fill-chaux"
      />

      {/* Grille de lames — trois bandes, la troisième plus sourde, comme le signe */}
      {[
        { y: 66, o: 1 },
        { y: 76, o: 1 },
        { y: 86, o: 0.55 },
      ].map(({ y, o }) => (
        <rect
          key={y}
          x="72"
          y={y}
          width="42"
          height="4"
          rx="2"
          className="fill-chaux dark:fill-persienne"
          style={{ opacity: o }}
        />
      ))}

      {/* Diode d'état, unique */}
      <circle
        cx="128"
        cy="68"
        r="3"
        className={`fill-chaux dark:fill-persienne ${anime ? "anim-pulse-mesure" : ""}`}
      />

      {/* Bornier sur le flanc droit : ce qui distingue un équipement d'une box */}
      {[92, 98, 104].map((y) => (
        <rect key={y} x="144" y={y} width="7" height="3" rx="1" className="fill-persienne/45 dark:fill-chaux/40" />
      ))}

      {/* Câble d'alimentation, tracé technique */}
      <path
        d="M 56 100 L 34 100 L 34 112"
        className="stroke-persienne/40 dark:stroke-chaux/30"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
