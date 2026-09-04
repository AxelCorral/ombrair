"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { formatDimension, gammeParId, gammes, type GammeId } from "@/lib/tarifs";
import { CAPTEURS_PAR_GAMME, capteursDuPack, getCreditsPionniers } from "@/lib/pionniers";
import {
  OFFRES,
  formatPrix,
  getBundleSavings,
  getPrixInstallation,
  getTotalConfigure,
  offreParId,
  type OffreId,
} from "@/lib/offres";
import { ChoixInstallation } from "@/components/site/choix-installation";
import { SuggestionsOffres } from "@/components/site/prix";

type Equipement = OffreId | "plusieurs";

interface Donnees {
  typeLogement: "maison" | "appartement" | "";
  ville: string;
  orientation: string;
  equipement: Equipement | "";
  /**
   * Installation Ombrair. `null` tant que la question n'a pas été posée —
   * distinct de `false`, qui est une réponse. Sans cette nuance, l'étape
   * s'ouvrirait avec « sans installation » déjà coché, ce qui répondrait à
   * la place du visiteur.
   */
  avecInstallation: boolean | null;
  nombreOuvrants: string;
  dimensionId: string;
  existant: "motorise" | "manuel" | "aucun" | "";
  installationId: string;
  nom: string;
  email: string;
  telephone: string;
}

const donneesInitiales: Donnees = {
  typeLogement: "",
  ville: "",
  orientation: "",
  equipement: "",
  avecInstallation: null,
  nombreOuvrants: "",
  dimensionId: "",
  existant: "",
  installationId: "",
  nom: "",
  email: "",
  telephone: "",
};

/*
 * Le parcours suit désormais la logique commerciale : on choisit un PRODUIT,
 * puis on décide de l'INSTALLATION, puis on complète. Les étapes existantes
 * — logement, configuration, coordonnées, récapitulatif — sont conservées :
 * l'installation s'insère entre le produit et sa configuration, là où la
 * question se pose naturellement.
 */
const etapes = [
  "Logement",
  "Produit",
  "Installation",
  "Configuration",
  "Coordonnées",
  "Récapitulatif",
] as const;

const LIBELLE_EQUIPEMENT: Record<Equipement, string> = {
  capteur: "Capteur Ombrair",
  volet: "Volet Ombrair",
  fenetre: "Fenêtre Ombrair",
  "pack-capteur-volet": "Pack Capteur + Volet",
  "pack-capteur-fenetre": "Pack Capteur + Fenêtre",
  plusieurs: "Plusieurs équipements",
};

/** L'offre tarifaire correspondante, ou `null` pour « plusieurs ». */
function offreChoisie(equipement: Donnees["equipement"]): OffreId | null {
  if (equipement === "" || equipement === "plusieurs") return null;
  return equipement;
}

/**
 * La gamme dont on tire dimensions et cas d'installation.
 *
 * Un pack retombe sur l'OUVRANT qu'il contient : c'est lui qui se
 * dimensionne, pas le capteur. « Plusieurs équipements » n'a pas de gamme
 * unique et rend `null`.
 */
function gammeChoisie(equipement: Donnees["equipement"]) {
  const offre = offreChoisie(equipement);
  if (!offre) return null;
  const ouvrant = offreParId(offre).produitsInclus.find((p) => p !== "capteur");
  return gammeParId((ouvrant ?? "capteur") as GammeId);
}

function etapeValide(index: number, d: Donnees): boolean {
  const gamme = gammeChoisie(d.equipement);
  switch (index) {
    case 0:
      return d.typeLogement !== "" && d.ville.trim() !== "";
    case 1:
      return d.equipement !== "";
    case 2:
      /*
       * « Plusieurs équipements » n'a pas de tarif d'installation défini :
       * l'étape est traversée sans blocage, et le sujet se traite avec un
       * conseiller.
       */
      return d.equipement === "plusieurs" || d.avecInstallation !== null;
    case 3: {
      if (d.installationId === "") return false;
      // Les ouvrants ne se comptent que pour les volets et les fenêtres.
      if (gamme?.dimensions) {
        return d.nombreOuvrants !== "" && Number(d.nombreOuvrants) > 0 && d.dimensionId !== "";
      }
      return true;
    }
    case 4:
      return d.nom.trim() !== "" && d.email.trim() !== "";
    default:
      return true;
  }
}

/**
 * Fil des étapes.
 *
 * La progression était une barre de cinq segments de 4 px surmontée d'une
 * ligne de texte : on savait qu'on avançait, jamais vers quoi. Les étapes
 * sont maintenant nommées et numérotées, l'étape courante marquée par un
 * repère plein et un libellé en pleine valeur, les suivantes en retrait.
 *
 * Sur mobile, afficher cinq libellés côte à côte les rendrait illisibles :
 * la version compacte garde le repère chiffré et le nom de l'étape en cours,
 * ce que la version desktop dit en entier.
 */
function FilEtapes({ etape }: { etape: number }) {
  return (
    <nav aria-label="Progression de la demande">
      <p className="t-eyebrow text-muted-foreground sm:hidden">
        <span className="text-foreground">{String(etape + 1).padStart(2, "0")}</span>
        <span aria-hidden="true" className="px-2 opacity-40">
          /
        </span>
        {etapes[etape]}
      </p>

      <ol className="hidden sm:grid sm:grid-cols-5 sm:gap-3">
        {etapes.map((nom, i) => {
          const passee = i < etape;
          const courante = i === etape;
          return (
            <li key={nom} className="flex flex-col gap-2.5">
              <span
                aria-hidden="true"
                className={
                  passee || courante ? "h-px w-full bg-foreground" : "h-px w-full bg-border"
                }
              />
              <span className="flex items-baseline gap-2">
                <span
                  className={
                    courante
                      ? "t-data t-caption text-foreground"
                      : "t-data t-caption text-muted-foreground"
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={courante ? "t-caption font-medium" : "t-caption text-muted-foreground"}
                >
                  {nom}
                </span>
              </span>
              {courante ? <span className="sr-only">— étape en cours</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Panneau contextuel — la colonne de droite du parcours.
 *
 * POURQUOI. À 1440 px, le formulaire occupait le tiers gauche et laissait
 * les deux tiers restants entièrement vides sur toute la hauteur de la
 * page : le moment le plus engageant du site était aussi le plus désert.
 *
 * Le panneau ne demande rien et ne calcule rien. Il REND VISIBLE ce qui a
 * déjà été répondu, ligne par ligne, à mesure que le parcours avance. Les
 * lignes non encore renseignées restent affichées en attente plutôt que
 * masquées : on voit d'emblée ce que la demande contiendra.
 *
 * Il vit à l'intérieur de `DevisForm` parce que c'est là que l'état existe.
 * Le remonter aurait demandé de réécrire la logique du formulaire, ce que
 * cette passe n'a pas à faire — seule la présentation change.
 */
function PanneauDemande({
  donnees,
  gamme,
}: {
  donnees: Donnees;
  gamme: ReturnType<typeof gammeChoisie>;
}) {
  const dimension = gamme?.dimensions?.find((d) => d.id === donnees.dimensionId);
  const situation = gamme?.optionsInstallation.find((o) => o.id === donnees.installationId);

  const lignes: [string, string | null][] = [
    [
      "Logement",
      donnees.typeLogement
        ? `${donnees.typeLogement === "maison" ? "Maison" : "Appartement"}${donnees.ville ? ` — ${donnees.ville}` : ""}`
        : null,
    ],
    ["Orientation", donnees.orientation.trim() || null],
    ["Produit", donnees.equipement ? LIBELLE_EQUIPEMENT[donnees.equipement] : null],
    [
      "Installation",
      donnees.avecInstallation === null
        ? null
        : donnees.avecInstallation
          ? "Avec installation Ombrair"
          : "Sans installation Ombrair",
    ],
    ["Ouvrants", donnees.nombreOuvrants ? `${donnees.nombreOuvrants}` : null],
    ["Format", dimension ? `${dimension.label} — ${formatDimension(dimension)}` : null],
    ["Situation", situation?.label ?? null],
    ["Contact", donnees.nom.trim() || null],
  ];

  return (
    <aside className="lg:sticky lg:top-28">
      <p className="t-eyebrow text-muted-foreground">Votre demande</p>

      <dl className="mt-6">
        {lignes.map(([cle, valeur]) => (
          <div
            key={cle}
            className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-border py-3 first:border-t"
          >
            <dt className="t-caption text-muted-foreground">{cle}</dt>
            {/*
              Le tiret dit « pas encore renseigné ». Il était à 55 %
              d'opacité, soit un contraste de 2,14 mesuré une fois composé
              sur son fond — sous le seuil AA pour un texte qui porte une
              information. Il passe à la couleur de texte secondaire, et
              l'état est donné en toutes lettres aux technologies
              d'assistance plutôt que par la seule pâleur du signe.
            */}
            <dd className="t-support text-muted-foreground">
              {valeur ?? (
                <>
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">non renseigné</span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <p className="t-caption mt-6 text-muted-foreground">
        Aucun montant n&apos;est calculé pendant le parcours : le devis définitif dépend des
        dimensions relevées et du type de pose, et se confirme après visite technique.
      </p>
    </aside>
  );
}

/** Les packs proposés au devis, dans l'ordre du catalogue. */
const PACKS_DEVIS: OffreId[] = ["pack-capteur-volet", "pack-capteur-fenetre"];

export function DevisForm() {
  const [etape, setEtape] = useState(0);
  const [donnees, setDonnees] = useState<Donnees>(donneesInitiales);
  const [envoye, setEnvoye] = useState(false);
  const idBase = useId();
  const titreRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titreRef.current?.focus();
  }, [etape]);

  function champ<K extends keyof Donnees>(cle: K, valeur: Donnees[K]) {
    setDonnees((d) => ({ ...d, [cle]: valeur }));
  }

  /** Changer d'équipement invalide la configuration déjà saisie. */
  function choisirEquipement(valeur: Equipement) {
    /*
     * Changer de produit remet l'installation à « non répondu » : son tarif
     * dépend de l'offre, et conserver un choix fait pour un autre produit
     * afficherait un total faux le temps d'un rendu.
     */
    setDonnees((d) => ({
      ...d,
      equipement: valeur,
      avecInstallation: null,
      dimensionId: "",
      installationId: "",
    }));
  }

  const gamme = gammeChoisie(donnees.equipement);
  const offreRetenue = offreChoisie(donnees.equipement);

  if (envoye) {
    return (
      <div role="status" className="flex flex-col gap-3 rounded-lg border border-border bg-card p-8">
        <h2 ref={titreRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
          Demande reçue (simulation)
        </h2>
        <p className="text-sm text-muted-foreground">
          Aucune demande n&apos;a réellement été transmise — ce parcours est une démonstration dans le cadre
          d&apos;un projet étudiant fictif. Dans une version réelle, la visite technique permettrait
          d&apos;établir le devis définitif.
        </p>
      </div>
    );
  }

  return (
    /*
     * Deux colonnes sur desktop : le parcours à gauche, ce qu'il a déjà
     * recueilli à droite. Une seule colonne en dessous de `lg`, le panneau
     * passant sous le formulaire.
     */
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:gap-20">
      <div className="flex flex-col gap-8">
        <FilEtapes etape={etape} />

      {etape === 0 ? (
        <fieldset className="flex flex-col gap-5">
          <h2 ref={titreRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
            Votre logement
          </h2>
          <div className="flex flex-col gap-2">
            <span className="t-support font-medium">Type de logement</span>
            <div className="flex gap-4">
              {(["maison", "appartement"] as const).map((valeur) => (
                <label key={valeur} className="flex items-center gap-2 text-sm capitalize">
                  <input
                    type="radio"
                    name={`${idBase}-type`}
                    checked={donnees.typeLogement === valeur}
                    onChange={() => champ("typeLogement", valeur)}
                    className="accent-[color:var(--primary)]"
                  />
                  {valeur}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idBase}-ville`} className="t-support font-medium">
              Ville
            </label>
            <input
              id={`${idBase}-ville`}
              type="text"
              value={donnees.ville}
              onChange={(e) => champ("ville", e.target.value)}
              className="h-11 max-w-xs rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idBase}-orientation`} className="t-support font-medium">
              Orientation principale (facultatif)
            </label>
            <input
              id={`${idBase}-orientation`}
              type="text"
              placeholder="ex. sud, traversant est-ouest…"
              value={donnees.orientation}
              onChange={(e) => champ("orientation", e.target.value)}
              className="h-11 max-w-xs rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
        </fieldset>
      ) : null}

      {etape === 1 ? (
        <fieldset className="flex flex-col gap-4">
          <h2 ref={titreRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
            Quel produit souhaitez-vous ?
          </h2>

          {/* Les trois produits d'abord : ils restent les catégories
              principales. Les packs viennent ensuite, sous leur propre
              intitulé, avec l'économie calculée. */}
          <div className="flex flex-col gap-2">
            {gammes.map((g) => (
              <label
                key={g.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-border p-3.5"
              >
                <span className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name={`${idBase}-equipement`}
                    className="mt-1 accent-[color:var(--primary)]"
                    checked={donnees.equipement === g.id}
                    onChange={() => choisirEquipement(g.id)}
                  />
                  <span>
                    <span className="t-support font-medium">{LIBELLE_EQUIPEMENT[g.id]}</span>
                    <span className="t-caption block text-muted-foreground">
                      {g.role.toLowerCase()} · {offreParId(g.id).unite}
                    </span>
                  </span>
                </span>
                <span className="t-data t-support whitespace-nowrap">
                  {formatPrix(OFFRES[g.id].prixProduitCents)}
                </span>
              </label>
            ))}
          </div>

          <p className="t-eyebrow mt-2 text-muted-foreground">Les packs</p>
          <div className="flex flex-col gap-2">
            {PACKS_DEVIS.map((id) => {
              const pack = offreParId(id);
              const economie = getBundleSavings(id);
              return (
                <label
                  key={id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border p-3.5"
                >
                  <span className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name={`${idBase}-equipement`}
                      className="mt-1 accent-[color:var(--primary)]"
                      checked={donnees.equipement === id}
                      onChange={() => choisirEquipement(id)}
                    />
                    <span>
                      <span className="t-support font-medium">{pack.nom}</span>
                      <span className="t-caption block text-muted-foreground">
                        {pack.unite} · {formatPrix(economie)} de moins que séparément
                      </span>
                    </span>
                  </span>
                  <span className="t-data t-support whitespace-nowrap">
                    {formatPrix(pack.prixProduitCents)}
                  </span>
                </label>
              );
            })}

            <label className="flex items-start gap-2.5 rounded-lg border border-border p-3.5">
              <input
                type="radio"
                name={`${idBase}-equipement`}
                className="mt-1 accent-[color:var(--primary)]"
                checked={donnees.equipement === "plusieurs"}
                onChange={() => choisirEquipement("plusieurs")}
              />
              <span>
                <span className="t-support font-medium">Plusieurs équipements</span>
                <span className="t-caption block text-muted-foreground">
                  à définir avec un conseiller
                </span>
              </span>
            </label>
          </div>
        </fieldset>
      ) : null}

      {/* ─── Étape 2 — Installation ──────────────────────────────────────
          Elle n'existe qu'une fois le produit choisi, et c'est tout l'objet
          du nouveau modèle : le prix affiché est celui du produit, la pose
          est une décision distincte. Le total se recalcule à chaque
          changement, et une suggestion de complément suit immédiatement. */}
      {etape === 2 ? (
        <div className="flex flex-col gap-8">
          <h2 ref={titreRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
            Installation
          </h2>

          {offreRetenue ? (
            <>
              <ChoixInstallation
                id={offreRetenue}
                avecInstallation={donnees.avecInstallation ?? false}
                onChange={(v) => champ("avecInstallation", v)}
                quantite={
                  gamme?.dimensions && Number(donnees.nombreOuvrants) > 0
                    ? Number(donnees.nombreOuvrants)
                    : 1
                }
              />

              {/* Cross-sell contextuel, à sa place dans le parcours :
                  après le produit et l'installation, avant la configuration. */}
              <SuggestionsOffres id={offreRetenue} titre="Compléter votre installation" />
            </>
          ) : (
            <p className="t-support max-w-xl text-muted-foreground">
              Vous avez indiqué plusieurs équipements : le périmètre et l&apos;installation se
              définissent avec un conseiller, après la visite technique. Aucun montant n&apos;est
              calculé à ce stade.
            </p>
          )}
        </div>
      ) : null}

      {etape === 3 ? (
        <fieldset className="flex flex-col gap-5">
          <h2 ref={titreRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
            Configuration
          </h2>

          {gamme?.dimensions ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idBase}-nb`} className="t-support font-medium">
                  Nombre d&apos;ouvrants à équiper
                </label>
                <input
                  id={`${idBase}-nb`}
                  type="number"
                  min={1}
                  value={donnees.nombreOuvrants}
                  onChange={(e) => champ("nombreOuvrants", e.target.value)}
                  className="h-10 max-w-[8rem] rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="t-support font-medium">Format le plus courant chez vous</span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {gamme.dimensions.map((dimension) => (
                    <label
                      key={dimension.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`${idBase}-dimension`}
                          checked={donnees.dimensionId === dimension.id}
                          onChange={() => champ("dimensionId", dimension.id)}
                          className="accent-[color:var(--primary)]"
                        />
                        {dimension.label}
                      </span>
                      <span className="font-mono t-caption text-muted-foreground">
                        {formatDimension(dimension)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          <div className="flex flex-col gap-2">
            <span className="t-support font-medium">Ce qui est en place aujourd&apos;hui</span>
            <div className="flex flex-col gap-2">
              {(
                [
                  ["motorise", "Volets ou fenêtres déjà motorisés"],
                  ["manuel", "Volets manuels (manivelle ou sangle)"],
                  ["aucun", "Ni volet ni fenêtre motorisée"],
                ] as const
              ).map(([valeur, label]) => (
                <label key={valeur} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`${idBase}-existant`}
                    checked={donnees.existant === valeur}
                    onChange={() => champ("existant", valeur)}
                    className="accent-[color:var(--primary)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="t-support font-medium">Type d&apos;intervention souhaitée</span>
            <div className="flex flex-col gap-2">
              {(gamme?.optionsInstallation ?? []).map((option) => (
                <label
                  key={option.id}
                  className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm"
                >
                  <input
                    type="radio"
                    name={`${idBase}-installation`}
                    className="mt-0.5 accent-[color:var(--primary)]"
                    checked={donnees.installationId === option.id}
                    onChange={() => champ("installationId", option.id)}
                  />
                  <span>
                    <span className="font-medium">{option.label}</span>
                    <span className="block t-caption text-muted-foreground">{option.description}</span>
                    {option.sousReserveCompatibilite ? (
                      <span className="block t-caption text-muted-foreground italic">
                        Sous réserve de compatibilité technique.
                      </span>
                    ) : null}
                  </span>
                </label>
              ))}

              {!gamme ? (
                <label className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
                  <input
                    type="radio"
                    name={`${idBase}-installation`}
                    className="mt-0.5 accent-[color:var(--primary)]"
                    checked={donnees.installationId === "a-definir"}
                    onChange={() => champ("installationId", "a-definir")}
                  />
                  <span>
                    <span className="font-medium">À définir lors de la visite technique</span>
                    <span className="block t-caption text-muted-foreground">
                      Plusieurs équipements : l&apos;intervention se chiffre après relevé sur place.
                    </span>
                  </span>
                </label>
              ) : null}
            </div>
          </div>
        </fieldset>
      ) : null}

      {etape === 4 ? (
        <fieldset className="flex flex-col gap-4">
          <h2 ref={titreRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
            Vos coordonnées
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idBase}-nom`} className="t-support font-medium">
                Nom
              </label>
              <input
                id={`${idBase}-nom`}
                type="text"
                value={donnees.nom}
                onChange={(e) => champ("nom", e.target.value)}
                className="h-11 rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idBase}-email`} className="t-support font-medium">
                E-mail
              </label>
              <input
                id={`${idBase}-email`}
                type="email"
                value={donnees.email}
                onChange={(e) => champ("email", e.target.value)}
                className="h-11 rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idBase}-tel`} className="t-support font-medium">
              Téléphone (facultatif)
            </label>
            <input
              id={`${idBase}-tel`}
              type="tel"
              value={donnees.telephone}
              onChange={(e) => champ("telephone", e.target.value)}
              className="h-11 max-w-xs rounded-lg border border-input bg-background px-3.5 text-[0.9375rem] outline-none transition-colors hover:border-foreground/35 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
        </fieldset>
      ) : null}

      {etape === 5 ? (
        <div className="flex flex-col gap-4">
          <h2 ref={titreRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
            Récapitulatif
          </h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 rounded-lg border border-border bg-card p-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Logement</dt>
              <dd className="capitalize">
                {donnees.typeLogement} — {donnees.ville}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Orientation</dt>
              <dd>{donnees.orientation || "Non précisée"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Équipement</dt>
              <dd>{donnees.equipement ? LIBELLE_EQUIPEMENT[donnees.equipement] : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Existant</dt>
              <dd>
                {donnees.existant === "motorise"
                  ? "Déjà motorisé"
                  : donnees.existant === "manuel"
                    ? "Manuel"
                    : donnees.existant === "aucun"
                      ? "Aucun"
                      : "Non précisé"}
              </dd>
            </div>
            {gamme?.dimensions ? (
              <>
                <div>
                  <dt className="text-muted-foreground">Ouvrants</dt>
                  <dd className="font-mono">{donnees.nombreOuvrants}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Format</dt>
                  <dd>
                    {(() => {
                      const d = gamme.dimensions?.find((x) => x.id === donnees.dimensionId);
                      return d ? `${d.label} — ${formatDimension(d)}` : "—";
                    })()}
                  </dd>
                </div>
              </>
            ) : null}
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Intervention</dt>
              <dd>
                {gamme?.optionsInstallation.find((o) => o.id === donnees.installationId)?.label ??
                  "À définir lors de la visite technique"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Contact</dt>
              <dd>
                {donnees.nom} — {donnees.email}
              </dd>
            </div>
          </dl>

          {/* ─── Votre configuration ──────────────────────────────────
              Le seul endroit du parcours où un total apparaît. Produit,
              installation et total sont TOUS dérivés de `lib/offres.ts` :
              aucun montant n'est calculé ni écrit ici. */}
          {offreRetenue ? (
            <div className="border-t border-border pt-5">
              <p className="t-eyebrow text-muted-foreground">Votre configuration</p>
              {(() => {
                const q =
                  gamme?.dimensions && Number(donnees.nombreOuvrants) > 0
                    ? Number(donnees.nombreOuvrants)
                    : 1;
                const avec = donnees.avecInstallation === true;
                const offre = offreParId(offreRetenue);
                return (
                  <dl className="mt-4">
                    <div className="flex items-baseline justify-between gap-4 border-t border-border py-2.5">
                      <dt className="t-support text-muted-foreground">
                        {offre.nom}
                        {q > 1 ? ` × ${q}` : ""}
                      </dt>
                      <dd className="t-data t-support">
                        {formatPrix(offre.prixProduitCents * q)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t border-border py-2.5">
                      <dt className="t-support text-muted-foreground">
                        {avec ? "Installation Ombrair" : "Sans installation Ombrair"}
                      </dt>
                      <dd className="t-data t-support">
                        {avec ? `+${formatPrix(getPrixInstallation(offreRetenue) * q)}` : "+0 €"}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t-2 border-foreground py-3">
                      <dt className="t-support font-medium">Total</dt>
                      <dd className="t-data text-xl">
                        {formatPrix(
                          getTotalConfigure(offreRetenue, {
                            avecInstallation: avec,
                            quantite: q,
                          })
                        )}
                      </dd>
                    </div>
                  </dl>
                );
              })()}
            </div>
          ) : null}

          {/*
            OMBRAIR PIONNIERS — affiché UNIQUEMENT quand le nombre de
            capteurs découle sans ambiguïté du choix fait dans le parcours.

            C'est le cas du Capteur — un produit, un capteur — et des deux
            packs, qui en contiennent un chacun. Un volet ou une fenêtre seuls
            n'embarquent aucun capteur, et « plusieurs équipements » n'a pas
            de composition arrêtée à ce stade : le bloc reste alors absent
            plutôt que d'annoncer un compte inventé.

            Le programme ne touche ni au prix, ni au parcours, ni au
            récapitulatif : il ajoute une ligne d'information, et rien
            d'autre. Aucun montant en euros n'apparaît ici.
          */}
          {(() => {
            if (!offreRetenue) return null;
            const capteurs =
              offreParId(offreRetenue).type === "pack"
                ? capteursDuPack(offreParId(offreRetenue).produitsInclus)
                : (CAPTEURS_PAR_GAMME[offreRetenue as keyof typeof CAPTEURS_PAR_GAMME]?.base ?? 0);
            if (capteurs <= 0) return null;
            return (
              <div className="border-t border-border pt-5">
                <p className="t-eyebrow text-muted-foreground">Ombrair Pionniers</p>
                <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-2">
                  <div className="flex items-baseline gap-2">
                    <dt className="t-caption text-muted-foreground">Capteurs éligibles</dt>
                    <dd className="t-data t-support">{capteurs}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="t-caption text-muted-foreground">Crédits Pionniers</dt>
                    <dd className="t-data t-support">{getCreditsPionniers(capteurs)}</dd>
                  </div>
                </dl>
                <Link
                  href="/pionniers"
                  className="t-caption mt-3 inline-block text-foreground underline underline-offset-4"
                >
                  En savoir plus sur le programme
                </Link>
              </div>
            );
          })()}

          {/* Aucun total n'est calculé : le projet ne définit aucune règle de
              prix au format ni à la pose. Annoncer un montant ici serait une
              fausse précision. */}
          <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            Ce total reprend les tarifs publiés du produit et de l&apos;installation Ombrair. Il ne
            vaut pas devis : l&apos;accessibilité, l&apos;état du support et les contraintes de pose se
            vérifient lors de la visite technique.
          </p>

          <p className="t-caption text-muted-foreground">
            Démonstration — aucune donnée n&apos;est réellement transmise ni conservée.
          </p>
        </div>
      ) : null}

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setEtape((e) => Math.max(0, e - 1))}
          disabled={etape === 0}
          className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-[0.9375rem] font-medium transition-colors hover:bg-surface-panneau disabled:pointer-events-none disabled:opacity-40"
        >
          Précédent
        </button>
        {etape < etapes.length - 1 ? (
          <button
            type="button"
            onClick={() => setEtape((e) => Math.min(etapes.length - 1, e + 1))}
            disabled={!etapeValide(etape, donnees)}
            className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary/85 disabled:pointer-events-none disabled:opacity-40"
          >
            Suivant
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEnvoye(true)}
            className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Envoyer la demande
          </button>
        )}
      </div>

        <Link href="/gammes" className="t-caption text-muted-foreground underline underline-offset-4">
          Comparer d&apos;abord les produits →
        </Link>
      </div>

      <PanneauDemande donnees={donnees} gamme={gamme} />
    </div>
  );
}
