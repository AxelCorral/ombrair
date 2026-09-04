/**
 * Visuels éditoriaux des articles.
 *
 * POURQUOI. La page Ressources traitait ses quatre articles exactement de la
 * même façon : quatre encadrés de texte, sans image, sans hiérarchie. Rien
 * n'aidait à choisir, et le dossier le plus documenté du site était le plus
 * plat visuellement.
 *
 * RÈGLES DE DESSIN — les mêmes que pour les visuels produit :
 *  - géométrie et architecture, jamais d'illustration de personnage ;
 *  - deux valeurs et, au plus, une couleur thermique lorsqu'elle signifie
 *    réellement une température ou un flux d'air ;
 *  - aucun aplat décoratif, aucune photo, aucun dégradé ;
 *  - le sujet de l'article se lit dans la forme, pas dans une icône posée.
 *
 * Chaque visuel est associé au `slug` de son article : ajouter un article
 * sans son visuel retombe sur un motif de lames neutre plutôt que sur un
 * trou — le contenu reste prioritaire sur l'illustration.
 */

const CADRE = "h-full w-full";

/** Nuit et fenêtre ouverte : l'air frais entre, la chaleur sort. */
function NuitOuverture() {
  return (
    <svg viewBox="0 0 320 200" className={CADRE} aria-hidden="true" fill="none">
      <rect width="320" height="200" className="fill-persienne/10 dark:fill-chaux/8" />
      {/* Façade nocturne : deux ouvertures fermées, une ouverte. Les
          fermées portent leurs lames — sans elles, ce sont deux aplats
          gris qui ne disent pas « volet baissé ». */}
      {[34, 234].map((x) => (
        <g key={x}>
          <rect x={x} y="46" width="52" height="86" className="fill-persienne/18 dark:fill-chaux/12" />
          {[54, 64, 74, 84, 94, 104, 114, 124].map((y) => (
            <line
              key={y}
              x1={x + 4}
              y1={y}
              x2={x + 48}
              y2={y}
              className="stroke-persienne/35 dark:stroke-chaux/25"
              strokeWidth="2"
            />
          ))}
        </g>
      ))}
      {/* L'ouverture centrale, béante */}
      <rect
        x="122"
        y="34"
        width="76"
        height="110"
        className="fill-background stroke-persienne dark:stroke-chaux"
        strokeWidth="2.5"
      />
      {/* Lune : un disque simple, aucune étoile décorative */}
      <circle cx="160" cy="66" r="13" className="fill-persienne/35 dark:fill-chaux/40" />
      {/* Flux d'air entrant — Fraîche, parce que l'air nocturne est plus frais */}
      {[96, 112, 128].map((y, i) => (
        <path
          key={y}
          d={`M ${132 + i * 4} ${y} q 14 -7 28 0`}
          className="stroke-etat-froid"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ opacity: 0.85 - i * 0.2 }}
        />
      ))}
      <rect x="0" y="160" width="320" height="1.6" className="fill-persienne/30 dark:fill-chaux/25" />
    </svg>
  );
}

/** Inertie : la masse du mur, et la fraîcheur stockée dedans. */
function InertieMur() {
  return (
    <svg viewBox="0 0 320 200" className={CADRE} aria-hidden="true" fill="none">
      <rect width="320" height="200" className="fill-persienne/10 dark:fill-chaux/8" />
      {/* Appareillage de pierre : la masse, dessinée comme un mur en coupe */}
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={78 + c * 42 + (r % 2 ? -21 : 0)}
            y={40 + r * 26}
            width="38"
            height="22"
            className="stroke-persienne/45 dark:stroke-chaux/30"
            strokeWidth="1.2"
          />
        ))
      )}
      {/* La fraîcheur emmagasinée, au cœur du mur */}
      <rect x="120" y="92" width="80" height="22" className="fill-etat-froid/35" />
      {/* Le soleil frappe la face extérieure : trait chaud, à droite */}
      {[52, 70, 88].map((y) => (
        <line
          key={y}
          x1="286"
          y1={y}
          x2="252"
          y2={y + 10}
          className="stroke-etat-chaud"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/** Climatisation : la protection passive d'abord, la machine en dernier. */
function ProtectionAvantMachine() {
  return (
    <svg viewBox="0 0 320 200" className={CADRE} aria-hidden="true" fill="none">
      <rect width="320" height="200" className="fill-persienne/10 dark:fill-chaux/8" />
      {/* Trois couches, de la plus extérieure à la plus intérieure : le volet
          d'abord, le vitrage ensuite, la machine seulement au bout. */}
      <g className="stroke-persienne dark:stroke-chaux" strokeWidth="2.5">
        <rect x="44" y="42" width="26" height="110" className="fill-persienne/20 dark:fill-chaux/15" />
        <rect x="96" y="42" width="26" height="110" fill="none" />
      </g>
      {/* Lames du volet — la première protection */}
      {[52, 66, 80, 94, 108, 122, 136].map((y) => (
        <line key={y} x1="46" y1={y} x2="68" y2={y} className="stroke-persienne/60 dark:stroke-chaux/45" strokeWidth="1.6" />
      ))}
      {/* Le soleil arrêté par le volet */}
      {[62, 84, 106].map((y) => (
        <line
          key={y}
          x1="12"
          y1={y - 8}
          x2="40"
          y2={y}
          className="stroke-etat-chaud"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
      {/* La machine, au bout de la chaîne et volontairement discrète */}
      <rect
        x="212"
        y="62"
        width="72"
        height="34"
        rx="3"
        className="stroke-persienne/45 dark:stroke-chaux/30"
        strokeWidth="1.6"
      />
      {[70, 78, 86].map((y) => (
        <line key={y} x1="222" y1={y} x2="274" y2={y} className="stroke-persienne/35 dark:stroke-chaux/25" strokeWidth="1.4" />
      ))}
      <line
        x1="130"
        y1="97"
        x2="206"
        y2="79"
        className="stroke-persienne/30 dark:stroke-chaux/25"
        strokeWidth="1.4"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

/** Personnes âgées : un logement tenu au frais, pièce par pièce. */
function LogementTenuAuFrais() {
  return (
    <svg viewBox="0 0 320 200" className={CADRE} aria-hidden="true" fill="none">
      <rect width="320" height="200" className="fill-persienne/10 dark:fill-chaux/8" />
      {/* Plan de logement en coupe simplifiée : quatre pièces, une seule
          exposée. Aucune silhouette humaine — le sujet est le logement. */}
      <g className="stroke-persienne dark:stroke-chaux" strokeWidth="2.5">
        <rect x="46" y="42" width="228" height="116" fill="none" />
        <line x1="160" y1="42" x2="160" y2="158" />
        <line x1="46" y1="100" x2="274" y2="100" />
      </g>
      {/* La pièce exposée, encore chaude */}
      <rect x="162" y="44" width="110" height="54" className="fill-etat-chaud/25" />
      {/* Les pièces tenues au frais */}
      <rect x="48" y="44" width="110" height="54" className="fill-etat-froid/22" />
      <rect x="48" y="102" width="110" height="54" className="fill-etat-froid/22" />
      {/* Volets fermés côté exposé */}
      {[50, 62, 74, 86].map((y) => (
        <line key={y} x1="278" y1={y} x2="298" y2={y} className="stroke-persienne/55 dark:stroke-chaux/40" strokeWidth="2.4" />
      ))}
    </svg>
  );
}

/** Motif neutre : trois lames, pour un article sans visuel dédié. */
function LamesNeutres() {
  return (
    <svg viewBox="0 0 320 200" className={CADRE} aria-hidden="true" fill="none">
      <rect width="320" height="200" className="fill-persienne/10 dark:fill-chaux/8" />
      {[
        { y: 74, o: 1 },
        { y: 98, o: 1 },
        { y: 122, o: 0.5 },
      ].map(({ y, o }) => (
        <rect
          key={y}
          x="82"
          y={y}
          width="156"
          height="10"
          className="fill-persienne dark:fill-chaux"
          style={{ opacity: o }}
        />
      ))}
    </svg>
  );
}

const VISUELS: Record<string, React.ReactNode> = {
  "rafraichissement-nocturne": <NuitOuverture />,
  "inertie-thermique": <InertieMur />,
  "climatisation-pas-seule-reponse": <ProtectionAvantMachine />,
  "canicule-personnes-agees": <LogementTenuAuFrais />,
};

export function VisuelArticle({ slug }: { slug: string }) {
  return VISUELS[slug] ?? <LamesNeutres />;
}
