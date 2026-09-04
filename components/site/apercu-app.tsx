import { OmbrairLogo } from "@/components/brand/ombrair-logo";
import { MENTION_DEMO, instant, meteo, prochaineAction } from "@/lib/mock/scenario";
import { temperatureInterieureMoyenneC } from "@/lib/mock/logement";
import { cn } from "@/lib/utils";

/**
 * Fragment d'écran applicatif — à poser dans une page vitrine.
 *
 * POURQUOI. Les pages produit se contentaient d'écrire « Dans
 * l'application » suivi d'une liste : on parlait de l'application sans
 * jamais la montrer, alors que c'est elle qui relie l'objet posé au mur à
 * l'écosystème. Un extrait vaut mieux qu'une promesse.
 *
 * POURQUOI PAS UN PhoneFrame COMPLET. Le cadre existant fait 780 px de haut
 * et attend une page entière ; posé au milieu d'une page produit il
 * créerait un grand vide sombre — exactement le défaut relevé sur la page
 * « L'application ». Ce fragment ne montre qu'un dessus d'écran, coupé net
 * en bas : le vrai écran continue, et on va le voir dans la démo.
 *
 * Les valeurs viennent toutes de `lib/mock` — même instant de référence que
 * la démo et que le schéma de journée du site. Rien n'est réécrit ici, donc
 * rien ne peut diverger.
 */
export function ApercuApp({ className }: { className?: string }) {
  const ecart = (meteo.exterieurC - temperatureInterieureMoyenneC).toFixed(1).replace(".", ",");

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      {/* `dark` en portée locale : l'application est sombre même quand la
          page qui l'accueille est en thème clair. Mécanisme déjà utilisé
          par PhoneFrame et par la présentation projetée. */}
      <div className="dark overflow-hidden rounded-lg border-[5px] border-persienne bg-background">
        <div className="flex flex-col gap-5 p-5 text-foreground">
          <div className="flex items-center justify-between">
            <OmbrairLogo variant="horizontal" size="xs" className="text-foreground" />
            <span className="t-data t-caption text-muted-foreground">
              {instant.libelleJour} · {instant.heure}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="t-eyebrow text-muted-foreground">Intérieur</span>
            <span className="t-data text-4xl leading-none text-etat-froid-texte">
              {temperatureInterieureMoyenneC.toFixed(1).replace(".", ",")} °C
            </span>
            <span className="t-caption text-muted-foreground">
              Extérieur{" "}
              <span className="t-data text-etat-chaud-texte">
                {meteo.exterieurC.toFixed(1).replace(".", ",")} °C
              </span>{" "}
              — {ecart} °C au-dessus.
            </span>
          </div>

          <div className="border-t border-border pt-4">
            <span className="t-eyebrow text-muted-foreground">Prochaine action</span>
            <p className="t-data mt-2 text-base">
              {prochaineAction.heure} — {prochaineAction.libelle}
            </p>
            <p className="t-caption mt-1.5 text-muted-foreground">
              Parce que {prochaineAction.raison}.
            </p>
          </div>
        </div>

        {/* Coupe franche : l'écran continue au-delà du cadre. Les lames de la
            marque servent ici de dégradé de coupure — une lumière filtrée,
            pas un fondu marketing. */}
        <div
          aria-hidden="true"
          className="lumiere-lames h-8 border-t border-border text-chaux/70"
        />
      </div>

      <figcaption className="t-caption text-muted-foreground">{MENTION_DEMO}</figcaption>
    </figure>
  );
}
