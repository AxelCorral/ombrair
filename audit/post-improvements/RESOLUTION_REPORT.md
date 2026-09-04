# Rapport de résolution — passe d'amélioration post-audit

L'audit initial (`audit/`, commit `89d548f`) est **conservé tel quel**. Ce
document dit ce qu'est devenu chacun de ses 24 findings, plus les six
problèmes remontés par la seconde revue et ceux découverts en chemin.

| | |
|---|---|
| Point de départ | `89d548f` — audit d'observation |
| Commits de la passe | `5d46f38` · `dc8e115` · `d3b62da` · `5b66905` · `0f41d70` |
| Contrôles finaux | lint propre · 87 tests / 26 suites · build 36 pages · 572 vérifications responsive sans débordement · 0 erreur console |

**Bilan** : 17 résolus · 3 partiellement résolus · 1 non traité · 3 rejetés.

---

## Résolus

### UX-001 — `/simulateur` en 404 · RESOLVED
La page existe. Le brief la spécifiait (ligne 113) avec quatre sorties ;
deux sont produites, deux sont refusées et l'interface dit pourquoi — voir
« Décisions de refus » plus bas. Logique en fonctions pures,
`lib/simulateur.ts`, 17 tests.

### CONTENT-001 — la FAQ promettait ce simulateur · RESOLVED
La réponse est réécrite et devient exacte : elle décrit ce que le
simulateur fait réellement (produit adapté + montant de départ) et rappelle
que le montant exact demande une visite.

### RESP-001 — débordement de 18 px à 768 px · RESOLVED
Le header bascule à `lg:` (1024 px) au lieu de `md:` (768 px). Vérifié sur
**26 routes × 11 largeurs × 2 thèmes = 572 combinaisons** : aucun
débordement, aucun statut non-200, aucune erreur console.

### A11Y-001 / A11Y-002 — contrastes Ambre et Fraîche · RESOLVED
Résolu **sans toucher à la charte**, par séparation des rôles :

| Rôle | Couleurs |
|---|---|
| Signal — pastilles, icônes, bordures, courbes | Fraîche `#2e8c8c`, Ambre `#c4862f`, inchangées |
| Texte — chiffres et libellés | variantes dérivées par thème |

Clair : `#1f6f6f` (5,22) et `#8b5e1f` (5,00). Nuit : `#5fc9c9` (8,66) et
`#e2a44f` (7,82). Mesuré au pixel sur le rendu : les températures passent
de 2,74–4,25 à **5,00–8,66**. La couleur n'est jamais seule à porter
l'information — le libellé « extérieur » / « intérieur » dit la même chose.

### A11Y-003 — bandeau d'alerte · RESOLVED
Un token `--alerte-texte` accompagne Braise. Au passage, un défaut **plus
grave que celui signalé** : Braise sur la carte du thème nuit était à
**2,48**, en dessous même du seuil des éléments non textuels. Corrigé.

### UI-001 — pages produit sans visuel · RESOLVED
Hero produit en deux colonnes : rôle, titre, promesse, prix, CTA à gauche ;
visuel cadré en arche à droite. Sur mobile, le visuel arrive juste après le
titre. Les illustrations existaient déjà.

### UX-002 / UX-004 — Ombrair Link · RESOLVED
Un nom unique partout — « passerelle » ne subsiste que dans la phrase qui
définit Ombrair Link. Un bloc d'explication sur la page où on l'achète,
plutôt qu'une page technique que personne n'irait lire : trois rôles
(écoute, décide, commande), la chaîne complète, et la précision qui compte
pour qui a déjà une box — ce n'est pas un boîtier de plus.

### UI-002 — prix répétés · RESOLVED
Le prix n'apparaît plus qu'une fois en tête de page produit. Les montants
suivants sont des tarifs **différents** dans un contexte propre : options
d'installation, pack, accessoires à l'unité.

### UI-003 — section « Compatibilité » quasi vide · RESOLVED
Fusionnée avec « Dimensions » sur Volet et Fenêtre : la contrainte
dimensionnelle et la contrainte technique répondent à la même question,
« est-ce que ça va chez moi ? ». Le Capteur, qui a un vrai contenu de
compatibilité, garde sa section autonome.

### UI-004 — page Ressources plate · RESOLVED
Temps de lecture **calculé** à partir du texte, source principale (déjà
présente dans les données), premier article mis en avant.

### UI-007 — sélecteur pré-coché · RESOLVED
« Format retenu » devient « Format sélectionné ». Le défaut par défaut est
conservé : il évite un état vide sans valeur ajoutée.

### A11Y-004 — H2 dans le pied de page · RESOLVED
Chaque colonne devient un `<nav>` nommé par un `<p>` via `aria-labelledby`.
Plan de titres vérifié : un H1, des H2 de section, des H3 de sous-section,
plus aucun H2 de navigation.

### CONTENT-002 — terminologie flottante · RESOLVED
« Produit » partout dans les textes. « Gamme » ne subsiste que dans les URL
et les identifiants internes — voir UX-003.

### TECH-001 — boucle d'animation permanente · RESOLVED
La boucle se suspend hors du champ de vision (`IntersectionObserver`) et
quand l'onglet passe en arrière-plan, puis reprend où elle en était plutôt
que de sauter en arrière. Vérifié au navigateur : l'horloge se fige au
défilement (15:39 → 15:39) et repart au retour.

### TECH-002 — visuels produit non factorisés · RESOLVED
`VISUEL_PRODUIT`, indexé sur `GammeId`. Ajouter un produit sans son visuel
devient une erreur de typage.

---

## Problèmes de la seconde revue

### COMMERCIAL-001 — « Capteur » vendu comme un capteur · RESOLVED
« Capteur Ombrair — 349 € » se lisait « un capteur coûte 349 € ». Le
produit devient **Kit Capteur Ombrair**, et un champ `resume` dit sous
chaque prix ce que le montant couvre : capteurs intérieurs et extérieur +
Ombrair Link + pilotage des volets motorisés existants. La catégorie
commerciale reste « Capteur ».

### COMMERCIAL-002 — prix Fenêtre ambigu · RESOLVED
Les 1 590 € couvrent la fenêtre **et** le volet. `prixBase` de la fenêtre
passe à `null` — fenêtre seule sur devis — et le tarif de l'ensemble vit
dans un champ distinct, `prixEnsemble`, avec son intitulé propre. Aucun
montant créé ni supprimé : seul l'étiquetage change. Deux tests empêchent
ces 1 590 € de retourner dans `prixBase`.

### UI-NEW-001 — hero initial peu démonstratif · RESOLVED
La simulation démarre à 09:30 au lieu de 00:00.

**Le premier essai était faux.** 14:00 semblait évident — heure la plus
chaude, écart maximal — mais à cette heure-là la logique ferme le volet
complètement : le cadre ne montrait plus qu'un tablier opaque. Pire que la
nuit. S'y ajoute une contrainte de géométrie qu'on avait perdue de vue : un
volet roulant s'enroule en haut, donc il dégage **par le bas** ; un soleil
haut n'est visible que tant que le tablier est peu descendu.

À 09:30, les cinq éléments coexistent : soleil filtré par les lames, écart
installé (27,6 / 23,8 °C), tablier engagé, lames à 36°, fermeture en cours.
Cinq assertions verrouillent ces conditions, dont celle qui compare la
hauteur du soleil au taux de levée.

### APP-NEW-001 — Pièces orienté inventaire technique · RESOLVED
L'écran ouvrait sur la liste des capteurs. L'ordre suit maintenant la façon
dont on se représente son logement : ce qui demande une action, puis les
pièces et leurs ouvrants, puis les capteurs, repliés. Divulgation
progressive sur les cartes : l'essentiel visible, le diagnostic derrière
« Détails ». Rien n'est supprimé.

### APP-NEW-002 — anomalies peu visibles · RESOLVED
Un bloc « n équipements à vérifier » ouvre l'écran. Les anomalies sont
**dérivées** des données : aucune panne ajoutée, et si le scénario n'a rien
à signaler, le bloc n'existe pas. Un test compte les défauts des données et
vérifie qu'il y en a exactement autant dans la liste.

### CONTENT-NEW-001 — témoignages fictifs · RESOLVED
Ils étaient correctement étiquetés « persona fictif », donc pas trompeurs ;
mais citation, prénom et ville reproduisaient la mécanique de l'avis
client. Aucun client n'existant, la section devient « Trois situations où
Ombrair change quelque chose ». Les scénarios sont conservés, le costume
abandonné.

---

## Découvert pendant la passe

### MUTED-001 — `--muted-foreground` à 2,8:1 · RESOLVED
**L'audit avait entièrement manqué ce défaut, plus étendu qu'aucun des 24
findings.** En mesurant les contrastes au pixel plutôt qu'en lisant les
valeurs calculées, le token qui porte la quasi-totalité du texte secondaire
du site — chapôs, légendes, aides de formulaire, blocs d'hypothèses —
ressort à **2,8:1** sur Chaux.

Le mélange passe de 65 % à 90 % de Persienne (4,7:1), et de 55 % à 65 % de
Chaux en thème nuit, où il échouait sur les cartes (4,0) tout en passant
sur le fond (5,4). Liens de navigation et corps du bandeau d'alerte passent
en `foreground` plein.

### BATTERIE-001 — seuils divergents · RESOLVED
Le seuil de batterie faible valait 15 % pour les ouvrants et 35 % pour les
capteurs, en dur dans deux composants. Un même niveau de charge était donc
« faible » sur un écran et normal sur l'autre. Les deux valeurs sont
conservées mais nommées — FAIBLE (alerte) et À SURVEILLER (vigilance) — et
seule la première alimente les anomalies.

### FAQ-001 — incohérence sur le fonctionnement hors ligne · RESOLVED
La FAQ affirmait que le pilotage automatique exigeait une connexion.
Puisqu'Ombrair Link décide en local, c'est faux : mesure et automatisme
continuent hors ligne, seule la consultation à distance s'arrête.

---

## Partiellement résolus

### BRAND-001 — l'arche · PARTIALLY RESOLVED
L'arche passe de trois cartes de l'accueil aux **trois pages produit**, via
un composant `ArcheProduit` documenté : elle cadre un produit, comme une
ouverture de menuiserie. Elle reste absente du hero et de l'application.

C'est délibéré. La consigne était explicite — « ne répète pas des arches
partout simplement parce que l'arche est le symbole de marque » — et le
vrai levier de tangibilité est la matérialité produit, pas la répétition
d'un motif. Le hero est déjà une fenêtre ; y ajouter une arche ferait un
cadre dans un cadre.

### UI-005 — longueur de l'accueil · PARTIALLY RESOLVED
Aucune barre de progression ni sommaire n'a été ajouté : la consigne
l'interdisait, et l'audit lui-même recommandait de ne pas trancher sans
donnée. Le travail a porté sur le rythme et la densité — hiérarchie du
hero, cartes produit avec résumé, section cas d'usage plus dense. La
longueur reste comparable.

⚠️ **Aucune donnée analytique n'existe** : on ne sait toujours pas où les
visiteurs s'arrêtent.

### APP-002 — vide vertical de l'appairage · PARTIALLY RESOLVED
Aucune illustration ajoutée. La consigne était de n'en ajouter une que si
elle apportait vraiment quelque chose ; ce n'était pas le cas. L'écran
bénéficie des corrections de contraste, rien de plus.

---

## Non traité

### UX-003 — l'URL `/gammes` ne correspond plus à « Produits » · NOT ADDRESSED
Sur consigne explicite : « ne dépense pas du temps maintenant à renommer
`/gammes` en `/produits` ». Changer une URL a un coût — liens, redirections,
sitemap — sans gain visible pour l'utilisateur. Les **libellés** ont été
harmonisés ; seule l'URL reste. À reprendre si le site est publié.

---

## Rejetés

### A11Y-005 — deux boutons de thème homonymes · REJECTED
**Mesuré, pas supposé.** Le DOM contient bien deux bascules, mais
l'inspection de l'arbre d'accessibilité en donne **une seule** à 390 px
comme à 1440 px : `display:none` retire l'élément caché. Il n'y a donc pas
de doublon pour une technologie d'assistance, et le finding tombe.

### APP-001 — écran Notifications moins dense · REJECTED
La faible densité n'est pas un défaut en soi. Ajouter du contenu pour
remplir l'écran aurait fabriqué des notifications qui n'existent pas dans
le scénario. Seul le contraste de l'icône d'alerte a été corrigé.

### BRAND-002 — le logo est une reconstruction · REJECTED
Aucun SVG officiel plus fiable n'existe. La géométrie est relevée sur la
planche et centralisée dans un composant unique : le jour où le fichier
d'origine arrive, il remplace cette géométrie sans toucher au reste. Déjà
documenté comme limite connue dans `docs/brand.md`.

---

## Décisions de refus

Deux chiffres que le brief demandait n'ont **pas** été produits, et
l'interface l'annonce plutôt que de le taire.

**Le gain de confort en °C** supposerait un modèle thermique du bâtiment —
inertie, surface vitrée, facteur solaire, renouvellement d'air — que le
projet n'a pas. Afficher « −4,2 °C » donnerait à une invention l'apparence
d'une mesure.

**L'économie de climatisation en euros** supposerait en plus un équipement,
un usage et un prix du kWh.

Ce que le simulateur fait honnêtement, il le fait : le produit adapté,
selon une règle explicite, et un montant de départ obtenu en multipliant
les tarifs publiés — qui sont donnés « par ouvrant posé », donc les
multiplier n'invente rien. Aucun barème au cm² n'a été fabriqué.

Un test vérifie que ces deux chiffres restent absents et que leur absence
reste expliquée.

---

## Ce qui n'a pas été vérifié

- **Aucune donnée analytique** — pas de trafic, pas de conversion, pas de
  test utilisateur. Les jugements UX restent des interprétations d'expert.
- **Aucune mesure de performance** — pas de Lighthouse, pas de Core Web
  Vitals, pas de profil CPU. La correction de TECH-001 est vérifiée par
  comportement observé, pas par gain chiffré.
- **Aucun test avec lecteur d'écran** (NVDA, VoiceOver). Les constats
  portent sur le DOM, l'arbre d'accessibilité exposé et des mesures de
  pixels.
- **Un seul navigateur** — Chromium headless. Safari et Firefox non testés.

## Note de méthode

Deux fois pendant cette passe, le script qui lit les couleurs *calculées*
s'est trompé : alpha non composé, puis `oklch()` non résolu. Il a produit
des ratios de 1,00 et 1,63 sur des textes parfaitement lisibles. Seul
l'échantillonnage des **pixels réellement rendus** donne des valeurs
fiables — c'est déjà ce qui avait disqualifié un faux positif pendant
l'audit initial. Tous les ratios de ce rapport viennent de cette méthode.
