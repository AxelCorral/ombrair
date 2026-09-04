import type { Metadata } from "next";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { ActionLien, LienFleche } from "@/components/site/actions";
import { FaqListe } from "@/components/site/faq-liste";
import { PionniersVisual } from "@/components/product-visuals/pionniers-visual";
import {
  AvertissementPionniers,
  BadgePionnier,
  DecomptePionniers,
} from "@/components/site/pionniers";
import {
  definitionIpo,
  etapesPionniers,
  faqPionniers,
  getCreditsPionniers,
  mentionExemple,
  siPasDIpo,
  wordingPionniers,
} from "@/lib/pionniers";

/**
 * Page du programme Ombrair Pionniers.
 *
 * OBJECTIF : comprendre le programme en moins de deux minutes. La page est
 * donc courte et n'essaie pas d'être exhaustive — elle dit la règle, montre
 * un exemple, répond à la question gênante, et s'arrête.
 *
 * ORDRE DE LECTURE. La mécanique vient AVANT la Bourse, volontairement : le
 * programme se comprend d'abord comme une reconnaissance des premiers
 * clients, et seulement ensuite comme un dispositif conditionnel. Ouvrir sur
 * l'introduction en Bourse en ferait un argument financier, ce qu'il n'est
 * pas.
 *
 * La question « et si Ombrair n'entre jamais en Bourse ? » est traitée en
 * pleine section, pas en note de bas de page. C'est la question que se pose
 * un lecteur attentif, et l'éviter décrédibiliserait tout le reste.
 */

export const metadata: Metadata = {
  title: "Ombrair Pionniers",
  /*
   * SEO. Le vocabulaire est celui d'un programme client — jamais
   * « investissement », « acheter des actions » ou « rendement », qui
   * attireraient une intention de recherche que ce concept ne satisfait pas
   * et ne doit pas prétendre satisfaire.
   */
  description:
    "Ombrair Pionniers : le programme qui associe les premiers clients Ombrair à la suite de l'aventure. Chaque capteur acheté génère un Crédit Pionnier. Programme conceptuel, projet étudiant fictif.",
  keywords: [
    "Ombrair Pionniers",
    "programme client Ombrair",
    "premiers clients",
    "Crédit Pionnier",
  ],
};

/*
 * Exemple d'un logement à trois pièces suivies. Il montre la règle sur un cas
 * courant : trois capteurs, un volet, un Ombrair Link. Seuls les capteurs
 * comptent — le volet actionne, la passerelle relie, ni l'un ni l'autre ne
 * mesure.
 *
 * Les quantités décrivent un panier possible, pas une offre packagée : le
 * catalogue vend les capteurs à l'unité.
 */
const LIGNES_EXEMPLE = [
  { id: "c1", label: "Capteur Ombrair — séjour", quantite: 1, eligible: true },
  { id: "c2", label: "Capteur Ombrair — chambre", quantite: 1, eligible: true },
  { id: "c3", label: "Capteur Ombrair — extérieur", quantite: 1, eligible: true },
  { id: "volet", label: "Volet Ombrair", quantite: 1, eligible: false },
  { id: "link", label: "Ombrair Link", quantite: 1, eligible: false },
];

export default function PionniersPage() {
  const creditsExemple = getCreditsPionniers(
    LIGNES_EXEMPLE.filter((l) => l.eligible).reduce((n, l) => n + l.quantite, 0)
  );

  return (
    <main className="flex flex-1 flex-col">
      {/* ─── Hero ─── */}
      <Section rythme="ample">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
          <div className="flex flex-col items-start">
            <p className="t-eyebrow text-muted-foreground">{wordingPionniers.surtitre}</p>

            <h1 className="t-display mt-5 max-w-2xl text-balance">
              {wordingPionniers.accroche}
            </h1>

            <p className="t-lead mt-6 max-w-lg text-muted-foreground">
              {wordingPionniers.sousTitre}
            </p>

            {/* La règle, isolée : c'est ce qu'on doit retenir en cinq secondes. */}
            <p className="t-data mt-10 border-t border-border pt-6 text-2xl">
              {wordingPionniers.principe}
            </p>

            {/*
              Ancre vers la mécanique, et non « Investir ». Le programme ne
              se souscrit pas : il accompagne un achat de matériel.
            */}
            <ActionLien href="#fonctionnement" className="mt-8">
              Découvrir le fonctionnement
            </ActionLien>
          </div>

          <figure className="flex flex-col gap-4">
            <div className="rounded-lg bg-surface-panneau p-8">
              <PionniersVisual />
            </div>
            <figcaption className="t-caption flex items-baseline gap-3 text-muted-foreground">
              <span aria-hidden="true" className="h-px w-8 shrink-0 translate-y-[-0.25em] bg-border" />
              Les premières contributions sont marquées ; la suite reste ouverte.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ─── Mécanique ─── */}
      <Section id="fonctionnement" fond="sourde" rythme="ample">
        <OuvertureChapitre
          surtitre="Fonctionnement"
          titre="Trois temps, dans cet ordre"
          chapo="Le programme n'est pas un placement : c'est une reconnaissance attachée à un achat de matériel."
        />

        <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {etapesPionniers.map((etape, i) => (
            <li key={etape.titre} className="flex flex-col border-t border-foreground/30 pt-5">
              <span className="t-data t-caption text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-h3 mt-3 text-balance">{etape.titre}</h3>
              <p className="t-support mt-4 text-muted-foreground">{etape.texte}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── Exemple concret ─── */}
      <Section rythme="ample">
        <OuvertureChapitre
          surtitre="Exemple"
          titre="Ce que donne un kit"
          chapo="Un capteur acheté vaut un crédit. Un volet, une fenêtre ou Ombrair Link n'en valent aucun : ils actionnent ou relient, ils ne mesurent pas."
        />

        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-20">
          <DecomptePionniers titre="Un logement à trois pièces suivies" lignes={LIGNES_EXEMPLE} />

          <div className="lg:pt-9">
            <p className="t-body max-w-md text-muted-foreground">
              Soit{" "}
              <span className="t-data text-foreground">{creditsExemple} Crédits Pionniers</span>{" "}
              pour ce logement. Un capteur ajouté plus tard en ajoute un de plus, et les deux
              packs en comprennent un chacun.
            </p>
            <p className="t-support mt-6 max-w-md text-muted-foreground italic">
              {mentionExemple}
            </p>
            <LienFleche href="/gammes/capteur" className="mt-8">
              Voir le capteur
            </LienFleche>
          </div>
        </div>
      </Section>

      {/* ─── L'introduction en Bourse ─────────────────────────────────────
          Placée APRÈS la mécanique, et traitée sobrement : une définition
          pour qui n'est pas familier du sujet, puis la question qui fâche. */}
      <Section fond="sourde" rythme="ample">
        <OuvertureChapitre
          surtitre="Le conditionnel"
          titre="Ce que « si Ombrair entre en Bourse » veut dire"
        />

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
          <div>
            <h3 className="t-h3">Une introduction en Bourse, en une phrase</h3>
            <p className="t-body mt-4 text-muted-foreground">{definitionIpo}</p>
          </div>

          <div className="md:border-l md:border-border md:pl-16">
            <h3 className="t-h3">Et si Ombrair n&apos;entre jamais en Bourse ?</h3>
            <p className="t-body mt-4 text-muted-foreground">{siPasDIpo}</p>
          </div>
        </div>

        <AvertissementPionniers className="mt-14" />
      </Section>

      {/* ─── FAQ ─── */}
      <Section rythme="normal">
        <OuvertureChapitre surtitre="Questions" titre="Ce qu'on nous demandera" />
        <div className="mt-10">
          <FaqListe items={faqPionniers.map((q) => ({ ...q }))} />
        </div>
      </Section>

      {/* ─── Reprise ──────────────────────────────────────────────────────
          Le CTA renvoie au PRODUIT, pas au programme : on achète un capteur
          parce qu'il est utile, le crédit vient avec. */}
      <Section fond="encre" rythme="normal">
        <div className="flex flex-col items-start gap-6">
          <BadgePionnier className="border-encre-border text-encre-muted" />
          <h2 className="t-h2 max-w-2xl text-balance">
            Le programme vient avec le produit, pas l&apos;inverse.
          </h2>
          <p className="t-lead max-w-xl text-encre-muted">
            Ombrair se choisit parce que les volets ferment au bon moment. Les Crédits Pionniers
            ne sont que la trace de ceux qui y sont venus les premiers.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ActionLien href="/gammes/capteur" surEncre>
              Voir le capteur
            </ActionLien>
            <ActionLien href="/devis" niveau="second" surEncre>
              Demander un devis
            </ActionLien>
          </div>
        </div>
      </Section>
    </main>
  );
}
