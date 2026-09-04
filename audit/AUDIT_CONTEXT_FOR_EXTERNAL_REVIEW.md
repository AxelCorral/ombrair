# Ombrair — contexte complet pour une analyse externe

> **Ce document est autonome.** Il est écrit pour être transmis à une IA ou
> à un designer qui n'a **pas accès au dépôt**. Il décrit le produit,
> l'architecture, l'identité visuelle et l'état réel de l'interface, de
> façon à permettre une critique UI/UX argumentée sans lire une ligne de code.

| | |
|---|---|
| Date de l'audit | 25 août 2026 |
| Branche | `master` |
| Commit audité | `dc757ab` — *feat(brand): intègre l'identité Ombrair retenue au site et à l'application* |
| État Git au moment de l'audit | propre (aucune modification non commitée) |
| Environnement | Next.js 15.5.23, React 19, Tailwind v4, TypeScript strict, Windows |
| Nature du projet | **Projet étudiant fictif** — Master MIASHS, Université Toulouse Jean Jaurès. Aucune vente réelle, aucun utilisateur réel. |

⚠️ **Aucune donnée analytique n'est disponible** : pas de trafic, pas de
conversion, pas de heatmap, pas de test utilisateur. Tout jugement UX de ce
dossier est une *interprétation d'expert*, jamais une donnée observée.

---

## 1. Le projet

### Ce qu'est Ombrair

Une entreprise **fictive** de confort thermique du logement. Le produit
automatise un geste simple que personne ne fait au bon moment tous les
jours : **fermer les ouvrants avant que le soleil ne tape, les rouvrir
quand l'air extérieur redevient plus frais que l'air intérieur.**

Baseline : *« La fraîcheur, avant la chaleur. »*

### Public cible

- **Principal** : propriétaires occupants 35-65 ans, maison ou appartement
  traversant, zones à fort risque canicule (Sud-Ouest, Sud-Est, vallée du Rhône).
- **Secondaire** : bailleurs sociaux, EHPAD, écoles — offre « Ombrair Pro », sur devis.

### Les trois produits

| Produit | Rôle | Qui conçoit / fabrique | Prix de départ |
|---|---|---|---|
| **Capteur Ombrair** | Mesurer · analyser | **Conçu ET fabriqué par Ombrair** (carte, firmware, intégration) | 349 € le kit de base |
| **Volet Ombrair** | Protéger · automatiser | Fabricant spécialisé — Ombrair sélectionne, revend, installe, intègre | à partir de 690 € / ouvrant posé |
| **Fenêtre Ombrair** | Ventiler · automatiser | Fabricant spécialisé — idem | à partir de 1 590 € / ouvrant posé* |

\* Ce montant couvre **fenêtre + volet posés ensemble**. Une fenêtre
motorisée seule n'a jamais eu de prix défini : elle est annoncée « sur devis ».

**Cette distinction fabrication / revente est un point central du discours**
et le site la traite explicitement (bloc « Qui conçoit, qui fabrique » sur
chaque page produit).

### Autres briques commerciales

- **Ombrair Link** — module combinant passerelle locale, logique et pilotage des ouvrants.
- **Application Ombrair** — **incluse à vie, sans abonnement**, dans les trois produits.
- **Ombrair+** — option facultative, 4,99 €/mois (météo 7 jours, multi-résidences, historique illimité). Jamais présentée comme requise.
- Services : conseil, vérification de compatibilité, pose, configuration, mise en service, maintenance, suivi des capteurs, assistance.

---

## 2. Architecture du site

### Routes réellement présentes (vérifiées, HTTP 200)

**Site vitrine**
`/` · `/comment-ca-marche` · `/gammes` (index produits) · `/gammes/capteur` ·
`/gammes/volet` · `/gammes/fenetre` · `/application` · `/devis` · `/pro` ·
`/ressources` + 4 articles · `/a-propos` · `/contact` · `/faq` ·
`/mentions-legales` · `/confidentialite`

**Démonstration d'application** — `/app` et 8 écrans
`/app` · `/app/pieces` · `/app/mode-auto` · `/app/programmes` ·
`/app/securite` · `/app/historique` · `/app/notifications` ·
`/app/reglages` · `/app/reglages/appairage`

**Autre** — `/presentation` (slideshow projeté), `/sitemap.xml`, `/robots.txt`

### ⚠️ Route manquante

**`/simulateur` renvoie 404** alors qu'il est lié depuis le **menu principal
et le pied de page de chaque page**, et qu'une réponse de la FAQ d'accueil
y renvoie explicitement. C'est le défaut le plus grave du site.

### Navigation

- **Header** : logo à gauche · 6 liens (Comment ça marche, Produits, L'application, Simulateur, Ressources, Ombrair Pro) · bouton thème jour/nuit · CTA « Demander un devis ». Sous 640 px, le logo passe au symbole seul ; sous 768 px, menu burger.
- **Footer** : 4 colonnes (Produits, Ressources, Entreprise, Légal) + logo + mention légale du projet fictif.
- **App** : barre de navigation basse à 5 onglets (Accueil, Pièces, Programmes, Historique, Réglages). Mode auto, Sécurité et Notifications ne sont accessibles que depuis d'autres écrans.

### Configurateurs

- **Devis** (`/devis`) : parcours en 5 étapes — Logement → Équipement (Capteur / Volet / Fenêtre / Plusieurs) → Configuration (nombre d'ouvrants, format, existant, type d'intervention) → Coordonnées → Récapitulatif. **Aucun montant n'est calculé** : le récapitulatif l'annonce explicitement.
- **Vérificateur de compatibilité** (page Capteur) : deux questions (volets motorisés ? type de commande ?), trois états de réponse, tous étiquetés « démonstration ».
- **Sélecteur de dimensions** (pages Volet et Fenêtre) : 5 formats standard + sur-mesure, sans incidence tarifaire affichée.

---

## 3. Identité visuelle

Charte retenue : **concept 07 — « arche méditerranéenne »**.
Principe directeur : *« Une arche, trois lames, un mot en bas de casse :
l'ombre choisie plutôt que subie. »*

### Logo

Une **arche** (demi-cercle en haut, montants droits, base à angles adoucis)
contenant **trois lames horizontales**, suivie du logotype `ombrair`
**toujours en bas de casse**.

Géométrie relevée sur la planche : ratio **4 × 5**, arc de rayon = demi-largeur,
lames à 65,4 % de la largeur et 7,7 % de la hauteur, positionnées à 41,5 % /
58,5 % / 75,4 %. **La troisième lame est volontairement plus sourde** que les
deux autres — c'est la lame restée dans l'ombre.

Interdits : dégradé, ombre portée, contour, rotation, étirement, capitales
sur le logotype, recoloration en Fraîche ou Ambre.

### Palette

| Nom | Hex | Rôle |
|---|---|---|
| Persienne | `#33665a` | couleur principale de marque, action, encre |
| Nuit | `#161d23` | fond sombre |
| Chaux | `#f4f1e9` | fond clair |
| Fraîche | `#2e8c8c` | **thermique uniquement** — froid, ventilation favorable |
| Ambre | `#c4862f` | **thermique uniquement** — chaleur, soleil |
| Braise | `#c4402a` | alertes (hors charte, conservé pour l'app) |

**Règle stricte** : Fraîche et Ambre ne sont jamais décoratives. Elles
n'apparaissent que là où elles encodent une information de température. Le
site vit avec Chaux, Persienne et Nuit.

### Typographie

- **Outfit** — titres (Medium) et logotype (Light 300, interlettrage +0,06 em)
- **Instrument Sans** — corps de texte
- **IBM Plex Mono** — températures, heures, dimensions, pourcentages, prix

### Langage graphique

Plat, architectural, calme, beaucoup d'espace négatif, traits fins, rayon
de 5 px. Pas de glassmorphism, pas de dégradé, pas d'ombre marketing.
Registre visé : **catalogue d'architecture / menuiserie contemporaine**,
pas dashboard SaaS.

---

## 4. Description de l'interface actuelle

### Header
Très minimal. Logo (symbole + mot) à gauche en Persienne, navigation
centrée en petits caractères, bouton lune/soleil et CTA sombre à droite.
Une seule ligne, bordure fine en bas, aucune ombre.

### Homepage — 8 sections, **5 720 px de haut en desktop, 9 851 px en mobile**

1. **Hero** — deux colonnes. À gauche : titre « La fraîcheur, avant la
   chaleur. », paragraphe, **relevés en direct** (heure, ext., int.,
   humidité, luminosité, volet, fenêtre) en police mono, **deux curseurs**
   (ouverture du volet 0-100 %, orientation des lames 0-90°), badge
   auto/manuel, CTA devis. À droite : **une fenêtre où défile une journée
   complète de 24 h en 48 s** — ciel qui change de phase, soleil et lune
   qui traversent le cadre, volet à lames qui monte, descend et pivote
   selon un scénario automatique.
2. **Problème** — trois grands chiffres sourcés (11 %, 79 %, 48 %) avec
   liens vers Insee/Météo-France et une étude Ademe.
3. **Comment ça marche** — 4 étapes (Mesurer / Comprendre / Agir / Piloter),
   chacune associée à une brique produit.
4. **Vitrine produits** — trois cartes avec **illustration SVG dans une
   ouverture en arche** (≈ 40 % de la hauteur de carte), rôle, nom, promesse
   courte, prix en gros mono, trois points clés, mention de pack discrète, CTA.
   Sous les cartes : « Mesurer → Protéger → Ventiler ».
5. **Bande écosystème** — chaîne Capteurs → Ombrair Link → Volets et
   fenêtres → Application, plus une maquette d'interface, et le bénéfice
   « accès à l'application inclus à vie » énoncé **une seule fois**.
6. **Aperçu de l'app** dans un cadre de téléphone.
7. **Témoignages** — trois, explicitement étiquetés « persona fictif ».
8. **FAQ courte**, puis **CTA final** encadré, puis footer.

### Pages produit (Capteur / Volet / Fenêtre)
Structure identique pour les trois, générée par un gabarit commun :
titre + rôle + prix + CTA → bloc « Qui conçoit, qui fabrique » (✓/✗) →
« Ce qui est fourni » + pack → trois options d'installation avec prix →
sélecteur de dimensions (Volet et Fenêtre) → Compatibilité (+ vérificateur
sur Capteur) → « Dans l'application » / « Après l'installation » → FAQ.

**Ces pages ne contiennent aucun visuel produit** : elles sont intégralement
textuelles, alors que la page d'accueil montre de belles illustrations des
mêmes produits.

### Application `/app`
Mobile-first (390 px de référence), suit le thème jour/nuit choisi. En-tête
avec logo + mention « données simulées », barre de navigation basse à 5
onglets. Scénario unique et cohérent : **canicule à Toulouse, jeudi 21 août,
16:20**, ext. 37,2 °C, int. 25,8 °C.

Écrans : accueil (alerte canicule, températures, indice de confort avec
hypothèses dépliables, prochaine action, tout ouvrir / tout fermer),
pièces et ouvrants (capteurs int./ext., puis 5 pièces et 6 ouvrants avec
ouverture, orientation, réglage détaillé, mode, batterie, signal, dernière
action), mode auto, programmes et scénarios, sécurité, historique
(24 h / 7 j / 30 j, recharts, export CSV), notifications, réglages,
appairage guidé en 4 étapes.

### Footer
Quatre colonnes de liens, puis une ligne finale : logo à gauche, mention
« Projet étudiant fictif — aucune vente réelle. Université Toulouse Jean
Jaurès, 2026. » à droite.

---

## 5. État UI

### Forces
- **Palette et typographie parfaitement centralisées** : aucune couleur en
  dur dans les composants, aucune classe Tailwind de couleur native.
- **Le hero est réellement remarquable** : simulation 24 h continue, volet à
  deux degrés de liberté physiquement crédibles (levée du tablier + pivot
  des lames), reprise en main immédiate par l'utilisateur.
- **Les trois illustrations produit de l'accueil** forment une vraie
  collection : même famille graphique, compositions distinctes, arche commune.
- Densité maîtrisée, beaucoup d'espace négatif, rayon faible cohérent.

### Faiblesses
- **Les pages produit n'ont aucun visuel.** L'écart entre la vitrine de
  l'accueil (très soignée) et les pages produit (mur de texte) est frappant.
- **La homepage est très longue** (près de 10 000 px en mobile) sans
  repère de progression ni ancre.
- **L'arche, signature de la marque, n'apparaît que dans les trois cartes
  de l'accueil.** Ni le hero, ni les pages produit, ni l'app ne l'utilisent.
- Répétitions de prix sur les pages produit (jusqu'à 4 occurrences du même montant).
- Certaines sections sont quasi vides (« Compatibilité » sur Volet/Fenêtre : un titre et une phrase).

---

## 6. État UX

### Parcours principaux et frictions

| Parcours | État |
|---|---|
| Découvrir → comprendre → demander un devis | fonctionne, mais très long en mobile |
| J'ai déjà des volets électriques | **bien traité** : vérificateur de compatibilité concluant |
| Je veux une nouvelle fenêtre | correct, mais le prix affiché couvre fenêtre + volet, ce qui peut surprendre |
| Je ne veux que des capteurs | correct |
| Comprendre l'application | correct — page marketing + démo réelle |
| **Comprendre Ombrair Link** | **échec** : le terme apparaît 2 fois sur le site, n'est jamais défini, et coexiste avec « passerelle Ombrair » sans que le lien soit fait |

### Frictions majeures
1. **Un lien du menu principal mène à une 404** (`/simulateur`), et la FAQ
   d'accueil affirme que « le simulateur donne une fourchette de prix ».
2. **Ombrair Link n'est jamais expliqué.**
3. Le devis n'affiche **aucun montant**, même indicatif — c'est un choix
   honnête (aucune règle tarifaire n'existe) mais l'utilisateur repart sans
   ordre de grandeur.
4. L'URL `/gammes` et le libellé « Produits » ne correspondent pas.

---

## 7. Responsive

| Largeur | État |
|---|---|
| 360 px | aucun débordement |
| 390 px | aucun débordement |
| **768 px** | **débordement horizontal de 18 px** sur `/`, `/gammes`, `/gammes/volet`, `/devis` |
| 1280 / 1440 / 1920 px | aucun débordement |

**Cause identifiée** : à exactement 768 px, le header bascule en disposition
desktop (`md:`) et affiche navigation + bouton thème + CTA, qui ne rentrent
pas encore. Le contenu dépasse de 18 px.

---

## 8. Accessibilité — synthèse

**Points forts** : focus visible partout, navigation clavier complète, aucun
bouton sans nom accessible, aucun champ sans label, aucune image sans alt,
`prefers-reduced-motion` respecté (le hero se fige sur un instant
représentatif et l'annonce), curseurs natifs avec `aria-valuetext` parlant.

**Problèmes confirmés — tous des contrastes de couleur :**

| Combinaison | Ratio mesuré | Seuil AA | Où |
|---|---|---|---|
| Ambre `#c4862f` sur Chaux | **2,74** | 4,5 (texte normal) | relevés de température ext. |
| Ambre sur Chaux, 24 px | **2,74** | 3,0 (grand texte) | température de l'app |
| Fraîche `#2e8c8c` sur Chaux | **3,55** | 4,5 | relevés de température int. |
| Fraîche sur Nuit | **4,25** | 4,5 | idem, mode nuit |
| Persienne sur fond d'alerte teinté | **3,18** | 4,5 | bandeau canicule de l'app |

C'est la conséquence directe d'une règle de marque forte : Fraîche et Ambre
**doivent** porter l'information thermique. Les valeurs de la charte sont
belles mais insuffisantes pour du petit texte.

---

## 9. Top 10 des problèmes

1. **`/simulateur` en 404** alors qu'il est lié depuis le menu et le pied de page de tout le site.
2. **La FAQ promet une fonctionnalité inexistante** (« le simulateur donne une fourchette de prix »).
3. **Contraste d'Ambre sur Chaux à 2,74** — sous le seuil AA, y compris en grand texte.
4. **Débordement horizontal de 18 px à 768 px** (tablette portrait).
5. **Les pages produit n'ont aucun visuel produit.**
6. **Ombrair Link n'est jamais expliqué** et coexiste avec « passerelle ».
7. **Contraste de Fraîche** sous AA sur les deux fonds.
8. **L'arche est absente partout sauf dans trois cartes** — la signature de marque n'irrigue pas le site.
9. **Homepage de 9 851 px en mobile**, sans repère de navigation interne.
10. **Prix répétés jusqu'à 4 fois** sur une même page produit.

---

## 10. Captures disponibles

35 captures dans `audit/screenshots/` — 32 captures de page nommées
`<page>-<viewport>-<thème>.png`, plus 3 captures de défaut préfixées
`issue-<ID>-`. Les plus utiles pour juger l'UI :

- `home-desktop-jour.png` / `home-desktop-nuit.png` — page entière
- `home-mobile-jour.png` — la longueur du parcours mobile
- `gammes-desktop-jour.png` — index produits
- `produit-volet-desktop-jour.png` — **illustre l'absence de visuel produit**
- `produit-capteur-desktop-jour.png` — avec vérificateur de compatibilité
- `devis-desktop-jour.png` — configurateur
- `app-accueil-mobile-jour.png` / `app-accueil-mobile-nuit.png`
- `app-pieces-mobile-jour.png` — écran le plus dense de l'app
- `app-historique-mobile-jour.png` — graphiques
- `issue-RESP-001-home-768.png` — le débordement tablette
- `simulateur-404-desktop.png` — la 404

Voir `AUDIT_SCREENSHOTS.md` pour l'index complet et la description
textuelle des captures principales.
