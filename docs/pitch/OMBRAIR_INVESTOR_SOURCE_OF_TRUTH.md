# OMBRAIR — SOURCE DE VÉRITÉ POUR LE DECK INVESTISSEURS

> Audit du dépôt au 27 août 2026. Ce document consolide uniquement les informations présentes dans le projet. Ombrair y est explicitement décrit comme un **projet étudiant fictif**, sans vente réelle, réalisé dans le cadre du Master MIASHS de l'Université Toulouse Jean Jaurès en 2026. Les éléments décrivant le produit ou le commerce sont donc des choix documentés du concept, et non des preuves d'activité d'une société existante.

## Légende de statut

- **CONFIRMÉE PAR LE PROJET** : information explicite et cohérente dans les sources actuelles du dépôt. Ce statut ne transforme pas un concept fictif en fait réel.
- **HYPOTHÈSE DU BUSINESS PLAN** : hypothèse explicitement issue d'un business plan ou d'une projection financière. Aucun business plan n'a été trouvé dans le dépôt ; ce statut n'est donc attribué à aucune donnée.
- **À CONFIRMER** : intention, promesse future, donnée conceptuelle non validée dans le monde réel, source contradictoire ou élément nécessitant une décision du porteur de projet.
- **ABSENTE** : information recherchée mais non trouvée dans les fichiers audités.

## Hiérarchie des sources et conflits résolus

1. La source tarifaire actuelle est `lib/offres.ts`. Elle se déclare source unique de vérité et alimente le site, le devis et le simulateur. **Statut : CONFIRMÉE PAR LE PROJET.**
2. `lib/tarifs.ts` est la source actuelle des définitions produit, de la fabrication, d'Ombrair Pro, d'Ombrair+ et de l'accès à l'application. **Statut : CONFIRMÉE PAR LE PROJET.**
3. `lib/pionniers.ts` est la source actuelle du programme Ombrair Pionniers. **Statut : CONFIRMÉE PAR LE PROJET.**
4. Le brief initial `prompt-claude-code-ombrair.md` contient une ancienne architecture de gammes et d'anciens prix. `lib/tarifs.ts` précise explicitement qu'ils « n'existent plus ». Ils ne doivent pas être repris dans le deck comme tarifs actuels. **Statut des anciens tarifs : À CONFIRMER / OBSOLÈTES DANS LE PROJET.**
5. Le dépôt ne contient ni business plan, ni tableur financier, ni projections annuelles, ni cap table, ni dossier de financement. **Statut : ABSENTE.**

## 1. Proposition de valeur actuelle

**CONFIRMÉE PAR LE PROJET**

Ombrair automatise les gestes de protection solaire et de ventilation du logement : les capteurs comparent les conditions intérieures et extérieures, les volets protègent du soleil, les fenêtres motorisées ventilent lorsque l'air extérieur redevient plus frais, et l'utilisateur conserve la main depuis l'application.

Formulations documentées :

- baseline historique : « La fraîcheur, avant la chaleur. » ;
- mécanisme : fermer lorsque l'extérieur devient plus chaud que l'intérieur et ouvrir lorsqu'il redevient plus frais ;
- promesse fonctionnelle actuelle : « Les capteurs mesurent, les volets protègent et les fenêtres ventilent. » ;
- accès à l'application inclus à vie, sans abonnement obligatoire.

**À CONFIRMER**

- La baseline définitive à employer dans le deck : elle existe dans le brief initial, mais n'est pas structurée comme donnée centrale dans les sources commerciales actuelles.
- Toute performance thermique, économie d'énergie, réduction de température ou retour sur investissement : le projet interdit de les présenter comme mesurés et n'en fournit aucun résultat validé.

Sources : `prompt-claude-code-ombrair.md`, `app/(site)/page.tsx`, `lib/tarifs.ts`, `app/(site)/simulateur/page.tsx`.

## 2. Fonctionnement exact de l'écosystème

**CONFIRMÉE PAR LE PROJET**

Chaîne fonctionnelle :

1. Les capteurs relèvent température, humidité et luminosité.
2. Ils transmettent leurs relevés en radio locale à Ombrair Link.
3. Ombrair Link compare les conditions intérieur/extérieur et exécute localement la logique de décision.
4. Ombrair Link commande les modules/actionneurs des volets et fenêtres.
5. Ombrair Link transmet l'état du logement à l'application via Wi-Fi.
6. Sans Internet, mesure, comparaison et commande automatique continuent localement ; consultation à distance et prévision météo Ombrair+ s'interrompent.
7. La commande manuelle demeure possible à tout moment.

Ombrair Link est décrit comme une passerelle et un « cerveau local », non comme un capteur. Il ne génère donc pas de Crédit Pionnier.

**À CONFIRMER**

- Protocole radio précis, portée, cybersécurité, redondance, consommation et certifications : non spécifiés.
- Le contenu actuel du produit Capteur mentionne l'intégration à Ombrair Link mais la grille tarifaire actuelle ne publie pas de prix séparé pour Ombrair Link et ne dit pas explicitement dans quelle offre physique il est livré.

Sources : `components/site/ombrair-link.tsx`, `components/site/diagramme-ecosysteme.tsx`, `app/(site)/faq/page.tsx`, `lib/tarifs.ts`.

## 3. Produits et caractéristiques

### Capteur Ombrair

**CONFIRMÉE PAR LE PROJET**

- Rôle : mesurer et analyser.
- Mesures : température, humidité, luminosité.
- Contenu annoncé : un capteur, fixation et pile, appairage guidé, intégration à Ombrair Link.
- Conçu et fabriqué par Ombrair selon le modèle projet : carte électronique, firmware et intégration logicielle ; composants électroniques unitaires achetés à des fournisseurs.
- Pose possible sans outil ou par technicien ; option de réglage du mode automatique.

**À CONFIRMER**

- Le site parle parfois de capteurs intérieurs et extérieurs, alors que la nouvelle unité commerciale est « un capteur ». Les variantes exactes, leur étanchéité, leurs capteurs embarqués et leur nomenclature industrielle restent à fixer.
- Le modèle 3D extérieur est un démonstrateur visuel, pas un dossier de fabrication. Ses 80 × 60 × 26 mm sont une cote de concept et les autres cotes sont graphiques.

### Volet Ombrair

**CONFIRMÉE PAR LE PROJET**

- Rôle : protéger et automatiser.
- Volet roulant motorisé, motorisation solaire ou filaire, coffre extérieur ou rénovation, module de commande Ombrair, intégration à l'application.
- Formats standards présentés : 60 × 75, 80 × 100, 100 × 125, 140 × 125 et 180 × 215 cm ; sur-mesure possible après relevé.
- Volets et motorisations issus de fabricants spécialisés ; Ombrair sélectionne, revend, installe, configure, connecte et maintient.
- Cas de pose : module sur volet existant compatible ; remplacement ; pose et mise en service complète.

**À CONFIRMER**

- Marques compatibles, fournisseurs, références, conditions d'approvisionnement et garanties.
- Les dimensions n'ont actuellement aucune incidence tarifaire publiée.

### Fenêtre Ombrair

**CONFIRMÉE PAR LE PROJET**

- Rôle : ventiler et automatiser.
- Fenêtre double vitrage à contrôle solaire, aluminium ou PVC, actionneur motorisé, module de commande et intégration à l'application.
- Formats présentés identiques à ceux du volet, plus sur-mesure.
- Menuiserie et actionneur issus de fabricants spécialisés ; Ombrair sélectionne, revend, installe, configure et intègre.
- Motorisation d'une fenêtre existante sous réserve de compatibilité ; remplacement total ou pose complète.

**À CONFIRMER**

- Le visuel/démonstrateur 3D et sa simulation ne sont ni calibrés sur un produit industriel ni une preuve de performance physique.
- Fournisseurs, caractéristiques vitrage, performances certifiées et contraintes de sécurité d'ouverture.

### Application et logiciel

**CONFIRMÉE PAR LE PROJET**

- Démo mobile avec accueil, pièces/ouvrants, mode automatique, programmes, sécurité, historique, notifications, réglages et appairage.
- Fonctions conceptuelles : commandes manuelles, scénarios, seuils par pièce, historique, alertes, gestion des membres, export CSV, firmware et confidentialité.
- Données de démonstration cohérentes mais simulées ; aucun backend, aucune authentification, aucun équipement réel connecté.
- Historique prévu : 90 jours dans l'accès inclus ; illimité avec Ombrair+.

Sources : `lib/tarifs.ts`, `app/app/**`, `audit/AUDIT_APP.md`, `docs/3d/*.md`, `app/(site)/confidentialite/page.tsx`.

## 4. Tarifs officiels actuels

**CONFIRMÉE PAR LE PROJET — grille actuelle de `lib/offres.ts`**

| Offre | Produit seul | Installation Ombrair optionnelle | Total avec installation | Unité |
|---|---:|---:|---:|---|
| Capteur Ombrair | 79,99 € | 119,99 € | 199,98 € | par capteur |
| Volet Ombrair | 349,99 € | 179,99 € | 529,98 € | par ouvrant |
| Fenêtre Ombrair | 1 499,99 € | 499,99 € | 1 999,98 € | par ouvrant |
| Pack Capteur + Volet | 399,99 € | 179,99 € | 579,98 € | un capteur et un ouvrant |
| Pack Capteur + Fenêtre | 1 549,99 € | 499,99 € | 2 049,98 € | un capteur et un ouvrant |
| Ombrair Pro | Sur devis | Sur devis | Sur devis | périmètre étudié |
| Ombrair+ | 4,99 €/mois | — | 4,99 €/mois | option facultative |

Économies pack, calculées depuis la grille :

- Pack Capteur + Volet : 29,99 € de moins que les produits séparés (429,98 €).
- Pack Capteur + Fenêtre : 29,99 € de moins que les produits séparés (1 579,98 €).

**À CONFIRMER**

- TVA incluse ou hors taxes, taux de TVA, frais de livraison, marge, validité géographique et durée de validité de la grille.
- Le caractère économiquement viable de ces prix : aucun coût de revient ni test de marge n'est fourni.

### Tarifs historiques à ne pas utiliser comme prix actuels

**À CONFIRMER / OBSOLÈTES DANS LE PROJET**

Le brief initial indiquait : Signal 349 €, Store dès 690 €/ouvrant posé, Intégral dès 1 590 €/ouvrant posé, packs quatre ouvrants à 2 890 € et 6 490 €, capteur additionnel 49 €, module 39 €, installation Signal 149 €. `lib/tarifs.ts` indique explicitement que ces offres ont disparu après migration vers le modèle « produit + installation optionnelle ».

## 5. Packs et installations

**CONFIRMÉE PAR LE PROJET**

- Deux packs actuels seulement : Capteur + Volet et Capteur + Fenêtre.
- Chaque pack associe un capteur et un ouvrant.
- L'installation est toujours distincte du produit et optionnelle dans la logique commerciale.
- Le tarif d'installation d'un pack est propre au pack, non la somme des poses unitaires.
- Le total est multiplié par la quantité d'ouvrants.
- Installation décrite : choix/relevé, pose ou raccordement, appairage, configuration, mise en service ; pour Pro, échange, visite puis étude chiffrée.

**À CONFIRMER**

- Faisabilité réelle d'une vente sans installation Ombrair pour les fenêtres et certains volets.
- Réseau d'installateurs, couverture géographique, temps d'intervention, SAV, garantie, assurance décennale et coûts opérationnels.

Sources : `lib/offres.ts`, `lib/tarifs.ts`, `components/site/choix-installation.tsx`, `app/(site)/pro/page.tsx`.

## 6. Modèle industriel

**CONFIRMÉE PAR LE PROJET — comme modèle conceptuel**

- Ombrair internalise la conception du capteur, la carte électronique, le firmware et l'intégration logicielle.
- Le projet affirme qu'Ombrair assemble/fabrique le capteur à partir de composants fournisseurs.
- Ombrair n'internalise pas la conception ni la fabrication des volets, motorisations, fenêtres et actionneurs.
- Ces équipements viennent de fabricants spécialisés ; Ombrair les sélectionne, revend, installe, configure, connecte et maintient.
- La valeur intégrée par Ombrair est donc le capteur, Ombrair Link/la logique locale, le logiciel, l'intégration multi-équipements, l'installation et la maintenance.

**À CONFIRMER**

- Site d'assemblage, make-or-buy exact, volumes, capacité, fournisseurs, BOM, coûts unitaires, outillage, MOQ, stocks, délais, contrôle qualité, certifications CE/radio/électriques, propriété intellectuelle, contrats fabricants et logistique inverse.
- Le terme « fabriqué par Ombrair » n'est soutenu par aucun dossier industriel réel dans le dépôt.

## 7. Modèle économique

**CONFIRMÉE PAR LE PROJET — structure de revenus prévue**

- Vente directe de capteurs, volets, fenêtres et packs.
- Vente optionnelle d'installation par offre.
- Revente/intégration d'équipements de fabricants spécialisés.
- Option récurrente Ombrair+ à 4,99 €/mois.
- Offre B2B/B2G Ombrair Pro sur devis.
- Accès aux fonctions principales de l'application inclus à vie, sans abonnement obligatoire.

**À CONFIRMER**

- Part respective matériel/installation/abonnement/maintenance dans le chiffre d'affaires.
- Marge brute, marge d'installation, coût d'acquisition, coût du SAV, churn, taux d'attachement Ombrair+, fréquence de remplacement et revenus de maintenance.
- Canal de vente, modalités de paiement, financement client, remises, commissions et partenaires.

**ABSENTE**

- Unit economics, compte de résultat prévisionnel, seuil de rentabilité et plan de trésorerie.

## 8. Go-to-market

**CONFIRMÉE PAR LE PROJET — canaux et parcours présents dans le prototype**

- Site vitrine avec catalogue, démonstrations interactives, simulateur de configuration/prix, tunnel de devis, formulaire contact et ressources éditoriales.
- Parcours particuliers : découverte → compréhension → sélection produit/pack → choix de l'installation → devis.
- Parcours Pro : formulaire → échange → visite → étude chiffrée.
- Contenus marketing sur canicule, ventilation nocturne, inertie, climatisation et personnes âgées.
- Campagne Ombrair Pionniers prévue comme argument secondaire ; quatre angles sociaux documentés : premiers clients, histoire, exemple chiffré, transparence.

**À CONFIRMER**

- La campagne Pionniers est explicitement conceptuelle et « pas un plan média destiné à être exécuté ».
- Priorité de lancement géographique, calendrier, budget, canaux payants, distribution, partenariats installateurs/fabricants, objectifs de leads, taux de conversion et stratégie commerciale terrain.

## 9. Cible client

**CONFIRMÉE PAR LE PROJET — cible définie dans le concept**

- Cible principale : propriétaires occupants de 35 à 65 ans, en maison ou appartement traversant, dans les zones à fort risque canicule ; zones citées : Sud-Ouest, Sud-Est, vallée du Rhône.
- Besoins illustrés : logement inoccupé en journée, chambre exposée à l'ouest, logement traversant nécessitant une ventilation nocturne au bon moment.
- Cible secondaire / Pro : bailleurs sociaux, EHPAD, écoles et autres collectivités.

**À CONFIRMER**

- Validation par entretiens, taille de chaque segment, capacité à payer, persona décideur/payeur, cycle de vente, critères d'adoption et priorisation du premier segment.

## 10. Différenciation

**CONFIRMÉE PAR LE PROJET — différenciation revendiquée**

- Automatisation conjointe de l'ombre et de l'air à partir de mesures intérieures/extérieures.
- Décision locale dans Ombrair Link, maintien de l'automatisation sans Internet.
- Écosystème intégrant capteurs, volets, fenêtres, installation et application.
- Fonctions principales de l'application incluses à vie.
- Choix entre équipement de l'existant et remplacement/pose d'ouvrants.
- Maîtrise déclarée du capteur, du firmware et de l'intégration, avec sourcing de menuiseries spécialisées.

**À CONFIRMER**

- Aucun benchmark concurrentiel, brevet, liberté d'exploitation, comparaison de prix/performance ou avantage défendable n'est présent.
- Aucun résultat terrain ne démontre que la logique produit surclasse une box domotique, un volet connecté, une protection solaire automatique ou un système de gestion technique existant.

## 11. Éléments réalisés / preuve d'exécution

**CONFIRMÉE PAR LE PROJET — preuve de réalisation numérique**

- Site Next.js complet, pages produit, Pro, application, ressources, devis, FAQ, mentions et confidentialité.
- Démo applicative cohérente sur plusieurs écrans, alimentée par données simulées centralisées.
- Simulateur de configuration et de tarifs ne promettant ni degrés gagnés ni économies non prouvées.
- Démonstrations 3D procédurales volet/fenêtre et modèle GLB du capteur extérieur ; rapports de conception et de recette associés.
- Présentation projetée web et versions PowerPoint/PDF produit-service.
- Design system, identité Ombrair, responsive, thème clair/sombre et accessibilité documentés.
- Audit technique du 25 août 2026 : lint sans erreur, TypeScript strict, 54 tests/16 suites sans échec, build réussi, 35 pages statiques, aucune erreur console sur 32 captures. Des rapports 3D ultérieurs mentionnent jusqu'à 149 tests réussis après extensions ; le nombre dépend donc du commit audité.
- Rapport 3D volet : 149 tests réussis, build et lint réussis, tests visuels multi-largeurs et scènes intérieures/extérieures.

**À CONFIRMER**

- L'état exact du build et le nombre de tests au commit courant doivent être revalidés avant le deck.
- Aucune preuve de prototype matériel fonctionnel, pilote terrain, commande fournisseur, certification, brevet, vente, chiffre d'affaires, client, LOI, partenariat ou mesure thermique réelle.

Sources : `audit/AUDIT_TECHNICAL_FRONTEND.md`, `audit/AUDIT_EXECUTIVE_SUMMARY.md`, `AVANCEMENT.md`, `docs/3d/*.md`, `presentation/`.

## 12. Programme Ombrair Pionniers

**CONFIRMÉE PAR LE PROJET — mécanisme conceptuel**

- Message : « Les premiers devraient compter davantage. »
- Règle : 1 capteur acheté = 1 Crédit Pionnier.
- Un crédit est associé au compte client, non cessible, sans valeur financière actuelle.
- Ombrair Link, volets, fenêtres et modules de pilotage ne génèrent pas de crédit.
- Chaque pack actuel contient un capteur et génère donc un crédit.
- Si une opération future le permettait, les crédits pourraient éventuellement ouvrir droit à une attribution d'actions, selon les conditions juridiques, fiscales et opérationnelles alors applicables.
- Aucune IPO n'est planifiée ni garantie ; aucune action n'est attribuée aujourd'hui ; aucune promesse de rendement.
- Programme explicitement fictif et conceptuel, sans validation juridique revendiquée.

**À CONFIRMER**

- Décision de conserver ce programme dans un deck investisseurs : il peut créer une confusion réglementaire et capitalistique alors que ses modalités sont entièrement indéterminées.
- Cadre juridique, fiscal, comptable, conditions d'éligibilité, durée, plafond, conversion, dilution et traitement des données client.

Sources : `lib/pionniers.ts`, `marketing/OMBRAIR_PIONNIERS_CAMPAIGN.md`, `marketing/OMBRAIR_PIONNIERS_SOCIAL.md`, `app/(site)/pionniers/page.tsx`.

## 13. Projections financières année par année

**ABSENTE**

Aucune projection annuelle de chiffre d'affaires, volumes, coûts, marge brute, EBITDA, résultat net, trésorerie, effectifs ou cash burn n'a été trouvée. Aucun business plan financier n'est présent.

## 14. Financement initial prévu / acquis

### Prévu

**ABSENTE**

Aucun besoin de financement initial, apport fondateur, prêt, subvention, avance, budget R&D, budget industrialisation ou budget de lancement n'est documenté.

### Acquis

**ABSENTE**

Aucun financement acquis, apport versé, subvention obtenue, prêt signé, investisseur engagé ou montant en banque n'est documenté.

## 15. Montant de levée recherché

**ABSENTE**

Aucun montant de levée, instrument, valorisation, dilution cible, emploi des fonds ou runway visé n'a été trouvé.

## 16. TAM / SAM / SOM

**ABSENTE**

Aucun TAM, SAM ou SOM n'est calculé dans le projet. Aucun nombre de foyers adressables, ouvrants, bâtiments cibles ou valeur de marché n'est consolidé.

## 17. Statistiques de marché déjà sourcées

**CONFIRMÉE PAR LE PROJET — statistiques présentes et reliées à une source**

| Statistique | Périmètre et réserve | Source consignée dans le projet |
|---|---|---|
| 11 % | Part de la population de France métropolitaine exposée à au moins 30 nuits tropicales par été entre 2021-2050, contre 5 % entre 1976-2005. Projection climatique, pas mesure commerciale. | Insee Flash PACA n°103, mai 2024, données Météo-France Drias 2020, RCP 8.5 |
| 79 % | Part projetée de la population de PACA concernée sur la même période, contre 35 % sur la période de référence. Projection climatique. | Même source Insee/Météo-France |
| 48 % | Logements analysés avec confort d'été jugé insuffisant ; manque de protections solaires extérieures identifié comme principal facteur. Analyse de 9 millions de DPE, non redressée et non représentative au sens statistique strict du parc français. | Étude Pouget Consultants / IGNES sur base DPE Ademe, juin 2026 |
| Jusqu'à +2 °C | Réchauffement extérieur modélisé à Paris en cas de généralisation de la climatisation ; ce n'est pas une taille de marché. | Article Ademe Infos 2024 cité dans les ressources |

**À CONFIRMER**

- Revalider les pages sources, dates, méthodologies et libellés exacts avant publication du deck.
- La statistique IGNES datée de juin 2026 est postérieure à plusieurs documents du dépôt et comporte une réserve méthodologique explicite.

**ABSENTE**

- Taille en euros du marché des volets, fenêtres, capteurs, smart home ou rénovation énergétique.
- Croissance de marché, pénétration des motorisations, nombre d'ouvrants adressables, dépenses moyennes et parts concurrentielles.

Sources : `app/(site)/page.tsx`, `AVANCEMENT.md`, `lib/content/ressources.ts`.

## 18. Fondateurs, rôles et informations d'équipe

**ABSENTE — fondateurs réels**

Aucun nom de fondateur réel, cofondateur, dirigeant, parcours, rôle, disponibilité, participation au capital ou profil LinkedIn n'est présent.

**CONFIRMÉE PAR LE PROJET — uniquement comme personas fictifs, à ne pas présenter comme équipe réelle**

- Camille R. — conception produit ; comportement de l'algorithme et scénarios de l'application.
- Younes T. — ingénierie capteurs ; mesures et limites techniques d'Ombrair Link et des capteurs.
- Léa F. — design ; direction artistique.

Le site étiquette explicitement ces trois personnes « personas fictifs ».

Source : `app/(site)/a-propos/page.tsx`.

# INFORMATIONS MANQUANTES POUR LE DECK INVESTISSEURS

- Identité complète des fondateurs réels, rôles, parcours, compétences, disponibilité et répartition du capital.
- Statut juridique actuel ou envisagé de la société, siège, date de création et propriété des actifs du projet.
- Problème client validé : entretiens, nombre de répondants, enseignements, volonté de payer et segment prioritaire.
- Définition du produit minimum commercialisable et clarification de ce qui est inclus physiquement avec Ombrair Link.
- État du prototype matériel réel, essais terrain, mesures thermiques, certifications et calendrier d'industrialisation.
- Fournisseurs/fabricants pressentis, BOM, coûts de revient, coûts de pose, MOQ, délais, capacité, qualité, garanties et SAV.
- Validation ou modification de la grille tarifaire actuelle, TVA, livraison, politique de remise et marges par offre.
- Modèle économique chiffré : mix de revenus, marge brute, CAC, LTV, taux d'attachement Ombrair+, churn et récurrence.
- Stratégie go-to-market exécutable : région de lancement, canaux, partenaires, force de vente, budget, calendrier et objectifs de conversion.
- Analyse concurrentielle et preuves d'un avantage défendable : alternatives, comparaison prix/fonctions, propriété intellectuelle et liberté d'exploitation.
- Traction réelle : pilotes, clients, chiffre d'affaires, précommandes, lettres d'intention, partenariats et pipeline — ou confirmation explicite qu'il n'y en a pas encore.
- TAM, SAM et SOM avec méthode, géographie, segments, nombre d'unités et valeur en euros.
- Projections financières année par année : volumes, chiffre d'affaires, coût des ventes, marge brute, charges, effectifs, EBITDA/résultat et trésorerie.
- Financement initial prévu, détail des emplois et calendrier.
- Financement déjà acquis, en distinguant apport fondateur, subventions, prêts et investissement externe.
- Montant de levée recherché, instrument, valorisation/dilution cible, runway et emploi des fonds.
- Décision d'inclure ou non Ombrair Pionniers dans le deck et, s'il est conservé, avis juridique et modalités complètes.
- Validation finale des statistiques de marché et ajout de données de taille/croissance du marché issues de sources publiables.
- Jalons des 18 à 24 prochains mois, risques principaux et plans de réduction des risques.
