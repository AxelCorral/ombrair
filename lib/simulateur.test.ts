import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  NB_OUVRANTS_MAX,
  NB_OUVRANTS_MIN,
  bornerOuvrants,
  estimationCapteur,
  estimationParOuvrant,
  simuler,
  type EntreeSimulation,
  type Situation,
} from "./simulateur.ts";
import { gammeParId } from "./tarifs.ts";
import { getPrixProduit, getTotalConfigure } from "./offres.ts";

const BASE: EntreeSimulation = {
  situation: "volets-motorises",
  nbOuvrants: 4,
  orientation: "sud",
  typeLogement: "maison",
};

describe("bornerOuvrants", () => {
  it("borne en dessous et au-dessus", () => {
    assert.equal(bornerOuvrants(0), NB_OUVRANTS_MIN);
    assert.equal(bornerOuvrants(-3), NB_OUVRANTS_MIN);
    assert.equal(bornerOuvrants(999), NB_OUVRANTS_MAX);
  });

  it("arrondit et survit aux valeurs non finies", () => {
    assert.equal(bornerOuvrants(3.4), 3);
    assert.equal(bornerOuvrants(3.6), 4);
    assert.equal(bornerOuvrants(Number.NaN), NB_OUVRANTS_MIN);
  });
});

/*
 * L'ancien garde-fou vérifiait que `TARIFS_NUMERIQUES` recopiait bien les
 * chaînes de `lib/tarifs.ts`. Cette duplication n'existe plus : le
 * simulateur lit directement `lib/offres.ts`, seule grille du projet. Il
 * reste donc à vérifier que le simulateur DÉRIVE bien ses montants, sans en
 * réintroduire aucun.
 */
describe("cohérence avec la grille tarifaire", () => {
  it("le capteur se vend à l'unité, plus en kit", () => {
    const capteur = gammeParId("capteur");
    assert.doesNotMatch(capteur.nom, /kit/i, "le nom ne doit plus parler de kit");
    assert.equal(capteur.offre, "capteur");
  });

  it("chaque gamme pointe vers son offre tarifaire", () => {
    for (const id of ["capteur", "volet", "fenetre"] as const) {
      assert.equal(gammeParId(id).offre, id);
    }
  });
});

describe("estimationCapteur", () => {
  it("compte un capteur par ouvrant", () => {
    assert.equal(estimationCapteur(1).montantMin, 79.99);
    assert.equal(estimationCapteur(3).montantMin, 239.97);
  });

  it("croît de façon monotone", () => {
    let precedent = 0;
    for (let n = 1; n <= NB_OUVRANTS_MAX; n += 1) {
      const actuel = estimationCapteur(n).montantMin;
      assert.ok(actuel >= precedent, `${n} ouvrants devrait coûter au moins autant que ${n - 1}`);
      precedent = actuel;
    }
  });
});

describe("estimationParOuvrant", () => {
  it("multiplie le prix produit", () => {
    assert.equal(estimationParOuvrant("volet", 3).montantMin, 1049.97);
  });

  it("ajoute l'installation quand elle est retenue", () => {
    assert.equal(estimationParOuvrant("volet", 1, true).montantMin, 529.98);
    assert.equal(estimationParOuvrant("volet", 3, true).montantMin, 1589.94);
  });

  it("borne le nombre d'ouvrants avant de multiplier", () => {
    assert.equal(estimationParOuvrant("volet", 0).montantMin, 349.99);
  });

  it("reste aligné sur la grille centrale", () => {
    for (const id of ["capteur", "volet", "fenetre"] as const) {
      assert.equal(estimationParOuvrant(id, 1).montantMin, getPrixProduit(id) / 100);
      assert.equal(
        estimationParOuvrant(id, 2, true).montantMin,
        getTotalConfigure(id, { avecInstallation: true, quantite: 2 }) / 100
      );
    }
  });
});

describe("simuler — recommandation", () => {
  const attendu: Record<Situation, string> = {
    "volets-motorises": "capteur",
    "volets-manuels": "volet",
    "sans-volets": "volet",
    "renovation-fenetres": "fenetre",
  };

  for (const [situation, gammeId] of Object.entries(attendu)) {
    it(`recommande ${gammeId} pour « ${situation} »`, () => {
      const r = simuler({ ...BASE, situation: situation as Situation });
      assert.equal(r.gammeId, gammeId);
      assert.equal(r.href, `/gammes/${gammeId}`);
    });
  }

  it("produit toujours une estimation, une raison et des hypothèses", () => {
    for (const situation of Object.keys(attendu) as Situation[]) {
      const r = simuler({ ...BASE, situation });
      assert.ok(r.estimation, "une estimation est attendue");
      assert.ok(r.raison.length > 0);
      assert.ok(r.hypotheses.length >= 3);
      assert.ok(r.surDevis.length >= 1);
    }
  });

  /**
   * Le refus de fabriquer un gain thermique ou une économie est une règle
   * du projet, pas un oubli : on le verrouille par un test.
   */
  it("n'expose ni gain en °C ni économie en euros", () => {
    const r = simuler(BASE);
    assert.ok(!("gainConfortC" in r));
    assert.ok(!("economieClimatisation" in r));
    const mentionne = r.hypotheses.some((h) => h.includes("ni gain de confort"));
    assert.ok(mentionne, "l'absence de ces chiffres doit être expliquée");
  });

  /*
   * L'ancienne version testait la mention « la fenêtre motorisée seule est
   * sur devis », propre au tarif « fenêtre + volet ensemble » qui n'existe
   * plus. La fenêtre a désormais son propre prix, et ce qui doit être signalé
   * est ailleurs : le caractère optionnel de l'installation, et le pack.
   */
  it("annonce l'installation comme optionnelle, avec son tarif", () => {
    for (const situation of Object.keys(attendu) as Situation[]) {
      const r = simuler({ ...BASE, situation });
      assert.ok(
        r.surDevis.some((s) => /installation Ombrair est optionnelle/i.test(s)),
        `situation « ${situation} »`
      );
    }
  });

  it("signale le pack quand il en existe un pour la gamme recommandée", () => {
    const volet = simuler({ ...BASE, situation: "volets-manuels" });
    assert.ok(volet.surDevis.some((s) => s.includes("Pack Capteur + Volet")));

    const fenetre = simuler({ ...BASE, situation: "renovation-fenetres" });
    assert.ok(fenetre.surDevis.some((s) => s.includes("Pack Capteur + Fenêtre")));
  });

  it("ne propose pas de pack quand le capteur seul est recommandé", () => {
    const capteur = simuler({ ...BASE, situation: "volets-motorises" });
    assert.ok(!capteur.surDevis.some((s) => s.includes("Pack")));
  });

  it("n'avance aucun ancien montant", () => {
    const anciens = [/349 €/, /690 €/, /1[  ]?590/, /2[  ]?890/, /6[  ]?490/, /149 €/];
    for (const situation of Object.keys(attendu) as Situation[]) {
      const r = simuler({ ...BASE, situation });
      const textes = [...r.surDevis, r.estimation?.detail ?? "", ...r.hypotheses];
      for (const t of textes) {
        for (const motif of anciens) {
          assert.ok(!motif.test(t), `ancien montant dans « ${t} »`);
        }
      }
    }
  });

  it("varie la note d'orientation sans jamais avancer de chiffre", () => {
    const sud = simuler({ ...BASE, orientation: "sud" }).noteOrientation;
    const nord = simuler({ ...BASE, orientation: "nord" }).noteOrientation;
    assert.notEqual(sud, nord);
    for (const note of [sud, nord]) {
      assert.ok(!/\d+\s*°C/.test(note), "aucune température ne doit être avancée");
      assert.ok(!/\d+\s*%/.test(note), "aucun pourcentage ne doit être avancé");
    }
  });
});
