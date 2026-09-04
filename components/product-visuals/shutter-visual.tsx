/**
 * Volet Ombrair — protection solaire.
 *
 * La scène est dessinée à plat : c'est la carte qui la découpe en arche.
 * Dessiner une seconde arche ici produirait un double cadrage.
 *
 * Tablier remonté aux deux tiers, lames qui filtrent la lumière. Le soleil
 * est en Ambre parce qu'il représente réellement un rayonnement chaud —
 * seul emploi autorisé de cette teinte. Les ombres viennent de la géométrie
 * des lames, pas d'un box-shadow décoratif.
 */
export function ShutterVisual() {
  const lames = [26, 37, 48, 59, 70];

  return (
    <svg viewBox="0 0 200 150" className="h-full w-full" aria-hidden="true" fill="none">
      {/* Extérieur vu à travers l'ouverture */}
      <rect x="0" y="0" width="200" height="150" className="fill-persienne/10 dark:fill-chaux/8" />

      {/* Soleil : rayonnement chaud, donc Ambre */}
      <circle cx="140" cy="104" r="15" className="fill-ambre/60" />

      {/* Lumière rasante projetée au sol, découpée par les lames */}
      {[120, 130, 140].map((y, i) => (
        <rect key={y} x="0" y={y} width={190 - i * 26} height="5" className="fill-ambre/22" />
      ))}

      {/* Coffre, puis tablier : les lames se regroupent en haut */}
      <rect x="0" y="0" width="200" height="16" className="fill-persienne dark:fill-chaux" />
      <g className="transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none">
        {lames.map((y, i) => (
          <rect
            key={y}
            x="0"
            y={y}
            width="200"
            height="8"
            className="fill-chaux stroke-persienne/30 dark:fill-chaux/85"
            strokeWidth="0.8"
            style={{ opacity: 1 - i * 0.05 }}
          />
        ))}
      </g>
    </svg>
  );
}
