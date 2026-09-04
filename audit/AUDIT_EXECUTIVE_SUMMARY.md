# Synthèse exécutive

**Audit** : 25 août 2026 · branche `master` · commit `dc757ab` · dépôt propre
**Nature** : observation et documentation uniquement. Aucune modification du site.

---

## État global

Le site est **techniquement sain et visuellement abouti sur ses points hauts**,
mais il souffre d'un défaut grave et évitable — un lien du menu principal
mène à une page 404 — et d'un déséquilibre : la page d'accueil est très
soignée, les pages produit sont restées austères.

Chiffres de contrôle : lint entièrement propre, 54 tests au vert, build
réussi, 35 routes générées, **aucune erreur console sur les 32 captures**,
aucun débordement horizontal sauf à 768 px, aucune couleur en dur dans les
composants.

**24 findings** : 1 critique, 5 élevés, 9 moyens, 9 faibles.

---

## 5 principales forces

1. **Le hero est un vrai différenciateur.** Une journée de 24 h défile en
   48 s : ciel qui change de phase, soleil et lune qui traversent le cadre,
   volet à deux degrés de liberté réellement distincts (levée du tablier et
   pivot des lames). L'utilisateur reprend la main au premier geste. Peu de
   sites de cette catégorie proposent une démonstration aussi lisible.

2. **La cohérence des données de l'application est exemplaire.** Vérifiée
   écran par écran : la température du séjour, le capteur extérieur, les
   événements de 07:30 et 08:05, le capteur hors ligne à 14:02, la batterie
   à 12 % — tout concorde entre accueil, pièces, historique et notifications.
   C'est rare et c'est à préserver absolument.

3. **L'honnêteté du discours est tenue de bout en bout.** La distinction
   entre ce qu'Ombrair fabrique (les capteurs) et ce qu'elle revend (volets,
   fenêtres) est explicite sur chaque page produit. Les estimations affichent
   leurs hypothèses. Le devis annonce qu'aucun montant n'est calculé plutôt
   que d'inventer un total. Les chiffres du problème sont réellement sourcés.

4. **Le système de tokens est propre.** Palette et typographies alignées sur
   la charte, alias sémantiques, thème jour/nuit fonctionnel et partagé
   entre le site et l'application, zéro couleur en dur dans les composants.

5. **Les trois illustrations produit de l'accueil** forment une véritable
   collection : même famille graphique, compositions différenciées, cadrage
   commun en arche. On distingue capteur, volet et fenêtre sans lire un mot.

---

## 10 principales faiblesses

1. **`/simulateur` renvoie 404** alors qu'il figure dans le menu principal et
   le pied de page de toutes les pages *(UX-001, critique)*.
2. **La FAQ promet ce simulateur** sur la question du prix *(CONTENT-001)*.
3. **Ambre sur Chaux : contraste 2,74**, sous le seuil AA y compris en grand
   texte, sur les relevés de température *(A11Y-001)*.
4. **Débordement horizontal de 18 px à 768 px** — le header bascule en
   disposition desktop avant que le contenu ne rentre *(RESP-001)*.
5. **Les pages produit ne montrent aucun produit** : trois pages de texte,
   alors que les illustrations existent déjà *(UI-001)*.
6. **Ombrair Link n'est jamais expliqué** et coexiste avec « passerelle »
   sans que le lien soit fait *(UX-002)*.
7. **Fraîche sous le seuil AA** sur les deux fonds *(A11Y-002)*.
8. **L'arche n'apparaît que dans trois cartes** de l'accueil : la signature
   de marque n'irrigue ni le hero, ni les pages produit, ni l'app *(BRAND-001)*.
9. **Page d'accueil de 9 851 px en mobile**, sans repère de progression, la
   vitrine produits n'arrivant qu'en quatrième position *(UI-005)*.
10. **Prix répétés jusqu'à quatre fois** sur une même page produit *(UI-002)*.

---

## Impression générale par domaine

### UI
Bonne maîtrise de la densité, de l'espace négatif et du rythme typographique.
Le problème n'est pas la qualité mais **l'inégalité** : la vitrine de
l'accueil est au niveau attendu, les pages produit et Ressources sont
restées à l'état de gabarits textuels. L'écart se voit exactement au moment
où l'acheteur veut regarder le produit.

### UX
Les parcours fonctionnent, sauf deux : « comprendre Ombrair Link » est un
échec, et n'importe quel parcours passant par « Simulateur » se termine sur
une 404. Le vérificateur de compatibilité, en revanche, résout très bien le
cas le plus fréquent (« j'ai déjà des volets électriques »).

### Responsive
Solide de 360 à 1920 px, **à l'exception d'un point unique** : 768 px, une
largeur courante de tablette. Le défaut est isolé, mesuré et de correction
triviale.

### Marque
Palette, typographie et logo sont conformes à la charte retenue. Mais si
l'on masque le logo, **le site pourrait encore appartenir à une autre
marque** : ce qui le rendrait spécifiquement Ombrair — l'arche, les lames,
la lumière filtrée — n'est présent que sur une fraction d'une seule page.

### Accessibilité
Base saine : focus visible, clavier complet, labels et noms accessibles
présents partout, `prefers-reduced-motion` respecté. **Tous les problèmes
confirmés sont des contrastes**, et ils découlent d'une règle de marque
volontaire : Fraîche et Ambre doivent porter l'information thermique. Les
valeurs de la charte sont belles mais insuffisantes pour du petit texte.

---

## Recommandation générale

Trois chantiers, dans cet ordre :

1. **Réparer ce qui est cassé** — la 404 du simulateur, la promesse de la FAQ
   et le débordement à 768 px. Trois corrections courtes, fort effet sur la
   crédibilité.
2. **Résoudre le conflit marque / accessibilité** sur Fraîche et Ambre en
   dissociant le *signal chromatique* de la *valeur chiffrée*, plutôt qu'en
   modifiant les couleurs de la charte.
3. **Rééquilibrer les pages produit** : y amener les visuels qui existent
   déjà et le cadrage en arche, pour que le niveau de la vitrine d'accueil
   se prolonge jusqu'à la page où l'achat se décide.

⚠️ **Aucune donnée analytique n'est disponible** — pas de trafic, pas de
conversion, pas de test utilisateur. Les jugements UX de ce dossier sont des
interprétations d'expert, explicitement distinguées des observations
vérifiables dans chaque finding.
