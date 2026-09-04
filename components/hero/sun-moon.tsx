import type { PositionAstre } from "@/lib/demo/day-cycle";

/**
 * Soleil et lune traversant réellement le cadre de la fenêtre. Position
 * calculée par le moteur de simulation : `x` va d'est en ouest, `hauteur`
 * de l'horizon au zénith. Un seul des deux est visible à la fois.
 *
 * Marges : l'astre entre et sort par les bords (de -6 % à 106 %) pour que
 * la traversée se voie, plutôt que d'apparaître d'un coup au milieu.
 */
function styleAstre(position: PositionAstre) {
  return {
    left: `${-6 + position.x * 112}%`,
    // 88 % = ras de l'horizon, 8 % = zénith.
    top: `${88 - position.hauteur * 80}%`,
  } as const;
}

export function SunMoon({ soleil, lune }: { soleil: PositionAstre; lune: PositionAstre }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {soleil.visible ? (
        <div
          className="absolute size-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chaux"
          style={{
            ...styleAstre(soleil),
            // Le halo se renforce quand le soleil monte.
            boxShadow: `0 0 ${12 + soleil.hauteur * 40}px ${4 + soleil.hauteur * 14}px color-mix(in oklch, var(--color-chaux) ${25 + soleil.hauteur * 45}%, transparent)`,
          }}
        />
      ) : null}

      {lune.visible ? (
        <div
          className="absolute size-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            ...styleAstre(lune),
            background: "color-mix(in oklch, var(--color-chaux) 78%, var(--ciel-crepuscule))",
            boxShadow:
              "0 0 18px 3px color-mix(in oklch, var(--color-chaux) 22%, transparent)",
          }}
        />
      ) : null}
    </div>
  );
}
