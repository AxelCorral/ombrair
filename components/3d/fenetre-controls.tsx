"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { Curseur } from "./shared/curseur";
import { Situations } from "./shared/situations";
import { BORNES_FENETRE, type EnvironnementFenetre } from "@/lib/fenetre-simulation";
import { PRESETS_FENETRE, type PresetFenetre } from "@/lib/fenetre-presets";
import { INCLINAISON_MAX } from "@/lib/demo/shutter";

/**
 * Réglages de la démonstration Fenêtre.
 *
 * Quatre conditions au lieu de trois, parce qu'une fenêtre arbitre un
 * ÉCHANGE et pas seulement une exposition : il faut connaître les deux
 * températures pour savoir si ouvrir améliore ou dégrade la pièce.
 *
 * Les deux températures sont volontairement adjacentes et libellées
 * « intérieure » / « extérieure » plutôt que « pièce » / « façade » : c'est
 * leur COMPARAISON qui commande, et deux libellés symétriques la rendent
 * lisible d'un coup d'œil.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Les quatre conditions
 * ───────────────────────────────────────────────────────────────────────── */

export function FenetreControls({
  environnement,
  onChange,
  className,
}: {
  environnement: EnvironnementFenetre;
  onChange: (e: EnvironnementFenetre) => void;
  className?: string;
}) {
  const b = BORNES_FENETRE;

  return (
    /*
     * Les quatre curseurs sont sur UNE RANGÉE dès qu'il y a la place. Empilés
     * dans une colonne étroite, ils repoussaient la moitié de la section sous
     * la ligne de flottaison et laissaient une zone morte à côté de la scène.
     *
     * Les deux températures tombent côte à côte à toutes les largeurs (deux
     * colonnes dès `sm`, quatre à `xl`) : c'est leur COMPARAISON qui commande
     * l'ouverture, et les lire l'une sous l'autre la rend moins évidente.
     */
    <fieldset className={cn("flex flex-col", className)}>
      <legend className="t-eyebrow text-muted-foreground">Conditions</legend>

      <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 xl:grid-cols-4">
        <Curseur
          label="Température intérieure"
          aide="Au-delà de 22 °C, la pièce commence à demander du frais."
          valeur={environnement.temperatureInterieure}
          min={b.temperatureInterieure.min}
          max={b.temperatureInterieure.max}
          pas={b.temperatureInterieure.pas}
          unite={b.temperatureInterieure.unite}
          onChange={(temperatureInterieure) => onChange({ ...environnement, temperatureInterieure })}
        />

        <Curseur
          label="Température extérieure"
          aide="C'est l'écart avec l'intérieur qui décide, pas la valeur seule."
          valeur={environnement.temperatureExterieure}
          min={b.temperatureExterieure.min}
          max={b.temperatureExterieure.max}
          pas={b.temperatureExterieure.pas}
          unite={b.temperatureExterieure.unite}
          onChange={(temperatureExterieure) => onChange({ ...environnement, temperatureExterieure })}
        />

        <Curseur
          label="Luminosité"
          aide="Elle n'ouvre jamais la fenêtre : elle commande l'ombre."
          valeur={environnement.luminosite}
          min={b.luminosite.min}
          max={b.luminosite.max}
          pas={b.luminosite.pas}
          unite={b.luminosite.unite}
          onChange={(luminosite) => onChange({ ...environnement, luminosite })}
        />

        <Curseur
          label="Humidité intérieure"
          aide="Au-delà de 60 %, la fenêtre s'entrouvre pour renouveler l'air."
          valeur={environnement.humidite}
          min={b.humidite.min}
          max={b.humidite.max}
          pas={b.humidite.pas}
          unite={b.humidite.unite}
          onChange={(humidite) => onChange({ ...environnement, humidite })}
        />
      </div>
    </fieldset>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Les situations types
 * ───────────────────────────────────────────────────────────────────────── */

export function FenetrePresets({
  actif,
  onChoisir,
  className,
}: {
  actif: string | null;
  onChoisir: (preset: PresetFenetre) => void;
  className?: string;
}) {
  return (
    <Situations
      situations={PRESETS_FENETRE}
      actif={actif}
      onChoisir={onChoisir}
      className={className}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * L'option volet
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * « Afficher le volet dans la simulation ».
 *
 * LE LIBELLÉ EST UNE DÉCISION, PAS UNE FORMULATION. « Ajouter le volet » se
 * lirait comme une option de configurateur, et laisserait croire qu'un volet
 * peut être commandé avec la fenêtre. Ce n'est pas le cas : le volet est un
 * produit distinct, à son propre tarif, sur sa propre page. Ce que ce switch
 * change, c'est le CONTENU DE LA SIMULATION, et rien d'autre.
 *
 * La ligne d'aide le redit en clair, à l'endroit exact où le doute pourrait
 * naître.
 *
 * ACCESSIBILITÉ. Une vraie `<input type="checkbox">`, visuellement remplacée
 * mais pas réimplémentée : le rôle, l'état coché, le clavier et l'annonce
 * viennent du contrôle natif.
 */
export function OptionVolet({
  actif,
  onChange,
  className,
}: {
  actif: boolean;
  onChange: (actif: boolean) => void;
  className?: string;
}) {
  const id = useId();

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-start gap-4">
        <label
          htmlFor={id}
          className="t-support flex-1 cursor-pointer font-medium"
        >
          Afficher le volet dans la simulation
        </label>

        <span className="relative inline-flex shrink-0 items-center">
          <input
            id={id}
            type="checkbox"
            checked={actif}
            onChange={(e) => onChange(e.target.checked)}
            className="peer size-full absolute inset-0 cursor-pointer opacity-0"
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none flex h-6 w-11 items-center rounded-lg border p-0.5 transition-colors",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
              actif ? "border-foreground bg-primary" : "border-border bg-surface-sourde"
            )}
          >
            <span
              className={cn(
                "block h-full w-[1.125rem] rounded-[3px] transition-transform duration-200 motion-reduce:transition-none",
                actif
                  ? "translate-x-[1.375rem] bg-primary-foreground"
                  : "translate-x-0 bg-foreground/45"
              )}
            />
          </span>
        </span>
      </div>

      <p className="t-caption mt-2 max-w-sm text-muted-foreground">
        Le volet Ombrair est un produit distinct, vendu séparément. Il est ici monté dans la
        même baie pour montrer comment les deux équipements se répartissent l&apos;ombre et
        l&apos;air.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Mode automatique / manuel
 * ───────────────────────────────────────────────────────────────────────── */

export type ModePilotage = "auto" | "manuel";

/**
 * Le sélecteur de mode.
 *
 * AUTO est le mode par défaut et le sujet de la page : Ombrair vend un
 * arbitrage, pas une télécommande. MANUEL existe pour qu'on puisse vérifier
 * l'amplitude réelle de la mécanique — jusqu'où va l'ouvrant, jusqu'où
 * descend le tablier — ce que les conditions ne montrent jamais toutes à la
 * fois.
 *
 * Deux boutons `aria-pressed` plutôt qu'un `radiogroup` : il n'y a que deux
 * états, ils sont visibles simultanément, et le libellé de chacun dit son
 * état, pas sa destination.
 */
export function SelecteurMode({
  mode,
  onChange,
  className,
}: {
  mode: ModePilotage;
  onChange: (mode: ModePilotage) => void;
  className?: string;
}) {
  const modes: [ModePilotage, string, string][] = [
    ["auto", "Automatique", "Les conditions commandent la fenêtre et le volet."],
    ["manuel", "Manuel", "Vous commandez directement les mécanismes."],
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="t-eyebrow text-muted-foreground">Pilotage</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {modes.map(([valeur, libelle, aide]) => (
          <button
            key={valeur}
            type="button"
            onClick={() => onChange(valeur)}
            aria-pressed={mode === valeur}
            title={aide}
            className={cn(
              "inline-flex h-9 items-center rounded-lg border px-3.5 text-[0.8125rem] font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              mode === valeur
                ? "border-foreground bg-surface-panneau"
                : "border-border hover:border-foreground/40"
            )}
          >
            {libelle}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Commandes manuelles
 * ───────────────────────────────────────────────────────────────────────── */

export interface CommandesManuelles {
  /** Ouverture de l'ouvrant, 0–100 %. */
  ouverture: number;
  /** Levée du tablier, 0–100 %. */
  levee: number;
  /** Orientation des lames, 0–90°. */
  inclinaison: number;
}

/**
 * Les curseurs du mode manuel.
 *
 * Les deux réglages de volet n'apparaissent que si le volet est monté : des
 * commandes sans organe à commander seraient trompeuses.
 */
export function ControlesManuels({
  commandes,
  onChange,
  avecVolet,
  className,
}: {
  commandes: CommandesManuelles;
  onChange: (c: CommandesManuelles) => void;
  avecVolet: boolean;
  className?: string;
}) {
  return (
    <fieldset className={cn("flex flex-col", className)}>
      <legend className="t-eyebrow text-muted-foreground">Commande directe</legend>

      {/* Même rangée que les conditions, pour que le passage d'un mode à
          l'autre ne redessine pas la moitié de la section. */}
      <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 xl:grid-cols-4">
        <Curseur
          label="Ouverture de la fenêtre"
          aide="De la fenêtre fermée à son ouverture maximale."
          valeur={commandes.ouverture}
          min={0}
          max={100}
          pas={1}
          unite="%"
          onChange={(ouverture) => onChange({ ...commandes, ouverture })}
        />

        {avecVolet ? (
          <>
            <Curseur
              label="Ouverture du volet"
              aide="Hauteur du tablier : 0 % descendu, 100 % enroulé dans le coffre."
              valeur={commandes.levee}
              min={0}
              max={100}
              pas={1}
              unite="%"
              onChange={(levee) => onChange({ ...commandes, levee })}
            />

            <Curseur
              label="Orientation des lames"
              aide="0° lames jointives, 90° lames à plat."
              valeur={commandes.inclinaison}
              min={0}
              max={INCLINAISON_MAX}
              pas={1}
              unite="°"
              onChange={(inclinaison) => onChange({ ...commandes, inclinaison })}
            />
          </>
        ) : null}
      </div>
    </fieldset>
  );
}
