/**
 * Capteur Ombrair — objet de design industriel.
 *
 * Composition : le capteur extérieur au premier plan, le capteur intérieur
 * décalé derrière, et Ombrair Link, compact et technique, en bas. Dessin
 * technique à plat, traits fins, aucun rendu photoréaliste : le produit
 * n'existe pas, une fausse photo serait trompeuse.
 *
 * Aucune couleur en dur : tout passe par les tokens du design system.
 */
export function SensorVisual() {
  return (
    /*
     * viewBox cadrée sur le contenu réel (x 30→176, y 20→130) et non sur une
     * planche de 200 × 150. Dessinés au centre d'une planche plus grande, les
     * trois objets flottaient au milieu de l'ouverture en arche : on voyait
     * surtout du vide. Le cadrage serré les fait remplir le percement.
     */
    <svg viewBox="30 20 146 110" className="h-full w-full" aria-hidden="true" fill="none">
      {/* Capteur intérieur, en retrait */}
      <g className="text-persienne/25 dark:text-chaux/20">
        <rect x="112" y="26" width="52" height="66" rx="4" className="fill-current" />
      </g>

      {/* Capteur extérieur, boîtier principal : coque Chaux, grille de mesure */}
      <g>
        <rect
          x="40"
          y="34"
          width="62"
          height="78"
          rx="4"
          className="fill-chaux stroke-persienne/45 dark:stroke-chaux/30"
          strokeWidth="1.2"
        />
        {/* Grille de mesure — lames horizontales, langage de la marque */}
        {[50, 58, 66, 74, 82].map((y) => (
          <rect
            key={y}
            x="52"
            y={y}
            width="38"
            height="2.4"
            rx="1"
            className="fill-persienne/55"
          />
        ))}
        {/* Marquage discret, à distance de la grille comme l'impose la charte */}
        <rect x="52" y="97" width="9" height="9" rx="1.6" className="fill-persienne" />
        <rect x="64" y="100" width="22" height="2.4" rx="1" className="fill-persienne/50" />
        {/* Capteur de luminosité */}
        <circle cx="93" cy="43" r="3.2" className="fill-persienne/70" />
      </g>

      {/* Ombrair Link — équipement technique compact, pas une box domotique */}
      <g>
        <rect
          x="118"
          y="100"
          width="54"
          height="26"
          rx="3"
          className="fill-persienne dark:fill-chaux"
        />
        {[107, 112, 117].map((y) => (
          <rect
            key={y}
            x="126"
            y={y}
            width="14"
            height="1.8"
            rx="0.9"
            className="fill-chaux dark:fill-persienne"
          />
        ))}
        <circle cx="162" cy="113" r="2.4" className="fill-chaux/60 dark:fill-persienne/60" />
      </g>

      {/* Liaison capteurs → Link, trait technique fin */}
      <path
        d="M 71 112 L 71 122 L 145 122 L 145 126"
        className="stroke-persienne/30 dark:stroke-chaux/25"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
    </svg>
  );
}
