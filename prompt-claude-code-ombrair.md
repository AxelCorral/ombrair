# Prompt Claude Code — Projet « Ombrair »

> À coller tel quel dans Claude Code (démarrer en mode plan).
> Répertoire suggéré : `D:\Project_claude_code\ombrair`

---

## CONTEXTE

Tu es lead designer + développeur front d'un petit studio. Tu construis l'intégralité de la présence produit d'une entreprise **fictive** créée dans le cadre d'un projet universitaire de création d'entreprise (Master MIASHS, Université Toulouse Jean Jaurès) sur la problématique des **canicules et du confort thermique du logement**.

Deux livrables dans un seul projet Next.js :
1. **Un site vitrine complet** (marketing, offres, tarifs, tunnel de devis).
2. **Une démo d'application** de pilotage (mobile-first, données simulées) accessible sur `/app`.

Tout est fictif mais doit être **cohérent, plausible et vérifiable dans ses hypothèses**. Aucun chiffre de performance ne doit être affirmé comme un fait mesuré : toute estimation (économies, degrés gagnés) doit afficher ses hypothèses de calcul à côté d'elle. Le pied de page de chaque page porte la mention : *« Projet étudiant fictif — aucune vente réelle. Université Toulouse Jean Jaurès, 2026. »*

---

## L'ENTREPRISE

**Nom : Ombrair**
Contraction d'*ombre* et d'*air*.

**Baseline :** « La fraîcheur, avant la chaleur. »

**Proposition de valeur :** des volets et fenêtres connectés pilotés par des capteurs intérieurs et extérieurs (température, humidité, luminosité, qualité d'air) qui décident automatiquement du bon moment pour ouvrir et fermer — fermer avant que le soleil ne tape, ouvrir la nuit quand l'air extérieur devient plus frais que l'air intérieur. Le geste que personne ne fait au bon moment, fait au bon moment.

**Cible principale :** propriétaires occupants 35-65 ans en maison ou appartement traversant, zones à fort risque canicule (Sud-Ouest, Sud-Est, vallée du Rhône). **Cible secondaire :** bailleurs sociaux, EHPAD, écoles (offre Pro, sur devis).

**Le mécanisme, en une phrase à réutiliser dans le site :** quand l'extérieur est plus chaud que l'intérieur, on ferme ; quand il devient plus frais, on ouvre. Ombrair mesure les deux en continu et agit tout seul.

---

## DIRECTION ARTISTIQUE (à suivre exactement)

L'univers de référence n'est pas la domotique lisse et bleutée : c'est la **menuiserie** et la **persienne méditerranéenne**. Bois peint, lames horizontales, lumière rasante qui découpe le sol en bandes.

### Palette (noms + hex, à implémenter en variables CSS)

| Rôle | Nom | Hex |
|---|---|---|
| Fond clair | Chaux | `#EDEEE8` |
| Encre / fond sombre | Persienne | `#1E3A35` |
| Fond app (dark) | Nuit | `#101E1C` |
| Accent froid (état « ouvert / frais ») | Fraîche | `#5FC2B4` |
| Accent chaud (état « fermé / chaud ») | Ambre | `#E9A13B` |
| Alerte (canicule, vent, effraction) | Braise | `#C4402A` |

Règle stricte : `Fraîche` et `Ambre` ne sont **jamais** décoratifs. Ils encodent toujours une information thermique (froid/chaud, ouvert/fermé). `Braise` est réservé aux alertes.

Interdits explicites : dégradé violet SaaS, blobs 3D, fond crème `#F4F1EA` avec accent terracotta, hero « gros chiffre + petit label + dégradé ».

### Typographie

- **Display : Archivo** (variable, largeurs Expanded, graisse 600-700). Titres larges, architecturaux, en bandes horizontales.
- **Texte : Instrument Sans** (400/500).
- **Données : IBM Plex Mono** — exclusivement pour les relevés de capteurs, températures, heures, pourcentages d'ouverture. Un capteur affiche une mesure, donc il parle en chiffres d'instrument.

Casse phrase partout (pas de Title Case anglo-saxon). Échelle typographique nette et assumée, pas de tailles intermédiaires molles.

### Système graphique — « la lame »

L'élément signature du site est **la lame de volet**. Les séparations de sections, les états, les révélations au scroll utilisent des bandes horizontales dont l'espacement encode le taux d'ouverture. Rayon de bordure faible (4-6 px) : on est dans la menuiserie, pas dans la pilule iOS.

**Signature du hero :** un volet interactif. L'utilisateur fait glisser un curseur d'ouverture (0-100 %) ; les lames s'écartent, la lumière projetée sur la pièce en arrière-plan change, et deux relevés en mono évoluent en direct (`ext. 37,2 °C` / `int. 25,8 °C`). C'est la thèse du produit rendue manipulable en trois secondes, sans une ligne d'argumentaire.

### Motion

Un seul moment orchestré : l'ouverture des lames au chargement du hero. Ailleurs, micro-interactions discrètes uniquement. `prefers-reduced-motion` respecté partout (les lames apparaissent ouvertes, sans animation).

---

## GAMMES ET TARIFS

Trois gammes + une offre Pro. L'accès à l'application est **inclus à vie, sans abonnement**, dans les trois cas — c'est un argument central à afficher sur chaque carte tarifaire.

### 1. Ombrair Signal — pour volets électriques existants
*Vous avez déjà des volets roulants électriques. On leur donne un cerveau.*
- **Kit de base : 349 €** — 1 passerelle Ombrair (Wi-Fi + radio), 1 capteur extérieur (température, humidité, luminosité), 2 capteurs intérieurs, 2 modules de pilotage à clipser dans les coffres de volets existants.
- Capteur intérieur supplémentaire : **49 €** — Module de pilotage supplémentaire : **39 €**
- Installation par un technicien Ombrair (optionnelle) : **149 €**
- Compatibilité : volets filaires et radio des principales marques (afficher un vérificateur de compatibilité sur la page).

### 2. Ombrair Store — pose de volets sur fenêtres existantes
*Vos fenêtres vont bien. Il leur manque une protection pilotée.*
- **À partir de 690 € par ouvrant, posé** — volet roulant connecté, motorisation solaire ou filaire, coffre extérieur ou rénovation.
- **Pack 4 ouvrants : 2 890 €**, kit Signal complet inclus (passerelle + 4 capteurs).
- Devis sur mesure au-delà, en fonction des dimensions et du type de pose.

### 3. Ombrair Intégral — fenêtres + volets
*Le double vitrage et la protection solaire conçus comme un seul système.*
- **À partir de 1 590 € par ouvrant, posé** — fenêtre double vitrage à contrôle solaire (aluminium ou PVC) + volet connecté + capteurs.
- **Pack 4 ouvrants : 6 490 €**
- TVA 5,5 %, éligible aux aides à la rénovation énergétique (MaPrimeRénov', CEE) sous conditions — le formuler au conditionnel, avec un lien vers France Rénov'.

### Ombrair Pro — bailleurs, EHPAD, établissements scolaires
Sur devis. Tableau de bord multi-sites, supervision de flotte, plan de gestion canicule, export de données pour les plans bleus. Page dédiée avec formulaire de contact.

### Option Ombrair+ — 4,99 €/mois
Explicitement facultative, jamais requise : prévision météo 7 jours intégrée à l'algorithme, pilotage multi-résidences, rapports mensuels de confort, historique illimité (l'app gratuite garde 90 jours).

---

## SITE VITRINE — ARBORESCENCE ET CONTENU

Rédige de vrais textes en français. Aucun lorem ipsum, aucune phrase creuse type « solutions innovantes ». Ton : direct, concret, tutoiement exclu, vouvoiement sobre.

1. **Accueil** — hero avec le volet interactif ; le problème en trois chiffres sourcés (nuits tropicales, surchauffe des logements — citer les sources : Météo-France, Ademe, avec liens) ; « comment ça marche » en 4 étapes (mesurer / anticiper / agir / apprendre) ; les 3 gammes en aperçu ; démo de l'app dans un cadre de téléphone ; témoignages clairement identifiés comme *personas fictifs* ; FAQ courte ; CTA devis.
2. **Comment ça marche** — la logique de décision expliquée sans jargon, schéma d'une journée type (courbe int/ext sur 24 h avec les moments d'ouverture/fermeture marqués), matériel détaillé, ce que l'algorithme prend en compte, ce qu'il ne fait pas.
3. **Gammes** — page index comparative + une page par gamme (Signal, Store, Intégral) avec contenu du kit, prix, déroulé de l'installation, compatibilités, FAQ spécifique.
4. **L'application** — parcours des écrans, captures intégrées dans un cadre mobile, lien vers la démo `/app`.
5. **Simulateur** — l'utilisateur saisit sa ville, son type de logement, son orientation, sa surface vitrée et le nombre d'ouvrants. Sortie : gain de confort estimé en °C, économie de climatisation estimée, gamme recommandée, fourchette de prix. **Chaque résultat affiche un bloc « hypothèses de calcul » dépliable détaillant la formule et ses limites.** Estimation, jamais promesse.
6. **Ombrair Pro** — offre collectivités et bailleurs, formulaire de contact.
7. **Ressources** — 4 à 6 articles rédigés sur la canicule et le logement (rafraîchissement nocturne, inertie thermique, pourquoi la clim n'est pas la seule réponse, protéger une personne âgée pendant un épisode caniculaire). Contenu réel, sourcé.
8. **À propos** — l'origine du projet, l'équipe (personas fictifs), la position sur les données personnelles.
9. **Devis** — formulaire multi-étapes (logement → ouvrants → gamme → coordonnées), récapitulatif, confirmation. Aucun envoi réel : afficher un écran de confirmation simulé.
10. **Contact**, **FAQ**, **Mentions légales**, **Politique de confidentialité (RGPD)** — traitement des données capteurs, durée de conservation, hébergement UE, droit à l'effacement.

---

## APPLICATION `/app` — ÉCRANS

Mobile-first (viewport 390 px de référence), thème sombre par défaut (`Nuit`), données simulées et cohérentes entre elles. Navigation par barre inférieure : Accueil · Pièces · Programmes · Historique · Réglages.

1. **Accueil** — température intérieure et extérieure en gros mono, indice de confort, état global (« Volets fermés — l'extérieur est à 8 °C au-dessus de l'intérieur »), prochaine action prévue avec son heure et sa raison, boutons Tout ouvrir / Tout fermer, bandeau d'alerte canicule si le scénario le déclenche.
2. **Pièces et ouvrants** — logement organisé par pièce (Séjour, Chambre 1, Chambre 2, Cuisine, Bureau) ; par ouvrant : nom, type (volet / fenêtre / les deux), pourcentage d'ouverture réglable, mode auto ou manuel, niveau de batterie, force du signal, dernière action et sa cause.
3. **Mode auto** — les préférences qui pilotent l'algorithme : température cible par pièce, plage horaire de rafraîchissement nocturne, seuil d'écart int/ext déclenchant l'ouverture, priorité confort ou économie, tolérance à la luminosité (« ne pas plonger le séjour dans le noir avant 14 h »).
4. **Programmes et scénarios** — scénarios prédéfinis modifiables : *Canicule*, *Absence*, *Nuit fraîche*, *Télétravail*, *Vacances*. Éditeur de règles simple (déclencheur → condition → action), programmation horaire hebdomadaire.
5. **Sécurité** — verrouillage des volets, simulation de présence pendant les absences, détection d'ouverture forcée, fermeture automatique sur alerte vent ou pluie, code PIN pour les réglages sensibles, journal des accès.
6. **Historique** — courbes int/ext sur 24 h, 7 j, 30 j (recharts), superposition des actions du système sur la courbe, degrés-heures de surchauffe évités (avec méthode de calcul accessible), export CSV.
7. **Notifications** — centre de notifications : alerte canicule à J-1, batterie faible, capteur hors ligne, fenêtre restée ouverte alors que la température monte.
8. **Réglages** — profil du logement, gestion des membres du foyer et de leurs droits, appairage d'un nouveau capteur (parcours d'onboarding complet en 4 étapes, avec état vide et état d'erreur rédigés), calibration, mise à jour firmware, données et confidentialité, à propos.

Rédige les états vides et les états d'erreur : ils expliquent quoi faire, sans s'excuser et sans être vagues.

---

## STACK ET CONTRAINTES TECHNIQUES

- **Next.js 15 (App Router) + TypeScript strict + Tailwind CSS v4 + shadcn/ui**
- `lucide-react` pour les icônes, `recharts` pour les graphiques, `framer-motion` avec parcimonie
- Aucun backend, aucune base de données, aucune authentification réelle : toutes les données viennent de fichiers `lib/mock/*.ts` typés, cohérents et réalistes (une journée type de canicule à Toulouse, 21 au 23 août)
- Design tokens centralisés dans `app/globals.css` (variables CSS) — aucune valeur hexadécimale en dur dans les composants
- Composants factorisés, pas de copier-coller entre pages
- Accessibilité : contrastes AA, focus visible, navigation clavier complète, `aria-label` sur les contrôles d'ouverture, respect de `prefers-reduced-motion`
- SEO : métadonnées par page, Open Graph, `sitemap.ts`, `robots.ts`
- Responsive de 360 px à 1920 px
- Le simulateur et l'app tournent entièrement côté client
- `README.md` : installation, structure, où modifier les tarifs et les tokens, et une note rappelant le caractère fictif du projet

---

## MÉTHODE DE TRAVAIL

1. **Ne code rien tout de suite.** Commence par un plan : arborescence de fichiers, système de tokens, choix de layout du hero comparés en deux ou trois wireframes ASCII, et l'élément signature retenu. Soumets ce plan avant d'écrire du code.
2. Relis ton plan contre le brief : si une partie ressemble à ce que tu produirais pour n'importe quel site de domotique, révise-la et dis ce que tu as changé.
3. Construis par incréments vérifiables, dans cet ordre : socle et tokens → composants partagés (header, footer, lame, carte tarifaire, cadre mobile) → accueil → gammes → autres pages du site → app → simulateur → polish.
4. Après chaque incrément, lance le build, corrige les erreurs, et fais un point court sur ce qui est fait et ce qui reste.
5. Si un choix de contenu est ambigu (un chiffre, une source, une mention légale), pose la question plutôt que d'inventer une donnée présentée comme factuelle.
6. Termine par une passe critique : liste ce que tu retirerais si tu ne pouvais garder qu'un seul effet visuel, et retire-le.

---

## CRITÈRES D'ACCEPTATION

- [ ] `npm run build` passe sans erreur ni warning TypeScript
- [ ] Les 10 pages du site et les 8 écrans de l'app existent et sont remplis de contenu rédigé
- [ ] Le hero interactif fonctionne à la souris, au clavier et au tactile
- [ ] Aucune couleur en dur hors des variables CSS
- [ ] Chaque estimation chiffrée s'accompagne de ses hypothèses
- [ ] La mention « projet étudiant fictif » figure dans le pied de page et dans le README
- [ ] Aucun `lorem ipsum`, aucun `TODO` laissé dans le code livré
- [ ] Navigation clavier complète sur le site et l'app
