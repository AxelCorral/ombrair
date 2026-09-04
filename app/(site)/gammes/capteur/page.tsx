import type { Metadata } from "next";
import { PageGamme } from "@/components/site/page-gamme";
import { CompatChecker } from "@/components/site/compat-checker";
import { OmbrairLinkExplication } from "@/components/site/ombrair-link";
import { VisionneuseProduit } from "@/components/site/visionneuse-produit";
import { gammeParId } from "@/lib/tarifs";

const gamme = gammeParId("capteur");

export const metadata: Metadata = {
  title: gamme.nom,
  description: gamme.description,
};

const faq = [
  {
    question: "Les capteurs fonctionnent-ils sans volet Ombrair ?",
    reponse:
      "Oui. Le capteur mesure et affiche l'intérieur et l'extérieur dans l'application même sans ouvrant motorisé. Le pilotage automatique, lui, demande un volet ou une fenêtre commandable.",
  },
  {
    question: "Faut-il un capteur par pièce ?",
    reponse:
      "Un capteur par pièce suivie donne les réglages les plus fins. Les capteurs se vendent à l'unité : vous en prenez autant que de pièces à suivre.",
  },
  {
    question: "Que mesure le capteur ?",
    reponse: "Température, humidité et luminosité. C'est ce qui permet de comparer l'extérieur à l'intérieur en continu.",
  },
  {
    question: "Que fait Ombrair exactement sur ce produit ?",
    reponse:
      "La conception du produit, la carte électronique, le firmware et l'intégration logicielle sont faits par Ombrair, ainsi que l'assemblage, la vente, l'installation et la maintenance. Les composants électroniques unitaires viennent de fournisseurs, comme pour tout produit électronique.",
  },
];

const dansLApplication = [
  "État de chaque capteur, intérieur comme extérieur",
  "Relevés en direct et historique sur 24 h, 7 jours et 30 jours",
  "Alerte si un capteur cesse de répondre",
  "Appairage guidé d'un nouveau capteur",
];

export default function CapteurPage() {
  return (
    <PageGamme
      gamme={gamme}
      faq={faq}
      dansLApplication={dansLApplication}
      enfants={<CompatChecker />}
      apresFourniture={<OmbrairLinkExplication />}
      /*
       * Le capteur est le seul produit qu'Ombrair conçoit et fabrique : c'est
       * aussi le seul dont on peut montrer le boîtier réel. Le modèle 3D
       * remplace donc l'illustration en arche dans le hero, et il devient le
       * visuel principal de la page.
       */
      visuelHero={
        <VisionneuseProduit
          src="/models/capteur-exterieur-ombrair.glb"
          srcEclate="/models/capteur-exterieur-ombrair-eclate.glb"
          poster="/models/capteur-exterieur-ombrair-fallback.png"
          alt="Capteur extérieur Ombrair — boîtier de 80 × 60 × 26 mm, grille de mesure et fenêtre optique en face avant. Modèle 3D manipulable."
        />
      }
    />
  );
}
