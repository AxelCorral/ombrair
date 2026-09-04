# Audit de la démonstration applicative

Périmètre : les neuf routes du groupe `app/app`. Onze captures, thèmes jour
et nuit, viewport mobile.

> Rappel de nature : c'est une **démonstration** alimentée par des données
> fictives (`lib/mock/`), pas une application connectée à des équipements.
> Le dossier n'évalue pas une application en production.

---

## Le point fort : la cohérence inter-écrans

Vérifiée écran par écran, et elle tient.

| Donnée | Où elle apparaît | Concorde |
|---|---|---|
| Température du séjour | accueil, pièces, historique | ✅ |
| Capteur extérieur | accueil, pièces, historique | ✅ |
| Action de 07:30 | « dernière action » (accueil), historique | ✅ |
| Action de 08:05 | historique, notifications | ✅ |
| Capteur hors ligne à 14:02 | notifications, pièces, réglages | ✅ |
| Batterie à 12 % | notifications, fiche capteur | ✅ |

Aucune contradiction relevée. Cause structurelle : tous ces écrans lisent
`lib/mock/evenements.ts`, `releves.ts` et `logement.ts`, qui sont sources
uniques. Le site public lit d'ailleurs les **mêmes** relevés pour son schéma
de journée, ce qui aligne la démo et la vitrine sur un instant de référence
commun.

C'est le genre de cohérence qu'on perd à la première évolution si on
duplique les données. **À préserver explicitement.**

Un détail qui montre le soin apporté : les événements de la veille portent
un marqueur dédié, pour ne pas apparaître dans les actions du jour.

---

## Navigation et chrome

Barre de navigation basse à cinq entrées, logo Ombrair en tête d'écran,
bascule de thème partagée avec le site. Le thème choisi sur le site est
conservé dans l'application — bonne continuité.

Le thème nuit de l'app est convaincant : `app-accueil-mobile-nuit` et
`app-pieces-mobile-nuit` ne sont pas des inversions mais des ambiances
retravaillées.

---

## Ce qui décroche

### APP-001 (faible) — l'écran Notifications est sous-dense

`app-notifications-mobile-jour` : une liste d'items courts, sans
regroupement par date, sans distinction visuelle entre une alerte (capteur
hors ligne, batterie faible) et une information de routine (volet fermé
automatiquement).

Comparé aux autres écrans — Pièces, Historique, Programmes, tous denses et
structurés — celui-ci paraît inachevé. Le contraste interne est plus
gênant que la densité absolue.

### APP-002 (faible) — grand vide vertical sur l'appairage

`app-appairage-mobile-jour` : le contenu occupe le tiers supérieur de
l'écran, le reste est vide. L'écran décrit une action en plusieurs étapes
(mettre l'équipement en appairage, attendre la détection) mais n'occupe pas
la place que cette attente justifierait — pas d'illustration, pas
d'indicateur de progression, pas de repli si rien n'est détecté.

### A11Y-003 (moyen) — bandeau d'alerte à 3,18

Texte Persienne sur fond teinté, ratio **3,18**, sous le seuil AA. Le
bandeau porte précisément l'information qu'il faut lire — un capteur hors
ligne, une batterie faible. Composant unique, correction circonscrite.

### A11Y-001 / A11Y-002 — les couleurs thermiques

L'application affiche beaucoup de températures, donc beaucoup d'Ambre et de
Fraîche. Elle est le lieu où le déficit de contraste de ces deux couleurs se
manifeste le plus souvent. Voir `AUDIT_ACCESSIBILITY.md`.

### BRAND-001 — le chrome est générique

En dehors du logo en tête d'écran, rien dans l'application ne dit Ombrair.
Pas d'arche, pas de motif de lames, pas de rappel du cadrage architectural
du site. L'application pourrait être celle d'une autre marque de
domotique.

---

## Écrans passés en revue

| Écran | Verdict |
|---|---|
| `/app` accueil | ✅ dense, hiérarchisé, état thermique lisible |
| `/app/pieces` | ✅ le meilleur écran de la démo |
| `/app/mode-auto` | ✅ réglages clairs |
| `/app/programmes` | ✅ |
| `/app/historique` | ✅ courbes int/ext lisibles, axes complets |
| `/app/notifications` | ⚠️ APP-001 |
| `/app/securite` | ✅ |
| `/app/reglages` | ✅ |
| `/app/reglages/appairage` | ⚠️ APP-002 |

---

## Findings de ce domaine

APP-001 · APP-002 — et, par recoupement, A11Y-001, A11Y-002, A11Y-003,
BRAND-001.
