# Audit visuel — UI

Observation des 32 captures de `audit/screenshots/`, thèmes jour et nuit,
viewports 360 / 768 / 1440 / 1920 px.

---

## Ce qui fonctionne

**Le rythme vertical.** Les sections alternent fond `--background` et
`--card` sans jamais empiler deux surfaces identiques. La lecture ne se
perd pas, même sur une page longue.

**L'espace négatif.** Marges généreuses, largeur de ligne contenue, très
peu de zones saturées. Le site respire — qualité rare sur un site produit,
où la tentation est de tout montrer.

**La discipline des ombres.** Presque aucune ombre portée ; le relief vient
des bordures fines et du contraste de surface. C'est cohérent avec la
charte (« le design existe par la géométrie, la proportion et l'espace ») et
tenu partout.

**La hiérarchie typographique.** Outfit pour les titres, Instrument Sans
pour le corps, IBM Plex Mono strictement réservé aux données chiffrées —
températures, heures, dimensions, prix. Aucun paragraphe en mono relevé.

**Le hero.** Le point haut du site. Ciel qui traverse ses phases, soleil et
lune, volet dont on distingue la levée du tablier et le pivot des lames, et
la reprise en main dès le premier geste. `home-desktop-jour` et
`home-desktop-nuit` montrent deux ambiances réellement différentes, pas une
simple inversion de couleurs.

**La vitrine des trois produits.** `product-showcase-card.tsx` : même
famille graphique, compositions distinctes, cadrage en arche commun. On
identifie capteur, volet et fenêtre sans lire une ligne.

---

## Ce qui décroche

### Les pages produit ne montrent pas le produit *(UI-001, élevé)*

`produit-capteur-desktop-jour`, `produit-volet-desktop-jour`,
`produit-fenetre-desktop-jour` : trois pages de texte, tableaux et cartes
de prix. Aucun visuel du produit décrit.

Ce n'est pas un manque d'assets — `components/product-visuals/` contient
`sensor-visual`, `shutter-visual` et `window-visual`, déjà utilisés dans la
vitrine de l'accueil. L'écart est un écart de mise en page, pas de matière
disponible.

L'effet est net à la comparaison : l'accueil vend, la page produit
documente. C'est l'inverse de ce qu'on attend au moment où l'achat se joue.

### Un prix répété jusqu'à quatre fois *(UI-002, moyen)*

Sur `/gammes/volet` et `/gammes/fenetre`, un même montant apparaît dans
l'accroche, dans la carte de prix, dans le sélecteur de dimensions et dans
l'appel à l'action final. L'insistance se lit comme de la pression
commerciale et brouille la lecture du tableau tarifaire.

### Section « Compatibilité » quasi vide *(UI-003, faible)*

Sur Volet et Fenêtre, la section existe, porte un titre, et contient une à
deux lignes. Le titre promet plus que le contenu ne livre. Sur Capteur, la
même section est nourrie.

### La page Ressources est plate *(UI-004, moyen)*

`ressources-desktop-jour` : quatre cartes d'article de traitement identique,
sans image, sans hiérarchie, sans mise en avant. Rien ne distingue l'article
le plus utile du dernier de la liste. Aucun repère de lecture — durée,
catégorie, date.

### La page d'accueil est très longue *(UI-005, moyen, confiance moyenne)*

**9 851 px mesurés à 360 px de large.** Aucun indicateur de progression,
aucune ancre, aucun retour en haut. La vitrine produits n'apparaît qu'en
quatrième position.

> Jugement d'expert, pas mesure. **Aucune donnée analytique n'est
> disponible** : je ne sais pas où les visiteurs s'arrêtent. La longueur est
> un fait, son coût est une hypothèse — d'où la confiance moyenne et
> l'effort L.

### Le sélecteur de dimensions est pré-coché *(UI-007, moyen)*

`selecteur-dimensions.tsx` arrive avec le premier format sélectionné. Le
prix affiché ressemble donc à *le* prix, alors que c'est celui d'un format
parmi d'autres. Un état non sélectionné inviterait au choix au lieu de le
suggérer.

---

## Thème nuit

Vérifié sur cinq paires jour/nuit (`home`, `gammes`, `produit-volet`,
`devis`, `app-accueil`, `app-pieces`).

Le thème nuit n'est pas une inversion : les surfaces sont retravaillées, les
bordures ajustées, le hero change réellement d'ambiance. Aucune zone de
texte illisible relevée, aucune couleur restée en dur — ce qui est cohérent
avec l'absence totale de hex dans les composants.

Un seul défaut de thème dans tout le dossier concerne l'app *(A11Y-003)*, et
il touche un composant unique.

---

## Findings de ce domaine

UI-001 · UI-002 · UI-003 · UI-004 · UI-005 · UI-007 — détail complet dans
`findings.json`.

> Note de numérotation : les identifiants UI sautent de 005 à 007. Le
> numéro UI-006 n'est attribué à aucun finding retenu ; la série n'est pas
> continue et le compte total reste de 24.
