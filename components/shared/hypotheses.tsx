/**
 * Bloc dépliable « hypothèses de calcul », à afficher à côté de toute
 * estimation chiffrée. Une estimation sans ce bloc ne doit pas être
 * publiée : c'est la règle du projet sur les chiffres non mesurés.
 */
export function Hypotheses({
  titre = "Hypothèses de calcul",
  points,
}: {
  titre?: string;
  points: readonly string[];
}) {
  return (
    <details className="rounded-lg border border-border bg-muted/40 px-4 py-3">
      <summary className="cursor-pointer list-none text-xs font-medium marker:content-none">
        {titre}
      </summary>
      <ul className="mt-2 flex flex-col gap-1.5">
        {points.map((point) => (
          <li key={point} className="text-xs leading-relaxed text-muted-foreground">
            {point}
          </li>
        ))}
      </ul>
    </details>
  );
}
