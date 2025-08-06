import { describe, expect, it } from "vitest";
import { convertInlineStyles } from "../src/convertInlineStyles";

describe("convertInlineStyles", () => {
  it("should convert bold text to markdown", () => {
    const wikitext = "This is '''bold'''";
    const expectedMarkdown = "This is __bold__";
    expect(convertInlineStyles(wikitext)).toBe(expectedMarkdown);
  });

  it("should convert italic text to markdown", () => {
    const wikitext = "This is ''italic''";
    const expectedMarkdown = "This is _italic_";
    expect(convertInlineStyles(wikitext)).toBe(expectedMarkdown);
  });

  it("should convert bold and italic text to markdown", () => {
    const wikitext = "This is '''bold''' and ''italic''";
    const expectedMarkdown = "This is __bold__ and _italic_";
    expect(convertInlineStyles(wikitext)).toBe(expectedMarkdown);
  });

  it("PmWiki lets you have a whitespace between the style and the text", () => {
    const wikitext = "This is '''bold '''and ''italic ''";
    const expectedMarkdown = "This is __bold__ and _italic_";
    expect(convertInlineStyles(wikitext)).toBe(expectedMarkdown);
  });

  it("PmWiki lets you have a inline style beginning at a character, we need to add a space", () => {
    const wikitext = "This is'''bold''' and ''italic''";
    const expectedMarkdown = "This is __bold__ and _italic_";
    expect(convertInlineStyles(wikitext)).toBe(expectedMarkdown);
  });
});
