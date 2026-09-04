import type { Metadata } from "next";
import { FaqListe } from "@/components/site/faq-liste";
import { formatPrix, getPrixProduit, offreParId } from "@/lib/offres";

/*
 * Les montants cités dans les réponses sont CONSTRUITS à partir de
 * `lib/offres.ts`, jamais recopiés. Une réponse de FAQ vieillit aussi mal
 * qu'une carte produit : si la grille change, ces phrases suivent.
 */
const PRIX = {
  capteur: formatPrix(getPrixProduit("capteur")),
  volet: formatPrix(getPrixProduit("volet")),
  fenetre: formatPrix(getPrixProduit("fenetre")),
  packVolet: formatPrix(getPrixProduit("pack-capteur-volet")),
  installVolet: formatPrix(offreParId("volet").prixInstallationCents),
};

export const metadata: Metadata = {
  title: "FAQ",
  description: "Les questions les plus fréquentes sur Ombrair — produit, installation, application et facturation.",
};

const categories = [
  {
    titre: "Produit",
    items: [
      {
        question: "Ombrair fonctionne-t-il avec mes volets actuels ?",
        reponse:
          "Si vos volets roulants sont déjà électriques, oui : un module de pilotage suffit. Sinon, il faut poser un volet motorisé.",
      },
      {
        question: "Quelle est la différence entre les trois produits ?",
        reponse:
          "Le capteur mesure l'intérieur et l'extérieur — c'est le produit qu'Ombrair conçoit et fabrique. Le volet protège du soleil. La fenêtre motorisée permet de ventiler. Volets et fenêtres viennent de fabricants spécialisés, Ombrair les installe et les intègre.",
      },
      {
        question: "Le système fonctionne-t-il sans connexion internet ?",
        reponse:
          "Oui, pour l'essentiel. Ombrair Link reçoit les capteurs en radio et décide sur place : la mesure, la comparaison intérieur / extérieur et la commande automatique des volets continuent sans internet. Seule la consultation à distance depuis l'application s'interrompt, ainsi que la prévision météo de l'option Ombrair+. La commande manuelle, elle, reste toujours possible.",
      },
    ],
  },
  {
    titre: "Installation",
    items: [
      {
        question: "L'installation est-elle obligatoire ?",
        reponse: `Non. Le prix du produit et le prix de l'installation Ombrair sont séparés : vous choisissez l'installation après avoir sélectionné votre produit. Pour un volet à ${PRIX.volet}, par exemple, l'installation Ombrair s'ajoute pour ${PRIX.installVolet}.`,
      },
      {
        question: "Combien de temps prend l'installation ?",
        reponse:
          "Pour un capteur, quelques minutes. Pour la pose de volets ou de fenêtres, une demi-journée à une journée selon le nombre d'ouvrants, confirmée avec le technicien lors du devis.",
      },
      {
        question: "Faut-il des travaux ?",
        reponse:
          "Non pour les capteurs et les modules de commande, qui se posent sans outil ou se clipsent dans le coffre existant. Oui pour la pose d'un volet ou d'une fenêtre neuve.",
      },
      {
        question: "Je peux compléter mon installation plus tard ?",
        reponse:
          "Oui. Des capteurs posés aujourd'hui peuvent être complétés plus tard par des volets ou des fenêtres motorisés ; Ombrair Link et les capteurs déjà installés restent utilisables.",
      },
    ],
  },
  {
    titre: "Application et données",
    items: [
      {
        question: "Faut-il un compte pour utiliser l'application ?",
        reponse: "Oui, un compte foyer gratuit, créé lors du premier appairage.",
      },
      {
        question: "Mes données sont-elles revendues ?",
        reponse: "Non. Le détail est expliqué sur la page confidentialité.",
      },
      {
        question: "Combien de temps l'historique est-il conservé ?",
        reponse: "90 jours dans l'usage inclus. Historique illimité avec l'option Ombrair+.",
      },
    ],
  },
  {
    titre: "Facturation",
    items: [
      {
        question: "Combien coûte Ombrair ?",
        reponse: `Le capteur est à ${PRIX.capteur}, le volet à ${PRIX.volet} par ouvrant, la fenêtre à ${PRIX.fenetre} par ouvrant. L'installation Ombrair s'ajoute si vous la retenez. Deux packs associent un capteur à un ouvrant, à partir de ${PRIX.packVolet} — le catalogue détaille chaque montant.`,
      },
      {
        question: "Faut-il payer un abonnement ?",
        reponse:
          "Non. L'accès à l'application est inclus à vie, sans abonnement, avec les trois produits. Ombrair+ est une option facultative, jamais requise.",
      },
      {
        question: "Le devis en ligne engage-t-il à quelque chose ?",
        reponse: "Non, c'est une simulation. Ici, aucune commande réelle n'est possible — projet étudiant fictif.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-16 sm:px-8">
      <section className="flex flex-col gap-4">
        <h1 className="t-display max-w-2xl text-balance">
          Questions fréquentes
        </h1>
      </section>

      {categories.map((categorie) => (
        <section key={categorie.titre} className="flex flex-col gap-6">
          <h2 className="t-h2">{categorie.titre}</h2>
          <FaqListe items={categorie.items} />
        </section>
      ))}
    </main>
  );
}
