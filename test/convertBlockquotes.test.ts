import { describe, expect, it } from "vitest";
import { convertBlockquotes } from "../src/convertBlockquotes";

describe("convertBlockquotes", () => {
  it("should convert PMWiki blockquotes to markdown blockquotes", () => {
    const wikitext = "->This is a blockquote";
    const expectedMarkdown = "> This is a blockquote";
    expect(convertBlockquotes(wikitext)).toBe(expectedMarkdown);
  });

  it("should convert multiple blockquotes", () => {
    const wikitext = "->First blockquote\n->Second blockquote";
    const expectedMarkdown = "> First blockquote\n> Second blockquote";
    expect(convertBlockquotes(wikitext)).toBe(expectedMarkdown);
  });

  it("should only convert lines that start with ->", () => {
    const wikitext =
      "->This is a blockquote\nThis is regular text\n->Another blockquote";
    const expectedMarkdown =
      "> This is a blockquote\nThis is regular text\n> Another blockquote";
    expect(convertBlockquotes(wikitext)).toBe(expectedMarkdown);
  });

  it("should handle blockquotes with complex content", () => {
    const wikitext =
      "->Attach:4stars.png Kampanja lähtee kunnolla käyntiin ja sirkusmiljööstä otetaan kaikki irti. -@NiTessine";
    const expectedMarkdown =
      "> Attach:4stars.png Kampanja lähtee kunnolla käyntiin ja sirkusmiljööstä otetaan kaikki irti. -@NiTessine";
    expect(convertBlockquotes(wikitext)).toBe(expectedMarkdown);
  });

  it("should leave regular text unchanged", () => {
    const wikitext = "This is regular text without blockquotes";
    expect(convertBlockquotes(wikitext)).toBe(wikitext);
  });

  it("should not convert -> in the middle of lines", () => {
    const wikitext =
      "Some text -> this is not a blockquote\n->This is a blockquote";
    const expectedMarkdown =
      "Some text -> this is not a blockquote\n> This is a blockquote";
    expect(convertBlockquotes(wikitext)).toBe(expectedMarkdown);
  });
});
