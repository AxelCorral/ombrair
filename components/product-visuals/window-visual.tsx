/**
 * Fenêtre Ombrair — ventilation.
 *
 * Comme pour le volet, la scène est à plat : c'est la carte qui la découpe
 * en arche. Composition verticale, deux battants dont l'un s'entrouvre en
 * diagonale, actionneur discret en partie haute.
 *
 * Fraîche n'apparaît que sur les traits de flux d'air, où elle signifie
 * réellement « l'extérieur est devenu plus frais ». Aucun aplat turquoise
 * décoratif.
 */
export function WindowVisual() {
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full" aria-hidden="true" fill="none">
      {/* Extérieur : ciel puis ligne d'horizon */}
      <rect x="0" y="0" width="200" height="150" className="fill-persienne/10 dark:fill-chaux/8" />
      <rect x="0" y="112" width="200" height="38" className="fill-persienne/16 dark:fill-chaux/12" />

      {/* Actionneur motorisé, discret, en partie haute */}
      <rect x="82" y="18" width="34" height="9" rx="2" className="fill-persienne dark:fill-chaux" />
      <rect x="97" y="27" width="4" height="8" className="fill-persienne/55 dark:fill-chaux/55" />

      {/* Battant fixe */}
      <rect
        x="42"
        y="36"
        width="56"
        height="96"
        className="fill-chaux/30 stroke-persienne dark:stroke-chaux"
        strokeWidth="2.5"
      />

      {/* Battant motorisé, entrouvert : la diagonale porte le mouvement */}
      <g className="origin-[100px_84px] transition-transform duration-500 ease-out group-hover:-rotate-[5deg] motion-reduce:transition-none">
        <path
          d="M 100 36 L 152 50 L 152 118 L 100 132 Z"
          className="fill-chaux/45 stroke-persienne dark:stroke-chaux"
          strokeWidth="2.5"
        />
      </g>

      {/* Flux d'air entrant : Fraîche, parce que l'air est plus frais */}
      {[62, 80, 98].map((y, i) => (
        <path
          key={y}
          d={`M ${158 + i * 5} ${y} q 13 -6 26 0`}
          className="stroke-fraiche"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ opacity: 0.8 - i * 0.18 }}
        />
      ))}
    </svg>
  );
}
