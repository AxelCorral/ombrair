import { LienFleche } from "@/components/site/actions";
import { meteo, prochaineAction } from "@/lib/mock/scenario";
import { temperatureInterieureMoyenneC } from "@/lib/mock/logement";
import { OmbrairLogo } from "@/components/brand/ombrair-logo";

/**
 * Diagramme de l'écosystème — remplace la bande « Capteurs → Ombrair Link →
 * Volets et fenêtres → Application ».
 *
 * POURQUOI. La chaîne était écrite en toutes lettres avec des flèches
 * typographiques, dans une carte bordée : le contenu le plus technique de
 * l'accueil était aussi le plus faible graphiquement. Or c'est exactement le
 * genre de contenu qu'un fabricant dessine.
 *
 * Chaque maillon porte maintenant sa miniature, tracée dans la même famille
 * que les visuels produit — trait fin, aplats, aucun rendu 3D — et les
 * quatre s'alignent sur un rail horizontal continu. Ce n'est pas un schéma
 * de réseau informatique : ce sont quatre objets sur une même ligne
 * technique.
 *
 * Aucune donnée n'est inventée : les valeurs de l'aperçu viennent de
 * `lib/mock`, comme partout ailleurs.
 */

const TRAIT = "stroke-current fill-none";

function MiniCapteur() {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <rect x="11" y="6" width="18" height="26" rx="2" className={TRAIT} strokeWidth="1.4" />
      {[13, 17, 21].map((y) => (
        <line key={y} x1="15" y1={y} x2="25" y2={y} className={TRAIT} strokeWidth="1.4" />
      ))}
      <circle cx="20" cy="27" r="1.8" className="fill-current" />
    </svg>
  );
}

function MiniLink() {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <rect x="6" y="12" width="28" height="16" rx="2" className="fill-current" />
      {[16, 20].map((y) => (
        <rect key={y} x="11" y={y} width="12" height="1.8" rx="0.9" className="fill-background" />
      ))}
      <rect x="11" y="24" width="12" height="1.8" rx="0.9" className="fill-background/50" />
      <circle cx="28" cy="17" r="1.6" className="fill-background" />
    </svg>
  );
}

function MiniOuvrant() {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      {/* Coffre + lames : le tablier à mi-course, un pivot amorcé. */}
      <rect x="7" y="7" width="26" height="3.5" rx="1" className="fill-current" />
      {[13, 17.5, 22].map((y, i) => (
        <line
          key={y}
          x1="8"
          y1={y}
          x2="32"
          y2={y}
          className={TRAIT}
          strokeWidth="2"
          style={{ opacity: 1 - i * 0.22 }}
        />
      ))}
      <line x1="8" y1="32" x2="32" y2="32" className={TRAIT} strokeWidth="1.2" />
    </svg>
  );
}

function MiniApplication() {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <rect x="13" y="5" width="14" height="30" rx="2.5" className={TRAIT} strokeWidth="1.4" />
      <line x1="17.5" y1="8.5" x2="22.5" y2="8.5" className={TRAIT} strokeWidth="1.2" />
      <line x1="16" y1="17" x2="24" y2="17" className={TRAIT} strokeWidth="2.4" />
      <line x1="16" y1="22" x2="21" y2="22" className={TRAIT} strokeWidth="1.4" />
    </svg>
  );
}

const MAILLONS = [
  { nom: "Capteurs", role: "Mesurent", visuel: <MiniCapteur /> },
  { nom: "Ombrair Link", role: "Décide", visuel: <MiniLink /> },
  { nom: "Volets et fenêtres", role: "Agissent", visuel: <MiniOuvrant /> },
  { nom: "Application", role: "Vous informe", visuel: <MiniApplication /> },
];

function temp(valeur: number) {
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function DiagrammeEcosysteme() {
  return (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-16">
      <div>
        {/*
          Le rail. Un seul trait continu derrière les quatre maillons sur
          desktop ; sur mobile la lecture redevient verticale et le rail
          passe à gauche, comme la ligne de rappel d'un plan.
        */}
        <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute top-5 right-0 left-0 hidden h-px bg-border lg:block"
          />

          {MAILLONS.map((maillon, i) => (
            <li key={maillon.nom} className="relative flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Le repère sur le rail : plein pour marquer le maillon. */}
                <span
                  aria-hidden="true"
                  className="relative z-10 block size-2.5 shrink-0 bg-foreground lg:mt-[0.9rem]"
                />
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-border lg:hidden"
                />
              </div>

              <span className="text-foreground">{maillon.visuel}</span>

              <div>
                <p className="t-h3">{maillon.nom}</p>
                <p className="t-caption mt-1 text-muted-foreground">{maillon.role}</p>
              </div>

              <span className="sr-only">
                {i < MAILLONS.length - 1 ? "puis" : "fin de la chaîne"}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-12 border-t border-border pt-6">
          <p className="t-h3">Accès à l&apos;application inclus à vie</p>
          <p className="t-support mt-2 text-muted-foreground">
            Aucun abonnement obligatoire pour les fonctions principales.
          </p>
          <LienFleche href="/application" className="mt-4">
            Découvrir l&apos;application
          </LienFleche>
        </div>
      </div>

      {/* Aperçu d'interface, dans l'esprit du mockup de la charte. */}
      <div className="w-full max-w-[15rem] rounded-lg border-2 border-persienne p-4 dark:border-chaux/40">
        <OmbrairLogo variant="horizontal" size="xs" className="text-primary" />

        <dl className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
          <div className="flex items-baseline justify-between">
            <dt className="t-caption text-muted-foreground">Séjour</dt>
            <dd className="t-data t-support">{temp(temperatureInterieureMoyenneC)}&nbsp;°C</dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="t-caption text-muted-foreground">Extérieur</dt>
            <dd className="t-data t-support">{temp(meteo.exterieurC)}&nbsp;°C</dd>
          </div>
        </dl>

        <p className="t-data t-caption mt-4 border-t border-border pt-3 text-muted-foreground">
          {prochaineAction.heure} — {prochaineAction.libelle.toLowerCase()}
        </p>
      </div>
    </div>
  );
}
