# Présentation — Ombrair, produits et services

Diaporama de 8 slides (≈ 7 minutes) consacré aux **produits et services**
d'Ombrair : ce que l'entreprise conçoit et fabrique, ce qu'elle revend et
installe, et ce qu'elle assure dans la durée.

Projet étudiant fictif — aucune vente réelle. Université Toulouse Jean
Jaurès, 2026.

## Fichiers

| Fichier | Rôle |
|---|---|
| `presentation-ombrair-produits-services.pptx` | Le livrable, éditable dans PowerPoint / Impress / Keynote |
| `presentation-ombrair-produits-services.pdf` | Export de secours, pour projeter sans PowerPoint |
| `presentation-ombrair-produits-services.js` | Source reproductible (PptxGenJS) |
| `assets/app-accueil-crop.png` | Capture réelle de la démo `/app` du projet, utilisée slide 5 |

## Régénérer

```bash
cd presentation
npm install
node presentation-ombrair-produits-services.js
```

Pour refaire le PDF (LibreOffice requis) :

```bash
soffice --headless --convert-to pdf --outdir . presentation-ombrair-produits-services.pptx
```

Pour refaire la capture de la slide 5, lancer `npm run dev` à la racine du
projet puis capturer `http://localhost:3000/app` en 390 × 470 px.

## Notes du présentateur

Chaque slide porte ses notes : message clé, points à dire, durée cible et
transition. Total ≈ 7 min. Elles s'affichent en mode Présentateur.

## Direction artistique

Reprise des tokens de `app/globals.css` — Chaux, Persienne, Nuit, Fraîche,
Ambre. La règle du projet est respectée : **Fraîche et Ambre n'encodent que
de l'information thermique** (slide 4 et captures de l'app), jamais un
titre, un accent décoratif ou un appel à l'action. Braise est réservée aux
alertes et n'apparaît donc pas ici. Angles droits, pas de coins arrondis :
le projet impose un rayon de 4-6 px, invisible à l'échelle d'une
diapositive, et l'univers menuiserie s'accommode mieux du trait net.

## Substitution typographique (à connaître)

Les polices du site — **Archivo**, **Instrument Sans**, **IBM Plex Mono** —
ne sont pas des polices système et ne peuvent pas être embarquées dans un
`.pptx` sans dépendance fragile : sur une autre machine, PowerPoint leur
substituerait une police arbitraire et la mise en page bougerait.

Le diaporama utilise donc :

| Rôle projet | Police du projet | Police utilisée dans le PPTX |
|---|---|---|
| Display / titres | Archivo | **Arial** (gras) |
| Texte courant | Instrument Sans | **Arial** |
| Données, prix, mesures | IBM Plex Mono | **Consolas** |

Arial et Consolas sont disponibles sous Windows comme sous macOS avec
Office, ce qui garantit un rendu stable le jour de la présentation. Aucun
fichier de police n'est distribué.

## Exactitude commerciale

Le point central du diaporama, vérifié slide par slide :

- **Capteurs** : conçus, fabriqués, installés et maintenus par Ombrair.
- **Volets et fenêtres motorisés** : équipements de fabricants partenaires,
  sélectionnés, revendus, installés et intégrés par Ombrair. Le diaporama
  ne dit jamais « nos volets » ni « nos fenêtres » au sens de la
  fabrication.
- **Application** : incluse à vie avec l'achat, sans abonnement. Ombrair+
  (4,99 €/mois) n'apparaît que comme option facultative.
- Aucune performance, autonomie, portée radio ni certification n'est
  avancée : ces données n'existent pas dans le projet.
- Les tarifs viennent de `lib/tarifs.ts` (349 € / à partir de 690 € par
  ouvrant posé / à partir de 1 590 € par ouvrant posé).
