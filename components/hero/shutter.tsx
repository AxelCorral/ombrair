import { bornerInclinaison, bornerLevee } from "@/lib/demo/shutter";

/**
 * Volet roulant à lames orientables, avec deux degrés de liberté réellement
 * distincts.
 *
 * LEVÉE — le tablier s'enroule dans le coffre, en haut. Il découvre donc la
 * fenêtre PAR LE BAS : à 55 % de levée, le bas de la fenêtre est dégagé et
 * le tablier ne pend plus que sur le haut. Les lames ne disparaissent pas en
 * fondu, le tablier se rétracte physiquement vers son coffre.
 *
 * INCLINAISON — chaque lame pivote sur son axe horizontal (`rotateX` sous une
 * `perspective` commune). À 0° elles sont vues de face et jointives, à 90°
 * par la tranche : la lumière passe entre elles sans que le tablier bouge.
 *
 * Purement visuel : l'état lisible (taux d'ouverture, libellés) est affiché
 * à côté, pour ne jamais dépendre du seul rendu graphique.
 */

const NOMBRE_LAMES = 14;

export function Shutter({
  levee,
  inclinaison,
  /** Coupe les transitions pendant la manipulation des curseurs. */
  transitions = true,
}: {
  levee: number;
  inclinaison: number;
  transitions?: boolean;
}) {
  const l = bornerLevee(levee) / 100;
  const i = bornerInclinaison(inclinaison);
  const duree = transitions ? "duration-700" : "duration-0";

  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col" style={{ perspective: "700px" }}>
      {/* Coffre : le tablier remonté doit aller quelque part. */}
      <div className="h-[3.5%] shrink-0 border-b border-nuit/50 bg-persienne" />

      {/* Tablier : sa hauteur est ce qui reste à couvrir. */}
      <div
        className={`flex flex-col overflow-hidden transition-[height] ${duree} ease-out`}
        style={{ height: `${(1 - l) * 100}%` }}
      >
        {Array.from({ length: NOMBRE_LAMES }).map((_, index) => (
          <div key={index} className="min-h-0 flex-1">
            <div
              className={`h-full w-full origin-center border-b-2 border-persienne/55 transition-transform ${duree} ease-out`}
              style={{
                transform: `rotateX(${i}deg)`,
                // Léger dégradé vertical : une lame fermée doit avoir une
                // épaisseur, pas ressembler à un aplat de papier.
                background:
                  "linear-gradient(to bottom, color-mix(in oklch, var(--color-chaux) 92%, var(--color-persienne)), var(--color-chaux) 45%, color-mix(in oklch, var(--color-chaux) 86%, var(--color-persienne)))",
                // Une lame vue par la tranche s'assombrit, comme en vrai.
                filter: `brightness(${1 - (i / 90) * 0.25})`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
