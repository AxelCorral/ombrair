# Direction — Démonstration applicative

## Problème visuel

L'app était fonctionnelle et cohérente — l'audit l'avait relevé, et rien de
tout cela n'a été reconstruit. Le défaut était ailleurs : presque toute
l'information vivait dans le MÊME contenant, un rectangle
`rounded-lg border border-border bg-card`. Sur un écran, cinq à huit blocs
identiques empilés, dont aucun ne disait « je suis plus important que le
voisin ».

En thème nuit, le défaut était plus net encore. `--card` est une Persienne
assombrie : chaque écran devenait une pile de blocs verts, alors que la
charte veut que Persienne reste une couleur de MARQUE et non la couleur de
toutes les surfaces sombres.

Deux points secondaires : l'écran d'appairage laissait ses deux tiers
inférieurs vides sous trois lignes décrivant un geste physique, et les
alertes occupaient un aplat teinté là où un signal aurait suffi.

## Parti pris

**Cinq niveaux au lieu d'un.** En-tête d'écran, panneau (un seul par écran,
celui qu'on vient lire), groupe porté par un filet, ligne de données,
statut. L'app reste compacte, utilitaire et technique : ces primitives ne
l'aèrent pas, elles la hiérarchisent.

**Les surfaces montent en Chaux, pas en Persienne.** `--surface-panneau`
remplace `--card` dans toute l'app. `--card` garde sa teinte sur le site,
où elle fait l'ambiance nocturne saluée par l'audit.

**Un seul système de statuts.** Auto, Manuel, Ouvert, Fermé, Hors ligne,
Batterie faible, Alerte. La FORME du repère porte l'information — carré
plein, carré vide, triangle — et la couleur ne fait que la soutenir : les
statuts restent lisibles en niveaux de gris, et pour quelqu'un qui ne
distingue pas le vert du rouge.

**Braise signale, elle ne remplit pas.** Les bandeaux d'alerte passent d'un
aplat teinté à un montant vertical plein, avec icône et titre.

**Le chapitre de pièce se voit sans être lu.** Nom en display et relevé
alignés au-dessus d'un filet plein. Sur un écran de 2 090 px, il faut
pouvoir repérer où commence une pièce d'un coup d'œil. La batterie et le
signal restent dans le repli des cartes d'ouvrant : ils n'ont pas à peser
autant que le nom d'une pièce.

**Le dessin technique là où il sert.** L'assistant d'appairage montre où
appuyer, la diode à surveiller et la portée radio — ce qu'aucune phrase ne
fait aussi vite.

## Ce qui n'a pas été touché

La logique, les données, la cohérence inter-écrans (le point fort de la
démo), les parcours, les cinq onglets, la divulgation progressive des
cartes d'ouvrant, les seuils de batterie, les courbes Recharts.

## Critères de validation

- [x] Un seul panneau par écran.
- [x] En thème nuit, l'écran n'est plus une pile de blocs Persienne.
- [x] Une alerte se distingue d'une information de routine au premier coup
      d'œil, sans grande surface rouge.
- [x] L'onglet actif est clair sans capsule iOS ; zone tactile à 56 px.
- [x] L'écran d'appairage n'a plus de grand vide.
- [x] Aucune régression fonctionnelle : 87 tests au vert.
