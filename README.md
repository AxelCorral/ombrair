# Ombrair

Ombrair est un produit fictif réalisé dans le cadre d'un projet universitaire. Il
imagine des volets, fenêtres et capteurs connectés capables d'anticiper la chaleur
et d'adapter automatiquement l'ombrage et l'aération d'un logement.

## Simulateur sur 24 heures

Le site comprend un simulateur thermique qui déroule une journée complète. Il met
en relation la course du soleil, la température extérieure, l'inertie intérieure,
la luminosité et l'humidité avec les décisions prises par les ouvrants. Des scènes
3D rendent visibles la position du volet, l'orientation des lames et l'ouverture de
la fenêtre.

## Architecture

L'interface est construite avec Next.js 15, React 19 et TypeScript. Elle comporte
28 routes applicatives, dont une route dynamique pour les ressources. Les pages et
composants de rendu vivent dans `app/` et `components/`.

La physique et les règles d'automatisation restent hors de l'interface : elles sont
implémentées dans des modules TypeScript purs sous `lib/`. Elles peuvent ainsi être
testées sans navigateur ni rendu React. La suite actuelle exécute 219 tests répartis
en 65 suites et couvre notamment le cycle jour/nuit, les températures, les volets,
les fenêtres et leur coordination.

## Sources des chiffres publiés

- **Nuits tropicales** : Insee Flash PACA n°103, mai 2024 — données Météo-France,
  Drias 2020.
- **Confort d'été** : étude Pouget Consultants / IGNES sur la base DPE de l'Ademe,
  juin 2026. L'analyse porte sur 9 millions de diagnostics de performance
  énergétique. Elle est non redressée et ne prétend donc pas être représentative,
  au sens statistique strict, du parc de logements français.

## Lancer le projet en local

Prérequis : Node.js et npm.

```bash
npm install
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

Pour lancer les tests :

```bash
npm test
```

## Démonstration

[Voir Ombrair en ligne](https://ombrair.vercel.app)
