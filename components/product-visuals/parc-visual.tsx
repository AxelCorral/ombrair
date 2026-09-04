/**
 * Parc d'ouvrants supervisé — visuel de la page Ombrair Pro.
 *
 * POURQUOI. La page Pro était un titre, quatre rectangles et un formulaire :
 * elle décrivait une supervision multi-sites sans jamais la montrer, alors
 * que c'est précisément ce qui distingue l'offre professionnelle de l'offre
 * particulier.
 *
 * CE QUI EST DESSINÉ — et ce qui ne l'est pas. Trois bâtiments d'échelles
 * différentes, leurs ouvrants, et le lien qui les ramène à un même tableau
 * de bord. AUCUN CHIFFRE : ni nombre de sites, ni nombre d'ouvrants, ni taux
 * d'équipement. Le projet ne dispose d'aucune donnée de ce genre, et en
 * inscrire dans une illustration reviendrait à inventer une référence
 * client. Le schéma dit la STRUCTURE de l'offre, pas son volume.
 *
 * Les ouvrants fermés sont pleins, les ouverts sont vides : c'est le même
 * code que la matrice de fonctions du catalogue, et il ne repose pas sur la
 * couleur.
 */

/** Grille d'ouvrants d'un bâtiment. `fermes` liste les index pleins. */
function Ouvrants({
  x,
  y,
  colonnes,
  rangs,
  fermes,
}: {
  x: number;
  y: number;
  colonnes: number;
  rangs: number;
  fermes: number[];
}) {
  const pas = 16;
  const taille = 9;

  return (
    <>
      {Array.from({ length: rangs }).flatMap((_, r) =>
        Array.from({ length: colonnes }).map((_, c) => {
          const i = r * colonnes + c;
          return (
            <rect
              key={i}
              x={x + c * pas}
              y={y + r * pas}
              width={taille}
              height={taille + 2}
              className={
                fermes.includes(i)
                  ? "fill-persienne dark:fill-chaux"
                  : "fill-none stroke-persienne/50 dark:stroke-chaux/40"
              }
              strokeWidth="1.2"
            />
          );
        })
      )}
    </>
  );
}

export function ParcVisual() {
  return (
    <svg viewBox="0 0 340 220" className="h-full w-full" aria-hidden="true" fill="none">
      {/* Sol : une seule ligne, comme sur une élévation. */}
      <line x1="0" y1="176" x2="340" y2="176" className="stroke-persienne/35 dark:stroke-chaux/25" strokeWidth="1.6" />

      {/* Bâtiment 1 — le plus bas */}
      <rect x="14" y="112" width="76" height="64" className="stroke-persienne dark:stroke-chaux" strokeWidth="2" />
      <Ouvrants x={24} y={122} colonnes={4} rangs={2} fermes={[0, 1, 4]} />

      {/* Bâtiment 2 — le plus haut, celui qui porte le rappel vers le tableau */}
      <rect x="106" y="56" width="92" height="120" className="stroke-persienne dark:stroke-chaux" strokeWidth="2" />
      <Ouvrants x={116} y={68} colonnes={5} rangs={6} fermes={[0, 1, 2, 5, 6, 10, 15, 20]} />

      {/* Bâtiment 3 */}
      <rect x="214" y="92" width="72" height="84" className="stroke-persienne dark:stroke-chaux" strokeWidth="2" />
      <Ouvrants x={224} y={104} colonnes={4} rangs={4} fermes={[0, 3, 4, 8]} />

      {/* Rappels vers le tableau de bord : un trait fin par site, réunis sur
          une même horizontale — l'écriture d'un plan, pas d'un réseau. */}
      <path
        d="M 52 112 L 52 32 L 296 32 M 152 56 L 152 32 M 250 92 L 250 32"
        className="stroke-persienne/40 dark:stroke-chaux/30"
        strokeWidth="1.2"
        strokeDasharray="4 4"
      />

      {/* Le tableau de bord unique */}
      <rect x="264" y="16" width="62" height="32" rx="3" className="fill-persienne dark:fill-chaux" />
      {[24, 30].map((y) => (
        <rect key={y} x="272" y={y} width="30" height="2.4" rx="1.2" className="fill-chaux dark:fill-persienne" />
      ))}
      <rect x="272" y="36" width="18" height="2.4" rx="1.2" className="fill-chaux/55 dark:fill-persienne/55" />
    </svg>
  );
}
