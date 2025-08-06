import { describe, expect, it } from "vitest";
import { convertLineBreaks } from "../src/convertLineBreaks";

describe("convertLineBreaks", () => {
  it("should convert PmWiki line breaks to markdown line breaks", () => {
    const wikitext = "This is a line%0aAnd this is another line";
    const expectedMarkdown = "This is a line\nAnd this is another line";
    expect(convertLineBreaks(wikitext)).toBe(expectedMarkdown);
  });
  it("should convert PmWiki <br> line breaks to markdown <br> line breaks", () => {
    const wikitext = "This is a line\\\\%0aAnd this is another line";
    const expectedMarkdown = "This is a line  \nAnd this is another line";
    expect(convertLineBreaks(wikitext)).toBe(expectedMarkdown);
  });
  it("should handle Pseudodragon Bard 6\\\\%0aNG Tiny Dragon) correctly", () => {
    const wikitext = "Pseudodragon Bard 6\\\\%0aNG Tiny Dragon";
    const expectedMarkdown = "Pseudodragon Bard 6  \nNG Tiny Dragon";
    expect(convertLineBreaks(wikitext)).toBe(expectedMarkdown);
  });

  /*
    it('should convert PmWiki line breaks to markdown line breaks', () => {
        const wikitext = 'This is a line\\%0aAnd It had a forced line break';
        const expectedMarkdown = 'This is a line  \nAnd It had a forced line break';
        expect(convertLineBreaks(wikitext)).toBe(expectedMarkdown);
    })*/
});
