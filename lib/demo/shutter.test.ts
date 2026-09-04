import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  INCLINAISON_MAX,
  LEVEE_MAX,
  LEVEE_MIN,
  bornerInclinaison,
  bornerLevee,
  fenetreAutomatique,
  libelleInclinaison,
  libelleLevee,
  tauxOuverture,
  voletAutomatique,
} from "./shutter.ts";
import { luminosite, temperatureExterieure, temperatureInterieure } from "./day-cycle.ts";

describe("bornes", () => {
  it("borne la levée", () => {
    assert.equal(bornerLevee(-20), LEVEE_MIN);
    assert.equal(bornerLevee(150), LEVEE_MAX);
    assert.equal(bornerLevee(42), 42);
  });

  it("borne l'inclinaison", () => {
    assert.equal(bornerInclinaison(-5), 0);
    assert.equal(bornerInclinaison(120), INCLINAISON_MAX);
    assert.equal(bornerInclinaison(45), 45);
  });
});

describe("tauxOuverture", () => {
  it("vaut 0 uniquement volet descendu ET lames fermées", () => {
    assert.equal(tauxOuverture({ levee: 0, inclinaison: 0 }), 0);
  });

  it("vaut 100 dès que le tablier est relevé, quel que soit l'angle", () => {
    assert.equal(tauxOuverture({ levee: 100, inclinaison: 0 }), 100);
    assert.equal(tauxOuverture({ levee: 100, inclinaison: 45 }), 100);
    assert.equal(tauxOuverture({ levee: 100, inclinaison: 90 }), 100);
  });

  it("vaut 100 tablier descendu mais lames à plat", () => {
    assert.equal(tauxOuverture({ levee: 0, inclinaison: 90 }), 100);
  });

  it("distingue bien levée et inclinaison — elles ne sont pas confondues", () => {
    // Deux états très différents mécaniquement, tous deux à mi-ouverture.
    assert.equal(tauxOuverture({ levee: 50, inclinaison: 0 }), 50);
    assert.equal(tauxOuverture({ levee: 0, inclinaison: 45 }), 50);
  });

  it("croît avec la levée à inclinaison constante", () => {
    let precedent = -1;
    for (let l = 0; l <= 100; l += 10) {
      const taux = tauxOuverture({ levee: l, inclinaison: 30 });
      assert.ok(taux >= precedent, `non monotone à levée ${l}`);
      precedent = taux;
    }
  });

  it("croît avec l'inclinaison à levée constante", () => {
    let precedent = -1;
    for (let i = 0; i <= 90; i += 10) {
      const taux = tauxOuverture({ levee: 20, inclinaison: i });
      assert.ok(taux >= precedent, `non monotone à inclinaison ${i}`);
      precedent = taux;
    }
  });

  it("reste dans 0-100 même avec des entrées aberrantes", () => {
    assert.equal(tauxOuverture({ levee: -50, inclinaison: -50 }), 0);
    assert.equal(tauxOuverture({ levee: 999, inclinaison: 999 }), 100);
  });
});

describe("libellés", () => {
  it("décrit l'orientation des lames", () => {
    assert.equal(libelleInclinaison(0), "Occultant");
    assert.equal(libelleInclinaison(30), "Lumière tamisée");
    assert.equal(libelleInclinaison(60), "Lumière filtrée");
    assert.equal(libelleInclinaison(90), "Ouvert");
  });

  it("décrit la position du tablier", () => {
    assert.equal(libelleLevee(0), "Tablier descendu");
    assert.equal(libelleLevee(100), "Tablier relevé");
    assert.match(libelleLevee(50), /50/);
  });
});

describe("voletAutomatique", () => {
  it("laisse le volet ouvert la nuit, quand l'extérieur est plus frais", () => {
    const etat = voletAutomatique(3, luminosite(3), -3);
    assert.equal(etat.levee, 100, "le tablier doit rester relevé la nuit");
    assert.equal(etat.inclinaison, INCLINAISON_MAX);
  });

  it("ferme franchement en pleine chaleur ensoleillée", () => {
    const etat = voletAutomatique(16, luminosite(16), 11);
    assert.ok(etat.levee < 10, `tablier trop haut : ${etat.levee}`);
    assert.ok(etat.inclinaison < 10, `lames trop ouvertes : ${etat.inclinaison}`);
  });

  it("joue d'abord sur les lames avant de descendre le tablier", () => {
    // Contrainte modérée : les lames s'inclinent mais le tablier reste haut.
    const etat = voletAutomatique(9, luminosite(9), 2);
    assert.equal(etat.levee, 100, "le tablier ne doit pas descendre trop tôt");
    assert.ok(etat.inclinaison < INCLINAISON_MAX, "les lames doivent déjà s'incliner");
  });

  it("évolue progressivement, sans bascule brutale d'une heure à l'autre", () => {
    let precedent = voletAutomatique(0, luminosite(0), 0);
    for (let h = 0.25; h < 24; h += 0.25) {
      const ext = temperatureExterieure(h);
      const int = temperatureInterieure(h);
      const etat = voletAutomatique(h, luminosite(h), ext - int);
      assert.ok(
        Math.abs(etat.levee - precedent.levee) < 12,
        `saut de levée à ${h} h : ${precedent.levee} → ${etat.levee}`
      );
      assert.ok(
        Math.abs(etat.inclinaison - precedent.inclinaison) < 12,
        `saut d'inclinaison à ${h} h : ${precedent.inclinaison} → ${etat.inclinaison}`
      );
      precedent = etat;
    }
  });

  it("produit toujours des valeurs dans les bornes", () => {
    for (let h = 0; h < 24; h += 0.25) {
      const etat = voletAutomatique(h, luminosite(h), temperatureExterieure(h) - temperatureInterieure(h));
      assert.ok(etat.levee >= 0 && etat.levee <= 100);
      assert.ok(etat.inclinaison >= 0 && etat.inclinaison <= 90);
    }
  });

  it("est plus fermé à 16 h qu'à 6 h — le scénario raconte bien une journée", () => {
    const matin = voletAutomatique(6, luminosite(6), temperatureExterieure(6) - temperatureInterieure(6));
    const apresMidi = voletAutomatique(16, luminosite(16), temperatureExterieure(16) - temperatureInterieure(16));
    assert.ok(tauxOuverture(apresMidi) < tauxOuverture(matin));
  });
});

describe("fenetreAutomatique", () => {
  it("reste fermée quand l'extérieur est plus chaud", () => {
    assert.equal(fenetreAutomatique(11), "fermee");
    assert.equal(fenetreAutomatique(1), "fermee");
  });

  it("s'ouvre quand l'extérieur est nettement plus frais", () => {
    assert.equal(fenetreAutomatique(-5), "ouverte");
  });

  it("reste entrouverte dans la zone intermédiaire", () => {
    assert.equal(fenetreAutomatique(0), "entrouverte");
    assert.equal(fenetreAutomatique(-1), "entrouverte");
  });
});
