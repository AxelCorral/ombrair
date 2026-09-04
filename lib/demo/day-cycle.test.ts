import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  COUCHER_SOLEIL,
  EXT_MAX,
  EXT_MIN,
  HEURE_DEPART,
  HEURE_EXT_MAX,
  HEURE_EXT_MIN,
  INT_MAX,
  INT_MIN,
  LEVER_SOLEIL,
  etatSimulation,
  formatHeure,
  heureDepuisTempsEcoule,
  luminosite,
  normaliserHeure,
  phaseCiel,
  positionLune,
  positionSoleil,
  melangeCiel,
  temperatureExterieure,
  temperatureInterieure,
  DUREE_CYCLE_MS,
} from "./day-cycle.ts";
import { tauxOuverture, voletAutomatique } from "./shutter.ts";

describe("normaliserHeure", () => {
  it("laisse les heures valides intactes", () => {
    assert.equal(normaliserHeure(0), 0);
    assert.equal(normaliserHeure(12), 12);
    assert.equal(normaliserHeure(23.99), 23.99);
  });

  it("repasse à zéro après 24 h", () => {
    assert.equal(normaliserHeure(24), 0);
    assert.equal(normaliserHeure(25), 1);
    assert.equal(normaliserHeure(48), 0);
  });

  it("gère les heures négatives, nécessaires au calcul d'inertie", () => {
    assert.equal(normaliserHeure(-1), 23);
    assert.equal(normaliserHeure(-3.5), 20.5);
  });
});

describe("formatHeure", () => {
  it("formate en HH:MM", () => {
    assert.equal(formatHeure(0), "00:00");
    assert.equal(formatHeure(6.5), "06:30");
    assert.equal(formatHeure(14 + 20 / 60), "14:20");
    assert.equal(formatHeure(22.75), "22:45");
  });

  it("boucle sur 24 h", () => {
    assert.equal(formatHeure(24), "00:00");
    assert.equal(formatHeure(25.5), "01:30");
  });
});

describe("heureDepuisTempsEcoule", () => {
  it("parcourt une journée complète sur la durée du cycle", () => {
    assert.equal(heureDepuisTempsEcoule(0), HEURE_DEPART);
    assert.equal(heureDepuisTempsEcoule(DUREE_CYCLE_MS / 2), normaliserHeure(HEURE_DEPART + 12));
    assert.equal(heureDepuisTempsEcoule(DUREE_CYCLE_MS), HEURE_DEPART);
  });

  it("revient au point de départ au cycle suivant", () => {
    assert.equal(
      heureDepuisTempsEcoule(DUREE_CYCLE_MS * 1.5),
      normaliserHeure(HEURE_DEPART + 12)
    );
  });

  /**
   * Le premier écran doit démontrer le produit, pas une nuit vide — ni un
   * volet complètement baissé, qui masque le ciel et ne montre rien non
   * plus. Trois conditions font une scène lisible, et elles sont
   * verrouillées ici parce qu'un simple décalage d'heure suffirait à en
   * casser une sans que rien ne le signale.
   */
  it("démarre sur un instant qui démontre le produit", () => {
    const heure = heureDepuisTempsEcoule(0);
    const depart = etatSimulation(heure);
    const ecart = depart.temperatureExterieure - depart.temperatureInterieure;
    const volet = voletAutomatique(heure, depart.luminosite, ecart);
    const ouverture = tauxOuverture(volet);

    assert.ok(depart.soleil.visible, "le soleil doit être visible au départ");
    assert.ok(ecart > 3, `l'écart extérieur/intérieur doit être parlant (${ecart.toFixed(1)} °C)`);
    assert.ok(
      volet.levee < 95,
      `le tablier doit être engagé, sinon il n'y a pas de volet à voir (levée ${volet.levee.toFixed(0)} %)`
    );
    assert.ok(
      volet.inclinaison > 20,
      `les lames doivent être nettement inclinées (${volet.inclinaison.toFixed(0)}°)`
    );
    /*
     * Le tablier s'enroule en haut et dégage par le bas : le soleil n'est
     * dans la partie visible du cadre que si sa hauteur reste sous le taux
     * de levée. C'est la condition qu'on avait ratée en visant d'abord
     * l'heure la plus chaude — le volet y masquait le soleil.
     */
    assert.ok(
      depart.soleil.hauteur < volet.levee / 100,
      `le soleil doit tomber dans la partie dégagée (hauteur ${depart.soleil.hauteur.toFixed(2)} vs levée ${(volet.levee / 100).toFixed(2)})`
    );
    assert.ok(ouverture > 15, `la scène ne doit pas être un tablier opaque (${ouverture} %)`);
  });
});

describe("positionSoleil", () => {
  it("est invisible la nuit", () => {
    for (const h of [0, 3, 23.5]) {
      assert.equal(positionSoleil(h).visible, false, `à ${h} h`);
    }
  });

  it("est visible entre le lever et le coucher", () => {
    assert.equal(positionSoleil(12).visible, true);
    assert.equal(positionSoleil(LEVER_SOLEIL + 0.1).visible, true);
    assert.equal(positionSoleil(COUCHER_SOLEIL - 0.1).visible, true);
  });

  it("traverse le cadre d'est en ouest", () => {
    const matin = positionSoleil(8);
    const apresMidi = positionSoleil(18);
    assert.ok(matin.x < apresMidi.x, "le soleil doit progresser vers l'ouest");
  });

  it("culmine au milieu de sa course, pas aux extrémités", () => {
    const midiSolaire = (LEVER_SOLEIL + COUCHER_SOLEIL) / 2;
    const haut = positionSoleil(midiSolaire).hauteur;
    assert.ok(haut > positionSoleil(LEVER_SOLEIL + 1).hauteur);
    assert.ok(haut > positionSoleil(COUCHER_SOLEIL - 1).hauteur);
    assert.ok(haut > 0.99, "la hauteur maximale doit approcher 1");
  });

  it("est au ras de l'horizon au lever et au coucher", () => {
    assert.ok(positionSoleil(LEVER_SOLEIL).hauteur < 0.01);
    assert.ok(positionSoleil(COUCHER_SOLEIL).hauteur < 0.01);
  });
});

describe("positionLune", () => {
  it("est visible la nuit et invisible en journée", () => {
    assert.equal(positionLune(0).visible, true);
    assert.equal(positionLune(23).visible, true);
    assert.equal(positionLune(5).visible, true);
    assert.equal(positionLune(12).visible, false);
    assert.equal(positionLune(16).visible, false);
  });

  it("progresse en traversant minuit sans repartir en arrière", () => {
    const avantMinuit = positionLune(23);
    const apresMinuit = positionLune(1);
    assert.ok(avantMinuit.x < apresMinuit.x, "la lune doit continuer sa course après minuit");
  });

  it("ne se superpose jamais au soleil", () => {
    for (let h = 0; h < 24; h += 0.25) {
      const s = positionSoleil(h);
      const l = positionLune(h);
      assert.ok(!(s.visible && l.visible), `soleil et lune tous deux visibles à ${h} h`);
    }
  });
});

describe("phaseCiel", () => {
  it("nomme correctement les moments clés", () => {
    assert.equal(phaseCiel(0), "nuit");
    assert.equal(phaseCiel(6), "aube");
    assert.equal(phaseCiel(9), "matin");
    assert.equal(phaseCiel(13), "midi");
    assert.equal(phaseCiel(17), "apres-midi");
    assert.equal(phaseCiel(20), "coucher");
    assert.equal(phaseCiel(22), "crepuscule");
    assert.equal(phaseCiel(23.5), "nuit");
  });

  it("couvre les 24 h sans trou", () => {
    for (let h = 0; h < 24; h += 0.25) {
      assert.ok(phaseCiel(h), `phase manquante à ${h} h`);
    }
  });
});

describe("melangeCiel", () => {
  it("renvoie toujours deux phases et un t borné", () => {
    for (let h = 0; h < 24; h += 0.1) {
      const m = melangeCiel(h);
      assert.ok(m.de && m.vers, `phases manquantes à ${h} h`);
      assert.ok(m.t >= 0 && m.t <= 1, `t hors bornes à ${h} h : ${m.t}`);
    }
  });

  it("progresse d'une phase à la suivante sans sauter", () => {
    const m6 = melangeCiel(6.5);
    assert.equal(m6.de, "aube");
    assert.ok(m6.t < 0.05, "on doit être au tout début de la phase aube");
  });

  it("reboucle du crépuscule vers la nuit en passant minuit", () => {
    const m = melangeCiel(23.5);
    assert.equal(m.de, "crepuscule");
    assert.equal(m.vers, "nuit");
  });
});

describe("luminosite", () => {
  it("est nulle la nuit", () => {
    assert.equal(luminosite(0), 0);
    assert.equal(luminosite(3), 0);
    assert.equal(luminosite(23), 0);
  });

  it("est maximale au milieu de la journée", () => {
    const midiSolaire = (LEVER_SOLEIL + COUCHER_SOLEIL) / 2;
    assert.ok(luminosite(midiSolaire) > 0.95);
  });

  it("reste bornée entre 0 et 1", () => {
    for (let h = 0; h < 24; h += 0.25) {
      const l = luminosite(h);
      assert.ok(l >= 0 && l <= 1, `luminosité hors bornes à ${h} h : ${l}`);
    }
  });
});

describe("temperatureExterieure", () => {
  it("atteint son minimum et son maximum aux heures prévues", () => {
    assert.ok(Math.abs(temperatureExterieure(HEURE_EXT_MIN) - EXT_MIN) < 0.01);
    assert.ok(Math.abs(temperatureExterieure(HEURE_EXT_MAX) - EXT_MAX) < 0.01);
  });

  it("reste dans les bornes du scénario sur 24 h", () => {
    for (let h = 0; h < 24; h += 0.1) {
      const t = temperatureExterieure(h);
      assert.ok(t >= EXT_MIN - 0.01 && t <= EXT_MAX + 0.01, `${t} °C hors bornes à ${h} h`);
    }
  });

  it("monte le matin et redescend le soir", () => {
    assert.ok(temperatureExterieure(10) > temperatureExterieure(7));
    assert.ok(temperatureExterieure(20) < temperatureExterieure(HEURE_EXT_MAX));
  });

  it("est continue au passage de minuit", () => {
    const ecart = Math.abs(temperatureExterieure(23.99) - temperatureExterieure(0.01));
    assert.ok(ecart < 0.2, `discontinuité de ${ecart} °C à minuit`);
  });
});

describe("temperatureInterieure", () => {
  it("reste dans les bornes du scénario", () => {
    for (let h = 0; h < 24; h += 0.25) {
      for (const ouverture of [0, 50, 100]) {
        const t = temperatureInterieure(h, ouverture);
        assert.ok(t >= INT_MIN - 0.01 && t <= INT_MAX + 1.3, `${t} °C hors bornes à ${h} h`);
      }
    }
  });

  it("varie beaucoup moins que l'extérieure — c'est l'inertie", () => {
    let minInt = Infinity;
    let maxInt = -Infinity;
    for (let h = 0; h < 24; h += 0.25) {
      const t = temperatureInterieure(h);
      minInt = Math.min(minInt, t);
      maxInt = Math.max(maxInt, t);
    }
    assert.ok(maxInt - minInt < EXT_MAX - EXT_MIN, "l'amplitude intérieure doit être plus faible");
  });

  it("n'est pas un simple décalage de l'extérieure", () => {
    const ecarts = [6, 12, 18].map((h) => temperatureExterieure(h) - temperatureInterieure(h));
    const tousIdentiques = ecarts.every((e) => Math.abs(e - ecarts[0]) < 0.5);
    assert.ok(!tousIdentiques, "l'écart int/ext doit varier au fil de la journée");
  });

  it("laisse entrer un peu plus de chaleur volet ouvert, jamais moins", () => {
    const ferme = temperatureInterieure(HEURE_EXT_MAX, 0);
    const ouvert = temperatureInterieure(HEURE_EXT_MAX, 100);
    assert.ok(ouvert > ferme, "volet ouvert en pleine chaleur doit réchauffer l'intérieur");
    assert.ok(ouvert - ferme <= 1.21, "l'influence doit rester modeste");
  });

  it("ne fait pas varier l'intérieur quand l'extérieur est plus frais", () => {
    // À 4 h du matin l'extérieur est sous l'intérieur : l'ouverture ne doit
    // pas réchauffer.
    assert.equal(temperatureInterieure(4, 0), temperatureInterieure(4, 100));
  });
});

describe("etatSimulation", () => {
  it("reste cohérent aux heures limites", () => {
    for (const h of [0, 6, 12, 18, 23.99]) {
      const etat = etatSimulation(h);
      assert.equal(etat.heureFormatee, formatHeure(h));
      assert.ok(!(etat.soleil.visible && etat.lune.visible));
      // Il fait forcément sombre si aucun astre n'est levé.
      if (!etat.soleil.visible) assert.equal(etat.luminosite, 0);
    }
  });

  it("affiche minuit et non 24:00 en fin de cycle", () => {
    assert.equal(etatSimulation(24).heureFormatee, "00:00");
  });
});
