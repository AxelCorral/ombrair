import type { Metadata } from "next";
import { PhoneFrame } from "@/components/site/phone-frame";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { ActionLien, LienFleche } from "@/components/site/actions";
import { OmbrairLogo } from "@/components/brand/ombrair-logo";
import {
  MENTION_DEMO,
  alerteCanicule,
  instant,
  meteo,
  prochaineAction,
} from "@/lib/mock/scenario";
import { temperatureInterieureMoyenneC } from "@/lib/mock/logement";
import { scenarios } from "@/lib/mock/programmes";

export const metadata: Metadata = {
  title: "L'application",
  description:
    "Le parcours des écrans de l'application Ombrair — pilotage, programmes, historique et sécurité.",
};

/**
 * Vitrine de l'application.
 *
 * CE QUI CHANGE. La page alignait trois cadres de téléphone identiques de
 * 780 px de haut, remplis chacun de quatre lignes : les trois quarts de la
 * page étaient des aplats sombres vides. C'était la page la plus faible du
 * site alors qu'elle présente ce qui relie tous les produits.
 *
 * Elle devient éditoriale : un seul appareil principal, à côté de la
 * promesse, puis deux vues RECADRÉES plus bas — coupées net en bas, parce
 * qu'un extrait dit « il y a la suite » là où un écran entier à moitié vide
 * dit « il n'y a que ça ».
 *
 * Les valeurs affichées viennent toutes de `lib/mock`. Elles étaient
 * auparavant recopiées en dur dans le JSX (25,8 °C, 11,4 °C, 22h40, 4,2 °C),
 * ce qui aurait fini par diverger de la démo qu'elles illustrent.
 */

const ecrans = [
  {
    nom: "Accueil",
    texte:
      "Température intérieure et extérieure, état global, prochaine action prévue, alerte canicule.",
  },
  {
    nom: "Pièces et ouvrants",
    texte: "Chaque volet et fenêtre, réglable individuellement, en mode auto ou manuel.",
  },
  {
    nom: "Mode auto",
    texte:
      "Les préférences qui pilotent l'algorithme — température cible, plage de rafraîchissement.",
  },
  {
    nom: "Programmes et scénarios",
    texte: "Canicule, Absence, Nuit fraîche, Télétravail, Vacances — modifiables.",
  },
  {
    nom: "Sécurité",
    texte: "Verrouillage, simulation de présence, détection d'ouverture forcée, code PIN.",
  },
  {
    nom: "Historique",
    texte: "Courbes intérieur/extérieur sur 24h, 7 jours, 30 jours, export CSV.",
  },
  { nom: "Notifications", texte: "Alertes canicule, batterie faible, capteur hors ligne." },
  {
    nom: "Réglages",
    texte: "Profil du logement, membres du foyer, appairage d'un capteur, mises à jour.",
  },
];

function nombre(valeur: number) {
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Enveloppe d'écran : le thème sombre en portée locale, comme dans la démo. */
function Ecran({ children }: { children: React.ReactNode }) {
  return <div className="dark flex h-full flex-col bg-background p-6 text-foreground">{children}</div>;
}

export default function ApplicationPage() {
  const ecart = meteo.exterieurC - temperatureInterieureMoyenneC;
  const canicule = scenarios.find((s) => s.actif) ?? scenarios[0];
  const inactif = scenarios.find((s) => !s.actif);

  return (
    <main className="flex flex-1 flex-col">
      {/* ─── Promesse + appareil principal ─── */}
      <Section rythme="ample">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-20">
          <div className="flex flex-col items-start">
            <p className="t-eyebrow text-muted-foreground">Incluse à vie, sans abonnement</p>

            <h1 className="t-display mt-5 text-balance">L&apos;application</h1>

            <p className="t-lead mt-6 max-w-lg text-muted-foreground">
              Le pilotage tient dans une poche : l&apos;état de chaque ouvrant, la prochaine action
              prévue, et la main reprise en un geste quand vous le voulez.
            </p>

            <ul className="mt-10 w-full max-w-lg">
              {[
                "Voir l'état du logement d'un coup d'œil",
                "Reprendre la main sur un ouvrant, sans quitter le mode auto",
                "Suivre l'écart intérieur / extérieur dans le temps",
                "Être prévenu d'une alerte, d'une batterie faible, d'un capteur muet",
              ].map((point) => (
                <li key={point} className="t-body border-b border-border py-3.5 first:border-t">
                  {point}
                </li>
              ))}
            </ul>

            <ActionLien href="/app" className="mt-9">
              Essayer la démo
            </ActionLien>
            <p className="t-caption mt-4 text-muted-foreground">{MENTION_DEMO}</p>
          </div>

          {/* L'écran d'accueil, entier : c'est celui qu'on veut montrer en
              premier, donc le seul qui mérite le cadre complet. */}
          <PhoneFrame>
            <Ecran>
              <div className="flex items-center justify-between">
                <OmbrairLogo variant="horizontal" size="xs" className="text-foreground" />
                <span className="t-data t-caption text-muted-foreground">{instant.heure}</span>
              </div>

              <p className="t-eyebrow mt-8 text-muted-foreground">
                {instant.libelleJour} · {meteo.ville}
              </p>

              {alerteCanicule.active ? (
                <div className="mt-5 border-l-2 border-alerte pl-4">
                  <p className="t-support font-medium text-alerte-texte">
                    Alerte canicule — {alerteCanicule.niveau}
                  </p>
                  <p className="t-caption mt-1.5 text-muted-foreground">{alerteCanicule.message}</p>
                </div>
              ) : null}

              <div className="mt-8">
                <p className="t-eyebrow text-muted-foreground">Intérieur</p>
                <p className="t-data mt-2 text-5xl leading-none text-etat-froid-texte">
                  {nombre(temperatureInterieureMoyenneC)} °C
                </p>
                <p className="t-support mt-3 text-muted-foreground">
                  Extérieur{" "}
                  <span className="t-data text-etat-chaud-texte">{nombre(meteo.exterieurC)} °C</span>{" "}
                  — {nombre(ecart)} °C au-dessus.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-5">
                <p className="t-eyebrow text-muted-foreground">Prochaine action</p>
                <p className="t-data mt-2 text-lg">
                  {prochaineAction.heure} — {prochaineAction.libelle}
                </p>
                <p className="t-caption mt-1.5 text-muted-foreground">
                  Parce que {prochaineAction.raison}.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-5">
                <p className="t-eyebrow text-muted-foreground">Minimum prévu cette nuit</p>
                <p className="t-data mt-2 text-lg">
                  {nombre(meteo.minimumNuitPrevuC)} °C · {meteo.heureMinimumNuit}
                </p>
              </div>
            </Ecran>
          </PhoneFrame>
        </div>
      </Section>

      {/* ─── Deux autres moments, en vues recadrées ─── */}
      <Section fond="sourde" rythme="ample">
        <OuvertureChapitre
          surtitre="Deux autres moments"
          titre="Un programme qui tourne, un écart qui se mesure"
          chapo="Deux extraits d'écran, coupés là où ils continuent dans la démo."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <PhoneFrame taille="courte" coupe className="mx-0">
              <Ecran>
                <p className="t-eyebrow text-muted-foreground">Programmes</p>
                <p className="t-h3 mt-5">{canicule.nom}</p>
                <p className="t-caption mt-1.5 text-etat-chaud-texte">Actif</p>
                <p className="t-support mt-3 text-muted-foreground">{canicule.description}</p>

                {inactif ? (
                  <div className="mt-6 border-t border-border pt-5">
                    <p className="t-h3">{inactif.nom}</p>
                    <p className="t-caption mt-1.5 text-muted-foreground">Programmable, non actif</p>
                  </div>
                ) : null}
              </Ecran>
            </PhoneFrame>

            <div>
              <h3 className="t-h3">Des scénarios, pas des réglages</h3>
              <p className="t-support mt-3 text-muted-foreground">
                Un programme regroupe ce qui change ensemble — heures de fermeture, seuils,
                ouverture nocturne — pour une situation nommée. On l&apos;active, on ne le
                paramètre pas ligne par ligne.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <PhoneFrame taille="courte" coupe className="mx-0">
              <Ecran>
                <p className="t-eyebrow text-muted-foreground">Historique — 24 h</p>

                <div className="mt-6">
                  <p className="t-support">Écart intérieur / extérieur, maintenant</p>
                  <p className="t-data mt-2 text-4xl leading-none">{nombre(ecart)} °C</p>
                </div>

                {/* Deux courbes suggérées : Fraîche pour l'intérieur, Ambre
                    pour l'extérieur — même code couleur que la démo. */}
                <svg viewBox="0 0 300 90" className="mt-7 w-full" aria-hidden="true" fill="none">
                  <path
                    d="M0 66 C 40 62, 80 44, 120 26 S 220 12, 300 20"
                    className="stroke-etat-chaud"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0 80 C 60 78, 120 70, 180 62 S 260 56, 300 58"
                    className="stroke-etat-froid"
                    strokeWidth="2.5"
                  />
                </svg>
                <p className="t-caption mt-3 text-muted-foreground">
                  Extérieur en ambre, intérieur en fraîche.
                </p>
              </Ecran>
            </PhoneFrame>

            <div>
              <h3 className="t-h3">L&apos;écart, pas la promesse</h3>
              <p className="t-support mt-3 text-muted-foreground">
                L&apos;historique montre ce qui a été mesuré chez vous — deux courbes et leur
                écart. Il n&apos;annonce aucun gain garanti : c&apos;est un relevé, pas un
                argument.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Les huit écrans ─── */}
      <Section rythme="ample">
        <OuvertureChapitre
          surtitre="Parcours complet"
          titre="Les huit écrans"
          action={<LienFleche href="/app">Ouvrir la démo</LienFleche>}
        />

        <ol className="mt-12 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {ecrans.map((ecran, i) => (
            <li
              key={ecran.nom}
              className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-5 md:first:border-t md:[&:nth-child(2)]:border-t"
            >
              <span className="t-data t-caption text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="t-h3 block">{ecran.nom}</span>
                <span className="t-support mt-2 block text-muted-foreground">{ecran.texte}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>
    </main>
  );
}
