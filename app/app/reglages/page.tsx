import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { membresFoyer, profilLogement } from "@/lib/mock/logement";
import { MENTION_DEMO } from "@/lib/mock/scenario";

export const metadata: Metadata = { title: "Réglages" };

const LIBELLE_ROLE = {
  administrateur: "Administratrice",
  adulte: "Adulte",
  "acces-limite": "Accès limité",
} as const;

const AUTRES_REGLAGES = [
  {
    titre: "Calibration des capteurs",
    detail: "Corriger un décalage constaté entre un capteur et un thermomètre de référence.",
  },
  {
    titre: "Mise à jour du firmware",
    detail: "Ombrair Link à jour (version 2.4.1). Les modules se mettent à jour automatiquement la nuit.",
  },
  {
    titre: "Données et confidentialité",
    detail: "Exporter ou supprimer les données du foyer, revoir la durée de conservation (90 jours).",
  },
];

export default function ReglagesPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <h1 className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight">Réglages</h1>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold">Profil du logement</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-border bg-surface-panneau p-4 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Type</dt>
            <dd>{profilLogement.type}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Construction</dt>
            <dd className="font-mono">{profilLogement.anneeConstruction}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Surface</dt>
            <dd className="font-mono">{profilLogement.surfaceM2} m²</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Surface vitrée</dt>
            <dd className="font-mono">{profilLogement.surfaceVitreeM2} m²</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Orientation principale</dt>
            <dd>{profilLogement.orientationPrincipale}</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold">Membres du foyer</h2>
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface-panneau">
          {membresFoyer.map((membre) => (
            <li key={membre.id} className="flex flex-col gap-1 px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium">{membre.prenom}</span>
                <span className="text-xs text-muted-foreground">{LIBELLE_ROLE[membre.role]}</span>
              </div>
              <p className="text-xs text-muted-foreground">{membre.droits}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold">Matériel</h2>
        <Link
          href="/app/reglages/appairage"
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-panneau px-4 py-3 transition-colors hover:bg-muted"
        >
          <span>
            <span className="block text-sm font-medium">Appairer un nouveau capteur</span>
            <span className="block text-xs text-muted-foreground">Ajouter un capteur ou un module de pilotage.</span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>

        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface-panneau">
          {AUTRES_REGLAGES.map((reglage) => (
            <li key={reglage.titre} className="flex flex-col gap-0.5 px-4 py-3">
              <span className="text-sm font-medium">{reglage.titre}</span>
              <span className="text-xs text-muted-foreground">{reglage.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2 rounded-lg border border-border bg-surface-panneau p-4">
        <h2 className="font-display text-base font-bold">À propos</h2>
        <p className="text-xs text-muted-foreground">
          Ombrair — démonstration d&apos;application. {MENTION_DEMO}
        </p>
        <p className="text-xs text-muted-foreground">
          Projet étudiant fictif — aucune vente réelle. Université Toulouse Jean Jaurès, 2026.
        </p>
        <Link href="/confidentialite" className="w-fit text-xs font-medium underline underline-offset-4">
          Politique de confidentialité →
        </Link>
      </section>
    </main>
  );
}
