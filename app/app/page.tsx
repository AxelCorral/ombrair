"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEtatDemo } from "@/components/app-demo/etat-provider";
import { BandeAlerte, EnTeteEcran, Groupe, Panneau } from "@/components/app-demo/ui";
import { Hypotheses } from "@/components/shared/hypotheses";
import { alerteCanicule, instant, meteo, prochaineAction } from "@/lib/mock/scenario";
import { notificationsNonLues } from "@/lib/mock/evenements";
import { surchauffeEvitee } from "@/lib/mock/releves";

/**
 * Accueil de la démonstration.
 *
 * CE QUI CHANGE. L'écran empilait cinq rectangles bordés de même poids :
 * alerte, températures, prochaine action, commandes, écart évité. Tout était
 * lisible, rien n'était hiérarchisé — et en thème nuit, cinq blocs Persienne
 * d'affilée.
 *
 * Un seul PANNEAU, celui qu'on vient lire : les deux températures et l'état
 * des ouvrants. Le reste devient des GROUPES portés par un filet. L'alerte
 * passe en bande à montant vertical : elle se distingue d'un coup d'œil sans
 * occuper un aplat rouge.
 *
 * Aucune donnée, aucun libellé et aucun comportement ne change.
 */

const HYPOTHESES_CONFORT = [
  "L'indice compare la température moyenne des pièces au seuil d'inconfort retenu pour le projet, 26 °C.",
  "Au-dessous de 25 °C : confortable. Entre 25 et 26 °C : correct. Entre 26 et 28 °C : inconfortable. Au-delà : chaud.",
  "Ce seuil est une hypothèse de simulation, pas une norme : le ressenti dépend aussi de l'humidité, de la ventilation et de chaque personne.",
];

function indiceConfort(temperatureC: number) {
  if (temperatureC < 25) return { libelle: "Confortable", ton: "froid" as const };
  if (temperatureC < 26) return { libelle: "Correct", ton: "neutre" as const };
  if (temperatureC < 28) return { libelle: "Inconfortable", ton: "chaud" as const };
  return { libelle: "Chaud", ton: "chaud" as const };
}

function formate(valeur: number) {
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function AppAccueil() {
  const {
    temperatureInterieureMoyenneC,
    nbOuvrantsOuverts,
    nbOuvrantsTotal,
    toutOuvrir,
    toutFermer,
    modifieDepuisChargement,
  } = useEtatDemo();

  const ecart = Math.round((meteo.exterieurC - temperatureInterieureMoyenneC) * 10) / 10;
  const confort = indiceConfort(temperatureInterieureMoyenneC);
  const etatGlobal =
    nbOuvrantsOuverts === 0
      ? "Volets fermés"
      : nbOuvrantsOuverts === nbOuvrantsTotal
        ? "Volets ouverts"
        : `Volets fermés, ${nbOuvrantsOuverts} entrouvert${nbOuvrantsOuverts > 1 ? "s" : ""}`;

  return (
    <main className="flex flex-1 flex-col gap-7 px-5 pt-5 pb-8">
      <EnTeteEcran
        titre="Accueil"
        meta={`${instant.libelleJour} · ${instant.heure} · ${meteo.ville}`}
        action={
          <Link
            href="/app/notifications"
            className="relative inline-flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-surface-panneau"
            aria-label={`Notifications (${notificationsNonLues} non lues)`}
          >
            <Bell className="size-4" aria-hidden="true" />
            {notificationsNonLues > 0 ? (
              <span className="t-data absolute -top-1 -right-1 inline-flex size-4 items-center justify-center rounded-full bg-alerte text-[10px] text-chaux">
                {notificationsNonLues}
              </span>
            ) : null}
          </Link>
        }
      />

      {alerteCanicule.active ? (
        <BandeAlerte titre={`Alerte canicule — ${alerteCanicule.niveau}`}>
          {alerteCanicule.message}
        </BandeAlerte>
      ) : null}

      {/* La lecture principale de l'écran — le seul panneau. */}
      <Panneau className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="t-eyebrow text-muted-foreground">intérieur</p>
            <p className="t-data mt-1.5 flex items-baseline gap-2 text-4xl font-medium text-etat-froid-texte">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 translate-y-[-0.25em] rounded-full bg-etat-froid"
              />
              {formate(temperatureInterieureMoyenneC)}&nbsp;°C
            </p>
          </div>
          <div className="text-right">
            <p className="t-eyebrow text-muted-foreground">extérieur</p>
            <p className="t-data mt-1.5 flex items-baseline justify-end gap-2 text-2xl font-medium text-etat-chaud-texte">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 translate-y-[-0.2em] rounded-full bg-etat-chaud"
              />
              {formate(meteo.exterieurC)}&nbsp;°C
            </p>
          </div>
        </div>

        <p className="t-support">
          <span className="font-medium">{etatGlobal}</span> — l&apos;extérieur est à{" "}
          {formate(ecart)}&nbsp;°C au-dessus de l&apos;intérieur.
        </p>

        <div className="flex items-center gap-2 border-t border-border pt-3">
          <span className="t-caption text-muted-foreground">Indice de confort</span>
          <span className="t-support font-medium">{confort.libelle}</span>
        </div>
        <Hypotheses titre="Comment cet indice est calculé" points={HYPOTHESES_CONFORT} />
      </Panneau>

      <Groupe titre="Prochaine action prévue">
        <p className="t-data text-lg">
          {prochaineAction.heure} — {prochaineAction.libelle}
        </p>
        <p className="t-caption mt-1.5 text-muted-foreground">
          Parce que {prochaineAction.raison}.
        </p>
      </Groupe>

      <Groupe titre="Commande générale">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={toutOuvrir}
            className="h-11 flex-1 rounded-lg bg-primary text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Tout ouvrir
          </button>
          <button
            type="button"
            onClick={toutFermer}
            className="h-11 flex-1 rounded-lg border border-border text-[0.9375rem] font-medium transition-colors hover:bg-surface-panneau"
          >
            Tout fermer
          </button>
        </div>
        <p aria-live="polite" className="t-caption mt-3 text-muted-foreground">
          {modifieDepuisChargement
            ? "Commande appliquée dans la démonstration. Les ouvrants concernés sont passés en mode manuel ; rechargez la page pour revenir au scénario initial."
            : "Une commande manuelle est toujours prioritaire sur le mode automatique."}
        </p>
      </Groupe>

      <Groupe
        titre="Écart évité aujourd'hui"
        action={
          <Link
            href="/app/historique"
            className="t-caption font-medium underline underline-offset-4"
          >
            Historique →
          </Link>
        }
      >
        <p className="t-data text-2xl font-medium">
          {formate(surchauffeEvitee.ecartMaxEviteC)}&nbsp;°C
        </p>
        <p className="t-caption mt-1.5 text-muted-foreground">
          estimation, au plus fort de la journée, vers {surchauffeEvitee.heureEcartMax}
        </p>
        <div className="mt-3">
          <Hypotheses points={surchauffeEvitee.methode} />
        </div>
      </Groupe>
    </main>
  );
}
