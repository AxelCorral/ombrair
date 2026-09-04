/**
 * Cas d'usage.
 *
 * Remplace les anciennes cartes de témoignage. Celles-ci étaient
 * correctement étiquetées « persona fictif », donc pas trompeuses au sens
 * strict — mais leur mécanique visuelle (citation entre guillemets, prénom,
 * ville) reproduisait exactement celle d'un avis client. Puisque aucun
 * client réel n'existe, autant ne pas emprunter la forme de la preuve
 * sociale : les mêmes situations sont plus utiles décrites comme des cas.
 *
 * CE QUI CHANGE DANS CETTE PASSE. C'étaient encore trois cartes bordées
 * identiques — le dernier endroit du site où l'on empilait trois blocs de
 * même poids côte à côte, exactement le motif qu'une page d'accueil
 * générique produit toute seule. Le cadre disparaît : reste un filet
 * supérieur, le contexte en surtitre, la situation en titre, puis les deux
 * temps du cas séparés par un second filet.
 *
 * Le problème est en retrait, la réponse en pleine valeur : sur trois
 * colonnes de texte continu, c'est ce contraste qui dit lequel des deux
 * paragraphes on est venu lire.
 */
export function CasUsageCard({
  situation,
  contexte,
  probleme,
  reponse,
}: {
  /** Le cas, en trois ou quatre mots. */
  situation: string;
  /** Type de logement et exposition. */
  contexte: string;
  /** Ce qui se passe sans rien faire. */
  probleme: string;
  /** Ce que le système change concrètement. */
  reponse: string;
}) {
  return (
    <article className="flex flex-col border-t border-foreground/30 pt-5">
      <p className="t-eyebrow text-muted-foreground">{contexte}</p>

      <h3 className="t-h3 mt-3 text-balance">{situation}</h3>

      <p className="t-support mt-4 text-muted-foreground">{probleme}</p>

      <p className="t-support mt-4 border-t border-border pt-4">{reponse}</p>
    </article>
  );
}
