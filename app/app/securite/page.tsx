"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { journalAcces, reglagesSecurite } from "@/lib/mock/programmes";

const OPTIONS = [
  {
    cle: "verrouillageOuvrants",
    titre: "Verrouillage des ouvrants",
    detail: "Empêche toute manœuvre depuis l'extérieur du foyer, y compris par le mode auto.",
  },
  {
    cle: "simulationPresence",
    titre: "Simulation de présence",
    detail: "Pendant une absence, ouvre et ferme le séjour à des horaires variables en soirée.",
  },
  {
    cle: "detectionOuvertureForcee",
    titre: "Détection d'ouverture forcée",
    detail: "Alerte immédiate si un volet verrouillé est déplacé mécaniquement.",
  },
  {
    cle: "fermetureSurAlerteVent",
    titre: "Fermeture sur alerte vent",
    detail: `Ferme les ouvrants exposés au-delà de ${reglagesSecurite.seuilVentKmh} km/h, avant que le vent ne les endommage.`,
  },
  {
    cle: "fermetureSurAlertePluie",
    titre: "Fermeture sur alerte pluie",
    detail: "Ferme les fenêtres restées ouvertes dès les premières gouttes détectées.",
  },
  {
    cle: "codePinReglagesSensibles",
    titre: "Code PIN pour les réglages sensibles",
    detail: "Demande un code à quatre chiffres avant de modifier la sécurité ou les membres du foyer.",
  },
] as const;

export default function SecuritePage() {
  const [etats, setEtats] = useState<Record<string, boolean>>({
    verrouillageOuvrants: reglagesSecurite.verrouillageOuvrants,
    simulationPresence: reglagesSecurite.simulationPresence,
    detectionOuvertureForcee: reglagesSecurite.detectionOuvertureForcee,
    fermetureSurAlerteVent: reglagesSecurite.fermetureSurAlerteVent,
    fermetureSurAlertePluie: reglagesSecurite.fermetureSurAlertePluie,
    codePinReglagesSensibles: reglagesSecurite.codePinReglagesSensibles,
  });

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <div className="flex flex-col gap-2">
        <Link href="/app/programmes" className="flex w-fit items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Programmes
        </Link>
        <h1 className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight">Sécurité</h1>
      </div>

      <p className="flex gap-3 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>
          Les règles de sécurité passent avant la logique thermique : un ouvrant verrouillé ou fermé sur alerte vent
          ne sera pas rouvert par le mode auto, même si l&apos;air extérieur devient plus frais.
        </span>
      </p>

      <section className="flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <div key={option.cle} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-panneau p-4">
            <div>
              <h2 className="text-sm font-medium">{option.titre}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{option.detail}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={etats[option.cle]}
              aria-label={option.titre}
              onClick={() => setEtats((p) => ({ ...p, [option.cle]: !p[option.cle] }))}
              className={`shrink-0 rounded-[var(--radius-sm)] border px-2.5 py-1 text-xs font-medium transition-colors ${
                etats[option.cle]
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {etats[option.cle] ? "Activé" : "Désactivé"}
            </button>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold">Journal des accès</h2>
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface-panneau">
          {journalAcces.map((entree) => (
            <li key={entree.horodatage + entree.action} className="flex flex-col gap-0.5 px-4 py-3">
              <span className="font-mono text-xs text-muted-foreground">{entree.horodatage}</span>
              <span className="text-sm">{entree.action}</span>
              <span className="text-xs text-muted-foreground">par {entree.qui}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
