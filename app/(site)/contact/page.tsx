import type { Metadata } from "next";
import { FormulaireContact } from "@/components/site/formulaire-contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur Ombrair ? Un formulaire de contact, à titre de démonstration.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-16 sm:px-8">
      <section className="flex flex-col gap-4">
        <h1 className="t-display max-w-2xl text-balance">Contact</h1>
        <p className="t-lead max-w-lg text-muted-foreground">
          Ombrair est un projet étudiant fictif : il n&apos;y a pas de service client réel derrière ce formulaire.
          Pour toute question sur le projet en lui-même, passez par les canaux de l&apos;Université Toulouse Jean
          Jaurès.
        </p>
      </section>

      <section className="max-w-xl">
        <FormulaireContact libelleSujet="Sujet" />
      </section>
    </main>
  );
}
