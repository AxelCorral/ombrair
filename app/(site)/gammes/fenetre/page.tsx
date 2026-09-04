import type { Metadata } from "next";
import { PageGamme } from "@/components/site/page-gamme";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { Fenetre3DDemo } from "@/components/site/fenetre-3d-demo";
import { gammeParId } from "@/lib/tarifs";

const gamme = gammeParId("fenetre");

export const metadata: Metadata = {
  title: gamme.nom,
  description: gamme.description,
};

const faq = [
  {
    question: "Peut-on motoriser une fenêtre existante ?",
    reponse:
      "Parfois, en ajoutant un actionneur — cela dépend du type de menuiserie, de l'état du dormant et du sens d'ouverture. C'est confirmé lors de la visite technique, pas au téléphone.",
  },
  {
    question: "L'installation est-elle comprise dans le prix ?",
    reponse:
      "Non. Le prix affiché est celui de la fenêtre. L'installation Ombrair est un montant distinct, que vous ajoutez ou non après avoir choisi le produit.",
  },
  {
    question: "C'est éligible à MaPrimeRénov' ?",
    reponse:
      "Sous conditions (ressources, logement concerné, recours à un professionnel labellisé RGE). Nous ne pouvons pas garantir votre éligibilité à votre place — le point de départ le plus fiable reste France Rénov'.",
  },
  {
    question: "La fenêtre s'ouvre-t-elle vraiment toute seule ?",
    reponse:
      "En mode automatique, elle peut s'entrouvrir quand l'air extérieur devient plus frais que l'intérieur, et se referme sur alerte pluie ou vent. Les règles de sécurité passent toujours avant la logique thermique.",
  },
];

const dansLApplication = [
  "État de la fenêtre : fermée, entrouverte ou ouverte",
  "Fermeture automatique sur alerte vent ou pluie",
  "Verrouillage et simulation de présence pendant les absences",
  "Mode automatique ou manuel",
];

export default function FenetrePage() {
  return (
    <PageGamme
      gamme={gamme}
      faq={faq}
      dansLApplication={dansLApplication}
      /*
       * Même emplacement que sur la page Volet : JUSTE APRÈS le hero, pas
       * dedans. Le hero doit d'abord dire ce qu'est le produit et ce qu'il
       * coûte ; la démonstration prend ensuite toute la mesure, parce que
       * c'est l'argument le plus fort de la page — on y voit la fenêtre
       * arbitrer toute seule entre l'air du dehors et la chaleur.
       *
       * Le reste de l'enchaînement de `PageGamme` est INCHANGÉ : nomenclature,
       * installation, tarifs, packs et programme Pionniers continuent de venir
       * de `lib/tarifs.ts` et `lib/offres.ts`. La démonstration n'introduit
       * aucune offre, aucun prix et aucun produit.
       */
      apresHero={
        <Section fond="sourde" rythme="ample">
          <OuvertureChapitre
            surtitre="Démonstration"
            titre="Faites varier les conditions, la fenêtre s'adapte"
            chapo="Une fenêtre motorisée n'a de sens que si elle sait quand ouvrir. Comparez l'air du dedans à celui du dehors, et regardez Ombrair décider. Ajoutez le volet à la simulation pour voir les deux équipements se partager l'ombre et l'air."
          />
          <div className="mt-14">
            <Fenetre3DDemo />
          </div>
        </Section>
      }
    />
  );
}
