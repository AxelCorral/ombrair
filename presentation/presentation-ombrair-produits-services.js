/**
 * Génère `presentation-ombrair-produits-services.pptx`.
 *
 *   node presentation-ombrair-produits-services.js
 *
 * Sujet : les PRODUITS et SERVICES d'Ombrair — pas une présentation
 * générale du projet. Message central : Ombrair conçoit et fabrique ses
 * capteurs, et revend / installe / intègre les volets et fenêtres
 * motorisés de fabricants partenaires.
 *
 * Direction artistique reprise de `app/globals.css` :
 *  - Fraîche et Ambre n'encodent QUE de l'information thermique (slide 4
 *    et captures de l'app). Jamais de titre ou de CTA dans ces couleurs.
 *  - Braise réservée aux alertes — non utilisée ici, aucune alerte.
 *  - Neutres : Persienne / Chaux / Nuit et leurs mélanges.
 *  - Angles droits : le projet impose un rayon de 4-6 px ; à l'échelle
 *    d'une diapositive c'est visuellement nul, on garde des rectangles
 *    nets, cohérents avec l'univers menuiserie.
 *
 * Substitution typographique (documentée) : Archivo, Instrument Sans et
 * IBM Plex Mono ne sont pas des polices système et ne peuvent pas être
 * embarquées dans un .pptx sans dépendance fragile. On utilise Arial
 * (grotesque proche d'Archivo pour les titres, et du texte courant) et
 * Consolas pour les données chiffrées, qui restent le « parler
 * d'instrument » du projet. Ces deux polices sont disponibles sous
 * Windows comme sous macOS avec Office.
 */

const path = require("node:path");
const PptxGenJS = require("pptxgenjs");

// --- Palette (identique aux tokens de app/globals.css) ---------------------
const CHAUX = "EDEEE8";
const PERSIENNE = "1E3A35";
const NUIT = "101E1C";
const FRAICHE = "5FC2B4"; // état froid / ouvert — usage thermique uniquement
const AMBRE = "E9A13B"; // état chaud / fermé — usage thermique uniquement

// Neutres dérivés (mélanges Persienne/Chaux et Chaux/Nuit)
const TEXTE_DOUX = "667974"; // sur fond clair
const BORDURE = "C8CEC8"; // sur fond clair
const TEXTE_DOUX_SOMBRE = "8A908C"; // sur fond Nuit
const BORDURE_SOMBRE = "35473F"; // sur fond Nuit

const DISPLAY = "Arial";
const TEXTE = "Arial";
const MONO = "Consolas";

const M = 0.55; // marge latérale
const LARGEUR = 10;
const HAUTEUR = 5.625;
const UTILE = LARGEUR - M * 2;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Ombrair";
pptx.company = "Université Toulouse Jean Jaurès";
pptx.title = "Ombrair — produits et services";

/** Bandeau de lames : le motif signature du projet. */
function lames(slide, { x, y, w, n = 5, gap = 0.075, ep = 0.045, couleur = BORDURE }) {
  for (let i = 0; i < n; i += 1) {
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y: y + i * (ep + gap),
      w,
      h: ep,
      fill: { color: couleur },
      line: { type: "none" },
    });
  }
}

/** Pied de page discret, présent sur toutes les diapositives. */
function pied(slide, numero, sombre = false) {
  slide.addText("Ombrair — produits et services", {
    x: M,
    y: HAUTEUR - 0.42,
    w: 5,
    h: 0.25,
    fontSize: 9,
    fontFace: TEXTE,
    color: sombre ? TEXTE_DOUX_SOMBRE : TEXTE_DOUX,
  });
  slide.addText(String(numero), {
    x: LARGEUR - M - 0.5,
    y: HAUTEUR - 0.42,
    w: 0.5,
    h: 0.25,
    fontSize: 9,
    fontFace: MONO,
    color: sombre ? TEXTE_DOUX_SOMBRE : TEXTE_DOUX,
    align: "right",
  });
}

/** Titre de diapositive + filet de séparation. */
function titre(slide, texte, { sombre = false, surtitre = null } = {}) {
  let y = 0.45;
  if (surtitre) {
    slide.addText(surtitre.toUpperCase(), {
      x: M,
      y,
      w: UTILE,
      h: 0.22,
      fontSize: 10,
      fontFace: TEXTE,
      color: sombre ? TEXTE_DOUX_SOMBRE : TEXTE_DOUX,
      charSpacing: 1.6,
    });
    y += 0.3;
  }
  slide.addText(texte, {
    x: M,
    y,
    w: UTILE,
    h: 0.55,
    fontSize: 26,
    bold: true,
    fontFace: DISPLAY,
    color: sombre ? CHAUX : PERSIENNE,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: M,
    y: y + 0.62,
    w: UTILE,
    h: 0.012,
    fill: { color: sombre ? BORDURE_SOMBRE : BORDURE },
    line: { type: "none" },
  });
  return y + 0.9; // ordonnée de départ du contenu
}

/** Carte rectangulaire nette (pas de pilule). */
function carte(slide, { x, y, w, h, sombre = false, fond = null }) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: fond || (sombre ? "17302B" : "E4E6DF") },
    line: { color: sombre ? BORDURE_SOMBRE : BORDURE, width: 0.75 },
  });
}

// ==========================================================================
// SLIDE 1 — Ombrair : plus qu'un volet connecté
// ==========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: NUIT };

  lames(s, { x: M, y: 0.5, w: 1.5, n: 4, couleur: BORDURE_SOMBRE });

  s.addText("OMBRAIR — PRODUITS ET SERVICES", {
    x: M,
    y: 1.15,
    w: 5.4,
    h: 0.25,
    fontSize: 10,
    fontFace: TEXTE,
    color: TEXTE_DOUX_SOMBRE,
    charSpacing: 1.8,
  });

  s.addText("Un écosystème complet pour piloter les ouvrants du logement", {
    x: M,
    y: 1.5,
    w: 5.2,
    h: 1.5,
    fontSize: 30,
    bold: true,
    fontFace: DISPLAY,
    color: CHAUX,
    lineSpacing: 34,
  });

  s.addText("Capteurs · équipements motorisés · application · installation · maintenance", {
    x: M,
    y: 3.15,
    w: 5.2,
    h: 0.6,
    fontSize: 13,
    fontFace: TEXTE,
    color: TEXTE_DOUX_SOMBRE,
    lineSpacing: 18,
  });

  // Chaîne du système, à droite
  const cx = 6.15;
  const cw = 3.3;
  const etapes = [
    ["Capteurs Ombrair", "conçus et fabriqués par nous"],
    ["Intelligence Ombrair", "décide du bon moment"],
    ["Application Ombrair", "le client garde la main"],
    ["Volets + fenêtres motorisés", "sélectionnés et installés par nous"],
  ];
  let cy = 0.75;
  etapes.forEach(([t, st], i) => {
    carte(s, { x: cx, y: cy, w: cw, h: 0.72, sombre: true });
    s.addText(t, {
      x: cx + 0.18,
      y: cy + 0.09,
      w: cw - 0.36,
      h: 0.28,
      fontSize: 12,
      bold: true,
      fontFace: DISPLAY,
      color: CHAUX,
    });
    s.addText(st, {
      x: cx + 0.18,
      y: cy + 0.37,
      w: cw - 0.36,
      h: 0.26,
      fontSize: 9.5,
      fontFace: TEXTE,
      color: TEXTE_DOUX_SOMBRE,
    });
    cy += 0.72;
    if (i < etapes.length - 1) {
      s.addText("↓", {
        x: cx,
        y: cy,
        w: cw,
        h: 0.26,
        fontSize: 12,
        fontFace: TEXTE,
        color: TEXTE_DOUX_SOMBRE,
        align: "center",
      });
      cy += 0.26;
    }
  });

  s.addShape(pptx.ShapeType.rect, {
    x: cx,
    y: cy + 0.16,
    w: cw,
    h: 0.42,
    fill: { color: "17302B" },
    line: { color: BORDURE_SOMBRE, width: 0.75 },
  });
  s.addText("Installation · maintenance · assistance", {
    x: cx,
    y: cy + 0.16,
    w: cw,
    h: 0.42,
    fontSize: 10,
    fontFace: TEXTE,
    color: CHAUX,
    align: "center",
    valign: "middle",
  });

  pied(s, 1, true);

  s.addNotes(
    [
      "≈ 45 s — Ouverture.",
      "",
      "Message clé : Ombrair ne vend pas « un volet connecté », mais un ensemble qui va du capteur jusqu'au service après installation.",
      "",
      "À dire : présenter la chaîne de droite en une phrase — nos capteurs mesurent, notre système décide, l'application donne la main au client, et les volets et fenêtres motorisés exécutent. Autour de tout ça : l'installation, la maintenance et l'assistance, qui sont aussi notre métier.",
      "",
      "Transition : « Commençons par la partie que nous maîtrisons entièrement : les capteurs. »",
    ].join("\n")
  );
}

// ==========================================================================
// SLIDE 2 — Notre technologie : les capteurs Ombrair
// ==========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: CHAUX };
  const y0 = titre(s, "Notre technologie : les capteurs Ombrair", {
    surtitre: "Ce qu'Ombrair conçoit et fabrique",
  });

  const etapes = ["Nous concevons", "Nous fabriquons", "Nous installons", "Nous maintenons"];
  const w = (UTILE - 0.3 * 3) / 4;
  etapes.forEach((t, i) => {
    const x = M + i * (w + 0.3);
    carte(s, { x, y: y0, w, h: 1.15, fond: PERSIENNE });
    s.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.18,
      y: y0 + 0.14,
      w: w - 0.36,
      h: 0.24,
      fontSize: 10,
      fontFace: MONO,
      color: TEXTE_DOUX_SOMBRE,
    });
    s.addText(t, {
      x: x + 0.18,
      y: y0 + 0.44,
      w: w - 0.36,
      h: 0.55,
      fontSize: 14,
      bold: true,
      fontFace: DISPLAY,
      color: CHAUX,
    });
    if (i < 3) {
      s.addText("→", {
        x: x + w,
        y: y0 + 0.4,
        w: 0.3,
        h: 0.3,
        fontSize: 13,
        fontFace: TEXTE,
        color: TEXTE_DOUX,
        align: "center",
      });
    }
  });

  s.addText("Ce que les capteurs mesurent", {
    x: M,
    y: y0 + 1.5,
    w: UTILE,
    h: 0.3,
    fontSize: 13,
    bold: true,
    fontFace: DISPLAY,
    color: PERSIENNE,
  });

  const mesures = ["Température", "Humidité", "Luminosité", "Qualité de l'air"];
  const mw = (UTILE - 0.25 * 3) / 4;
  mesures.forEach((m, i) => {
    const x = M + i * (mw + 0.25);
    carte(s, { x, y: y0 + 1.9, w: mw, h: 0.5 });
    s.addText(m, {
      x,
      y: y0 + 1.9,
      w: mw,
      h: 0.5,
      fontSize: 11.5,
      fontFace: TEXTE,
      color: PERSIENNE,
      align: "center",
      valign: "middle",
    });
  });

  s.addText("Capteurs intérieurs et extérieurs, reliés par une passerelle Ombrair.", {
    x: M,
    y: y0 + 2.55,
    w: UTILE,
    h: 0.3,
    fontSize: 11,
    fontFace: TEXTE,
    color: TEXTE_DOUX,
  });

  pied(s, 2);
  s.addNotes(
    [
      "≈ 60 s — La slide la plus importante pour comprendre notre métier.",
      "",
      "Message clé : les capteurs sont la technologie réellement maîtrisée en interne. Nous ne sous-traitons ni la conception ni la fabrication, et nous restons responsables de leur installation et de leur maintenance.",
      "",
      "À dire : insister sur la chaîne complète — concevoir, fabriquer, installer, maintenir. Puis expliquer les quatre grandeurs mesurées : température intérieure et extérieure, humidité, luminosité, qualité de l'air. C'est ce qui permet au système de savoir quand il faut fermer et quand il faut ouvrir.",
      "",
      "Ne pas inventer de chiffres : ne pas annoncer d'autonomie, de portée radio ni de précision — ces données ne sont pas définies dans le projet.",
      "",
      "Transition : « En revanche, tout ce qui bouge dans le logement — les volets et les fenêtres — ne sort pas de nos ateliers. »",
    ].join("\n")
  );
}

// ==========================================================================
// SLIDE 3 — Les équipements que nous installons
// ==========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: CHAUX };
  const y0 = titre(s, "Les équipements que nous installons", {
    surtitre: "Ce qui vient de fabricants partenaires",
  });

  // Colonne gauche : chaîne de valeur des équipements
  const gw = 5.75;
  const hCol = 3.25;
  carte(s, { x: M, y: y0, w: gw, h: hCol });

  s.addText("Volets électriques  ·  Fenêtres motorisées", {
    x: M + 0.25,
    y: y0 + 0.2,
    w: gw - 0.5,
    h: 0.3,
    fontSize: 14,
    bold: true,
    fontFace: DISPLAY,
    color: PERSIENNE,
  });

  const maillons = [
    ["Fabricants partenaires", "conçoivent et fabriquent"],
    ["Ombrair", "sélectionne · revend · installe · configure"],
    ["Client", "une installation qui fonctionne"],
  ];
  let my = y0 + 0.65;
  maillons.forEach(([t, st], i) => {
    s.addShape(pptx.ShapeType.rect, {
      x: M + 0.25,
      y: my,
      w: gw - 0.5,
      h: 0.5,
      fill: { color: i === 1 ? PERSIENNE : CHAUX },
      line: { color: BORDURE, width: 0.75 },
    });
    s.addText(t, {
      x: M + 0.4,
      y: my,
      w: 1.9,
      h: 0.5,
      fontSize: 11.5,
      bold: true,
      fontFace: DISPLAY,
      color: i === 1 ? CHAUX : PERSIENNE,
      valign: "middle",
    });
    s.addText(st, {
      x: M + 2.3,
      y: my,
      w: gw - 2.55,
      h: 0.5,
      fontSize: 10,
      fontFace: TEXTE,
      color: i === 1 ? TEXTE_DOUX_SOMBRE : TEXTE_DOUX,
      valign: "middle",
      align: "right",
    });
    my += 0.5;
    if (i < 2) {
      s.addText("↓", {
        x: M + 0.25,
        y: my,
        w: gw - 0.5,
        h: 0.22,
        fontSize: 11,
        fontFace: TEXTE,
        color: TEXTE_DOUX,
        align: "center",
      });
      my += 0.22;
    }
  });

  s.addText(
    "Ombrair ne conçoit ni ne fabrique les volets et les fenêtres. Elle les sélectionne, les revend, les installe et les intègre à son écosystème.",
    {
      x: M + 0.25,
      y: my + 0.12,
      w: gw - 0.5,
      h: 0.45,
      fontSize: 10,
      italic: true,
      fontFace: TEXTE,
      color: TEXTE_DOUX,
      lineSpacing: 13,
    }
  );

  // Colonne droite : ce qui est à nous
  const dx = M + gw + 0.35;
  const dw = UTILE - gw - 0.35;
  carte(s, { x: dx, y: y0, w: dw, h: hCol, fond: PERSIENNE });
  lames(s, { x: dx + 0.25, y: y0 + 0.25, w: dw - 0.5, n: 4, couleur: BORDURE_SOMBRE });

  s.addText("Capteurs Ombrair", {
    x: dx + 0.25,
    y: y0 + 0.95,
    w: dw - 0.5,
    h: 0.3,
    fontSize: 14,
    bold: true,
    fontFace: DISPLAY,
    color: CHAUX,
  });
  s.addText("Conçus et fabriqués par Ombrair.", {
    x: dx + 0.25,
    y: y0 + 1.3,
    w: dw - 0.5,
    h: 0.4,
    fontSize: 11,
    fontFace: TEXTE,
    color: CHAUX,
    lineSpacing: 14,
  });
  s.addText(
    "C'est la seule partie matérielle dont nous maîtrisons la chaîne complète — et c'est elle qui rend le reste intelligent.",
    {
      x: dx + 0.25,
      y: y0 + 1.8,
      w: dw - 0.5,
      h: 0.75,
      fontSize: 10,
      fontFace: TEXTE,
      color: TEXTE_DOUX_SOMBRE,
      lineSpacing: 13,
    }
  );

  pied(s, 3);
  s.addNotes(
    [
      "≈ 65 s — La slide qui lève toute ambiguïté commerciale.",
      "",
      "Message clé : deux natures de produits très différentes. Les capteurs sont à nous de bout en bout. Les volets et les fenêtres motorisés viennent de fabricants spécialisés.",
      "",
      "À dire : assumer clairement ce point — nous ne sommes pas menuisiers ni fabricants de motorisation. Notre valeur est de choisir des équipements compatibles, de les installer correctement et de les faire fonctionner avec nos capteurs. C'est un choix industriel assumé : on ne réinvente pas un volet, on rend intelligent celui qui existe.",
      "",
      "Attention à la formulation : dire « volets motorisés proposés et installés par Ombrair », jamais « nos volets fabriqués par Ombrair ».",
      "",
      "Transition : « Voyons maintenant ce que donne l'ensemble une fois installé. »",
    ].join("\n")
  );
}

// ==========================================================================
// SLIDE 4 — Une installation qui devient intelligente
// ==========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: CHAUX };
  const y0 = titre(s, "Une installation qui devient intelligente", {
    surtitre: "Comment les produits fonctionnent ensemble",
  });

  const etapes = [
    ["Mesurer", "Les capteurs relèvent l'intérieur et l'extérieur en continu."],
    ["Analyser", "Le système compare les deux et repère le bon moment."],
    ["Agir", "Volets et fenêtres motorisés s'ouvrent ou se ferment."],
    ["Garder la main", "Le client reprend le contrôle à tout moment."],
  ];
  const w = (UTILE - 0.28 * 3) / 4;
  etapes.forEach(([t, st], i) => {
    const x = M + i * (w + 0.28);
    s.addText(String(i + 1).padStart(2, "0"), {
      x,
      y: y0,
      w,
      h: 0.24,
      fontSize: 10,
      fontFace: MONO,
      color: TEXTE_DOUX,
    });
    s.addText(t, {
      x,
      y: y0 + 0.26,
      w,
      h: 0.3,
      fontSize: 14,
      bold: true,
      fontFace: DISPLAY,
      color: PERSIENNE,
    });
    s.addText(st, {
      x,
      y: y0 + 0.6,
      w,
      h: 0.7,
      fontSize: 10,
      fontFace: TEXTE,
      color: TEXTE_DOUX,
      lineSpacing: 13,
    });
  });

  // Bande thermique — seul emploi légitime de Fraîche et Ambre
  const by = y0 + 1.55;
  const bw = (UTILE - 0.3) / 2;

  s.addShape(pptx.ShapeType.rect, { x: M, y: by, w: bw, h: 1.0, fill: { color: "F3E2C6" }, line: { color: AMBRE, width: 1 } });
  s.addShape(pptx.ShapeType.rect, { x: M, y: by, w: 0.06, h: 1.0, fill: { color: AMBRE }, line: { type: "none" } });
  s.addText("Extérieur plus chaud que l'intérieur", {
    x: M + 0.25,
    y: by + 0.16,
    w: bw - 0.5,
    h: 0.28,
    fontSize: 12,
    bold: true,
    fontFace: DISPLAY,
    color: PERSIENNE,
  });
  s.addText("On ferme, avant que le soleil ne tape.", {
    x: M + 0.25,
    y: by + 0.5,
    w: bw - 0.5,
    h: 0.35,
    fontSize: 11,
    fontFace: TEXTE,
    color: TEXTE_DOUX,
  });

  const x2 = M + bw + 0.3;
  s.addShape(pptx.ShapeType.rect, { x: x2, y: by, w: bw, h: 1.0, fill: { color: "D9EFEA" }, line: { color: FRAICHE, width: 1 } });
  s.addShape(pptx.ShapeType.rect, { x: x2, y: by, w: 0.06, h: 1.0, fill: { color: FRAICHE }, line: { type: "none" } });
  s.addText("Extérieur plus frais, la nuit", {
    x: x2 + 0.25,
    y: by + 0.16,
    w: bw - 0.5,
    h: 0.28,
    fontSize: 12,
    bold: true,
    fontFace: DISPLAY,
    color: PERSIENNE,
  });
  s.addText("On ouvre, pour faire entrer la fraîcheur.", {
    x: x2 + 0.25,
    y: by + 0.5,
    w: bw - 0.5,
    h: 0.35,
    fontSize: 11,
    fontFace: TEXTE,
    color: TEXTE_DOUX,
  });

  s.addText(
    "Scénario de démonstration — aucun gain de température n'est garanti : le résultat dépend du logement, de son orientation et de son inertie.",
    {
      x: M,
      y: by + 1.12,
      w: UTILE,
      h: 0.3,
      fontSize: 9.5,
      italic: true,
      fontFace: TEXTE,
      color: TEXTE_DOUX,
    }
  );

  pied(s, 4);
  s.addNotes(
    [
      "≈ 55 s.",
      "",
      "Message clé : les produits ne valent que par leur fonctionnement d'ensemble. Le capteur seul ne sert à rien, le volet seul non plus.",
      "",
      "À dire : dérouler les quatre étapes rapidement, puis appuyer sur la logique de fond — quand l'extérieur est plus chaud, on ferme ; quand il devient plus frais, on ouvre. C'est le geste que tout le monde connaît mais que personne ne fait au bon moment tous les jours.",
      "",
      "Important : préciser à l'oral qu'il s'agit d'un scénario d'illustration et que nous ne promettons pas un nombre de degrés gagnés.",
      "",
      "Transition : « Et le client, lui, voit tout ça depuis une seule application. »",
    ].join("\n")
  );
}

// ==========================================================================
// SLIDE 5 — L'application : le centre de contrôle
// ==========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: CHAUX };
  const y0 = titre(s, "L'application : le centre de contrôle", {
    surtitre: "Incluse à vie avec l'achat",
  });

  // Capture réelle de la démo du projet (cadrage serré pour rester lisible)
  const imgW = 2.45;
  const imgH = imgW * (470 / 390);
  s.addShape(pptx.ShapeType.rect, {
    x: M - 0.06,
    y: y0 - 0.06,
    w: imgW + 0.12,
    h: imgH + 0.12,
    fill: { color: PERSIENNE },
    line: { type: "none" },
  });
  s.addImage({
    path: path.join(__dirname, "assets", "app-accueil-crop.png"),
    x: M,
    y: y0,
    w: imgW,
    h: imgH,
  });
  s.addText("Écran d'accueil de la démonstration (données simulées)", {
    x: M - 0.06,
    y: y0 + imgH + 0.14,
    w: imgW + 0.6,
    h: 0.22,
    fontSize: 8.5,
    fontFace: TEXTE,
    color: TEXTE_DOUX,
  });

  const gx = M + imgW + 0.45;
  const gw = LARGEUR - M - gx;
  const groupes = [
    ["Piloter", "Ouvrir, fermer, verrouiller, régler chaque ouvrant."],
    ["Surveiller", "État de l'installation, capteurs, historique, notifications."],
    ["Automatiser", "Mode auto, programmes et scénarios (Canicule, Absence, Nuit fraîche…)."],
    ["Être assisté", "Réglages, appairage guidé, suivi et assistance."],
  ];
  const gh = 0.54;
  groupes.forEach(([t, st], i) => {
    const y = y0 + i * (gh + 0.1);
    s.addShape(pptx.ShapeType.rect, {
      x: gx,
      y,
      w: 0.05,
      h: gh,
      fill: { color: PERSIENNE },
      line: { type: "none" },
    });
    s.addText(t, {
      x: gx + 0.2,
      y,
      w: gw - 0.2,
      h: 0.26,
      fontSize: 13,
      bold: true,
      fontFace: DISPLAY,
      color: PERSIENNE,
    });
    s.addText(st, {
      x: gx + 0.2,
      y: y + 0.27,
      w: gw - 0.2,
      h: 0.34,
      fontSize: 10,
      fontFace: TEXTE,
      color: TEXTE_DOUX,
      lineSpacing: 12.5,
    });
  });

  const yFinGroupes = y0 + 3 * (gh + 0.1) + gh;
  s.addText("Ombrair+ (4,99 €/mois) reste une option facultative, jamais nécessaire aux fonctions principales.", {
    x: gx,
    y: yFinGroupes + 0.1,
    w: gw,
    h: 0.24,
    fontSize: 9,
    fontFace: TEXTE,
    color: TEXTE_DOUX,
  });

  const by = yFinGroupes + 0.42;
  s.addShape(pptx.ShapeType.rect, {
    x: gx,
    y: by,
    w: gw,
    h: 0.44,
    fill: { color: PERSIENNE },
    line: { type: "none" },
  });
  s.addText("Accès inclus à vie avec l'achat — sans abonnement", {
    x: gx + 0.15,
    y: by,
    w: gw - 0.3,
    h: 0.44,
    fontSize: 11.5,
    bold: true,
    fontFace: DISPLAY,
    color: CHAUX,
    valign: "middle",
  });

  pied(s, 5);
  s.addNotes(
    [
      "≈ 65 s.",
      "",
      "Message clé : l'application n'est pas un gadget offert, c'est le centre de contrôle de l'installation — et elle est incluse à vie, sans abonnement.",
      "",
      "À dire : présenter les quatre familles d'usage plutôt que d'énumérer des fonctions. Piloter, surveiller, automatiser, être assisté. Montrer la capture : ce que le client voit en ouvrant l'app, c'est l'état réel de son logement et la prochaine action prévue, avec sa raison.",
      "",
      "Point commercial à ne pas rater : l'accès est inclus à vie avec l'achat. Ombrair+ existe mais reste facultatif — ne jamais le présenter comme nécessaire.",
      "",
      "Préciser que la capture vient d'une démonstration à données simulées.",
      "",
      "Transition : « Reste la partie qu'on oublie souvent dans la domotique : ce qui se passe avant et après la pose. »",
    ].join("\n")
  );
}

// ==========================================================================
// SLIDE 6 — Nos services : avant, pendant et après
// ==========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: CHAUX };
  const y0 = titre(s, "Nos services : avant, pendant, après", {
    surtitre: "Ce qu'Ombrair fait, au-delà du matériel",
  });

  const colonnes = [
    ["Avant", ["Conseil", "Choix de la solution", "Vérification de compatibilité"]],
    ["Installation", ["Fourniture des équipements", "Pose", "Configuration", "Mise en service"]],
    ["Après", ["Application incluse", "Service client et assistance", "Maintenance", "Suivi des capteurs"]],
  ];
  const w = (UTILE - 0.35 * 2) / 3;
  colonnes.forEach(([titreCol, items], i) => {
    const x = M + i * (w + 0.35);
    carte(s, { x, y: y0, w, h: 2.35, fond: i === 2 ? PERSIENNE : "E4E6DF" });
    const sombre = i === 2;
    s.addText(titreCol.toUpperCase(), {
      x: x + 0.22,
      y: y0 + 0.18,
      w: w - 0.44,
      h: 0.26,
      fontSize: 10,
      fontFace: TEXTE,
      color: sombre ? TEXTE_DOUX_SOMBRE : TEXTE_DOUX,
      charSpacing: 1.5,
    });
    items.forEach((item, j) => {
      s.addText(item, {
        x: x + 0.22,
        y: y0 + 0.55 + j * 0.42,
        w: w - 0.44,
        h: 0.36,
        fontSize: 11.5,
        fontFace: TEXTE,
        color: sombre ? CHAUX : PERSIENNE,
        valign: "middle",
      });
      if (j < items.length - 1) {
        s.addShape(pptx.ShapeType.rect, {
          x: x + 0.22,
          y: y0 + 0.55 + j * 0.42 + 0.37,
          w: w - 0.44,
          h: 0.008,
          fill: { color: sombre ? BORDURE_SOMBRE : BORDURE },
          line: { type: "none" },
        });
      }
    });
  });

  s.addShape(pptx.ShapeType.rect, {
    x: M,
    y: y0 + 2.6,
    w: UTILE,
    h: 0.5,
    fill: { color: "E4E6DF" },
    line: { color: BORDURE, width: 0.75 },
  });
  s.addText("Ombrair reste l'interlocuteur du client après l'installation.", {
    x: M,
    y: y0 + 2.6,
    w: UTILE,
    h: 0.5,
    fontSize: 13,
    bold: true,
    fontFace: DISPLAY,
    color: PERSIENNE,
    align: "center",
    valign: "middle",
  });

  pied(s, 6);
  s.addNotes(
    [
      "≈ 55 s.",
      "",
      "Message clé : la vente ne s'arrête pas à la pose. Une bonne partie de la valeur d'Ombrair est du service.",
      "",
      "À dire : dérouler le parcours client. Avant, on conseille et on vérifie la compatibilité — c'est important car tous les volets existants ne sont pas éligibles. Pendant, on fournit, on pose, on configure et on met en service. Après, on assure la maintenance, le suivi des capteurs et l'assistance, avec l'application comme point d'entrée.",
      "",
      "Insister sur la colonne « Après » : c'est ce qui distingue une solution d'un simple produit vendu en carton.",
      "",
      "Transition : « Concrètement, cela se décline en trois niveaux d'offre. »",
    ].join("\n")
  );
}

// ==========================================================================
// SLIDE 7 — Trois niveaux d'offre
// ==========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: CHAUX };
  const y0 = titre(s, "Capteur · Volet · Fenêtre", { surtitre: "Trois produits qui fonctionnent ensemble" });

  // Prix repris de lib/tarifs.ts. Le montant de la fenêtre couvre la
  // solution complète fenêtre + volet : c'est le seul prix de départ défini,
  // une fenêtre motorisée seule se chiffrant sur devis.
  const offres = [
    {
      nom: "Capteur",
      prix: "349 €",
      unite: "kit de base",
      pour: "Conçu et fabriqué par Ombrair",
      fourni: "Passerelle, capteurs intérieurs et extérieur, modules de pilotage à clipser dans les coffres existants.",
    },
    {
      nom: "Volet",
      prix: "690 €",
      unite: "à partir de, par ouvrant posé",
      pour: "Fabricant spécialisé, installé par Ombrair",
      fourni: "Volet roulant motorisé, motorisation solaire ou filaire, pose comprise, plus l'intégration Ombrair.",
    },
    {
      nom: "Fenêtre",
      prix: "1 590 €",
      unite: "à partir de, par ouvrant posé",
      pour: "Fabricant spécialisé, installé par Ombrair",
      fourni: "Fenêtre à contrôle solaire et volet motorisé, posés ensemble avec les capteurs.",
    },
  ];

  const w = (UTILE - 0.35 * 2) / 3;
  offres.forEach((o, i) => {
    const x = M + i * (w + 0.35);
    carte(s, { x, y: y0, w, h: 2.7 });
    s.addShape(pptx.ShapeType.rect, {
      x,
      y: y0,
      w,
      h: 0.05,
      fill: { color: PERSIENNE },
      line: { type: "none" },
    });
    s.addText(o.nom, {
      x: x + 0.22,
      y: y0 + 0.2,
      w: w - 0.44,
      h: 0.32,
      fontSize: 17,
      bold: true,
      fontFace: DISPLAY,
      color: PERSIENNE,
    });
    s.addText(o.prix, {
      x: x + 0.22,
      y: y0 + 0.58,
      w: w - 0.44,
      h: 0.4,
      fontSize: 22,
      fontFace: MONO,
      color: PERSIENNE,
    });
    s.addText(o.unite, {
      x: x + 0.22,
      y: y0 + 1.0,
      w: w - 0.44,
      h: 0.28,
      fontSize: 9,
      fontFace: TEXTE,
      color: TEXTE_DOUX,
    });
    s.addShape(pptx.ShapeType.rect, {
      x: x + 0.22,
      y: y0 + 1.32,
      w: w - 0.44,
      h: 0.008,
      fill: { color: BORDURE },
      line: { type: "none" },
    });
    s.addText("Origine", {
      x: x + 0.22,
      y: y0 + 1.42,
      w: w - 0.44,
      h: 0.2,
      fontSize: 8.5,
      fontFace: TEXTE,
      color: TEXTE_DOUX,
      charSpacing: 1,
    });
    s.addText(o.pour, {
      x: x + 0.22,
      y: y0 + 1.62,
      w: w - 0.44,
      h: 0.4,
      fontSize: 11,
      bold: true,
      fontFace: DISPLAY,
      color: PERSIENNE,
    });
    s.addText(o.fourni, {
      x: x + 0.22,
      y: y0 + 2.04,
      w: w - 0.44,
      h: 0.6,
      fontSize: 9.5,
      fontFace: TEXTE,
      color: TEXTE_DOUX,
      lineSpacing: 12,
    });
  });

  s.addShape(pptx.ShapeType.rect, {
    x: M,
    y: y0 + 2.9,
    w: UTILE,
    h: 0.46,
    fill: { color: PERSIENNE },
    line: { type: "none" },
  });
  s.addText("Application incluse à vie dans les trois offres  ·  Ombrair+ : option facultative", {
    x: M,
    y: y0 + 2.9,
    w: UTILE,
    h: 0.46,
    fontSize: 11.5,
    bold: true,
    fontFace: DISPLAY,
    color: CHAUX,
    align: "center",
    valign: "middle",
  });

  pied(s, 7);
  s.addNotes(
    [
      "≈ 55 s.",
      "",
      "Message clé : trois portes d'entrée selon ce que le client possède déjà. Le point de départ, c'est son logement, pas notre catalogue.",
      "",
      "À dire : le capteur, 349 € le kit, c'est le produit que nous concevons et fabriquons. Le volet, à partir de 690 € par ouvrant posé, quand il faut motoriser une ouverture. La fenêtre, à partir de 1 590 € par ouvrant posé — ce prix couvre la fenêtre ET le volet posés ensemble ; une fenêtre motorisée seule se chiffre sur devis.",
      "",
      "Rappeler que ces prix sont des prix de départ : au-delà, c'est du devis sur mesure. Il existe aussi une offre Pro sur devis pour les bailleurs, EHPAD et établissements scolaires.",
      "",
      "Répéter le point clé : dans les trois cas, l'application est incluse à vie.",
      "",
      "Transition : « Pour résumer ce que nous vendons, du capteur jusqu'au service. »",
    ].join("\n")
  );
}

// ==========================================================================
// SLIDE 8 — Une seule solution, du capteur au service
// ==========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: NUIT };
  const y0 = titre(s, "Une seule solution, du capteur au service", { sombre: true });

  const chaine = [
    ["Concevoir", "Capteurs Ombrair"],
    ["Équiper", "Volets et fenêtres motorisés"],
    ["Installer", "Pose et configuration"],
    ["Connecter", "Application Ombrair"],
    ["Accompagner", "Maintenance et support"],
  ];
  const w = (UTILE - 0.2 * 4) / 5;
  chaine.forEach(([t, st], i) => {
    const x = M + i * (w + 0.2);
    carte(s, { x, y: y0, w, h: 1.4, sombre: true });
    s.addText(t, {
      x: x + 0.1,
      y: y0 + 0.25,
      w: w - 0.2,
      h: 0.3,
      fontSize: 11.5,
      bold: true,
      fontFace: DISPLAY,
      color: CHAUX,
    });
    s.addText(st, {
      x: x + 0.1,
      y: y0 + 0.62,
      w: w - 0.2,
      h: 0.6,
      fontSize: 9.5,
      fontFace: TEXTE,
      color: TEXTE_DOUX_SOMBRE,
      lineSpacing: 12,
    });
  });

  s.addText(
    "Ombrair conçoit la couche intelligente de la solution — capteurs, intégration, logiciel et services — et fournit les équipements motorisés nécessaires, qu'elle installe et accompagne dans la durée.",
    {
      x: M,
      y: y0 + 1.75,
      w: UTILE,
      h: 0.8,
      fontSize: 14,
      fontFace: TEXTE,
      color: CHAUX,
      lineSpacing: 21,
    }
  );

  lames(s, { x: M, y: y0 + 2.62, w: 1.5, n: 3, couleur: BORDURE_SOMBRE });
  s.addText("La fraîcheur, avant la chaleur.", {
    x: M + 1.8,
    y: y0 + 2.6,
    w: UTILE - 1.8,
    h: 0.4,
    fontSize: 15,
    bold: true,
    fontFace: DISPLAY,
    color: CHAUX,
    valign: "middle",
  });

  pied(s, 8, true);
  s.addNotes(
    [
      "≈ 40 s — Conclusion.",
      "",
      "Message clé, à énoncer tel quel : Ombrair conçoit la couche intelligente — capteurs, intégration, logiciel, services — et fournit les équipements motorisés nécessaires, qu'elle installe et accompagne dans la durée.",
      "",
      "À dire : reprendre les cinq verbes de la chaîne. Concevoir est la seule étape où nous fabriquons du matériel. Les quatre autres sont de l'assemblage, de l'installation, du logiciel et du service — et c'est là que se trouve l'essentiel de notre valeur.",
      "",
      "Terminer sur la baseline, puis ouvrir les questions.",
    ].join("\n")
  );
}

const sortie = path.join(__dirname, "presentation-ombrair-produits-services.pptx");
pptx
  .writeFile({ fileName: sortie })
  .then(() => console.log("Généré :", sortie))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
