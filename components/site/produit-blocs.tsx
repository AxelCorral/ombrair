import { Check, X } from "lucide-react";
import type { Gamme, OptionInstallation } from "@/lib/tarifs";

/**
 * Les trois blocs qui portaient l'essentiel du « mur de texte » des pages
 * produit. Aucun contenu n'est retiré : seule sa représentation change.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * NOMENCLATURE — « Ce qui est fourni »
 *
 * C'était une liste à tirets. Une entreprise qui vend du matériel présente
 * ce qu'elle livre comme une nomenclature : un repère, un intitulé, une
 * ligne de conduite entre les deux. Le repère chiffré est légitime ici,
 * parce que le contenu EST une liste de pièces d'un même ensemble — la
 * numérotation renvoie à des articles, pas à des étapes inventées.
 *
 * Le bloc « à l'unité, si besoin » a disparu avec la nouvelle grille : les
 * anciens tarifs au capteur supplémentaire et au module de pilotage n'en font
 * pas partie, et leur en réattribuer un aurait été inventer un prix.
 * ─────────────────────────────────────────────────────────────────────── */
export function Nomenclature({ articles }: { articles: string[] }) {
  return (
    <div className="flex flex-col gap-10">
      <ol className="flex flex-col">
        {articles.map((article, i) => (
          <li
            key={article}
            className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-4 border-t border-border py-4 last:border-b"
          >
            <span className="t-data t-caption text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="t-body">{article}</span>
          </li>
        ))}
      </ol>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * RAIL D'INSTALLATION — les cas de figure de chantier
 *
 * C'étaient trois rectangles bordés presque identiques : rien ne disait ce
 * qui change d'une option à l'autre. Ces entrées SONT une progression — vous
 * posez, un technicien pose, un technicien pose ET règle — et cette
 * progression se lit sur un rail horizontal, le degré d'intervention marqué
 * par des repères pleins.
 *
 * ELLES NE PORTENT PLUS DE PRIX. Depuis la nouvelle grille, l'installation
 * Ombrair a un tarif unique par offre, affiché une seule fois dans le hero
 * produit. Répéter un montant par ligne rendrait la page contradictoire le
 * jour où l'un d'eux changerait — et surtout, ces lignes décrivent des
 * SITUATIONS de logement, pas des formules tarifaires.
 *
 * Le rail est un trait, pas trois bordures : la structure vient de
 * l'alignement, pas de l'encadrement.
 * ─────────────────────────────────────────────────────────────────────── */
export function RailInstallation({ options }: { options: OptionInstallation[] }) {
  return (
    <ol className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
      {options.map((option, i) => (
        <li key={option.id} className="flex flex-col">
          {/* Repère + rail. Le nombre de points pleins dit le degré
              d'intervention d'Ombrair : un, deux, puis trois. */}
          <div className="flex items-center gap-3">
            <span className="t-data t-caption text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="flex items-center gap-1">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className={
                    n <= i ? "block size-1.5 bg-foreground" : "block size-1.5 bg-foreground/20"
                  }
                />
              ))}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </div>

          <h3 className="t-h3 mt-5">{option.label}</h3>

          <p className="t-support mt-3 flex-1 text-muted-foreground">{option.description}</p>

          {option.sousReserveCompatibilite ? (
            <p className="t-caption mt-2 text-muted-foreground italic">
              Sous réserve de compatibilité technique, confirmée lors de la visite.
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * RELEVÉ DE FABRICATION — « Qui conçoit, qui fabrique »
 *
 * C'était un grand rectangle bordé, visuellement lourd pour un contenu qui
 * tient en quatre lignes. Il devient un relevé en deux colonnes : ce
 * qu'Ombrair maîtrise à gauche, ce qui vient d'un partenaire à droite,
 * séparés par un simple filet. Le point ne doit jamais devenir flou — il est
 * donc plus lisible qu'avant, pas moins.
 *
 * La coche et la croix ne sont pas le seul canal : chaque ligne porte son
 * état en toutes lettres pour les technologies d'assistance, et la colonne
 * de droite nomme explicitement ce qui n'est pas fabriqué par Ombrair.
 * ─────────────────────────────────────────────────────────────────────── */
export function ReleveFabrication({ gamme }: { gamme: Gamme }) {
  const { fabrication } = gamme;

  const lignes = [
    ["Conçu par Ombrair", fabrication.concuParOmbrair],
    ["Fabriqué par Ombrair", fabrication.fabriqueParOmbrair],
    ["Vendu, installé et intégré par Ombrair", true],
    ["Maintenu et suivi par Ombrair", true],
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
      <ul className="flex flex-col">
        {lignes.map(([label, vrai]) => (
          <li
            key={label}
            className="flex items-center gap-3 border-b border-border py-3.5 first:border-t"
          >
            {vrai ? (
              <Check className="size-4 shrink-0 text-foreground" aria-hidden="true" />
            ) : (
              <X className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            )}
            <span
              className={
                vrai ? "t-support" : "t-support text-muted-foreground line-through decoration-border"
              }
            >
              {label}
            </span>
            <span className="sr-only">{vrai ? " — oui" : " — non"}</span>
          </li>
        ))}
      </ul>

      <div className="md:border-l md:border-border md:pl-16">
        <p className="t-eyebrow text-muted-foreground">La mention exacte</p>
        <p className="t-support mt-4 text-muted-foreground">{fabrication.mention}</p>
      </div>
    </div>
  );
}
