import type { Metadata } from "next";
import { DevisForm } from "@/components/site/devis-form";
import { Section } from "@/components/site/mise-en-page";

export const metadata: Metadata = {
  title: "Devis",
  description: "Simulation de devis en ligne : produit, installation, configuration — démonstration, aucun envoi réel.",
};

/**
 * Le parcours de devis occupe désormais toute la mesure : formulaire à
 * gauche, panneau de ce qui a déjà été recueilli à droite (voir
 * `PanneauDemande` dans `devis-form.tsx`). La moitié droite de la page,
 * jusque-là entièrement vide sur toute la hauteur, porte enfin quelque
 * chose — sans qu'aucune étape ni aucune règle du formulaire ne change.
 */
export default function DevisPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section rythme="normal" className="pb-0 md:pb-0">
        <p className="t-eyebrow text-muted-foreground">Sans engagement</p>
        <h1 className="t-display mt-5 max-w-2xl text-balance">Demander un devis</h1>
        <p className="t-lead mt-5 max-w-lg text-muted-foreground">
          Six étapes. Ce parcours est une démonstration : aucune demande n&apos;est réellement
          transmise.
        </p>
      </Section>

      <Section rythme="ample">
        <DevisForm />
      </Section>
    </main>
  );
}
