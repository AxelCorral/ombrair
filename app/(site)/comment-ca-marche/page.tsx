import type { Metadata } from "next";
import { SchemaJournee } from "@/components/site/schema-journee";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { ActionLien, LienFleche } from "@/components/site/actions";
import { ArcheProduit } from "@/components/site/arche-produit";
import { ApercuApp } from "@/components/site/apercu-app";
import { LinkVisual } from "@/components/product-visuals";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "La logique de décision d'Ombrair expliquée sans jargon : ce que les capteurs mesurent, comment l'algorithme décide, ce qu'il prend en compte et ce qu'il ne fait pas.",
};

/**
 * Comment ça marche.
 *
 * CE QUI CHANGE. La page était un titre, un graphique, deux colonnes de
 * texte et quatre cartes : tout le contenu était là, mais rien ne le
 * racontait. Elle suit maintenant les quatre temps du système — LE JOUR,
 * OBSERVER, DÉCIDER, GARDER LA MAIN — chacun ouvert par son repère chiffré.
 *
 * La numérotation est légitime ici : c'est une vraie séquence, celle que
 * suit la logique du produit du matin au soir.
 *
 * Aucun contenu n'est ajouté ni retiré. Le graphique de journée, la liste
 * de ce qui est pris en compte, la liste de ce que le système NE fait pas
 * et l'inventaire du matériel sont les mêmes, à leur place dans le récit.
 * La liste des limites reste intégrale et au même niveau de titre que le
 * reste : c'est le passage le plus honnête de la page.
 */

const priseEnCompte = [
  "Température et humidité intérieures et extérieures",
  "Luminosité extérieure, pour ne pas plonger une pièce dans le noir en pleine journée",
  "Qualité de l'air extérieur, quand un capteur est installé",
  "Vos préférences par pièce (température cible, plage horaire de rafraîchissement)",
  "Les scénarios actifs (Absence, Canicule, Nuit fraîche…)",
];

const nePasFaire = [
  "Ombrair ne prévoit pas la météo par lui-même — la prévision à 7 jours est une fonctionnalité de l'option Ombrair+, pas du socle gratuit.",
  "Il n'ouvre jamais un ouvrant en mode sécurité (absence, alerte vent) même si la logique thermique le suggérerait.",
  "Il ne remplace pas une action manuelle : toute commande directe dans l'app ou sur l'interrupteur reste prioritaire.",
  "Il ne garantit pas une température précise — c'est une aide à la décision, pas un système de climatisation.",
];

const materiel = [
  {
    nom: "Ombrair Link",
    texte: "Wi-Fi et radio, connecte tous les capteurs et modules au foyer et à l'application.",
  },
  {
    nom: "Capteur extérieur",
    texte: "Température, humidité, luminosité — et qualité d'air sur les modèles récents.",
  },
  {
    nom: "Capteurs intérieurs",
    texte: "Un par pièce suivie, mesurent température et humidité en continu.",
  },
  {
    nom: "Modules de pilotage",
    texte:
      "Se clipsent dans le coffre d'un volet déjà motorisé, ou sont intégrés à la pose d'un volet neuf.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section rythme="ample">
        <OuvertureChapitre
          niveau="h1"
          surtitre="Le principe"
          titre="Comment ça marche"
          chapo="Pas de règle mystérieuse : Ombrair compare en continu la température intérieure et extérieure, et agit quand l'écart devient significatif dans un sens ou dans l'autre."
        />
      </Section>

      {/* ─── 01 — Le jour ─── */}
      <Section fond="sourde" rythme="ample">
        <OuvertureChapitre
          index="01"
          surtitre="Le jour"
          titre="Une journée type"
          chapo="Ce que fait la chaleur d'une journée d'été, et à quels moments un ouvrant change quelque chose."
        />
        <div className="mt-12">
          <SchemaJournee />
        </div>
      </Section>

      {/* ─── 02 — Observer ─────────────────────────────────────────────
          Le matériel devient une nomenclature, et Ombrair Link est enfin
          montré sur la page qui l'explique le plus. */}
      <Section rythme="ample">
        <OuvertureChapitre
          index="02"
          surtitre="Observer"
          titre="Ce qui mesure"
          chapo="Quatre équipements, dont un seul est un boîtier : le reste se pose là où il y a quelque chose à mesurer ou à commander."
        />

        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-20">
          <ol>
            {materiel.map((item, i) => (
              <li
                key={item.nom}
                className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-5 first:border-t"
              >
                <span className="t-data t-caption text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="t-h3 block">{item.nom}</span>
                  <span className="t-support mt-2 block text-muted-foreground">{item.texte}</span>
                </span>
              </li>
            ))}
          </ol>

          <figure className="flex flex-col gap-4">
            <ArcheProduit>
              <LinkVisual anime />
            </ArcheProduit>
            <figcaption className="t-caption flex items-baseline gap-3 text-muted-foreground">
              <span aria-hidden="true" className="h-px w-8 shrink-0 translate-y-[-0.25em] bg-border" />
              Ombrair Link — le boîtier qui reçoit, décide et commande.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ─── 03 — Décider ─── */}
      <Section fond="sourde" rythme="ample">
        <OuvertureChapitre
          index="03"
          surtitre="Décider"
          titre="Ce qui entre dans la décision — et ce qui n'en sort jamais"
        />

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          <div>
            <h3 className="t-h3">Ce que l&apos;algorithme prend en compte</h3>
            <ul className="mt-5">
              {priseEnCompte.map((item) => (
                <li key={item} className="flex gap-3 border-b border-border py-3.5 first:border-t">
                  <span aria-hidden="true" className="t-data text-etat-froid-texte">
                    +
                  </span>
                  <span className="t-support text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-border md:pl-16">
            <h3 className="t-h3">Ce qu&apos;il ne fait pas</h3>
            <ul className="mt-5">
              {nePasFaire.map((item) => (
                <li key={item} className="flex gap-3 border-b border-border py-3.5 first:border-t">
                  <span aria-hidden="true" className="t-data text-alerte-texte">
                    −
                  </span>
                  <span className="t-support text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ─── 04 — Garder la main ─── */}
      <Section rythme="ample">
        <OuvertureChapitre index="04" surtitre="Garder la main" titre="Vous décidez en dernier" />

        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
          <div>
            <p className="t-lead max-w-xl text-muted-foreground">
              Le mode automatique propose ; il ne confisque rien. Chaque ouvrant reste pilotable
              depuis l&apos;application ou depuis son interrupteur, et une commande directe reprend
              toujours le pas sur la logique.
            </p>
            <LienFleche href="/app" className="mt-8">
              Essayer la démo de l&apos;application
            </LienFleche>
          </div>

          <ApercuApp />
        </div>
      </Section>

      <Section fond="encre" rythme="normal">
        <div className="flex flex-col items-start gap-6">
          <h2 className="t-h2 max-w-2xl text-balance">Voir le détail par produit</h2>
          <p className="t-lead max-w-xl text-encre-muted">
            Capteur, volet, fenêtre : ce que chacun fait, ce qu&apos;Ombrair fabrique et ce
            qu&apos;il installe.
          </p>
          <ActionLien href="/gammes" surEncre className="mt-2">
            Voir le catalogue
          </ActionLien>
        </div>
      </Section>
    </main>
  );
}
