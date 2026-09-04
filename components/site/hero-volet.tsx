"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ActionLien } from "@/components/site/actions";
import { DaySky } from "@/components/hero/day-sky";
import { SunMoon } from "@/components/hero/sun-moon";
import { Shutter } from "@/components/hero/shutter";
import { LiveMeasurements } from "@/components/hero/live-measurements";
import { HeroControls } from "@/components/hero/hero-controls";
import {
  HEURE_DEPART,
  etatSimulation,
  formatHeure,
  heureDepuisTempsEcoule,
} from "@/lib/demo/day-cycle";
import { fenetreAutomatique, tauxOuverture, voletAutomatique } from "@/lib/demo/shutter";

/**
 * « Une journée Ombrair en 24 heures ».
 *
 * Une horloge de simulation fait défiler une journée complète en 48 s. Le
 * ciel, les astres, les températures et le volet en découlent. L'utilisateur
 * peut reprendre la main à tout moment : toucher un curseur bascule en mode
 * manuel, un bouton rend la journée automatique.
 *
 * Ce n'est pas un relevé météo et Ombrair ne promet aucun gain de
 * température : c'est une démonstration de la logique de décision.
 *
 * Performance : une seule boucle `requestAnimationFrame` met à jour l'heure,
 * et seulement quand elle a bougé d'au moins une minute simulée — inutile de
 * re-rendre 60 fois par seconde pour une horloge qui affiche des minutes.
 * Cette boucle s'arrête dès que le hero quitte le champ de vision ou que
 * l'onglet passe en arrière-plan : sur une page d'accueil longue, le
 * visiteur passe l'essentiel de sa visite loin d'ici.
 */

export function HeroVolet() {
  const [heure, setHeure] = useState(HEURE_DEPART);
  const [auto, setAuto] = useState(true);
  const [manuel, setManuel] = useState({ levee: 0, inclinaison: 0 });
  const [reducedMotion, setReducedMotion] = useState(true);
  const [manipule, setManipule] = useState(false);
  const [actif, setActif] = useState(true);

  const conteneurRef = useRef<HTMLDivElement | null>(null);
  const ecouleRef = useRef(0);
  const debutRef = useRef<number | null>(null);
  const derniereHeureRef = useRef(HEURE_DEPART);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  /*
   * La simulation ne tourne que si le hero est visible ET l'onglet au
   * premier plan. `visible` et `ongletActif` sont combinés en un seul état
   * pour que la boucle n'ait qu'une condition à surveiller.
   */
  useEffect(() => {
    const cible = conteneurRef.current;
    if (!cible) return;

    let visible = true;
    let ongletActif = !document.hidden;
    const majActif = () => setActif(visible && ongletActif);

    const observateur = new IntersectionObserver(
      ([entree]) => {
        visible = entree.isIntersecting;
        majActif();
      },
      { threshold: 0 }
    );
    observateur.observe(cible);

    const onVisibilite = () => {
      ongletActif = !document.hidden;
      majActif();
    };
    document.addEventListener("visibilitychange", onVisibilite);

    return () => {
      observateur.disconnect();
      document.removeEventListener("visibilitychange", onVisibilite);
    };
  }, []);

  // Horloge de simulation. Arrêtée en reduced motion : le hero affiche
  // alors un instant représentatif, fixe et pleinement lisible.
  useEffect(() => {
    if (reducedMotion) {
      setHeure(HEURE_DEPART);
      return;
    }
    if (!actif) return;

    // Reprise : on repart du temps déjà écoulé, pour que la journée ne
    // saute pas en arrière quand le hero revient à l'écran.
    debutRef.current = null;

    let frame = 0;
    const boucle = (maintenant: number) => {
      if (debutRef.current === null) debutRef.current = maintenant - ecouleRef.current;
      ecouleRef.current = maintenant - debutRef.current;
      const nouvelle = heureDepuisTempsEcoule(ecouleRef.current);
      // Une minute simulée = 1/60 d'heure : en deçà, rien n'a changé à l'écran.
      if (Math.abs(nouvelle - derniereHeureRef.current) >= 1 / 60) {
        derniereHeureRef.current = nouvelle;
        setHeure(nouvelle);
      }
      frame = requestAnimationFrame(boucle);
    };
    frame = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, actif]);

  // Position du volet : calculée par le scénario en auto, pilotée par
  // l'utilisateur en manuel.
  const etatPrealable = etatSimulation(heure);
  const ecartExtInt = etatPrealable.temperatureExterieure - etatPrealable.temperatureInterieure;
  const volet = auto
    ? voletAutomatique(heure, etatPrealable.luminosite, ecartExtInt)
    : manuel;

  const ouverture = tauxOuverture(volet);
  // L'ouverture influe sur la température intérieure : on recalcule l'état
  // une fois le volet connu, pour que les chiffres et l'image concordent.
  const etat = etatSimulation(heure, ouverture);
  const fenetre = auto ? fenetreAutomatique(ecartExtInt) : "fermee";

  const passerEnManuel = useCallback(
    (modif: Partial<{ levee: number; inclinaison: number }>) => {
      setManuel((precedent) => ({ ...(auto ? volet : precedent), ...modif }));
      setAuto(false);
      setManipule(true);
      // Coupe les transitions le temps de la manipulation : un curseur doit
      // répondre instantanément, pas avec 700 ms de retard.
      window.setTimeout(() => setManipule(false), 120);
    },
    [auto, volet]
  );

  return (
    <div ref={conteneurRef} className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:items-center lg:gap-16">
      {/*
        COLONNE DE GAUCHE — quatre groupes séparés par des filets.

        Elle enchaînait auparavant titre, phrase, heure, mesures, curseurs,
        badge, mention et bouton d'un seul tenant : neuf éléments de même
        poids, dont on ne voyait plus l'articulation. Les mêmes éléments sont
        maintenant regroupés en PROMESSE / MESURES / COMMANDE / ACTION.

        La séparation se fait au filet et au surtitre, pas à la carte : un
        panneau technique encadré au milieu du hero alourdirait exactement là
        où le site doit rester ouvert.
      */}
      <div className="flex flex-col">
        <h1 className="t-display max-w-xl text-balance">La fraîcheur, avant la chaleur.</h1>

        {/* Le test des cinq secondes : capteurs, anticipation, ouvrants,
            automatisme. La baseline pose l'intention, cette phrase dit ce
            que fait le produit. */}
        <p className="t-lead mt-6 max-w-lg text-muted-foreground">
          Des capteurs mesurent l&apos;intérieur et l&apos;extérieur. Ombrair anticipe la
          surchauffe et ferme vos volets avant qu&apos;elle n&apos;arrive, puis ouvre
          quand l&apos;air du dehors redevient plus frais. Une journée entière défile ici —
          reprenez la main quand vous voulez.
        </p>

        <div className="mt-10 border-t border-border pt-6">
          <p className="t-eyebrow text-muted-foreground">Relevés de la simulation</p>
          <div className="mt-4">
            <LiveMeasurements etat={etat} tauxOuverture={ouverture} etatFenetre={fenetre} />
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="t-eyebrow text-muted-foreground">Commande</p>
          <div className="mt-4">
            <HeroControls
              levee={volet.levee}
              inclinaison={volet.inclinaison}
              auto={auto}
              onLevee={(valeur) => passerEnManuel({ levee: valeur })}
              onInclinaison={(valeur) => passerEnManuel({ inclinaison: valeur })}
              onReprendreAuto={() => setAuto(true)}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-5">
          <ActionLien href="/devis">Demander un devis</ActionLien>
          <p className="t-caption max-w-md text-muted-foreground">
            Scénario de démonstration — températures, luminosité et course du
            soleil sont simulées. Aucun gain de température n&apos;est garanti.
            {reducedMotion
              ? ` Animations réduites : la scène est figée à ${formatHeure(HEURE_DEPART)}.`
              : null}
          </p>
        </div>
      </div>

      {/*
        L'OUVERTURE — mur, embrasure, dormant, scène, appui.

        C'était un simple rectangle bordé posé sur la page : à minuit, quand
        le ciel s'assombrit et que le volet est baissé, il devenait un grand
        aplat presque vide. Le percement est maintenant tenu par une
        architecture, si bien que la scène reste lisible même à 00:00 — le
        mur, l'épaisseur du tableau et l'appui ne dépendent pas de l'heure.

        Tout est à plat : aucune ombre floue, la profondeur vient d'un décalage
        de trois pixels et d'un aplat plus sombre.
      */}
      <figure className="flex flex-col">
        <div className="relative bg-surface-panneau px-[6%] pt-[6%] pb-[9%]">
          <div className="relative aspect-[4/5] w-full">
            {/* Embrasure : l'épaisseur du tableau, décalée vers le haut-gauche. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-1 -translate-y-1 rounded-lg bg-border/70"
            />

            {/* Dormant + scène. */}
            <div className="relative h-full w-full overflow-hidden rounded-lg border-[3px] border-persienne bg-persienne">
              <div className="absolute inset-2 overflow-hidden rounded-[var(--radius-sm)]">
                <DaySky heure={etat.heure} />
                <SunMoon soleil={etat.soleil} lune={etat.lune} />

                <Shutter levee={volet.levee} inclinaison={volet.inclinaison} transitions={!manipule} />
              </div>
            </div>
          </div>

          {/* Appui de fenêtre : une dalle qui déborde de l'ouverture de part
              et d'autre. Elle donne son assise au percement — sans elle, le
              cadre flottait au milieu du mur. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-[2%] bottom-[2.5%] h-3 bg-border"
          />
        </div>

        <figcaption className="t-caption mt-4 flex items-baseline gap-3 text-muted-foreground">
          <span aria-hidden="true" className="h-px w-8 shrink-0 translate-y-[-0.25em] bg-border" />
          Une journée de 24 h en 48 s — {formatHeure(etat.heure)}
        </figcaption>
      </figure>
    </div>
  );
}
