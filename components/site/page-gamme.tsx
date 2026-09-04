import { FaqListe } from "@/components/site/faq-liste";
import { SelecteurDimensions } from "@/components/site/selecteur-dimensions";
import { ArcheProduit } from "@/components/site/arche-produit";
import { ApercuApp } from "@/components/site/apercu-app";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { ActionLien, LienFleche } from "@/components/site/actions";
import { Nomenclature, RailInstallation, ReleveFabrication } from "@/components/site/produit-blocs";
import { VISUEL_PRODUIT } from "@/components/product-visuals";
import { DecomptePionniers, EncartPionniers } from "@/components/site/pionniers";
import { PrixOffre, DetailInstallation, SuggestionsOffres } from "@/components/site/prix";
import { accesAppInclus, type Gamme } from "@/lib/tarifs";
import { CAPTEURS_PAR_GAMME } from "@/lib/pionniers";

/**
 * Gabarit commun aux trois pages produit. Tout le contenu vient de
 * `lib/tarifs.ts` : les pages elles-mêmes n'apportent que leur FAQ et le
 * détail de ce que fait l'application pour ce produit.
 *
 * ORDRE DES SECTIONS — inchangé. Le visiteur voit d'abord le produit et ce
 * qu'il fait ; la question « qui le fabrique » vient après, sans être
 * masquée.
 *
 *   1. Hero + visuel produit    5. Dimensions et compatibilité
 *   2. Ce qui est fourni        6. Dans l'application
 *   3. Options d'installation   7. Fabrication et responsabilités
 *   4. Pack éventuel            8. Après l'installation · 9. FAQ · 10. CTA
 *
 * LE PRIX n'apparaît qu'une fois en tête. Les montants qui reviennent
 * ensuite (options d'installation, pack, accessoires) sont des tarifs
 * différents dans un contexte propre, pas des répétitions du même chiffre.
 *
 * CE QUI CHANGE DANS CETTE PASSE. Le contenu est identique ; sa mise en
 * page ne l'est pas. La page était une colonne unique de titres et de
 * paragraphes de même poids, avec une moitié droite vide sur le premier
 * écran. Elle alterne désormais les fonds de section, ouvre chaque chapitre
 * par un filet et un surtitre technique, et remplace trois blocs textuels
 * par des représentations : nomenclature, rail d'installation, silhouettes
 * de format, extrait d'application.
 */
export function PageGamme({
  gamme,
  faq,
  dansLApplication,
  enfants,
  apresFourniture,
  visuelHero,
  apresHero,
}: {
  gamme: Gamme;
  faq: { question: string; reponse: string }[];
  dansLApplication: string[];
  /** Contenu propre au produit, placé dans la section compatibilité. */
  enfants?: React.ReactNode;
  /** Bloc inséré après « Ce qui est fourni » — l'explication d'Ombrair
      Link sur la page Capteur, par exemple. */
  apresFourniture?: React.ReactNode;
  /**
   * Visuel de hero de remplacement. Quand il est fourni, il prend la place de
   * l'ouverture en arche — c'est ce qui permet à la page Capteur d'afficher
   * son modèle 3D là où les deux autres gardent leur illustration.
   *
   * Les pages sans visuel dédié ne changent pas d'un pixel : la 3D est un
   * ajout ciblé, pas une refonte du gabarit produit.
   */
  visuelHero?: React.ReactNode;
  /**
   * Section pleine largeur insérée juste après le hero. Sert à la
   * démonstration interactive du volet ; les autres pages produit ne
   * passent rien et gardent exactement leur enchaînement.
   */
  apresHero?: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col">
      {/* ─── 1. Hero produit ─────────────────────────────────────────────
          Deux colonnes sur desktop, l'ouverture en arche à droite. Sur
          mobile, le visuel remonte juste après le titre : l'acheteur doit
          voir l'objet avant de lire le tarif et la liste. */}
      <Section rythme="ample" interieurClassName="lg:min-h-[32rem] lg:flex lg:items-center">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20">
          <div className="flex flex-col items-start lg:order-1">
            <p className="t-eyebrow text-muted-foreground">{gamme.role}</p>

            <h1 className="t-display mt-5 text-balance">{gamme.nom}</h1>

            <p className="t-lead mt-5 max-w-lg text-muted-foreground">{gamme.description}</p>

            {/* PRIX PRINCIPAL = le produit seul. Le total installé n'est
                jamais le titre tarifaire : il vit dans le détail ci-dessous,
                une fois l'installation présentée comme un choix. */}
            <div className="mt-9 w-full max-w-md border-t border-border pt-6">
              <PrixOffre id={gamme.offre} taille="grand" mentionInstallation={false} />
              <p className="t-support mt-3 text-muted-foreground">{gamme.resume}</p>
            </div>

            <p className="t-support mt-6 font-medium">{accesAppInclus}</p>

            <ActionLien href="/devis" className="mt-7">
              Demander un devis
            </ActionLien>
          </div>

          {/* L'ouverture et sa légende. `accroche` existait déjà dans
              `lib/tarifs.ts` mais n'était plus affichée nulle part depuis que
              la carte de tarifs a disparu : elle reprend ici son rôle de
              légende de planche, sous l'objet qu'elle décrit. */}
          {visuelHero ? (
            <div className="lg:order-2">{visuelHero}</div>
          ) : (
            <figure className="flex flex-col gap-4 lg:order-2">
              <ArcheProduit lumiere={gamme.id === "capteur"}>
                {VISUEL_PRODUIT[gamme.id]}
              </ArcheProduit>
              <figcaption className="t-caption flex items-baseline gap-3 text-muted-foreground">
                <span aria-hidden="true" className="h-px w-8 shrink-0 translate-y-[-0.25em] bg-border" />
                {gamme.accroche}
              </figcaption>
            </figure>
          )}
        </div>
      </Section>

      {apresHero}

      {/* ─── 2. Ce qui est fourni ─── */}
      <Section fond="sourde" rythme="ample">
        <OuvertureChapitre
          surtitre="Nomenclature"
          titre="Ce qui est fourni"
          chapo="Le détail de ce qui est livré, article par article."
        />

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <Nomenclature articles={gamme.inclus} />

          {/* L'installation, chiffrée, à côté de ce que contient le produit :
              c'est là que la question « et la pose ? » se pose vraiment. */}
          <aside className="h-fit">
            <DetailInstallation id={gamme.offre} />
          </aside>
        </div>
      </Section>

      {apresFourniture}

      {/* ─── 2 bis. Ombrair Pionniers ────────────────────────────────────
          Section SECONDAIRE, posée après ce qui est fourni : le programme
          se lit une fois qu'on sait ce qu'il y a dans le carton, et il ne
          doit jamais concurrencer le produit.

          Le contenu se dérive de `CAPTEURS_PAR_GAMME` plutôt que d'être
          écrit page par page, ce qui donne le bon comportement pour les
          trois produits sans condition recopiée :

            Capteur  3 capteurs → décompte complet, ligne à ligne
            Volet    0 de base, 4 dans le pack → mention rattachée au pack
            Fenêtre  compte indéterminable → RIEN n'est affiché

          Ce dernier cas est le plus important : le catalogue annonce
          « Capteurs et intégration à l'application » sans jamais donner de
          nombre. Afficher un compte ici reviendrait à inventer une donnée
          commerciale. */}
      <PionniersProduit gamme={gamme} />

      {/* ─── 3. Options d'installation ─── */}
      <Section rythme="normal">
        <OuvertureChapitre
          surtitre="Installation"
          titre="Trois degrés d'intervention"
          chapo="Le point de départ, c'est votre logement : selon l'existant, l'intervention n'est pas la même."
        />
        <div className="mt-12">
          <RailInstallation options={gamme.optionsInstallation} />
        </div>
      </Section>

      {/* ─── 4. Dimensions et compatibilité ──────────────────────────────
          Fusionnées : la contrainte dimensionnelle et la contrainte
          technique relèvent de la même question — « est-ce que ça va chez
          moi ? ». Le Capteur, qui n'a pas de dimensions mais un vrai
          contenu de compatibilité, garde sa section autonome. */}
      {gamme.dimensions ? (
        <Section fond="sourde" rythme="ample">
          <OuvertureChapitre
            surtitre="Formats"
            titre="Dimensions et compatibilité"
            chapo="Les formats les plus courants sont indiqués ci-dessous. Au-delà, la pose se fait sur mesure."
          />
          <div className="mt-12 flex flex-col gap-8">
            <SelecteurDimensions
              dimensions={gamme.dimensions}
              legende={`Format d'ouvrant — ${gamme.nom}`}
            />
            {gamme.compatibilite ? (
              <p className="t-support max-w-2xl text-muted-foreground">{gamme.compatibilite}</p>
            ) : null}
            {enfants}
          </div>
        </Section>
      ) : gamme.compatibilite || enfants ? (
        <Section fond="sourde" rythme="ample">
          <OuvertureChapitre surtitre="Compatibilité" titre="Est-ce que ça va chez vous ?" />
          <div className="mt-12 flex flex-col gap-8">
            {gamme.compatibilite ? (
              <p className="t-lead max-w-2xl text-muted-foreground">{gamme.compatibilite}</p>
            ) : null}
            {enfants}
          </div>
        </Section>
      ) : null}

      {/* ─── 5. Dans l'application ───────────────────────────────────────
          Un extrait d'écran réel plutôt qu'une liste seule : le produit posé
          au mur et l'écran qui le pilote sur la même ligne. */}
      <Section rythme="normal">
        <OuvertureChapitre surtitre="Écosystème" titre="Dans l'application" />

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
          <div>
            <ul className="flex flex-col">
              {dansLApplication.map((item) => (
                <li key={item} className="t-body border-b border-border py-3.5 first:border-t">
                  {item}
                </li>
              ))}
            </ul>
            <LienFleche href="/app" className="mt-8">
              Essayer la démo
            </LienFleche>
          </div>

          <ApercuApp />
        </div>
      </Section>

      {/* ─── 6. Fabrication et responsabilités ───────────────────────────
          Le point à ne jamais rendre flou — mais à sa juste place. */}
      <Section fond="sourde" rythme="normal">
        <OuvertureChapitre surtitre="Responsabilités" titre="Qui conçoit, qui fabrique" />
        <div className="mt-12">
          <ReleveFabrication gamme={gamme} />
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <h3 className="t-h3">Après l&apos;installation</h3>
          <p className="t-body mt-3 max-w-2xl text-muted-foreground">
            Ombrair reste votre interlocuteur : suivi de l&apos;état du matériel, maintenance,
            assistance et accès à l&apos;application inclus à vie, sans abonnement.
          </p>
        </div>
      </Section>

      {/* ─── 6 bis. Souvent choisi avec ─────────────────────────────────
          Cross-sell contextuel, placé après la fabrication et avant la FAQ :
          on a fini de présenter le produit, on peut proposer ce qui le
          complète. Deux suggestions au maximum, dérivées de `lib/offres.ts`. */}
      <Section rythme="normal">
        <SuggestionsOffres id={gamme.offre} className="max-w-3xl" />
      </Section>

      {/* ─── 7. FAQ ─── */}
      <Section rythme="normal">
        <OuvertureChapitre surtitre="Questions" titre={`À propos du ${gamme.nom}`} />
        <div className="mt-10">
          <FaqListe items={faq} />
        </div>
      </Section>

      {/* ─── 8. Reprise finale ─── */}
      <Section fond="encre" rythme="normal">
        <div className="flex flex-col items-start gap-6">
          <h2 className="t-h2 max-w-2xl text-balance">Voir ce que ça donne chez vous</h2>
          <p className="t-lead max-w-xl text-encre-muted">
            Une visite technique confirme la faisabilité et le montant. En attendant, le simulateur
            indique en quatre questions le produit adapté à votre situation.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ActionLien href="/devis" surEncre>
              Demander un devis
            </ActionLien>
            <ActionLien href="/simulateur" niveau="second" surEncre>
              Essayer le simulateur
            </ActionLien>
          </div>
        </div>
      </Section>
    </main>
  );
}

/**
 * Le bloc Pionniers d'une page produit. Local à ce gabarit : il n'a de sens
 * qu'ici, et l'extraire ferait un composant partagé à un seul appelant.
 */
function PionniersProduit({ gamme }: { gamme: Gamme }) {
  const capteurs = CAPTEURS_PAR_GAMME[gamme.id];

  // Capteur : le kit a un compte connu, on le détaille ligne à ligne.
  if (gamme.id === "capteur" && capteurs.base) {
    return (
      <Section rythme="normal">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-20">
          <EncartPionniers compact />
          <DecomptePionniers
            titre="Ce kit"
            lignes={[
              { id: "ext", label: "Capteur extérieur", quantite: 1, eligible: true },
              { id: "int-1", label: "Capteur intérieur", quantite: 1, eligible: true },
              { id: "int-2", label: "Capteur intérieur", quantite: 1, eligible: true },
              { id: "link", label: "Ombrair Link", quantite: 1, eligible: false },
              { id: "modules", label: "Module de pilotage", quantite: 2, eligible: false },
            ]}
          />
        </div>
      </Section>
    );
  }

  /*
   * Volet et fenêtre seuls n'embarquent aucun capteur : ils actionnent, ils
   * ne mesurent pas. Le programme leur est donc rappelé sans chiffre, avec
   * le renvoi vers le pack qui, lui, contient un capteur.
   */
  return (
    <Section rythme="normal">
      <EncartPionniers compact />
      <p className="t-support mt-6 max-w-xl text-muted-foreground">
        {gamme.nom} seul ne génère pas de crédit : il actionne, il ne mesure pas. Le pack qui
        lui associe un capteur en génère un.
      </p>
    </Section>
  );
}
