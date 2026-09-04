# Direction — Catalogue et pages produit

## Problème visuel

**`/gammes`** reprenait le gabarit d'une grille de tarifs : trois colonnes
de hauteurs inégales, coiffées de bandes horizontales qui ressemblaient à
des chargements en attente, et aucune illustration — alors que les trois
visuels produit existaient déjà et servaient l'accueil. Le tableau
comparatif avait la forme exacte d'une grille d'abonnements.

**Les pages produit** étaient une colonne unique de titres et de
paragraphes de même poids. Le premier écran occupait la moitié gauche et
laissait l'autre moitié vide. « Ce qui est fourni » était une liste à
tirets, les options d'installation trois rectangles presque identiques, le
sélecteur de dimensions un formulaire administratif, et « Dans
l'application » une liste qui ne montrait jamais l'application.

## Parti pris

**Le catalogue est une planche, pas un comparateur.** Une entrée par
produit sur toute la mesure, ouverture en arche d'un côté, fiche de
l'autre, le côté s'inversant à chaque entrée. Le regard descend en zigzag
au lieu de balayer trois colonnes. L'accueil garde sa vitrine en trois
cartes : les deux pages ne se répètent plus, et chacune fait ce qu'elle
sait faire.

**On compare des fonctions, pas des prix.** Capteur, Volet et Fenêtre ne
sont pas trois formules concurrentes — ce sont trois pièces d'un même
système, dont deux se posent volontiers ensemble. La matrice porte
exactement les mêmes faits que le tableau précédent, réorganisés par
fonction. Repère plein / repère vide, jamais la couleur seule, et chaque
cellule porte son état en toutes lettres pour les technologies
d'assistance.

**Le produit se voit avant de se lire.** Hero tenu sur 32 rem de hauteur,
ouverture agrandie à 30 rem, légende de planche reprenant `accroche` — un
champ de `lib/tarifs.ts` qui n'était plus affiché nulle part. Sur mobile, le
visuel remonte juste après le titre.

**Trois blocs de texte deviennent trois représentations.** Nomenclature
numérotée (c'est une liste de pièces d'un même ensemble : la numérotation
renvoie à des articles, pas à des étapes inventées), rail d'installation à
trois degrés d'intervention, silhouettes de format à l'échelle relative,
extrait d'écran applicatif alimenté par les vraies données de `lib/mock`.

## Ce qui n'a pas été touché

Les produits, les prix, les mentions de fabrication, l'ordre des sections,
le vérificateur de compatibilité, et la logique du sélecteur de dimensions
— les `<input type="radio">` restent en place sous les silhouettes, avec
leur anneau de focus reporté sur la case.

## Deux erreurs corrigées en cours de route

**L'inversion par `order`.** L'arche changeait bien de colonne mais héritait
de la largeur de sa nouvelle colonne : elle passait de 24 rem à toute la
place restante, et les trois entrées perdaient la même échelle. Corrigé par
placement explicite.

**Les silhouettes couchées.** Dimensionnées en pourcentage d'une case bien
plus large que haute, tous les formats s'affichaient en paysage — une
petite fenêtre de 60 × 75 cm, qui est un portrait, apparaissait couchée.
Une silhouette fausse est pire que pas de silhouette. La largeur se déduit
maintenant du rapport réel du format.

## Critères de validation

- [x] En arrivant sur `/gammes`, on voit CAPTEUR, VOLET, FENÊTRE avec leurs
      vraies illustrations.
- [x] Aucune bande horizontale ne ressemble à un chargement en attente.
- [x] Sur la page Capteur on voit le capteur ; sur Volet, un volet ; sur
      Fenêtre, une fenêtre.
- [x] Le prix n'apparaît qu'une fois en tête.
- [x] Les silhouettes de format sont proportionnellement justes.
- [x] La comparaison ne ressemble plus à un tableau d'abonnements.
