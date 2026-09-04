import type { Metadata } from "next";
import { SimulateurForm } from "@/components/site/simulateur-form";

export const metadata: Metadata = {
  title: "Simulateur",
  description:
    "Quelques questions sur votre logement, et le simulateur indique quel produit Ombrair correspond et pour quel montant. Estimation, jamais promesse.",
};

export default function SimulateurPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-16 sm:px-8">
      <section className="flex max-w-2xl flex-col gap-4">
        <p className="text-sm text-muted-foreground">Estimation en quatre questions</p>
        <h1 className="t-display text-balance">
          Quel produit pour votre logement&nbsp;?
        </h1>
        <p className="text-lg text-muted-foreground">
          Le simulateur part de ce que vous avez déjà. Il indique le produit adapté, un montant de
          départ calculé sur les tarifs publiés, et ce qui ne peut pas être chiffré sans visite.
        </p>
      </section>

      <SimulateurForm />

      {/*
        Dire ce que l'outil ne fait pas, et pourquoi. Un simulateur qui
        affiche « −4 °C » et « 320 € économisés » serait plus séduisant,
        mais ces deux chiffres n'auraient aucune base : ce projet n'a pas de
        modèle thermique du bâtiment. Voir l'en-tête de lib/simulateur.ts.
      */}
      <section className="max-w-2xl rounded-lg border border-border bg-muted/40 p-6">
        <h2 className="t-h3">Ce que ce simulateur ne calcule pas</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Il n&apos;annonce ni gain de confort en degrés, ni économie de climatisation en euros. Les
          deux supposeraient un modèle thermique de votre logement — inertie des murs, surface
          vitrée, facteur solaire, renouvellement d&apos;air — dont Ombrair ne dispose pas. Un
          chiffre produit sans ce modèle aurait l&apos;apparence d&apos;une mesure sans en être une.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Ce que le simulateur peut faire honnêtement, il le fait : vous dire quel produit
          correspond à votre situation, et pour quel montant, à partir des tarifs réellement
          publiés.
        </p>
      </section>
    </main>
  );
}
