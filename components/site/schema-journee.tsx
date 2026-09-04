"use client";

import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { serie24h } from "@/lib/mock/releves";

/**
 * Journée type simulée (canicule, Toulouse) pour illustrer la logique de
 * décision — pas un relevé réel. La série vient de `lib/mock` : c'est la
 * même que celle de l'historique de la démo `/app`, pour que le site et
 * l'application ne racontent pas deux journées différentes.
 */
const donnees = serie24h;

export function SchemaJournee() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={donnees} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="degradeExt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-ambre)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-ambre)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="degradeInt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-fraiche)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-fraiche)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="heure"
              tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "var(--color-muted-foreground)" }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(valeur: number) => `${Math.round(valeur)}°`}
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
            <Area type="monotone" dataKey="ext" name="extérieur" stroke="var(--color-ambre)" fill="url(#degradeExt)" strokeWidth={2} />
            <Area type="monotone" dataKey="int" name="intérieur" stroke="var(--color-fraiche)" fill="url(#degradeInt)" strokeWidth={2} />
            <ReferenceDot x="08h" y={23.6} r={5} fill="var(--color-ambre)" stroke="var(--color-card)" strokeWidth={2} />
            <ReferenceDot x="22h" y={26.0} r={5} fill="var(--color-fraiche)" stroke="var(--color-card)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 t-caption text-muted-foreground">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-ambre" /> extérieur
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-fraiche" /> intérieur
        </span>
        <span>● fermeture ~8h (l&apos;extérieur dépasse l&apos;intérieur)</span>
        <span>● ouverture ~22h (l&apos;extérieur redevient plus frais)</span>
      </div>
      <p className="t-caption text-muted-foreground/80 italic">
        Journée type simulée (scénario canicule, Toulouse) — à titre d&apos;illustration, pas un relevé réel.
      </p>
    </div>
  );
}
