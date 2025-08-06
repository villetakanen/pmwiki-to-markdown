import { describe, expect, it } from "vitest";
import { convertBoldMarkup } from "../src/convertWikitextToMarkdown";

describe("convertBoldMarkup", () => {
  it("should convert PMWiki bold markup to markdown bold", () => {
    const wikitext = "[+This is bold text+]";
    const expectedMarkdown = "**This is bold text**";
    expect(convertBoldMarkup(wikitext)).toBe(expectedMarkdown);
  });

  it("should convert PMWiki bold markup with links", () => {
    const wikitext =
      "[+[AP #145: Hellknight Hill](https://paizo.com/products/btq01znq) (Level 1) by Amanda Hamon+]";
    const expectedMarkdown =
      "**[AP #145: Hellknight Hill](https://paizo.com/products/btq01znq) (Level 1) by Amanda Hamon**";
    expect(convertBoldMarkup(wikitext)).toBe(expectedMarkdown);
  });

  it("should handle multiple bold markups in the same text", () => {
    const wikitext = "[+First bold text+] and [+second bold text+]";
    const expectedMarkdown = "**First bold text** and **second bold text**";
    expect(convertBoldMarkup(wikitext)).toBe(expectedMarkdown);
  });

  it("should handle bold markup spanning multiple lines", () => {
    const wikitext = "[+This is a long bold text\nthat spans multiple lines+]";
    const expectedMarkdown =
      "**This is a long bold text\nthat spans multiple lines**";
    expect(convertBoldMarkup(wikitext)).toBe(expectedMarkdown);
  });

  it("should leave regular text unchanged", () => {
    const wikitext = "This is regular text without bold markup";
    expect(convertBoldMarkup(wikitext)).toBe(wikitext);
  });
});
