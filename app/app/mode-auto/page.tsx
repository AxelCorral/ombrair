"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEtatDemo } from "@/components/app-demo/etat-provider";
import { reglagesAuto } from "@/lib/mock/programmes";

export default function ModeAutoPage() {
  const { pieces } = useEtatDemo();
  const [seuil, setSeuil] = useState(reglagesAuto.seuilEcartOuvertureC);
  const [priorite, setPriorite] = useState(reglagesAuto.priorite);
  const [debut, setDebut] = useState(reglagesAuto.plageRafraichissementNocturne.debut);
  const [fin, setFin] = useState(reglagesAuto.plageRafraichissementNocturne.fin);
  const idBase = useId();

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <div className="flex flex-col gap-2">
        <Link href="/app" className="flex w-fit items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Accueil
        </Link>
        <h1 className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight">Mode auto</h1>
        <p className="text-xs text-muted-foreground">
          Les préférences qui pilotent l&apos;algorithme. Une commande manuelle reste toujours prioritaire.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold">Température cible par pièce</h2>
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface-panneau">
          {pieces.map((piece) => (
            <li key={piece.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{piece.nom}</span>
              <span className="font-mono">{piece.cibleC}&nbsp;°C</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface-panneau p-4">
        <h2 className="font-display text-base font-bold">Rafraîchissement nocturne</h2>
        <p className="text-xs text-muted-foreground">
          Plage pendant laquelle Ombrair peut ouvrir pour faire entrer l&apos;air frais.
        </p>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idBase}-debut`} className="text-xs">
              Début
            </label>
            <input
              id={`${idBase}-debut`}
              type="time"
              value={debut}
              onChange={(e) => setDebut(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idBase}-fin`} className="text-xs">
              Fin
            </label>
            <input
              id={`${idBase}-fin`}
              type="time"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface-panneau p-4">
        <label htmlFor={`${idBase}-seuil`} className="flex justify-between text-sm font-medium">
          <span>Écart int/ext déclenchant l&apos;ouverture</span>
          <span className="font-mono">{seuil.toLocaleString("fr-FR")}&nbsp;°C</span>
        </label>
        <input
          id={`${idBase}-seuil`}
          type="range"
          min={0.5}
          max={4}
          step={0.5}
          value={seuil}
          onChange={(e) => setSeuil(Number(e.target.value))}
          aria-valuetext={`${seuil} degrés d'écart`}
          className="h-2 w-full cursor-pointer accent-[color:var(--primary)]"
        />
        <p className="text-xs text-muted-foreground">
          Ombrair n&apos;ouvre que si l&apos;extérieur est au moins {seuil.toLocaleString("fr-FR")}&nbsp;°C sous
          l&apos;intérieur. Un seuil bas ouvre plus souvent, au risque de mouvements inutiles.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface-panneau p-4">
        <h2 className="font-display text-base font-bold">Priorité</h2>
        <div className="flex rounded-lg border border-border p-0.5" role="group" aria-label="Priorité du mode auto">
          {(["confort", "economie"] as const).map((valeur) => (
            <button
              key={valeur}
              type="button"
              onClick={() => setPriorite(valeur)}
              aria-pressed={priorite === valeur}
              className={`flex-1 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors ${
                priorite === valeur ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {valeur === "confort" ? "Confort" : "Économie"}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {priorite === "confort"
            ? "Ombrair privilégie la température ressentie, quitte à manœuvrer plus souvent."
            : "Ombrair limite les manœuvres et la consommation des moteurs, au prix d'un peu moins de réactivité."}
        </p>
      </section>

      <section className="flex flex-col gap-2 rounded-lg border border-border bg-surface-panneau p-4">
        <h2 className="font-display text-base font-bold">Tolérance à la luminosité</h2>
        <p className="text-xs text-muted-foreground">{reglagesAuto.toleranceLuminosite}</p>
      </section>

      <p className="text-xs text-muted-foreground">
        Démonstration : les réglages modifiés ici ne sont pas conservés d&apos;une visite à l&apos;autre.
      </p>
    </main>
  );
}
