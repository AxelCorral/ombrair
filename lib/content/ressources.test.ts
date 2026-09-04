import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MOTS_PAR_MINUTE, articles, tempsLectureMinutes } from "./ressources.ts";

describe("articles", () => {
  it("donne un slug unique à chaque article", () => {
    const slugs = articles.map((a) => a.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  /**
   * Le positionnement du site repose sur des chiffres sourcés. Un article
   * sans source affaiblirait tout le reste.
   */
  it("adosse chaque article à au moins une source vérifiable", () => {
    for (const article of articles) {
      assert.ok(article.sources.length > 0, `${article.slug} n'a aucune source`);
      for (const source of article.sources) {
        assert.match(source.href, /^https:\/\//, `source non https sur ${article.slug}`);
        assert.ok(source.label.length > 0);
      }
    }
  });
});

describe("tempsLectureMinutes", () => {
  it("renvoie au moins une minute", () => {
    for (const article of articles) {
      assert.ok(tempsLectureMinutes(article) >= 1, `${article.slug} : durée nulle`);
    }
  });

  it("croît avec la longueur du texte", () => {
    const court = { ...articles[0], chapo: "Court.", contenu: ["Deux mots."] };
    const long = {
      ...articles[0],
      chapo: "Long.",
      contenu: [Array.from({ length: MOTS_PAR_MINUTE * 5 }, () => "mot").join(" ")],
    };
    assert.ok(tempsLectureMinutes(long) > tempsLectureMinutes(court));
  });

  it("applique bien la cadence annoncée", () => {
    const article = {
      ...articles[0],
      chapo: "",
      contenu: [Array.from({ length: MOTS_PAR_MINUTE * 3 }, () => "mot").join(" ")],
    };
    assert.equal(tempsLectureMinutes(article), 3);
  });
});
