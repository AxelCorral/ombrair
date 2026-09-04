import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Ombrair — projet étudiant fictif.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-16 sm:px-8">
      <section className="flex flex-col gap-4">
        <h1 className="t-display max-w-2xl text-balance">Mentions légales</h1>
      </section>

      <section className="t-body flex max-w-[38rem] flex-col gap-6 text-muted-foreground">
        <p>
          Ombrair est un projet fictif, réalisé dans le cadre d&apos;un exercice universitaire de création
          d&apos;entreprise (Master MIASHS, Université Toulouse Jean Jaurès, 2026). Il ne correspond à aucune
          société immatriculée, aucune activité commerciale réelle, et ce site n&apos;effectue aucune vente.
        </p>
        <p>
          Une page de mentions légales sert normalement à identifier l&apos;éditeur d&apos;un site (raison sociale,
          SIRET, siège social, directeur de publication) et son hébergeur. Comme Ombrair n&apos;est pas une société
          réelle, ces informations n&apos;existent pas — les inventer donnerait à ce site une apparence
          d&apos;entreprise réelle qu&apos;il n&apos;a pas, ce que ce projet cherche justement à éviter.
        </p>
        <p>
          Ce site est hébergé et développé à titre pédagogique. Pour toute question sur le cadre du projet, les
          canaux de contact appropriés sont ceux de l&apos;Université Toulouse Jean Jaurès, et non ce site.
        </p>
      </section>
    </main>
  );
}
