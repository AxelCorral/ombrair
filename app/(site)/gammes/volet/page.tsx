import type { Metadata } from "next";
import { PageGamme } from "@/components/site/page-gamme";
import { Section, OuvertureChapitre } from "@/components/site/mise-en-page";
import { Volet3DDemo } from "@/components/site/volet-3d-demo";
import { gammeParId } from "@/lib/tarifs";

const gamme = gammeParId("volet");

export const metadata: Metadata = {
  title: gamme.nom,
  description: gamme.description,
};

const faq = [
  {
    question: "Mes volets sont déjà motorisés, dois-je les remplacer ?",
    reponse:
      "Non, dans la plupart des cas un module de pilotage suffit : il se clipse dans le coffre existant et rend le volet commandable par Ombrair. La compatibilité se vérifie au préalable.",
  },
  {
    question: "Mes volets sont manuels, à manivelle ou sangle.",
    reponse:
      "Il faut alors poser un volet motorisé : un module de pilotage ne peut pas motoriser un volet qui ne l'est pas.",
  },
  {
    question: "Le prix dépend-il des dimensions ?",
    reponse:
      "Non. Le prix publié est celui du volet, quel que soit le format standard retenu : Ombrair ne pratique pas de barème au centimètre. Le format sert à cadrer la demande, et les dimensions hors standard se traitent après relevé.",
  },
  {
    question: "Qui fabrique les volets ?",
    reponse:
      "Des fabricants spécialisés. Ombrair les sélectionne, les revend, les installe, les configure et en assure la maintenance, mais ne les conçoit ni ne les fabrique.",
  },
];

const dansLApplication = [
  "Ouverture de 0 à 100 %, volet par volet ou pour tout le logement",
  "Orientation des lames pour filtrer la lumière sans tout fermer",
  "Mode automatique ou manuel, la commande manuelle restant prioritaire",
  "Dernière action effectuée et sa raison",
];

export default function VoletPage() {
  return (
    <PageGamme
      gamme={gamme}
      faq={faq}
      dansLApplication={dansLApplication}
      /*
       * La démonstration vient JUSTE APRÈS le hero, pas dedans : le hero doit
       * d'abord dire ce qu'est le produit et ce qu'il coûte. Elle prend
       * ensuite toute la mesure, parce que c'est l'argument le plus fort de
       * la page — on y voit le volet décider tout seul.
       */
      apresHero={
        <Section fond="sourde" rythme="ample">
          <OuvertureChapitre
            surtitre="Démonstration"
            titre="Réglez les conditions, regardez le volet décider"
            chapo="Température, luminosité, humidité : le mode automatique en déduit une hauteur de tablier et un angle de lames. Déplacez un curseur et le volet réagit."
          />
          <div className="mt-14">
            <Volet3DDemo />
          </div>
        </Section>
      }
    />
  );
}
