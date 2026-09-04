"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, TriangleAlert, WifiOff } from "lucide-react";
import { notifications, type CategorieNotification } from "@/lib/mock/evenements";

const ICONE: Record<CategorieNotification, typeof Bell> = {
  alerte: TriangleAlert,
  materiel: WifiOff,
  action: Bell,
};

const LIBELLE_CATEGORIE: Record<CategorieNotification, string> = {
  alerte: "Alerte",
  materiel: "Matériel",
  action: "Action",
};

export default function NotificationsPage() {
  const [lues, setLues] = useState<Record<string, boolean>>(
    Object.fromEntries(notifications.map((n) => [n.id, n.lue]))
  );

  const nonLues = notifications.filter((n) => !lues[n.id]).length;

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <div className="flex flex-col gap-2">
        <Link href="/app" className="flex w-fit items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Accueil
        </Link>
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight">Notifications</h1>
          {nonLues > 0 ? (
            <button
              type="button"
              onClick={() => setLues(Object.fromEntries(notifications.map((n) => [n.id, true])))}
              className="text-xs font-medium underline underline-offset-4"
            >
              Tout marquer comme lu
            </button>
          ) : null}
        </div>
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {nonLues === 0 ? "Aucune notification non lue." : `${nonLues} non lue${nonLues > 1 ? "s" : ""}.`}
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {notifications.map((notif) => {
          const Icone = ICONE[notif.categorie];
          const estLue = lues[notif.id];
          return (
            <li
              key={notif.id}
              className={`flex gap-3 rounded-lg border p-4 ${
                estLue ? "border-border bg-surface-panneau" : "border-foreground/25 bg-surface-panneau"
              }`}
            >
              <Icone
                className={`mt-0.5 size-4 shrink-0 ${
                  notif.categorie === "alerte"
                    ? "text-[color:var(--color-alerte-texte)]"
                    : "text-muted-foreground"
                }`}
                aria-hidden="true"
              />
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-medium">
                    {notif.titre}
                    {!estLue ? <span className="sr-only"> — non lue</span> : null}
                  </h2>
                  <span className="font-mono text-xs text-muted-foreground">{notif.heure}</span>
                </div>
                <p className="text-xs text-muted-foreground">{notif.detail}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="rounded-[var(--radius-sm)] bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    {LIBELLE_CATEGORIE[notif.categorie]}
                  </span>
                  {!estLue ? (
                    <button
                      type="button"
                      onClick={() => setLues((p) => ({ ...p, [notif.id]: true }))}
                      className="text-xs underline underline-offset-4"
                    >
                      Marquer comme lu
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
