interface FaqItem {
  question: string;
  reponse: string;
}

/**
 * Liste de questions.
 *
 * Une FAQ doit rester rapide : pas de carte, pas d'animation, pas
 * d'accordéon à ressort. La seule chose qui manquait était l'AFFORDANCE —
 * rien ne disait qu'une ligne s'ouvre. Un signe « + » qui bascule en « − »
 * à l'ouverture le dit, sans rien coûter.
 *
 * La réponse est limitée à une mesure de lecture confortable plutôt que de
 * s'étendre sur toute la largeur du conteneur.
 */
export function FaqListe({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col border-t border-border">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-border">
          <summary className="flex cursor-pointer list-none items-baseline gap-4 py-4 marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <span
              aria-hidden="true"
              className="t-data shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            >
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
            <span className="t-body font-medium">{item.question}</span>
          </summary>
          <p className="t-support max-w-2xl pb-5 pl-8 text-muted-foreground">{item.reponse}</p>
        </details>
      ))}
    </div>
  );
}
