"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { OmbrairLogo } from "@/components/brand/ombrair-logo";
import { Conteneur } from "@/components/site/mise-en-page";
import { cn } from "@/lib/utils";

const liensPrincipaux = [
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/gammes", label: "Produits" },
  { href: "/application", label: "L'application" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/ressources", label: "Ressources" },
  { href: "/pro", label: "Ombrair Pro" },
] as const;

/**
 * En-tête du site.
 *
 * DIRECTION. Celui d'une marque d'architecture contemporaine : un filet bas,
 * rien d'autre. Pas d'ombre au défilement, pas de flou, pas de dégradé —
 * la présence vient de la hauteur (72 px), du logo à sa vraie taille et de
 * l'espacement, pas d'un effet.
 *
 * ÉTAT ACTIF. La page courante porte un soulignement fin de la largeur du
 * libellé. C'est le seul repère : ni pastille, ni fond, ni capsule.
 *
 * BASCULE DE THÈME. Un seul bouton dans le DOM, et non deux — l'audit avait
 * relevé deux boutons au même nom accessible, l'un pour la disposition
 * mobile, l'autre pour la desktop. Un seul suffit à condition de le sortir
 * des deux blocs conditionnels.
 *
 * DEUX TAILLES DE HEADER DESKTOP. L'audit avait corrigé un débordement de
 * 18 px à 768 px en repoussant la navigation à `lg`. En grossissant le logo,
 * l'interlettrage et le texte de navigation, cette passe a recréé le même
 * défaut à sa nouvelle frontière : à 1024 px exactement, les six entrées, le
 * logo et les actions demandaient 70 px de plus que la largeur disponible.
 *
 * Repousser encore la bascule à `xl` aurait renvoyé tous les portables
 * 1024–1279 px au menu compact — un recul. La navigation reste donc visible
 * dès 1024 px, mais en version RESSERRÉE : logo `sm`, gouttières de 16 px,
 * libellés à 14 px, appel à l'action plus étroit. La version confortable
 * reprend à 1280 px. Marge mesurée à 1024 px après correction : 63 px.
 */
export function Header() {
  const [ouvert, setOuvert] = useState(false);
  const panelId = useId();
  const chemin = usePathname();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOuvert(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const estActif = (href: string) =>
    href === "/" ? chemin === "/" : chemin === href || chemin.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Conteneur className="flex h-[4.5rem] items-center justify-between gap-4 xl:gap-6">
        <Link
          href="/"
          onClick={() => setOuvert(false)}
          aria-label="Ombrair — accueil"
          className="shrink-0"
        >
          {/*
            Signe seul en dessous de 640 px : le logotype complet mangerait la
            largeur nécessaire à la navigation. Variante officielle.

            Les trois variantes sont masquées par un SPAN ENVELOPPE et non par
            une classe passée au logo : `OmbrairLogo` pose lui-même
            `inline-flex` avant d'appliquer `className`, et `inline-flex`
            l'emportait sur `hidden` — les deux logotypes s'affichaient
            ensemble, ce qui ajoutait 127 px au header entre 1024 et 1280 px.
            Un conteneur neutre évite la lutte de spécificité.
          */}
          <span className="inline-flex sm:hidden">
            <OmbrairLogo variant="symbol" size="md" className="text-primary" />
          </span>
          <span className="hidden sm:inline-flex xl:hidden">
            <OmbrairLogo variant="horizontal" size="sm" className="text-primary" />
          </span>
          <span className="hidden xl:inline-flex">
            <OmbrairLogo variant="horizontal" size="md" className="text-primary" />
          </span>
        </Link>

        {/*
          Bascule à `lg` (1024 px) et non `md` (768 px) : à 768 px exactement,
          les six entrées, le logo et les actions demandaient 18 px de plus
          que la largeur disponible, ce qui provoquait un débordement
          horizontal sur toutes les pages.
        */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-4 lg:flex xl:gap-7">
          {liensPrincipaux.map((lien) => {
            const actif = estActif(lien.href);
            return (
              <Link
                key={lien.href}
                href={lien.href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap text-[0.875rem] text-foreground decoration-1 underline-offset-[7px] transition-colors xl:text-[0.9375rem]",
                  actif ? "font-medium underline decoration-foreground" : "hover:underline hover:decoration-border"
                )}
              >
                {lien.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <Link
            href="/devis"
            className="hidden h-10 items-center rounded-lg bg-primary px-4 text-[0.875rem] font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/85 lg:inline-flex xl:px-5 xl:text-[0.9375rem]"
          >
            Demander un devis
          </Link>

          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-surface-panneau lg:hidden"
            aria-expanded={ouvert}
            aria-controls={panelId}
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOuvert((v) => !v)}
          >
            {ouvert ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Conteneur>

      <div
        id={panelId}
        className={cn(
          "overflow-hidden border-t border-border bg-surface-sourde transition-[max-height] duration-200 lg:hidden",
          ouvert ? "max-h-[28rem]" : "max-h-0 border-t-0"
        )}
      >
        <Conteneur as="nav" className="flex flex-col py-3">
          <span className="sr-only">Navigation principale (mobile)</span>
          {liensPrincipaux.map((lien) => {
            const actif = estActif(lien.href);
            return (
              <Link
                key={lien.href}
                href={lien.href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "t-body border-b border-border/60 py-3 last:border-b-0",
                  actif ? "font-medium" : "text-muted-foreground"
                )}
                onClick={() => setOuvert(false)}
              >
                {lien.label}
              </Link>
            );
          })}
          <Link
            href="/devis"
            className="mt-4 mb-2 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-[0.9375rem] font-medium text-primary-foreground"
            onClick={() => setOuvert(false)}
          >
            Demander un devis
          </Link>
        </Conteneur>
      </div>
    </header>
  );
}
