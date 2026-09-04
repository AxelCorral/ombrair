import { cn } from "@/lib/utils";

/**
 * Primitives de mise en page du site.
 *
 * POURQUOI. Le header et le pied de page étaient contenus dans `max-w-6xl`
 * centré, tandis que chaque page posait son propre `px-6 md:px-16` en pleine
 * largeur. À 1440 px, le titre d'une page produit commençait donc 104 px à
 * gauche du logo qui le surplombe. Ce décalage, invisible ligne à ligne dans
 * le JSX, se voit immédiatement sur une capture : c'est la première cause de
 * l'impression de « maquette » relevée par l'audit.
 *
 * Une seule mesure, partagée par le header, le pied de page et le contenu.
 */

/** Mesure commune. Tout ce qui s'aligne dans le site passe par ici. */
export function Conteneur({
  children,
  className,
  as: Balise = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "header" | "footer" | "section" | "nav";
}) {
  return (
    <Balise className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}>{children}</Balise>
  );
}

/**
 * Fonds de section. La distinction se fait par la VALEUR DE FOND, jamais par
 * une ombre — voir les tokens de surface dans `globals.css`.
 *
 *   page     fond courant
 *   sourde   bande discrète : change de chapitre sans tracer de bordure
 *   panneau  regroupement plus marqué
 *   encre    aplat Persienne pleine largeur, moment fort d'une page
 */
type Fond = "page" | "sourde" | "panneau" | "encre";

const FONDS: Record<Fond, string> = {
  page: "bg-background",
  sourde: "bg-surface-sourde",
  panneau: "bg-surface-panneau",
  encre: "bg-encre text-encre-foreground",
};

/**
 * Rythme vertical. Trois amplitudes, ce qui suffit à distinguer « deux
 * informations liées » de « deux chapitres » — la nuance qui manquait quand
 * toutes les sections étaient séparées par le même `gap-16`.
 *
 * Les valeurs sont volontairement contenues. Un premier réglage plus généreux
 * (112 px de part et d'autre en desktop) ajoutait à lui seul près de 1 000 px
 * à la page d'accueil, dont l'audit signalait déjà la longueur : l'espace
 * était bien intentionnel, mais il coûtait plus qu'il ne rapportait. Le
 * changement de chapitre est maintenant surtout porté par le CHANGEMENT DE
 * FOND et par le filet d'ouverture, qui ne coûtent pas de hauteur.
 */
type Rythme = "normal" | "ample" | "serre";

const RYTHMES: Record<Rythme, string> = {
  serre: "py-8 md:py-12",
  normal: "py-12 md:py-16",
  ample: "py-14 md:py-20",
};

export function Section({
  children,
  className,
  interieurClassName,
  fond = "page",
  rythme = "normal",
  id,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  interieurClassName?: string;
  fond?: Fond;
  rythme?: Rythme;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <section id={id} aria-label={ariaLabel} className={cn(FONDS[fond], RYTHMES[rythme], className)}>
      <Conteneur className={interieurClassName}>{children}</Conteneur>
    </section>
  );
}

/**
 * Ouverture de chapitre — la signature de composition du site.
 *
 * Un filet fin traverse toute la mesure, le surtitre technique s'accroche
 * juste dessous à gauche, et le titre descend en dessous : c'est la façon
 * dont on annote une planche de dessin, pas dont on titre une landing page.
 * Cela donne un repère de chapitre net sans ajouter ni carte, ni bordure,
 * ni ombre — et cela règle le reproche « des blocs très éloignés sans que le
 * changement de chapitre soit visuellement évident ».
 *
 * `index` est facultatif à dessein : un numéro ne s'affiche que là où le
 * contenu est réellement une séquence (les quatre temps du fonctionnement,
 * la nomenclature d'un produit). Ailleurs il décorerait.
 */
export function OuvertureChapitre({
  surtitre,
  index,
  titre,
  chapo,
  action,
  niveau: Titre = "h2",
  className,
  aligne = "gauche",
}: {
  surtitre?: string;
  index?: string;
  titre: React.ReactNode;
  chapo?: React.ReactNode;
  /** Lien ou bouton posé en bout de filet, sur la même ligne que le surtitre. */
  action?: React.ReactNode;
  niveau?: "h1" | "h2";
  className?: string;
  aligne?: "gauche" | "large";
}) {
  const estDisplay = Titre === "h1";

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="h-px w-full bg-border" />

      {surtitre || index || action ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-3">
          <p className="t-eyebrow text-muted-foreground">
            {index ? (
              <>
                <span className="text-foreground">{index}</span>
                <span aria-hidden="true" className="px-2 opacity-40">
                  /
                </span>
              </>
            ) : null}
            {surtitre}
          </p>
          {action ? <div className="t-caption">{action}</div> : null}
        </div>
      ) : null}

      <Titre
        className={cn(
          estDisplay ? "t-display" : "t-h2",
          "mt-5 text-balance",
          aligne === "gauche" ? "max-w-3xl" : "max-w-5xl"
        )}
      >
        {titre}
      </Titre>

      {chapo ? <div className="t-lead mt-4 max-w-2xl text-muted-foreground">{chapo}</div> : null}
    </div>
  );
}
