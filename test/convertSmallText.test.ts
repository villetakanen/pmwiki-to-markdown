import { describe, expect, it } from "vitest";
import { convertSmallText } from "../src/convertSmallText";

describe("convertSmallText", () => {
  it("should convert PMWiki small text markup to HTML span tags", () => {
    const wikitext = "[- _Amiri, human barbarian._ -]";
    const expectedMarkdown =
      '<span class="text-small"> _Amiri, human barbarian._ </span>';
    expect(convertSmallText(wikitext)).toBe(expectedMarkdown);
  });

  it("should convert multiple small text markups", () => {
    const wikitext = "[- _First small text_ -] and [- _Second small text_ -]";
    const expectedMarkdown =
      '<span class="text-small"> _First small text_ </span> and <span class="text-small"> _Second small text_ </span>';
    expect(convertSmallText(wikitext)).toBe(expectedMarkdown);
  });

  it("should handle small text spanning multiple lines", () => {
    const wikitext =
      "[- _This is a long small text\nthat spans multiple lines_ -]";
    const expectedMarkdown =
      '<span class="text-small"> _This is a long small text\nthat spans multiple lines_ </span>';
    expect(convertSmallText(wikitext)).toBe(expectedMarkdown);
  });

  it("should handle complex content with links", () => {
    const wikitext =
      "[-_This website uses trademarks and/or copyrights owned by Paizo Publishing, LLC, which are used under Paizo's Community Use Policy. We are expressly prohibited from charging you to use or access this content. This website is not published, endorsed, or specifically approved by Paizo Publishing. For more information about Paizo's Community Use Policy, please visit [paizo.com/communityuse](http://paizo.com/communityuse). For more information about Paizo Publishing and Paizo products, please visit [paizo.com](http://www.paizo.com)._-]";
    const expectedMarkdown =
      "<span class=\"text-small\">_This website uses trademarks and/or copyrights owned by Paizo Publishing, LLC, which are used under Paizo's Community Use Policy. We are expressly prohibited from charging you to use or access this content. This website is not published, endorsed, or specifically approved by Paizo Publishing. For more information about Paizo's Community Use Policy, please visit [paizo.com/communityuse](http://paizo.com/communityuse). For more information about Paizo Publishing and Paizo products, please visit [paizo.com](http://www.paizo.com)._</span>";
    expect(convertSmallText(wikitext)).toBe(expectedMarkdown);
  });

  it("should leave regular text unchanged", () => {
    const wikitext = "This is regular text without small text markup";
    expect(convertSmallText(wikitext)).toBe(wikitext);
  });

  it("should not convert similar patterns that are not small text", () => {
    const wikitext =
      "This is [not small] text and some text [- properly -] formed";
    const expectedMarkdown =
      'This is [not small] text and some text <span class="text-small"> properly </span> formed';
    expect(convertSmallText(wikitext)).toBe(expectedMarkdown);
  });
});
