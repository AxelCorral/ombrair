# Direction — Accueil

## Problème visuel

L'accueil était déjà la page la plus soignée du site, et le hero son
meilleur élément. Le problème n'était donc pas la qualité mais
l'ARTICULATION :

- la colonne gauche du hero enchaînait neuf éléments de même poids — titre,
  phrase, heure, quatre mesures, deux curseurs, badge, mention, bouton —
  sans qu'aucun groupe ne se détache ;
- la fenêtre de droite était un rectangle bordé posé sur la page : à 00:00,
  ciel sombre et volet baissé, elle devenait un grand aplat presque vide ;
- les huit sections suivantes étaient séparées par un `gap-24` uniforme, sur
  un fond unique. Rien ne disait « nouveau chapitre » ;
- les trois chiffres du constat et les quatre temps du fonctionnement
  étaient des colonnes de texte ;
- la bande écosystème — le contenu le plus technique de la page — était la
  plus faible graphiquement : une chaîne de mots reliés par des flèches
  typographiques, dans une carte bordée.

## Parti pris

**Le hero est un panneau technique, pas une carte.** Quatre groupes —
PROMESSE / MESURES / COMMANDE / ACTION — séparés au filet et au surtitre
mono. Un encadré au milieu du hero aurait alourdi exactement là où le site
doit rester ouvert.

**L'ouverture est tenue par une architecture.** Mur, embrasure décalée,
dormant, appui débordant. Ces quatre éléments ne dépendent pas de l'heure :
la scène reste lisible même quand le ciel s'assombrit.

**Le chapitre se marque par le fond, pas par la hauteur.** Alternance
page / sourde, et filet d'ouverture. Un premier réglage du rythme à 112 px
de part et d'autre ajoutait près de 1 000 px à la page — l'espace était
intentionnel mais coûtait plus qu'il ne rapportait. Ramené à 80 px.

**Ce qui est technique se dessine.** Le constat devient une composition
éditoriale à filets verticaux, les quatre temps se lisent sur un rail
continu, et la bande écosystème devient un diagramme à quatre miniatures
tracées dans la famille des visuels produit.

## Ce qui n'a pas été touché

La simulation 24 h et ses commandes, la vitrine des trois produits (le
point haut du site d'après l'audit), les cas d'usage, la FAQ, tous les
chiffres et toutes les sources.

## Critères de validation

- [x] La scène du hero reste intéressante à 00:00.
- [x] Les quatre groupes de la colonne gauche se distinguent sans bordure.
- [x] Chaque chapitre est identifiable au premier coup d'œil.
- [x] Aucune carte n'a été ajoutée.
- [x] Jour et nuit conçus ensemble.
- [ ] La page reste longue : 11 708 px à 390 px, contre 10 398 avant. Le
      corps est passé de 14 à 16 px et les titres ont grandi — c'était la
      demande explicite du brief. Le coût est assumé et documenté.
