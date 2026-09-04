"use client";

import { cn } from "@/lib/utils";
import { Curseur } from "./shared/curseur";
import { Situations } from "./shared/situations";
import { BORNES, type Conditions } from "@/lib/volet-simulation";
import { PRESETS, type PresetVolet } from "@/lib/volet-presets";

/**
 * Réglages de la démonstration Volet : trois curseurs et une série de
 * situations.
 *
 * Le curseur lui-même vit désormais dans `shared/curseur.tsx` : la démo
 * Fenêtre utilise le même, ce qui garantit que les deux pages produit se
 * manipulent à l'identique.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * Les trois réglages
 * ───────────────────────────────────────────────────────────────────────── */

export function VoletControls({
  conditions,
  onChange,
  className,
}: {
  conditions: Conditions;
  onChange: (c: Conditions) => void;
  className?: string;
}) {
  return (
    /* Une rangée, comme sur la démo Fenêtre : les deux pages produit doivent
       se manipuler à l'identique, et une colonne de curseurs laissait une
       zone morte à côté de la scène. */
    <fieldset className={cn("flex flex-col", className)}>
      <legend className="t-eyebrow text-muted-foreground">Conditions extérieures</legend>

      <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
        <Curseur
          label="Température"
          aide="En dessous de 18 °C, la chaleur ne justifie aucune fermeture."
          valeur={conditions.temperature}
          min={BORNES.temperature.min}
          max={BORNES.temperature.max}
          pas={BORNES.temperature.pas}
          unite={BORNES.temperature.unite}
          onChange={(temperature) => onChange({ ...conditions, temperature })}
        />

        <Curseur
          label="Luminosité"
          aide="L'ensoleillement direct sur la façade."
          valeur={conditions.luminosite}
          min={BORNES.luminosite.min}
          max={BORNES.luminosite.max}
          pas={BORNES.luminosite.pas}
          unite={BORNES.luminosite.unite}
          onChange={(luminosite) => onChange({ ...conditions, luminosite })}
        />

        <Curseur
          label="Humidité"
          aide="Au-delà de 45 %, les lames gardent une ouverture pour ventiler."
          valeur={conditions.humidite}
          min={BORNES.humidite.min}
          max={BORNES.humidite.max}
          pas={BORNES.humidite.pas}
          unite={BORNES.humidite.unite}
          onChange={(humidite) => onChange({ ...conditions, humidite })}
        />
      </div>
    </fieldset>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Les situations types
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Les cinq situations du volet. La rangée elle-même est partagée avec la
 * démo Fenêtre — seule la liste change.
 */
export function VoletPresets({
  actif,
  onChoisir,
  className,
}: {
  actif: string | null;
  onChoisir: (preset: PresetVolet) => void;
  className?: string;
}) {
  return (
    <Situations situations={PRESETS} actif={actif} onChoisir={onChoisir} className={className} />
  );
}
