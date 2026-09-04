import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BATTERIE_A_SURVEILLER_PCT,
  BATTERIE_FAIBLE_PCT,
  anomalies,
  capteurs,
  pieces,
  tousLesOuvrants,
} from "./logement.ts";

/**
 * La cohérence entre les écrans de l'application tient à une seule chose :
 * tout dérive de ce fichier. Ces tests protègent cette propriété, qui se
 * perdrait à la première donnée recopiée à la main.
 */
describe("anomalies", () => {
  it("signale exactement les défauts présents dans les données", () => {
    const attendus = [
      ...pieces.filter((p) => p.capteurHorsLigneDepuis).map((p) => p.id),
      ...tousLesOuvrants.filter((o) => o.batteriePct <= BATTERIE_FAIBLE_PCT).map((o) => o.id),
      ...capteurs
        .filter((c) => c.batteriePct <= BATTERIE_FAIBLE_PCT && !c.horsLigneDepuis)
        .map((c) => c.id),
    ];
    assert.equal(
      anomalies.length,
      attendus.length,
      "chaque défaut des données doit apparaître une fois et une seule"
    );
  });

  it("n'invente aucune panne : chaque anomalie nomme un lieu réel", () => {
    const lieux = new Set([...pieces.map((p) => p.nom), "Extérieur"]);
    for (const anomalie of anomalies) {
      assert.ok(
        lieux.has(anomalie.ou) || capteurs.some((c) => c.nom.includes(anomalie.ou)),
        `lieu inconnu : ${anomalie.ou}`
      );
      assert.ok(anomalie.consequence.length > 0, "une anomalie doit dire ce qu'elle implique");
    }
  });

  it("ne remonte pas une batterie seulement « à surveiller »", () => {
    for (const anomalie of anomalies) {
      const correspondance = anomalie.quoi.match(/\((\d+) %\)/);
      if (correspondance) {
        assert.ok(
          Number(correspondance[1]) <= BATTERIE_FAIBLE_PCT,
          `${anomalie.quoi} est au-dessus du seuil d'alerte`
        );
      }
    }
  });

  it("garde les deux seuils distincts et ordonnés", () => {
    assert.ok(
      BATTERIE_FAIBLE_PCT < BATTERIE_A_SURVEILLER_PCT,
      "le seuil d'alerte doit être plus bas que le seuil de vigilance"
    );
  });
});

describe("logement", () => {
  it("donne un identifiant unique à chaque ouvrant", () => {
    const ids = tousLesOuvrants.map((o) => o.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("rattache chaque capteur intérieur à une pièce existante", () => {
    const idsPieces = new Set(pieces.map((p) => p.id));
    for (const capteur of capteurs) {
      if (capteur.emplacement !== "interieur") continue;
      assert.ok(capteur.pieceId, `${capteur.nom} devrait nommer sa pièce`);
      assert.ok(idsPieces.has(capteur.pieceId), `pièce inconnue : ${capteur.pieceId}`);
    }
  });

  /**
   * Le capteur d'une pièce et la pièce elle-même affichent la même
   * température sur deux écrans différents. Elles doivent concorder.
   */
  it("aligne la température du capteur sur celle de sa pièce", () => {
    for (const capteur of capteurs) {
      if (capteur.emplacement !== "interieur") continue;
      const piece = pieces.find((p) => p.id === capteur.pieceId);
      const mesure = capteur.mesures.find((m) => m.label === "Température");
      if (!piece || !mesure) continue;
      const valeur = Number(mesure.valeur.replace(",", ".").replace(/[^\d.]/g, ""));
      assert.equal(valeur, piece.temperatureC, `désaccord sur ${piece.nom}`);
    }
  });

  it("marque hors ligne des deux côtés le même capteur", () => {
    for (const piece of pieces) {
      if (!piece.capteurHorsLigneDepuis) continue;
      const capteur = capteurs.find((c) => c.pieceId === piece.id);
      assert.ok(capteur, `${piece.nom} annonce un capteur hors ligne mais n'en a aucun`);
      assert.equal(capteur.signal, "hors-ligne");
      assert.equal(capteur.horsLigneDepuis, piece.capteurHorsLigneDepuis);
    }
  });
});
