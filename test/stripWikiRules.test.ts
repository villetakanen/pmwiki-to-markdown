import { describe, expect, it } from "vitest";
import { stripWikiRules } from "../src/stripWikiRules";

describe("stripWikiRules", () => {
  it("should strip inline styles", () => {
    const wikitext = "This is %25bold%25 text %25%25";
    const expectedMarkdown = "This is  text ";
    expect(stripWikiRules(wikitext)).toBe(expectedMarkdown);
  });
  it("should strip inline styles that end at line end", () => {
    const wikitext =
      "%25justify%25 Ilta Ruosteisessa Tikarissa jatkui juoman ja ruuan virratessa pöytiin.\n\n and some more text";
    const expectedMarkdown =
      " Ilta Ruosteisessa Tikarissa jatkui juoman ja ruuan virratessa pöytiin.\n\n and some more text";
    expect(stripWikiRules(wikitext)).toBe(expectedMarkdown);
  });
  it("should strip wiki directives", () => {
    const wikitext = "This is (:directive:)";
    const expectedMarkdown = "This is ";
    expect(stripWikiRules(wikitext)).toBe(expectedMarkdown);
  });
});
