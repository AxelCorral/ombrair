# Prompt Claude Code — Refonte UI complète Ombrair

Tu dois maintenant réaliser une **PASSE DE DIRECTION ARTISTIQUE ET DE REFONTE UI très poussée** sur le projet Ombrair existant.

IMPORTANT :

Cette mission est principalement une mission de :

**UI DESIGN  
+ DIRECTION ARTISTIQUE  
+ DESIGN SYSTEM  
+ COMPOSITION  
+ ILLUSTRATION PRODUIT  
+ POLISH VISUEL**

Ce n’est **PAS** une nouvelle refonte UX générale.

Ne change pas arbitrairement :

- le modèle commercial ;
- les produits ;
- les tarifs ;
- la logique métier ;
- les données mock ;
- les routes ;
- les parcours ;
- la structure fonctionnelle de l’application.

Sauf correction indispensable pour supporter une amélioration visuelle, la priorité est exclusivement :

> **RENDRE OMBRAIR BEAUCOUP PLUS BEAU, PLUS PREMIUM, PLUS MÉMORABLE ET PLUS COHÉRENT VISUELLEMENT, SANS PERDRE SA SOBRIÉTÉ.**

---

# 0A. BOOTSTRAP CLAUDE CODE — CAPACITÉS UI/DESIGN

Avant toute modification du dépôt, vérifie les capacités Claude Code disponibles.

Inspecte notamment :

- les plugins Claude Code installés ;
- les skills utilisateur dans `~/.claude/skills/` ;
- les skills projet dans `.claude/skills/` ;
- les outils navigateur / Playwright / Chrome DevTools déjà disponibles ;
- les instructions `CLAUDE.md` du projet.

Ne suppose pas qu'un plugin ou une skill est installé : vérifie.

## Plugin prioritaire : Frontend Design

Pour cette mission, utilise en priorité le plugin / skill officiel **Frontend Design** d’Anthropic s’il est disponible.

Il est spécifiquement destiné à produire des interfaces frontend distinctives et production-grade, en évitant les esthétiques génériques générées par IA.

### Si déjà installé

Utilise-le pendant toutes les phases de direction artistique et d’implémentation frontend.

Il peut s’activer automatiquement sur les tâches frontend ; même dans ce cas, garde explicitement ses principes en tête :

- direction esthétique intentionnelle ;
- composition spatiale ;
- typographie ;
- hiérarchie ;
- motion contextuelle ;
- éviter les patterns génériques.

### Si absent

Essaie d’abord l’installation **depuis le marketplace officiel Anthropic**, à portée projet si la version de Claude Code installée le permet.

Commande CLI actuellement utilisée par les versions récentes de Claude Code :

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install frontend-design@claude-plugins-official --scope project
```

Si cette syntaxe n’est pas supportée par la version locale :

1. n’invente PAS une autre commande ;
2. ouvre/utilise le gestionnaire `/plugin` de Claude Code ;
3. recherche **Frontend Design** ;
4. sélectionne uniquement la version **Anthropic Verified** / officielle ;
5. installe-la pour le projet.

Si l’installation nécessite un redémarrage de Claude Code pour être réellement active :

- termine uniquement la phase de bootstrap ;
- indique clairement qu’un redémarrage est nécessaire ;
- ne commence PAS la refonte avant que la skill soit active.

Ne remplace pas la version officielle par une copie communautaire portant le même nom.

---

# 0B. OUTIL NAVIGATEUR / VISUAL QA

Cette mission ne peut pas être faite correctement uniquement depuis JSX/CSS.

Claude doit pouvoir :

- ouvrir le site réel ;
- changer de viewport ;
- changer de thème ;
- cliquer ;
- prendre des screenshots ;
- inspecter le rendu ;
- comparer avant/après.

Le projet a déjà utilisé un environnement Playwright externe / scratchpad dans les travaux précédents.

### Priorité

1. réutiliser l’outil navigateur déjà opérationnel ;
2. ne PAS ajouter Playwright comme dépendance npm du projet simplement pour l’audit visuel ;
3. si aucun navigateur pilotable n’est disponible, utiliser un plugin Claude Code vérifié tel que **Playwright** ou **Chrome DevTools** depuis le répertoire de plugins officiel.

Ne pas installer plusieurs outils navigateur redondants.

Un seul outil fiable suffit.

La boucle obligatoire sera :

> **IMPLEMENT → RENDER → SCREENSHOT → CRITIQUE → CORRECT → RENDER AGAIN**

Aucune page majeure n’est considérée terminée tant que cette boucle n’a pas été effectuée.

---

# 0C. CRÉER UNE SKILL PROJET SPÉCIFIQUE À OMBRAIR

En plus de la skill Frontend Design générique, créer une skill locale spécifique à ce projet afin d’éviter que la direction artistique dérive au fil d’une longue session.

Créer :

```text
.claude/skills/ombrair-ui-art-direction/SKILL.md
```

Cette skill doit être concise et dérivée EXCLUSIVEMENT :

- de `Ombrair - Identité concept 07-selection.png` ;
- de `audit/AUDIT_CONTEXT_FOR_EXTERNAL_REVIEW.md` ;
- des règles de marque présentes dans ce prompt ;
- du design system réel du dépôt.

Elle doit rappeler en particulier :

## Positionnement esthétique

- architecture méditerranéenne ;
- menuiserie contemporaine ;
- hardware ;
- lumière filtrée ;
- ombre ;
- air ;
- précision technique ;
- calme ;
- produit physique premium.

## Palette

- Persienne ;
- Nuit ;
- Chaux ;
- Fraîche uniquement thermique ;
- Ambre uniquement thermique ;
- Braise uniquement alerte.

## Typographies

- Outfit ;
- Instrument Sans ;
- IBM Plex Mono pour les données.

## Interdits

- SaaS générique ;
- purple gradient ;
- glassmorphism ;
- pill radius ;
- grosse ombre marketing ;
- cartes partout ;
- blobs 3D ;
- faux visuels stock ;
- arches répétées comme décoration ;
- couleurs Fraîche/Ambre décoratives.

## Signature

- arche comme ouverture/cadre ;
- lames lorsqu’elles ont un sens architectural ;
- lumière et ombre comme matière graphique ;
- produit réel visible.

Après création :

- relis explicitement cette skill au début de chaque grande phase ;
- considère-la comme une contrainte de projet supérieure aux goûts génériques d’une skill externe.

Si Claude Code ne recharge pas automatiquement une skill créée pendant la session, lis directement son `SKILL.md` avant chaque phase : ne bloque pas le travail pour cette raison.

---

# 0D. SKILLS UI COMPLÉMENTAIRES — OPTIONNELLES ET CONTRÔLÉES

N’installe PAS dix skills de design concurrentes.

Le problème n’est pas de maximiser le nombre de prompts chargés : le problème est d’obtenir une direction cohérente.

Si le projet possède déjà un pack de skills frontend/UI fiable, tu peux utiliser des skills méthodologiques de ce type :

- redesign d’un projet existant ;
- layout / spatial composition ;
- typesetting ;
- responsive adaptation ;
- critique ;
- polish.

Si tu choisis d’installer un pack communautaire supplémentaire :

1. inspecte d’abord sa source et sa licence ;
2. n’installe que des skills constituées de Markdown/instructions ou du code que tu as inspecté ;
3. privilégie une installation **project-scoped** dans `.claude/skills/` ;
4. ne laisse jamais une skill tierce écraser les règles de marque Ombrair.

Une option communautaire connue est le dépôt `tyfarrago-hub/taste`, qui fournit notamment des skills orientées :

- `redesign-existing-projects`
- `layout`
- `typeset`
- `adapt`
- `critique`
- `polish`

Si et seulement si tu décides de l’utiliser, ne charge que ces disciplines méthodologiques.

Évite pour Ombrair les skills volontairement démonstratives ou incompatibles avec la charte, par exemple :

- overdrive ;
- cosmic glass ;
- colorize sans contrainte ;
- effets maximalistes ;
- génération de palettes alternatives.

L’identité Ombrair est déjà définie : **aucune skill externe n’a le droit de réinventer la palette, le logo ou le ton visuel**.

Une séquence utile, si ces skills sont disponibles, est :

1. `redesign-existing-projects` — comprendre ce qu’il faut préserver ;
2. `layout` — composition et rythme ;
3. `typeset` — hiérarchie typographique ;
4. implémentation ;
5. `adapt` — responsive ;
6. `critique` — jugement visuel séparé ;
7. `polish` — finition.

Ne les exécute pas toutes simultanément.

---

# 0E. MODE DE TRAVAIL DE DESIGN

Pour chaque page majeure, sépare mentalement quatre rôles.

## 1 — Art director

Décide :

- composition ;
- rythme ;
- masse ;
- relation texte/visuel ;
- matérialité ;
- identité.

## 2 — UI designer

Décide :

- type scale ;
- spacing ;
- surfaces ;
- controls ;
- états ;
- responsive.

## 3 — Frontend engineer

Implémente :

- composants ;
- CSS ;
- tokens ;
- interactions ;
- performances ;
- accessibilité.

## 4 — Reviewer

Regarde uniquement le rendu final et cherche :

- générique ;
- trop de cards ;
- microtexte ;
- vides accidentels ;
- manque de hiérarchie ;
- ruptures de marque ;
- asymétries involontaires ;
- responsive maladroit.

Ne mélange pas immédiatement implémentation et validation.

Après chaque phase importante, fais une vraie passe de reviewer.

---

# 0F. RÈGLE ANTI « AI SLOP »

À chaque fois qu’une solution ressemble à un pattern évident généré par IA, reconsidère-la.

Signaux typiques :

- trois cartes égales avec icône + titre + texte ;
- bento grid inutile ;
- gros gradient ;
- glow ;
- grande headline centrée + sous-titre + deux boutons ;
- icône Lucide dans un cercle coloré pour chaque feature ;
- pill badges partout ;
- faux glassmorphism ;
- énorme section témoignages générique ;
- animations gratuites ;
- tout encapsuler dans des cards.

Ombrair peut utiliser une grille, des cards et des icônes lorsqu’elles sont réellement pertinentes.

Mais la marque doit reposer davantage sur :

> **ARCHITECTURE + PRODUIT + LUMIÈRE + TYPOGRAPHIE + ESPACE**

que sur des recettes de landing page.

---

# 1. COMMENCER PAR LIRE L’AUDIT

Un dossier d’audit complet existe dans le projet :

`audit/`

Commence impérativement par lire :

- `audit/AUDIT_INDEX.md`
- `audit/AUDIT_CONTEXT_FOR_EXTERNAL_REVIEW.md`
- `audit/AUDIT_EXECUTIVE_SUMMARY.md`
- `audit/AUDIT_VISUAL_UI.md`
- `audit/AUDIT_BRAND_CONSISTENCY.md`
- `audit/AUDIT_COMPONENTS_AND_DESIGN_SYSTEM.md`
- `audit/AUDIT_APP.md`
- `audit/AUDIT_RESPONSIVE.md`
- `audit/AUDIT_ACCESSIBILITY.md`
- `audit/AUDIT_SCREENSHOTS.md`
- `audit/findings.json`

Puis inspecte réellement les captures dans :

`audit/screenshots/`

En particulier :

- `home-desktop-jour.png`
- `home-desktop-nuit.png`
- `home-mobile-jour.png`
- `gammes-desktop-jour.png`
- `gammes-desktop-nuit.png`
- `gammes-mobile-jour.png`
- `produit-capteur-desktop-jour.png`
- `produit-capteur-mobile-jour.png`
- `produit-volet-desktop-jour.png`
- `produit-volet-desktop-nuit.png`
- `produit-fenetre-desktop-jour.png`
- `application-desktop-jour.png`
- `comment-ca-marche-desktop-jour.png`
- `pro-desktop-jour.png`
- `devis-desktop-jour.png`
- `devis-desktop-nuit.png`
- `devis-mobile-jour.png`
- `ressources-desktop-jour.png`
- tous les screenshots `/app/*`.

Ne te contente PAS des conclusions textuelles de l’audit.

**Regarde réellement les interfaces.**

---

# 2. SOURCE DE VÉRITÉ DE MARQUE

La charte retenue est :

**OMBRAIR — CONCEPT 07 — ARCHE MÉDITERRANÉENNE**

Le fichier de référence doit également être consulté :

`Ombrair - Identité concept 07-selection.png`

Concept :

> « Une arche, trois lames, un mot en bas de casse :  
> l’ombre choisie plutôt que subie. »

La direction doit évoquer :

- architecture méditerranéenne ;
- menuiserie contemporaine ;
- persiennes ;
- lumière filtrée ;
- soleil ;
- ombre ;
- ouverture ;
- air ;
- matériau ;
- objet physique ;
- précision technique.

Ombrair ne doit PAS ressembler à :

- une startup SaaS ;
- un dashboard B2B générique ;
- une landing page Tailwind ;
- un template shadcn ;
- une marque de domotique bleue ;
- un produit Apple/Nest copié.

---

# 3. PALETTE À CONSERVER

Palette officielle :

Persienne  
`#33665a`

Nuit  
`#161d23`

Chaux  
`#f4f1e9`

Fraîche  
`#2e8c8c`

Ambre  
`#c4862f`

Braise  
`#c4402a`

IMPORTANT :

Fraîche et Ambre restent exclusivement **THERMIQUES**.

Fraîche :

- froid ;
- air plus frais ;
- ventilation favorable.

Ambre :

- chaleur ;
- soleil ;
- température extérieure élevée.

Ne jamais les utiliser gratuitement pour rendre l’UI plus jolie.

La majorité du design doit vivre avec :

**Chaux + Persienne + Nuit.**

---

# 4. TYPOGRAPHIE

Conserver :

### Outfit
Titres / display.

### Instrument Sans
Corps.

### IBM Plex Mono
Données :

- température ;
- prix ;
- heure ;
- dimensions ;
- pourcentages ;
- références.

Mais l’audit visuel montre que certains éléments sont actuellement trop petits.

Effectuer une vraie passe typographique.

Je veux davantage de contraste entre :

- display ;
- heading ;
- body ;
- supporting text ;
- caption ;
- technical data.

Ne rends pas tout plus gros aveuglément.

Mais les textes doivent être confortables pour un public grand public 35–65 ans.

En particulier, vérifier :

- navigation ;
- descriptions ;
- labels ;
- sources ;
- petits textes des cartes ;
- application mobile.

---

# 5. PROBLÈME VISUEL PRINCIPAL À CORRIGER

L’interface actuelle est propre mais utilise beaucoup trop souvent le même langage :

**FOND CHAUX  
+ RECTANGLE À BORDURE 1 PX  
+ TITRE  
+ TEXTE**

Cela donne parfois l’impression d’une :

> maquette fonctionnelle très propre

plutôt que d’un :

> produit fini ayant une vraie direction artistique.

Le site ne doit pas devenir plus décoratif.

Il doit devenir plus **COMPOSÉ**.

---

# 6. RÉDUIRE LA « CARDIFICATION »

Ne mets pas chaque information dans une carte bordée.

Actuellement de nombreuses interfaces reposent sur :

```text
┌───────────────────────────┐
│ titre                     │
│ texte                     │
└───────────────────────────┘
```

répété encore et encore.

Créer davantage de distinction entre :

- sections libres ;
- blocs structurés ;
- données techniques ;
- cartes réellement interactives ;
- illustrations ;
- tableaux ;
- panneaux.

Une information n’a pas besoin d’une bordure simplement parce qu’elle existe.

Utiliser davantage :

- composition ;
- whitespace ;
- alignement ;
- changement de surface ;
- ligne horizontale ;
- typographie ;
- illustration.

---

# 7. MATÉRIALITÉ PRODUIT

C’est probablement le changement visuel le plus important.

Ombrair vend :

- des capteurs ;
- Ombrair Link ;
- des volets ;
- des fenêtres ;
- de l’installation physique.

Le site doit davantage donner l’impression d’une entreprise de :

**HARDWARE  
+ ARCHITECTURE  
+ MENUISERIE  
+ INSTALLATION**

Créer davantage de :

- vues produit ;
- détails de lames ;
- cadre de fenêtre ;
- vue en coupe simplifiée ;
- capteurs ;
- boîtiers ;
- schémas ;
- ouvertures architecturales ;
- effets de lumière par géométrie.

Pas de photo stock générique.

---

# 8. SYSTÈME D’ILLUSTRATIONS

Le projet possède déjà :

- `sensor-visual`
- `shutter-visual`
- `window-visual`

Ils constituent actuellement l’un des meilleurs éléments graphiques du site.

Les réutiliser et les enrichir si nécessaire.

Créer un système partagé :

`components/product-visuals/`

avec si pertinent :

- `SensorVisual`
- `ShutterVisual`
- `WindowVisual`
- `LinkVisual`
- `ProductArch`
- `TechnicalCallout`
- `OpeningDiagram`

Les illustrations doivent appartenir exactement à la même famille.

Style :

- vectoriel ;
- plat ;
- architectural ;
- line art ;
- précis ;
- peu de couleurs ;
- pas de 3D SaaS.

---

# 9. L’ARCHE

L’arche est importante.

Mais NE PAS résoudre la marque en ajoutant une arche partout.

Utilisations pertinentes :

- cadrage produit ;
- ouverture architecturale ;
- visuel de fenêtre ;
- certains hero produit ;
- éventuellement une grande image éditoriale.

Utilisations interdites :

- boutons ;
- inputs ;
- chaque carte ;
- toutes les sections ;
- décoration répétitive.

L’arche doit sembler naturelle parce qu’Ombrair parle d’ouvertures.

---

# 10. LES LAMES

Même principe.

Les lames peuvent apparaître :

- dans les volets ;
- comme masque de lumière ;
- comme transition subtile ;
- dans le logo.

Éviter trois traits horizontaux arbitraires en haut d’une carte.

En particulier, les bandes horizontales visibles actuellement sur certaines cartes `/gammes`
ressemblent à des skeleton loaders.

**LES SUPPRIMER comme faux élément visuel.**

---

# 11. HEADER

Le header actuel est propre mais extrêmement discret.

Améliorer légèrement sa présence sans l’alourdir.

Objectifs :

- logo plus assuré ;
- navigation parfaitement lisible ;
- espacement plus intentionnel ;
- état hover plus fin ;
- état actif discret ;
- CTA clairement hiérarchisé ;
- toggle thème intégré proprement.

Ne pas ajouter :

- grosse ombre sticky ;
- blur ;
- glassmorphism ;
- gradients.

Le header doit ressembler à celui d’une marque d’architecture contemporaine.

---

# 12. CONTAINER / GRILLE

Revoir la grille générale.

Le site contient beaucoup d’espace négatif — c’est une force.

Mais certains espaces semblent actuellement être :

> du vide non utilisé

plutôt que :

> du vide intentionnel.

Créer une grille cohérente.

Desktop :

- grande largeur maîtrisée ;
- alignements répétables ;
- colonnes claires ;
- largeurs de texte limitées.

Chaque grande zone doit avoir une composition identifiable.

---

# 13. RYTHME VERTICAL

Préserver l’espace généreux.

Mais distinguer davantage :

### espace entre deux informations liées

vs

### espace entre deux grandes sections.

Certaines pages ont actuellement des blocs très éloignés sans que le changement de chapitre soit visuellement évident.

Créer un rythme plus éditorial.

---

# 14. HOMEPAGE — HERO

Le hero est déjà le meilleur élément du site.

**NE LE REFAIS PAS À ZÉRO.**

Conserver :

- simulation 24 h ;
- soleil ;
- lune ;
- températures ;
- lames ;
- levée ;
- inclinaison ;
- manuel / automatique.

Mais améliorer son **DESIGN**.

---

# 15. HERO — FENÊTRE

La scène de droite est actuellement très grande et, pendant la nuit, peut devenir un immense rectangle presque vide.

Donner davantage de matérialité à l’ouverture.

Ajouter subtilement selon ce qui fonctionne :

- profondeur de tableau de fenêtre ;
- embrasure ;
- appui de fenêtre ;
- cadre ;
- légère géométrie de façade ;
- silhouette de lames ;
- reflet / masque architectural ;
- horizon abstrait.

Toujours flat design.

Pas de rendu photoréaliste.

Le visuel doit rester intéressant même à :

`00:00`.

---

# 16. HERO — LUMIÈRE

Exploiter davantage la lumière comme élément de marque.

Le soleil peut créer :

- lignes ;
- bandes ;
- zones géométriques ;
- ombres de lames.

Pas d’ombres CSS floues marketing.

Les « ombres » doivent sembler provenir d’une architecture.

---

# 17. HERO — COLONNE DE GAUCHE

La colonne gauche contient actuellement :

- texte ;
- heure ;
- plusieurs mesures ;
- sliders ;
- badge ;
- disclaimer ;
- CTA.

Revoir la composition.

Créer des groupes visuels plus nets :

### Promesse

### Mesures

### Contrôle

### Action

Les données live doivent ressembler à un véritable panneau technique Ombrair,
pas simplement à plusieurs petits textes posés sur la page.

Éviter néanmoins de créer une grosse card.

---

# 18. SECTION « LE PROBLÈME »

Les trois grands chiffres sont intéressants mais très textuels.

Créer une composition éditoriale plus forte.

Par exemple :

- numéro très présent ;
- libellé court ;
- explication ;
- source plus discrète ;
- séparateurs verticaux.

Pas besoin de cartes.

Les sources doivent rester parfaitement lisibles.

---

# 19. « COMMENT ÇA MARCHE » SUR L’ACCUEIL

La section actuelle en quatre colonnes est propre mais assez abstraite.

Créer une progression visuelle :

01  
MESURER

02  
COMPRENDRE

03  
AGIR

04  
PILOTER

avec une ligne / rail / flux discret.

Possibilité d’utiliser de petites illustrations techniques :

- capteur ;
- logique ;
- lame ;
- application.

Éviter quatre grosses cards.

---

# 20. VITRINE DES TROIS PRODUITS — À PRÉSERVER

La vitrine produit actuelle fait partie des meilleurs éléments du site.

Ne la détériore pas.

Conserver :

- arche ;
- illustration dédiée ;
- même famille graphique ;
- trois compositions distinctes.

Faire seulement une passe de polish :

- proportions ;
- alignements ;
- hauteur ;
- respiration ;
- prix ;
- CTA ;
- hover.

---

# 21. `/GAMMES` — REFONTE FORTE

La page `/gammes` est actuellement nettement inférieure à la vitrine produit de l’accueil.

Les cartes contiennent en haut des bandes horizontales qui ressemblent à des placeholders.

Remplacer complètement cette partie.

Réutiliser le véritable système visuel produit.

Je veux qu’en arrivant sur :

`/gammes`

on voie immédiatement :

**CAPTEUR  
VOLET  
FENÊTRE**

avec les vraies illustrations.

La page doit donner l’impression d’un catalogue premium.

---

# 22. `/GAMMES` — CARTES

Utiliser idéalement un dérivé du composant de vitrine d’accueil.

Chaque carte :

- illustration forte ;
- rôle ;
- produit ;
- prix ;
- 2–3 points ;
- CTA.

Éviter les longues listes.

Les informations détaillées restent disponibles dans les pages produit.

---

# 23. `/GAMMES` — COMPARAISON

La comparaison ne doit pas ressembler à un tableau SaaS d’abonnements.

Capteur, Volet et Fenêtre ne sont **PAS** trois tiers.

Créer une comparaison par usage.

Par exemple visuellement :

```text
                CAPTEUR    VOLET    FENÊTRE

Mesure             ●
Protection                    ●
Ventilation                             ●
Pilotage app         ●         ●         ●
Installation         ●         ●         ●
```

ou une composition plus élégante.

Le but est de comparer des fonctions, pas des abonnements.

---

# 24. PAGES PRODUIT — PLUS GROS CHANTIER UI

Les captures montrent clairement que :

`/gammes/capteur`  
`/gammes/volet`  
`/gammes/fenetre`

sont actuellement beaucoup trop textuelles.

Le premier écran utilise environ la moitié gauche et laisse une grande zone vide à droite.

C’est une opportunité majeure.

Créer un véritable :

**PRODUCT HERO**

---

# 25. PRODUCT HERO — DESKTOP

Structure recommandée :

```text
┌──────────────────────────────────────────────────┐
│                                                  │
│  MESURER · ANALYSER        ┌───────────────╮     │
│                            │               │     │
│  Capteur Ombrair           │   VISUEL      │     │
│                            │   PRODUIT      │     │
│  Description               │               │     │
│                            │               │     │
│  349 €                     ╰───────────────┘     │
│  kit de base                                     │
│                                                  │
│  [ Demander un devis ]                           │
│                                                  │
└──────────────────────────────────────────────────┘
```

L’arche doit contenir le produit.

Même système :

Capteur  
Volet  
Fenêtre.

---

# 26. PRODUCT HERO — MOBILE

Ordre :

- surtitre ;
- produit ;
- promesse ;
- prix ;
- CTA ;
- visuel produit.

Ou :

- surtitre ;
- produit ;
- visuel ;
- prix ;
- CTA.

Tester visuellement.

Le produit doit être visible **AVANT** une longue succession de textes.

---

# 27. PAGES PRODUIT — FIN DU « MUR DE TEXTE »

Le contenu actuel est informatif mais visuellement monotone.

Créer des respirations :

- grande illustration ;
- schéma ;
- chiffres ;
- liste technique ;
- bande de surface ;
- cards uniquement pour les vraies options.

Ne supprime pas les informations.

Change leur représentation.

---

# 28. « QUI CONÇOIT, QUI FABRIQUE »

Le grand rectangle actuel est visuellement lourd.

Le transformer en une section beaucoup plus raffinée.

Par exemple :

```text
OMBRAIR
✓ intégration
✓ installation
✓ maintenance

PARTENAIRE
✓ menuiserie
✓ moteur
```

avec une ligne de séparation claire.

Ou une petite matrice.

Pas besoin d’un immense rectangle bordé.

---

# 29. « CE QUI EST FOURNI »

Créer une composition de type nomenclature produit.

Exemple :

01  
Volet motorisé

02  
Motorisation

03  
Ombrair Link

04  
Application

Avec petites représentations / lignes techniques.

Cela correspond beaucoup mieux à l’identité industrielle.

---

# 30. OPTIONS D’INSTALLATION

Actuellement plusieurs rectangles presque identiques.

Les rendre plus distinctifs.

Exemple :

### 01
Équipement existant

### 02
Nouvel ouvrant

### 03
Installation complète

Créer un rail ou une progression.

Afficher clairement ce qui change d’une option à l’autre.

---

# 31. DIMENSIONS

Le sélecteur de dimensions est fonctionnel mais visuellement proche d’un formulaire administratif.

Créer des représentations de formats.

Exemple :

```text
┌─┐    ┌──┐     ┌────┐
│ │    │  │     │    │
└─┘    └──┘     └────┘
60×75   80×100    140×125
```

Pas besoin d’être à l’échelle exacte.

Les silhouettes doivent aider à comprendre les formats.

Conserver les radio inputs accessibles sous-jacents.

---

# 32. COMPATIBILITÉ

La présentation doit être visuellement cohérente avec l’installation.

Éviter une section presque vide avec un H2 seul.

Si contenu faible :

l’intégrer à un bloc voisin visuellement.

---

# 33. APPLICATION DANS LES PAGES PRODUIT

Ne simplement pas écrire :

« Dans l’application ».

Montrer quelque chose.

Utiliser :

- PhoneFrame ;
- extrait d’écran ;
- petit statut ;
- mini interface.

Cela permet de relier physiquement le produit à l’écosystème.

---

# 34. PAGE APPLICATION

La page actuelle présente trois énormes cadres téléphone alignés.

C’est fonctionnel mais trop répétitif.

Créer une composition plus éditoriale.

Par exemple :

GAUCHE :

- titre ;
- promesse ;
- CTA ;
- fonctions.

DROITE :

- grand téléphone principal.

Puis plus bas :

- 2 autres écrans ;
- cropped views ;
- callouts ;
- données.

Éviter trois grands téléphones identiques occupant toute la largeur.

---

# 35. PHONE FRAME

Conserver son identité sombre.

Mais améliorer éventuellement :

- proportions ;
- détail du haut ;
- bordure ;
- intégration au fond.

Pas de mockup iPhone photoréaliste.

L’appareil doit rester conceptuel et Ombrair.

---

# 36. BANDE ÉCOSYSTÈME

La bande :

Capteurs  
→ Ombrair Link  
→ Volets & fenêtres  
→ Application

est importante mais actuellement graphiquement assez faible.

La transformer en véritable diagramme produit très simple.

Créer éventuellement :

- miniature capteur ;
- miniature Ombrair Link ;
- petite lame ;
- téléphone.

Relier avec un trait architectural propre.

Pas d’illustration de réseau informatique générique.

---

# 37. OMBRAIR LINK — VISUEL

Créer un petit visuel partagé de Ombrair Link s’il n’existe pas.

Style cohérent avec le capteur :

- boîtier compact ;
- Chaux / Persienne ;
- logo discret ;
- bornier / indicateur suggéré ;
- rien qui ressemble à un routeur Wi-Fi.

Il pourra être réutilisé :

- homepage ;
- Capteur ;
- Comment ça marche ;
- présentation de l’écosystème.

---

# 38. PAGE « COMMENT ÇA MARCHE »

Le graphique est intéressant et doit rester.

Mais la page ressemble actuellement beaucoup à :

titre  
+  
graphique  
+  
deux colonnes de texte.

Créer davantage de narration.

Possibilité :

### 01 — Le jour

graphique thermique.

### 02 — Ombrair observe

capteurs / mesures.

### 03 — Ombrair agit

ouverture / fermeture.

### 04 — Vous gardez la main

application.

Créer de vrais moments visuels.

---

# 39. GRAPHIQUES

Les graphiques actuels sont propres.

Conserver la sobriété.

Améliorer si nécessaire :

- labels ;
- typographie ;
- points clés ;
- légendes ;
- contraste.

Les lignes thermiques doivent rester Fraîche / Ambre.

Les textes des valeurs doivent être accessibles.

---

# 40. RESSOURCES

La capture `ressources-desktop-jour.png` est extrêmement plate.

Les quatre articles ont exactement le même traitement.

Créer une vraie page éditoriale.

Par exemple :

### ARTICLE À LA UNE

un grand bloc.

Puis :

### À LIRE AUSSI

3 cartes plus petites.

Utiliser éventuellement des illustrations éditoriales abstraites :

- nuit / fenêtre ;
- inertie / mur ;
- soleil / protection ;
- personne vulnérable / maison.

Pas de photos stock.

---

# 41. STYLE DES ILLUSTRATIONS RESSOURCES

Illustration très simple :

- 2 ou 3 couleurs max ;
- géométrie ;
- architecture ;
- lignes ;
- textures interdites si elles jurent avec la charte.

Les illustrations peuvent être SVG.

---

# 42. OMBRAIR PRO

La page Pro est actuellement très générique :

titre  
+  
4 rectangles  
+  
formulaire.

Créer une vraie identité Pro sans créer une deuxième marque.

Montrer visuellement :

- plusieurs bâtiments ;
- supervision ;
- réseau de sites ;
- tableau de bord ;
- parc d’ouvrants.

Créer par exemple un diagramme architectural multi-site.

Ne pas inventer de statistiques.

---

# 43. DEVIS

La capture desktop montre une grande quantité de vide sur la droite.

Utiliser cet espace.

Créer un layout desktop en deux colonnes.

GAUCHE :

formulaire.

DROITE :

panneau contextuel.

Ce panneau peut montrer selon l’étape :

- logement ;
- produits choisis ;
- format ;
- intervention ;
- résumé.

Ou une illustration cohérente.

Ne change pas la logique du formulaire.

Seulement sa présentation.

---

# 44. PROGRESSION DEVIS

La barre actuelle est très légère.

La rendre plus claire tout en restant sobre.

Exemple :

01  
Logement

02  
Produit

03  
Configuration

04  
Coordonnées

05  
Récapitulatif

Desktop :

ligne horizontale.

Mobile :

progress compact.

---

# 45. FAQ

La page FAQ fonctionne.

Ne la surdesign pas.

Améliorer seulement :

- typographie ;
- largeur ;
- espacement ;
- affordance d’ouverture ;
- états hover/focus.

Une FAQ doit rester rapide.

---

# 46. PAGES LÉGALES

Ne gaspille pas de temps à les décorer.

Seulement :

- largeur de lecture ;
- hiérarchie ;
- typography ;
- footer.

---

# 47. APPLICATION `/APP` — OBJECTIF

La démo application est fonctionnelle et cohérente.

**NE LA RECONSTRUIS PAS.**

Mais visuellement, elle ressemble encore beaucoup à un :

dashboard domotique générique.

Il faut lui donner davantage de caractère Ombrair.

---

# 48. APPLICATION — PRINCIPES UI

Le langage doit rester :

- compact ;
- utilitaire ;
- calme ;
- technique ;
- très lisible.

Pas de grosses illustrations sur tous les écrans.

L’app doit être plus fonctionnelle que le site marketing.

---

# 49. APPLICATION — CARTES

Aujourd’hui de très nombreuses informations vivent dans des rectangles bordés.

Réduire la répétition.

Créer différentes hiérarchies :

### Surface principale

### Groupe

### Ligne

### Statut

### Carte interactive

Toutes les données n’ont pas besoin d’une card.

---

# 50. APPLICATION — PIÈCES

Visuellement, l’écran est très long et dense.

Sans modifier profondément son UX, améliorer la lecture.

Créer des chapitres de pièce plus distinctifs.

Exemple :

```text
SALON
26,1 °C · 46 %

Baie vitrée sud
[ état visuel ]
```

Puis séparer davantage :

- information principale ;
- paramètres ;
- détails techniques.

Les batteries / signaux ne doivent pas avoir la même présence que le nom d’un ouvrant.

---

# 51. APPLICATION — STATUS

Créer un système visuel cohérent de statuts :

- Auto ;
- Manuel ;
- Ouvert ;
- Fermé ;
- Hors ligne ;
- Batterie faible ;
- Alerte.

Utiliser :

- typographie ;
- symbole ;
- contour ;
- couleur uniquement en soutien.

Éviter dix styles différents.

---

# 52. APPLICATION — ALERTES

Les alertes doivent être immédiatement distinguables des informations normales.

Braise uniquement pour alerte réelle/simulée.

Ne pas remplir une énorme surface rouge.

Préférer :

- bordure ;
- icône ;
- titre ;
- petite bande.

---

# 53. APPLICATION — NAVIGATION BASSE

Conserver les cinq onglets.

Améliorer :

- état actif ;
- icônes ;
- label ;
- séparation ;
- zone tactile.

Le bouton actif doit être clair sans grosse capsule iOS.

---

# 54. APPLICATION — MODE NUIT

Le dark mode actuel est globalement réussi.

**NE le réinvente pas.**

Faire seulement une passe de polish.

En particulier :

éviter que toutes les cards deviennent de grands blocs Persienne foncés.

Persienne doit rester une couleur de marque, pas devenir la couleur de toutes les surfaces.

Créer davantage de hiérarchie entre :

- Nuit ;
- surface ;
- card ;
- active.

---

# 55. APPLICATION — ÉCRAN HISTORIQUE

Conserver Recharts.

Améliorer :

- espace du graph ;
- légende ;
- période ;
- actions ;
- données clés.

Ne surcharge pas.

---

# 56. APPLICATION — PROGRAMMES / SÉCURITÉ

Ces écrans utilisent actuellement plusieurs cartes identiques.

Créer une meilleure hiérarchie :

- titre programme ;
- état ;
- description ;
- règles.

Le statut actif/inactif doit être immédiatement identifiable.

---

# 57. APPLICATION — APPAIRAGE

Le grand vide actuel peut être utilisé intelligemment.

Ajouter une illustration technique légère :

- capteur ;
- bouton ;
- LED ;
- Ombrair Link.

Un wizard d’installation est un excellent endroit pour utiliser le dessin technique.

---

# 58. SYSTÈME DE BOUTONS

Auditer tous les boutons.

Créer une hiérarchie stricte :

### Primary

### Secondary

### Ghost / Link

### Destructive uniquement si nécessaire.

Radius :

5 px.

Pas de pill.

Pas de shadow.

Pas de gradient.

---

# 59. CTA

Le bouton :

`Demander un devis`

est le CTA principal.

Il doit être visuellement cohérent partout.

Éviter d’avoir trop de variantes légèrement différentes selon les pages.

---

# 60. LIENS

Les liens textuels peuvent utiliser une flèche ou soulignement discret.

Exemple :

`Découvrir les volets →`

Créer une transition hover très simple.

---

# 61. FORMULAIRES

Les inputs actuels sont très sobres.

Améliorer :

- hauteur ;
- label ;
- focus ;
- spacing ;
- disabled state ;
- radio ;
- checkbox.

Pas de gros fond blanc générique.

Ils doivent appartenir au même design system.

---

# 62. SURFACES

Créer explicitement quelques niveaux :

### background

### subtle section

### panel

### interactive surface

### highlighted surface.

Aujourd’hui la distinction entre certains niveaux est trop faible.

Ne rajoute pas une shadow pour créer le relief.

Utiliser :

- valeur de fond ;
- bordure ;
- espace.

---

# 63. BORDURES

Les bordures sont actuellement très nombreuses.

Réduire leur usage.

Une bordure doit signifier :

- limite interactive ;
- regroupement réel ;
- structure.

Pas simplement :

« voici un bloc ».

---

# 64. MICRO-INTERACTIONS

Ajouter uniquement des micro-interactions utiles.

Exemples :

- lame qui pivote légèrement ;
- fenêtre qui s’entrouvre ;
- capteur qui émet une impulsion ;
- flèche qui se déplace légèrement ;
- ligne qui se dessine ;
- transition de surface.

Durée :

environ 200–500 ms.

Pas de spring rebondissant.

Pas de parallax.

Pas de scroll-jacking.

---

# 65. HOVER PRODUCT

Sur les cartes produit :

hover possible :

- petite évolution des lames ;
- mouvement du battant ;
- signal du capteur.

Très subtil.

Respecter reduced motion.

---

# 66. THEME JOUR / NUIT

Chaque modification doit être pensée simultanément pour les deux thèmes.

Ne fais jamais :

design clair d’abord  
+  
inversion ensuite.

Les captures actuelles montrent que le thème nuit est une force du projet.

La préserver.

---

# 67. ACCESSIBILITÉ VISUELLE

L’audit a confirmé un problème :

Fraîche et Ambre ne passent pas toujours AA lorsqu’elles sont utilisées comme texte.

**NE modifie pas la charte.**

Créer / utiliser des tokens UI dérivés :

```css
--thermal-cool
--thermal-cool-text

--thermal-warm
--thermal-warm-text
```

Le signal reste Fraîche/Ambre.

La valeur peut être :

- foreground ;
- ou variante textuelle accessible.

La couleur n’est jamais le seul canal.

---

# 68. RESPONSIVE

Tout nouveau design doit fonctionner :

- 360
- 390
- 768
- 1024
- 1280
- 1440
- 1920.

Les compositions desktop ambitieuses doivent se transformer proprement en mobile.

Ne simplement pas réduire une grille 3 colonnes jusqu’à ce qu’elle casse.

---

# 69. MOBILE

Sur mobile :

- produit visuel prioritaire ;
- titres confortables ;
- CTA faciles ;
- texte limité en largeur ;
- cards moins nombreuses ;
- pas de microtexte minuscule.

L’expérience mobile doit être conçue, pas juste empilée.

---

# 70. TABLETTE

Prêter particulièrement attention à :

768 px.

L’audit a déjà trouvé un problème à cette largeur.

Ne crée aucune nouvelle régression.

---

# 71. NE PAS AJOUTER DE NOUVELLE BIBLIOTHÈQUE LOURDE

Le projet fonctionne actuellement sans bibliothèque d’animation lourde supplémentaire.

Ne rajoute pas :

- GSAP ;
- Three.js ;
- WebGL ;
- grosse bibliothèque UI parallèle ;

sauf nécessité exceptionnelle et justification préalable.

Si Framer Motion est déjà installé et réellement utilisé par le projet, tu peux le conserver avec parcimonie ; sinon ne l’ajoute pas uniquement pour cette refonte.

CSS + SVG + composants existants doivent suffire dans la majorité des cas.

---

# 72. PERFORMANCE

Les illustrations doivent être :

- SVG ;
- CSS ;
- assets optimisés.

Pas de vidéo de fond.

Pas de gros PNG décoratifs.

Le hero ne doit pas rerender inutilement toute la page.

---

# 73. COMPOSANTS RÉUTILISABLES

Factoriser intelligemment.

Potentiels nouveaux composants :

- `ProductHero`
- `ProductArch`
- `ProductVisual`
- `LinkVisual`
- `SectionIntro`
- `TechnicalCallout`
- `ProcessRail`
- `ProductSpecList`
- `InstallationOption`
- `EditorialArticleCard`
- `AppStatus`
- `RoomSection`

Mais NE crée pas un design system abstrait pour le plaisir.

Créer uniquement ce qui est réellement réutilisé.

---

# 74. PRÉSERVER LES POINTS FORTS TECHNIQUES

L’audit confirme notamment :

- design tokens centralisés ;
- zéro couleur hardcodée ;
- données centralisées ;
- app cohérente ;
- tests existants ;
- build propre ;
- thème partagé ;
- reduced motion.

**NE régresse sur aucun de ces points.**

---

# 75. AUCUNE COULEUR EN DUR

Toute nouvelle couleur :

dans `globals.css`.

Jamais :

```tsx
style={{ color: "#33665a" }}
```

ou classe Tailwind native arbitraire.

---

# 76. PHASE DE TRAVAIL 1 — BASE UI

Commencer par :

- typographie ;
- spacing ;
- surfaces ;
- borders ;
- buttons ;
- input ;
- container ;
- section rhythm.

Avant d’implémenter massivement :

1. prendre 3 pages représentatives ;
2. tester les nouveaux tokens ;
3. vérifier qu’ils améliorent réellement le rendu ;
4. seulement ensuite généraliser.

Commit séparé.

---

# 77. PHASE 2 — HOMEPAGE

Polish :

- header ;
- hero ;
- problème ;
- comment ça marche ;
- produits ;
- écosystème ;
- application ;
- cas d’usage / témoignages ;
- FAQ ;
- CTA.

Ne change pas la logique.

Utilise la skill Frontend Design + la skill projet Ombrair comme garde-fous.

---

# 78. PHASE 3 — CATALOGUE ET PRODUITS

Refondre :

- `/gammes`
- `/gammes/capteur`
- `/gammes/volet`
- `/gammes/fenetre`

C’est la priorité UI principale.

Effectuer une vraie boucle :

1. screenshot avant ;
2. refonte ;
3. screenshot après ;
4. critique ;
5. correction.

---

# 79. PHASE 4 — APPLICATION MARKETING

Refondre :

`/application`

avec composition plus éditoriale.

---

# 80. PHASE 5 — APP

Polish cohérent sur :

- accueil ;
- pièces ;
- mode auto ;
- programmes ;
- sécurité ;
- historique ;
- notifications ;
- réglages ;
- appairage.

La logique fonctionnelle reste intacte.

---

# 81. PHASE 6 — AUTRES PAGES

- Comment ça marche ;
- Ressources ;
- Pro ;
- Devis ;
- FAQ ;
- pages secondaires.

Prioriser selon l’impact visuel réel observé dans les screenshots.

---

# 82. VISUAL QA OBLIGATOIRE

Cette mission est **VISUELLE**.

Tu ne peux PAS considérer un composant terminé après avoir écrit son JSX.

Après chaque grande modification :

1. lancer le site ;
2. ouvrir la page ;
3. prendre une capture ;
4. la regarder à 100 % ;
5. comparer à l’ancienne capture ;
6. écrire mentalement ou dans une note courte 3 défauts restants ;
7. corriger ;
8. reprendre une capture.

Lorsque la skill `critique` ou un équivalent est disponible, l’utiliser pendant cette étape, mais la décision finale reste soumise à la charte Ombrair.

---

# 83. DOSSIER BEFORE / AFTER

Créer :

`audit/ui-redesign/`

Puis :

```text
audit/ui-redesign/
├── UI_REDESIGN_REPORT.md
├── decisions/
└── after/
```

Les anciennes captures sont déjà dans :

`audit/screenshots`.

Ne pas les dupliquer inutilement.

Dans `decisions/`, créer si utile de courtes notes de direction pour les grandes pages :

- `home.md`
- `products.md`
- `app.md`

Chaque note doit rester courte :

- problème visuel ;
- parti pris ;
- changements ;
- critères de validation.

---

# 84. SCREENSHOTS FINAUX MINIMUM

Créer au minimum :

## SITE

- `home-desktop-jour.png`
- `home-desktop-nuit.png`
- `home-mobile-jour.png`

- `gammes-desktop-jour.png`
- `gammes-desktop-nuit.png`
- `gammes-mobile-jour.png`

- `produit-capteur-desktop-jour.png`
- `produit-capteur-mobile-jour.png`

- `produit-volet-desktop-jour.png`
- `produit-volet-desktop-nuit.png`

- `produit-fenetre-desktop-jour.png`

- `application-desktop-jour.png`

- `comment-ca-marche-desktop-jour.png`

- `ressources-desktop-jour.png`

- `pro-desktop-jour.png`

- `devis-desktop-jour.png`
- `devis-desktop-nuit.png`
- `devis-mobile-jour.png`

## APP

- `app-accueil-mobile-jour.png`
- `app-accueil-mobile-nuit.png`
- `app-pieces-mobile-jour.png`
- `app-pieces-mobile-nuit.png`
- `app-mode-auto-mobile-jour.png`
- `app-programmes-mobile-jour.png`
- `app-historique-mobile-jour.png`
- `app-securite-mobile-jour.png`
- `app-reglages-mobile-jour.png`
- `app-appairage-mobile-jour.png`

---

# 85. COMPARAISON VISUELLE

Pour chaque page majeure, demande-toi :

### Avant

- très textuelle ?
- trop de rectangles ?
- trop de vide ?
- manque de produit ?
- manque de hiérarchie ?
- microtexte ?
- aspect template ?

### Après

- plus claire visuellement ?
- plus identifiable Ombrair ?
- plus premium ?
- plus matérielle ?
- meilleure composition ?
- toujours aussi sobre ?
- plus agréable à regarder à 100 % ?
- meilleure distinction des niveaux d’information ?

---

# 86. TEST « SANS LOGO »

Fais mentalement ce test :

> Si je cache le logo, est-ce que cette interface semble encore appartenir à Ombrair ?

Elle doit évoquer :

- ouverture ;
- lumière ;
- lames ;
- architecture ;
- précision technique.

Mais sans spammer le symbole.

---

# 87. TEST « PAS UNE LANDING SAAS »

Vérifie qu’aucune page ne ressemble à :

- 3 pricing cards ;
- 4 feature cards ;
- grosse CTA box ;
- témoignages ;
- FAQ ;

empilés exactement comme un template SaaS.

Ombrair vend des objets physiques.

Cela doit se sentir.

---

# 88. TEST « OBJET PHYSIQUE »

Sur une page Capteur :

je dois voir le capteur.

Sur une page Volet :

je dois voir un volet.

Sur une page Fenêtre :

je dois voir une fenêtre.

Sur une page Application :

je dois voir l’application.

Sur une page Pro :

je dois voir une notion de parc / bâtiments.

Pas uniquement du texte expliquant ces choses.

---

# 89. TEST DE LISIBILITÉ

Regarder les captures à 100 %.

Pas uniquement zoomées dans le navigateur.

Vérifier que :

- corps ;
- navigation ;
- sources ;
- captions ;
- labels ;

ne deviennent pas minuscules sur un écran 1440 px.

Le site doit rester confortable pour quelqu’un qui n’est ni designer ni développeur.

---

# 90. NE PAS DÉTRUIRE L’ESPACE NÉGATIF

Le whitespace est une force du site.

Le but n’est PAS de tout remplir.

Différence importante :

### bon espace négatif

composition volontaire.

### mauvais vide

une moitié de page sans fonction.

Garde le premier.

Corrige le second.

---

# 91. CRITIQUE SÉPARÉE AVANT COMMIT

Avant chaque commit de phase, effectuer une passe de critique où tu ne touches pas au code pendant quelques minutes.

Pour chaque page modifiée, noter au minimum :

- 1 élément le plus réussi ;
- 3 faiblesses visibles restantes ;
- 1 élément éventuellement surdesigné ;
- 1 test mobile ;
- 1 test dark mode.

Puis seulement corriger les points qui ont un impact réel.

Ne cherche pas à perfectionner à l’infini.

---

# 92. GIT

Un commit par grande phase.

Exemples :

```text
refactor(ui): strengthen Ombrair visual system

feat(ui): refine homepage art direction

feat(ui): redesign product catalogue and product pages

feat(ui): elevate application showcase

refactor(app-ui): align demo with Ombrair visual language

feat(ui): polish secondary pages

docs(audit): document UI redesign results
```

Ne pousse rien.

---

# 93. BUILD / WINDOWS

Respecter les règles déjà établies.

**NE JAMAIS lancer :**

`npm run build`

pendant que :

`npm run dev`

tourne sur le même projet.

Sous Git Bash Windows :

```bash
netstat -ano | grep LISTENING
taskkill //F //PID <pid>
```

Si nécessaire :

```bash
rm -rf .next
```

Ne modifie pas l’identité Git existante.

---

# 94. VALIDATION PAR PHASE

Avant chaque commit :

- lint ;
- tests ;
- screenshot ;
- desktop ;
- mobile ;
- jour ;
- nuit ;
- reduced motion si animation modifiée ;
- keyboard si composant interactif modifié ;
- vérification absence d’overflow ;
- vérification des couleurs hardcodées.

Ne lance le build final qu’après arrêt du serveur dev.

---

# 95. RAPPORT DE FIN

Créer :

`audit/ui-redesign/UI_REDESIGN_REPORT.md`

Documenter :

## Skills / plugins réellement utilisés

- Frontend Design : oui/non ;
- skill projet Ombrair : oui ;
- navigateur utilisé ;
- éventuelles skills complémentaires ;
- raisons.

## Direction générale

## Design system

## Homepage

## Gammes

## Capteur

## Volet

## Fenêtre

## Application marketing

## App

## Ressources

## Pro

## Devis

## Responsive

## Dark mode

## Accessibilité

Puis :

### Principales différences avant / après

### Nouveaux composants

### Assets créés

### Pages non modifiées

### Limites restantes

### Résultats lint / tests / build

---

# 96. CRITÈRE DE RÉUSSITE FINAL

La mission est réussie si :

1. la base sobre du projet est toujours reconnaissable ;
2. la charte Ombrair est mieux incarnée ;
3. les pages ne semblent plus être des gabarits ;
4. les produits sont réellement montrés ;
5. `/gammes` ressemble à un catalogue et non à un tableau de prix ;
6. les pages produit semblent appartenir à une marque de hardware/architecture ;
7. les grands vides ont une intention ;
8. les rectangles bordés sont utilisés avec parcimonie ;
9. la typographie est plus confortable ;
10. le site est plus mémorable sans devenir plus bruyant ;
11. l’app est plus raffinée sans perdre sa fonction ;
12. le dark mode reste excellent ;
13. mobile et desktop semblent tous deux conçus ;
14. aucune information métier n’a été inventée ;
15. aucune régression fonctionnelle n’est introduite ;
16. les plugins/skills utilisés n’ont pas fait dériver la marque ;
17. chaque page majeure a subi au moins une vraie boucle screenshot → critique → correction ;
18. lint, tests et build sont verts.

---

# 97. PRINCIPE FINAL

Ne cherche PAS à rendre Ombrair « plus moderne ».

Il l’est déjà.

Cherche à le rendre :

# **PLUS OMBRAIR.**

Le résultat doit se rapprocher d’un mélange entre :

- catalogue d’architecture contemporaine ;
- design industriel ;
- interface de contrôle précise ;
- marque méditerranéenne sobre.

Moins de :

> blocs UI.

Plus de :

> **composition, produit, lumière et architecture.**

Les skills de design sont des outils de méthode, pas des directeurs artistiques autonomes.

**La charte Ombrair reste l’autorité finale.**

Commence maintenant par :

1. vérifier/installer les capacités Claude Code nécessaires ;
2. ouvrir la charte ;
3. lire l’audit ;
4. inspecter les screenshots ;
5. créer la skill locale Ombrair ;
6. établir une courte stratégie de refonte ;
7. réaliser la refonte UI complète incrément par incrément ;
8. effectuer le contrôle visuel réel après chaque phase ;
9. terminer uniquement lorsque les captures finales démontrent une amélioration nette.
