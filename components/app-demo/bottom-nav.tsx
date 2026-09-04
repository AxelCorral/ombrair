"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, ChartLine, House, LayoutGrid, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const onglets = [
  { href: "/app", label: "Accueil", Icone: House },
  { href: "/app/pieces", label: "Pièces", Icone: LayoutGrid },
  { href: "/app/programmes", label: "Programmes", Icone: CalendarClock },
  { href: "/app/historique", label: "Historique", Icone: ChartLine },
  { href: "/app/reglages", label: "Réglages", Icone: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation de l'application"
      className="sticky bottom-0 z-10 border-t border-border bg-background"
    >
      {/*
        ÉTAT ACTIF. Un trait plein sur toute la largeur de l'onglet, posé
        au ras du filet supérieur — le repère d'un plan, pas une capsule
        iOS. Il tient sans couleur d'accent : c'est la valeur du trait et
        du libellé qui distingue, donc l'état reste lisible en niveaux de
        gris. Zone tactile portée à 56 px de haut.
      */}
      <ul className="mx-auto flex max-w-md">
        {onglets.map(({ href, label, Icone }) => {
          const actif = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-1 px-1 text-[11px] transition-colors",
                  actif ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-2 top-0 h-0.5",
                    actif ? "bg-foreground" : "bg-transparent"
                  )}
                />
                <Icone className={cn("size-5", actif && "stroke-[2.25]")} aria-hidden="true" />
                <span className={cn("text-center leading-tight", actif && "font-medium")}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
