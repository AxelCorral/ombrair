"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Hypotheses } from "@/components/shared/hypotheses";
import { evenementsDuJour } from "@/lib/mock/evenements";
import { serie24h, serie30j, serie7j, surchauffeEvitee } from "@/lib/mock/releves";

type Periode = "24h" | "7j" | "30j";

const PERIODES: { id: Periode; label: string }[] = [
  { id: "24h", label: "24 h" },
  { id: "7j", label: "7 jours" },
  { id: "30j", label: "30 jours" },
];

/** Actions du jour repérables sur la courbe 24 h (heure alignée sur les points de la série). */
const REPERES_24H = evenementsDuJour
  .filter((ev) => ev.type !== "incident" && !ev.veille)
  .map((ev) => ({
    heure: `${ev.heure.slice(0, 2)}h`,
    libelle: ev.libelle,
    type: ev.type,
  }))
  .filter((repere) => serie24h.some((point) => point.heure === repere.heure));

function formate(valeur: number) {
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function HistoriquePage() {
  const [periode, setPeriode] = useState<Periode>("24h");

  const donnees = useMemo(() => {
    if (periode === "24h") return serie24h.map((p) => ({ x: p.heure, ext: p.ext, int: p.int }));
    const serie = periode === "7j" ? serie7j : serie30j;
    return serie.map((p) => ({ x: p.jour, ext: p.ext, int: p.int }));
  }, [periode]);

  const extremes = useMemo(() => {
    const exts = donnees.map((d) => d.ext);
    const ints = donnees.map((d) => d.int);
    return {
      extMax: Math.max(...exts),
      extMin: Math.min(...exts),
      intMax: Math.max(...ints),
      intMin: Math.min(...ints),
    };
  }, [donnees]);

  function exporterCsv() {
    const entete = periode === "24h" ? "heure" : "jour";
    const lignes = [
      `${entete};exterieur_c;interieur_c`,
      ...donnees.map((d) => `${d.x};${d.ext.toString().replace(".", ",")};${d.int.toString().replace(".", ",")}`),
    ];
    const blob = new Blob([lignes.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = `ombrair-historique-${periode}-demo.csv`;
    lien.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <div>
        <h1 className="font-display text-[1.375rem] leading-tight font-semibold tracking-tight">Historique</h1>
        <p className="text-xs text-muted-foreground">Températures intérieure et extérieure relevées (simulées).</p>
      </div>

      <div className="flex rounded-lg border border-border p-0.5" role="group" aria-label="Période affichée">
        {PERIODES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriode(p.id)}
            aria-pressed={periode === p.id}
            className={`flex-1 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors ${
              periode === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <div className="h-64 w-full" role="img" aria-label={`Courbes des températures sur ${periode}. Résumé chiffré disponible juste en dessous.`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={donnees} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="x"
                tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={16}
              />
              <YAxis
                tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(v: number) => `${Math.round(v)}°`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="ext" name="extérieur" stroke="var(--color-ambre)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="int" name="intérieur" stroke="var(--color-fraiche)" strokeWidth={2} dot={false} />
              {periode === "24h"
                ? REPERES_24H.map((repere) => {
                    const point = serie24h.find((p) => p.heure === repere.heure);
                    if (!point) return null;
                    return (
                      <ReferenceDot
                        key={repere.libelle}
                        x={repere.heure}
                        y={point.int}
                        r={4}
                        fill={
                          repere.type === "ouverture" ? "var(--color-fraiche)" : "var(--color-ambre)"
                        }
                        stroke="var(--color-card)"
                        strokeWidth={2}
                      />
                    );
                  })
                : null}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full bg-ambre" /> extérieur
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full bg-fraiche" /> intérieur
          </span>
          {periode === "24h" ? <span>● actions du système</span> : null}
        </div>

        {/* Restitution accessible : le SVG seul ne suffit pas à un lecteur d'écran. */}
        <p className="text-xs text-muted-foreground">
          Sur cette période, l&apos;extérieur va de {formate(extremes.extMin)}&nbsp;°C à{" "}
          {formate(extremes.extMax)}&nbsp;°C, l&apos;intérieur de {formate(extremes.intMin)}&nbsp;°C à{" "}
          {formate(extremes.intMax)}&nbsp;°C, soit un écart maximal de{" "}
          {formate(extremes.extMax - extremes.intMax)}&nbsp;°C entre les deux maximums.
        </p>
      </section>

      {periode === "24h" ? (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-base font-bold">Actions du système aujourd&apos;hui</h2>
          <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface-panneau">
            {evenementsDuJour
              .filter((ev) => !ev.veille)
              .map((ev) => (
                <li key={ev.id} className="flex flex-col gap-0.5 px-4 py-3">
                  <span className="font-mono text-xs text-muted-foreground">{ev.heure}</span>
                  <span className="text-sm">{ev.libelle}</span>
                  <span className="text-xs text-muted-foreground">
                    {ev.raison}
                    {ev.parQui ? ` (${ev.parQui})` : ""}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface-panneau p-4">
        <h2 className="font-display text-base font-bold">Surchauffe évitée (estimation)</h2>
        <div className="flex gap-6">
          <div>
            <p className="font-mono text-2xl font-medium">{surchauffeEvitee.degresHeuresEvitesJour}&nbsp;°C·h</p>
            <p className="text-xs text-muted-foreground">aujourd&apos;hui</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium">{surchauffeEvitee.degresHeuresEvites7j}&nbsp;°C·h</p>
            <p className="text-xs text-muted-foreground">sur 7 jours</p>
          </div>
        </div>
        <Hypotheses titre="Méthode de calcul" points={surchauffeEvitee.methode} />
      </section>

      <button
        type="button"
        onClick={exporterCsv}
        className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        <Download className="size-4" aria-hidden="true" />
        Exporter la période en CSV
      </button>
    </main>
  );
}
