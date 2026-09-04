import { HeroVolet } from "@/components/site/hero-volet";
import { CasUsageCard } from "@/components/site/cas-usage-card";
import { FaqListe } from "@/components/site/faq-liste";
import { ProductShowcaseCard } from "@/components/site/product-showcase-card";
import { DiagrammeEcosysteme } from "@/components/site/diagramme-ecosysteme";
import { ApercuApp } from "@/components/site/apercu-app";
import { BadgePionnier, MentionPionniers } from "@/components/site/pionniers";
import { PionniersVisual } from "@/components/product-visuals/pionniers-visual";
import { CAPTEURS_PAR_GAMME, wordingPionniers } from "@/lib/pionniers";
import { PACKS, formatPrix, getPrixProduit, offreParId } from "@/lib/offres";
import { EconomiePack, PrixOffre } from "@/components/site/prix";
import { Section, OuvertureChapitre, Conteneur } from "@/components/site/mise-en-page";
import { ActionLien, LienFleche } from "@/components/site/actions";
import { VISUEL_PRODUIT } from "@/components/product-visuals";
import { gammes, type GammeId } from "@/lib/tarifs";

/**
 * Contenu de vitrine : promesse courte, trois points clés et visuel propres
 * à chaque produit. Les prix et le pack viennent de `lib/tarifs.ts` — rien
 * de commercial n'est dupliqué ici.
 */
const VITRINE: Record<
  GammeId,
  { description: string; points: string[]; cta: string }
> = {
  capteur: {
    description:
      "Les données intérieures et extérieures dont Ombrair a besoin pour décider au bon moment.",
    points: [
      "Capteurs intérieur et extérieur",
      "Ombrair Link — mesure, décision, commande",
      "Conçu et fabriqué par Ombrair",
    ],
    cta: "Découvrir le capteur",
  },
  volet: {
    description: "Un volet motorisé, posé par Ombrair et relié à ses capteurs.",
    points: ["Volet motorisé et motorisation", "Installation et configuration", "Pilotage connecté"],
    cta: "Découvrir les volets",
  },
  fenetre: {
    description:
      "Une fenêtre motorisée capable de s'ouvrir lorsque les conditions deviennent favorables.",
    points: [
      "Fenêtre motorisée et actionneur",
      "Protection solaire posée avec elle",
      "Installation et pilotage",
    ],
    cta: "Découvrir les fenêtres",
  },
};

const chiffres = [
  {
    valeur: "11 %",
    legende:
      "de la population de France métropolitaine sera exposée à au moins 30 nuits tropicales par été entre 2021 et 2050, contre 5 % entre 1976 et 2005.",
    source: {
      label: "Insee Flash PACA n°103, mai 2024 — données Météo-France, Drias 2020",
      href: "https://www.insee.fr/fr/statistiques/8188144",
    },
  },
  {
    valeur: "79 %",
    legende:
      "dans le Sud-Est (Provence-Alpes-Côte d'Azur), c'est la part de la population qui serait concernée sur la même période — contre 35 % aujourd'hui.",
    source: {
      label: "Insee Flash PACA n°103, mai 2024 — données Météo-France, Drias 2020",
      href: "https://www.insee.fr/fr/statistiques/8188144",
    },
  },
  {
    valeur: "48 %",
    legende:
      "des logements analysés ont un confort d'été jugé insuffisant. Le manque de protections solaires extérieures (volets, stores) est identifié comme le principal facteur de surchauffe.",
    source: {
      label: "Étude Pouget Consultants / IGNES sur la base DPE de l'Ademe, juin 2026",
      href: "https://ignes.fr/2026/06/16/etude-pouget-consultants-ignes-sur-la-base-dpe-ademe-la-moitie-des-logements-susceptibles-detre-des-bouilloires-thermiques/",
    },
    note: "Analyse de 9 millions de diagnostics de performance énergétique, non redressée : elle ne prétend pas être représentative au sens statistique strict du parc de logements français.",
  },
];

const etapes = [
  {
    titre: "Mesurer",
    produit: "Capteurs",
    texte: "Les capteurs intérieurs et extérieurs relèvent en continu température, humidité et luminosité.",
  },
  {
    titre: "Comprendre",
    produit: "Logique Ombrair",
    texte: "Le système compare les relevés et repère le moment où l'extérieur devient plus chaud — ou plus frais — que l'intérieur.",
  },
  {
    titre: "Agir",
    produit: "Volets et fenêtres",
    texte: "Les ouvrants motorisés se ferment avant que le soleil ne tape, et s'ouvrent quand l'air extérieur redevient plus frais.",
  },
  {
    titre: "Piloter",
    produit: "Application",
    texte: "Vous gardez la main à tout moment, et l'accès à l'application est inclus à vie.",
  },
];

/**
 * Trois situations où le produit change quelque chose. Ce ne sont pas des
 * témoignages : aucun client n'existe, et emprunter la forme de l'avis
 * client — citation, prénom, ville — pour un logement imaginé reviendrait
 * à mimer une preuve sociale qui n'a pas lieu d'être.
 */
const casUsage = [
  {
    situation: "Personne à la maison en journée",
    contexte: "Maison individuelle",
    probleme:
      "Les volets restent ouverts pendant les heures les plus chaudes, faute de quelqu'un pour les fermer. Le soir, le logement a emmagasiné la chaleur de toute la journée.",
    reponse:
      "La fermeture se déclenche quand les capteurs voient l'extérieur passer au-dessus de l'intérieur — que le logement soit occupé ou non.",
  },
  {
    situation: "Chambre exposée à l'ouest",
    contexte: "Appartement ou maison",
    probleme:
      "La pièce prend le soleil en fin d'après-midi et reste chaude au moment du coucher, alors même que la température extérieure a commencé à baisser.",
    reponse:
      "Le volet se ferme avant l'arrivée du soleil sur la façade, puis s'ouvre dès que l'air du dehors redevient plus frais que celui de la chambre.",
  },
  {
    situation: "Logement traversant",
    contexte: "Appartement",
    probleme:
      "La ventilation nocturne serait efficace, mais elle demande d'ouvrir et de refermer au bon moment — souvent en pleine nuit.",
    reponse:
      "Avec des ouvrants motorisés, l'ouverture nocturne suit l'écart de température mesuré, et se referme avant le retour de la chaleur au matin.",
  },
];

const faq = [
  {
    question: "Ombrair fonctionne-t-il avec mes volets actuels ?",
    reponse:
      "Si vos volets roulants sont déjà électriques, oui : un module de pilotage suffit. Un vérificateur de compatibilité est disponible sur la page Capteur.",
  },
  {
    question: "Faut-il payer un abonnement ?",
    reponse:
      "Non. L'accès à l'application est inclus à vie, sans abonnement, pour les trois produits. Ombrair+ est une option facultative, jamais requise.",
  },
  {
    question: "Je peux garder la main sur mes volets ?",
    reponse: "Oui, chaque ouvrant reste pilotable manuellement à tout moment, en plus du mode automatique.",
  },
  {
    question: "Combien ça coûte pour mon logement ?",
    reponse:
      `Le capteur est à ${formatPrix(getPrixProduit("capteur"))}, le volet à ${formatPrix(getPrixProduit("volet"))} par ouvrant, la fenêtre à ${formatPrix(getPrixProduit("fenetre"))} par ouvrant. L'installation Ombrair s'ajoute si vous la retenez, et deux packs associent un capteur à un ouvrant.`,
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Le hero garde son autonomie de mise en page : il porte sa propre
          composition et n'entre pas dans le rythme de section commun. */}
      <Conteneur className="py-12 md:py-16">
        <HeroVolet />
      </Conteneur>

      {/* ─── Le problème ─────────────────────────────────────────────────
          Trois chiffres, séparés par des filets verticaux plutôt que posés
          dans trois blocs. Le nombre domine, la source reste parfaitement
          lisible mais descend d'un cran : c'est une composition éditoriale,
          pas trois cartes de statistiques. */}
      <Section fond="sourde" rythme="ample">
        <OuvertureChapitre
          surtitre="Le constat"
          titre="Le problème n'est pas une impression."
          chapo="Trois relevés publics, sourcés, sur l'inconfort d'été du logement français."
        />

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-3">
          {chiffres.map((chiffre, i) => (
            <div
              key={chiffre.valeur}
              className={
                i === 0 ? "flex flex-col" : "flex flex-col md:border-l md:border-border md:pl-12"
              }
            >
              <p className="t-display leading-none">{chiffre.valeur}</p>
              <p className="t-body mt-5 text-muted-foreground">{chiffre.legende}</p>
              {chiffre.note ? (
                <p className="t-caption mt-3 text-muted-foreground/85 italic">{chiffre.note}</p>
              ) : null}
              <a
                href={chiffre.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-caption mt-auto pt-5 text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                Source — {chiffre.source.label}
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Comment ça marche ───────────────────────────────────────────
          Les quatre temps sont une vraie séquence — mesurer précède
          comprendre, qui précède agir — donc la numérotation dit quelque
          chose, et le rail continu la matérialise. */}
      <Section rythme="ample">
        <OuvertureChapitre
          surtitre="Le principe"
          titre="Comment ça marche"
          chapo="Quatre temps, en continu, sans intervention."
          action={<LienFleche href="/comment-ca-marche">Voir le détail</LienFleche>}
        />

        <ol className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <span
            aria-hidden="true"
            className="absolute top-[0.3rem] right-0 left-0 hidden h-px bg-border lg:block"
          />
          {etapes.map((etape, i) => (
            <li key={etape.titre} className="relative flex flex-col">
              <span
                aria-hidden="true"
                className="relative z-10 block size-3 bg-foreground"
                style={{ opacity: 1 - i * 0.15 }}
              />
              <span className="t-data t-caption mt-5 text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-h2 mt-2">{etape.titre}</h3>
              <p className="t-eyebrow mt-3 text-muted-foreground">{etape.produit}</p>
              <p className="t-support mt-4 text-muted-foreground">{etape.texte}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── Vitrine produit ─────────────────────────────────────────────
          Le point haut du site d'après l'audit : trois compositions
          distinctes, cadrage commun en arche. On ne la refait pas. */}
      <Section fond="sourde" rythme="ample">
        <OuvertureChapitre
          surtitre="Nos solutions"
          titre="Trois produits, un même écosystème"
          chapo="Les capteurs mesurent, les volets protègent et les fenêtres ventilent. Ombrair adapte l'installation à votre logement."
          action={<LienFleche href="/gammes">Voir le catalogue</LienFleche>}
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {gammes.map((gamme) => (
            <ProductShowcaseCard
              key={gamme.id}
              role={gamme.role}
              nom={gamme.nom}
              description={VITRINE[gamme.id].description}
              offre={gamme.offre}
              resume={gamme.resume}
              points={VITRINE[gamme.id].points}
              href={gamme.href}
              ctaLabel={VITRINE[gamme.id].cta}
              visuel={VISUEL_PRODUIT[gamme.id]}
              /* Uniquement quand le catalogue chiffre les capteurs du
                 produit — donc pas sur la fenêtre. */
              pionniers={
                CAPTEURS_PAR_GAMME[gamme.id].base ? (
                  <MentionPionniers capteurs={CAPTEURS_PAR_GAMME[gamme.id].base} />
                ) : null
              }
            />
          ))}
        </div>
      </Section>

      {/* ─── Les packs ───────────────────────────────────────────────────
          Présentation SECONDAIRE, sous la vitrine : les trois produits
          restent les catégories principales d'Ombrair, les packs sont une
          façon de les combiner. Deux lignes sur un filet, pas deux cartes
          qui viendraient concurrencer les trois du dessus. */}
      <Section rythme="normal">
        <div className="border-t border-border pt-6">
          <p className="t-eyebrow text-muted-foreground">Les packs</p>
          <ul className="mt-6 grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
            {PACKS.map((id) => {
              const pack = offreParId(id);
              return (
                <li key={id}>
                  <h3 className="t-h3">{pack.nom}</h3>
                  <div className="mt-3">
                    <PrixOffre id={id} taille="compact" mentionInstallation={false} />
                  </div>
                  <EconomiePack id={id} className="mt-2" />
                </li>
              );
            })}
          </ul>
          <LienFleche href="/gammes#packs" className="mt-8">
            Voir les packs
          </LienFleche>
        </div>
      </Section>

      {/* ─── Écosystème ─── */}
      <Section rythme="ample">
        <OuvertureChapitre
          surtitre="Un seul écosystème"
          titre="Les trois produits parlent la même langue"
          chapo="Mesurer, décider, agir, informer : quatre maillons sur une même ligne technique."
        />
        <div className="mt-14">
          <DiagrammeEcosysteme />
        </div>
      </Section>

      {/* ─── L'application ─── */}
      <Section fond="sourde" rythme="ample">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
          <div>
            <p className="t-eyebrow text-muted-foreground">L&apos;application</p>
            <h2 className="t-h1 mt-5 max-w-md text-balance">Le pilotage, dans votre poche</h2>
            <p className="t-lead mt-5 max-w-md text-muted-foreground">
              État de chaque ouvrant, prochaine action prévue, alertes canicule :
              l&apos;application donne la main sans jamais l&apos;imposer.
            </p>
            <LienFleche href="/application" className="mt-8">
              Découvrir l&apos;application
            </LienFleche>
          </div>

          <ApercuApp />
        </div>
      </Section>

      {/* ─── Cas d'usage ─── */}
      <Section rythme="ample">
        <OuvertureChapitre
          surtitre="Situations"
          titre="Trois situations où Ombrair change quelque chose"
          chapo="Ombrair étant un projet d'étude, ces cas décrivent des configurations de logement courantes — pas des clients."
        />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {casUsage.map((cas) => (
            <CasUsageCard key={cas.situation} {...cas} />
          ))}
        </div>
      </Section>

      {/* ─── Ombrair Pionniers ───────────────────────────────────────────
          Placé après la vitrine produit et l'écosystème, avant la FAQ et la
          reprise finale : le programme est un bonus différenciant, pas une
          raison d'acheter. Il n'apparaît donc jamais dans le premier écran.

          Composition asymétrique et volontairement pauvre en éléments —
          l'accroche, la règle, un lien. Tout le détail vit sur `/pionniers`,
          et la page d'accueil n'a pas à le porter. */}
      <Section rythme="ample">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
          <div className="flex flex-col items-start">
            <BadgePionnier />

            <h2 className="t-h1 mt-6 max-w-lg text-balance">{wordingPionniers.accroche}</h2>

            <p className="t-lead mt-5 max-w-md text-muted-foreground">
              Chaque capteur Ombrair acheté génère un Crédit Pionnier. Une reconnaissance pour
              ceux qui font confiance à la marque en premier — pas un placement.
            </p>

            {/* La règle, seule sur sa ligne. C'est tout ce que la page
                d'accueil doit faire retenir du programme. */}
            <p className="t-data mt-9 border-t border-border pt-6 text-xl">
              {wordingPionniers.principe}
            </p>

            <LienFleche href="/pionniers" className="mt-7">
              {wordingPionniers.cta}
            </LienFleche>
          </div>

          <div className="rounded-lg bg-surface-sourde p-8">
            <PionniersVisual />
          </div>
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section fond="sourde" rythme="normal">
        <OuvertureChapitre
          surtitre="Questions"
          titre="Questions fréquentes"
          action={<LienFleche href="/faq">Voir toute la FAQ</LienFleche>}
        />
        <div className="mt-10">
          <FaqListe items={faq} />
        </div>
      </Section>

      {/* ─── Reprise finale ─── */}
      <Section fond="encre" rythme="ample">
        <div className="flex flex-col items-start gap-6">
          {/* Espace insécable : en typographie française le « ? » ne doit pas
              être renvoyé seul à la ligne. */}
          <h2 className="t-h1 max-w-xl text-balance">
            Prêt à voir ce que ça donne chez vous&nbsp;?
          </h2>
          <p className="t-lead max-w-md text-encre-muted">
            Le devis se fait en ligne, produit puis installation, sans engagement.
          </p>
          <ActionLien href="/devis" surEncre className="mt-2">
            Demander un devis
          </ActionLien>
        </div>
      </Section>
    </main>
  );
}
