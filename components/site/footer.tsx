import Link from "next/link";
import { OmbrairLogo } from "@/components/brand/ombrair-logo";
import { Conteneur } from "@/components/site/mise-en-page";

const colonnes = [
  {
    titre: "Produits",
    liens: [
      { href: "/gammes", label: "Comparer les produits" },
      { href: "/gammes/capteur", label: "Capteur Ombrair" },
      { href: "/gammes/volet", label: "Volet Ombrair" },
      { href: "/gammes/fenetre", label: "Fenêtre Ombrair" },
      { href: "/pro", label: "Ombrair Pro" },
    ],
  },
  {
    titre: "Ressources",
    liens: [
      { href: "/comment-ca-marche", label: "Comment ça marche" },
      { href: "/application", label: "L'application" },
      { href: "/simulateur", label: "Simulateur" },
      { href: "/ressources", label: "Articles" },
    ],
  },
  {
    titre: "Entreprise",
    liens: [
      { href: "/a-propos", label: "À propos" },
      /* Ombrair Pionniers vit dans « Entreprise » et non dans le header :
         le programme est déjà visible sur l'accueil et la page Capteur, et
         une septième entrée de navigation principale déséquilibrerait le
         header — qui ne tient déjà qu'à 63 px près à 1024 px. */
      { href: "/pionniers", label: "Ombrair Pionniers" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/devis", label: "Demander un devis" },
    ],
  },
  {
    titre: "Légal",
    liens: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Politique de confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-sourde">
      <Conteneur className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 sm:grid-cols-4">
        {/*
          Les intitulés de colonne étaient des H2. Comme le pied de page est
          présent partout, chaque page se terminait par quatre H2 de
          navigation qui n'appartenaient pas à sa structure de contenu — du
          bruit pour qui parcourt une page par ses titres.

          Ils deviennent des <p>, et chaque colonne un <nav> nommé par ce
          <p> via aria-labelledby : l'association reste explicite pour les
          technologies d'assistance, sans polluer le plan de titres.
        */}
        {colonnes.map((colonne) => (
          <nav
            key={colonne.titre}
            aria-labelledby={`footer-${colonne.titre.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <p
              id={`footer-${colonne.titre.toLowerCase().replace(/\s+/g, "-")}`}
              className="t-eyebrow text-muted-foreground"
            >
              {colonne.titre}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {colonne.liens.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    className="t-support text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Conteneur>
      <div className="border-t border-border">
        <Conteneur className="flex flex-wrap items-center justify-between gap-4 py-6">
          <OmbrairLogo variant="horizontal" size="sm" className="text-primary" titre="Ombrair" />
          <p className="t-caption text-muted-foreground">
            Projet étudiant fictif — aucune vente réelle. Université Toulouse Jean Jaurès, 2026.
          </p>
        </Conteneur>
      </div>
    </footer>
  );
}
