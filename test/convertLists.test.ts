import { describe, expect, it } from "vitest";
import { convertLists } from "../src/convertWikitextToMarkdown";

describe("convertWikitextToMarkdown", () => {
  it("should convert wikitext bullet lists to markdown", () => {
    const wikitext = `* Item 1
* Item 2
* Item 3`;
    const expectedMarkdown = "* Item 1\n* Item 2\n* Item 3";
    expect(convertLists(wikitext)).toBe(expectedMarkdown);
  });
  it("should remove extra spaces after bullet lists", () => {
    const wikitext = `*    Item 1
*        Item 2`;
    const expectedMarkdown = "* Item 1\n* Item 2";
    expect(convertLists(wikitext)).toBe(expectedMarkdown);
  });

  it("should support nested bullet lists", () => {
    const wikitext = "* Item 1\n** Item 1.1\n** Item 1.2\n* Item 2";
    const expectedMarkdown = "* Item 1\n  * Item 1.1\n  * Item 1.2\n* Item 2";
    expect(convertLists(wikitext)).toBe(expectedMarkdown);
  });

  it("should convert wikitext ordered lists to markdown", () => {
    const wikitext = `# Item 1
# Item 2
# Item 3`;
    const expectedMarkdown = "1. Item 1\n1. Item 2\n1. Item 3";
    expect(convertLists(wikitext)).toBe(expectedMarkdown);
  });
  it("should support list start without a space", () => {
    const wikitext = `*Item 1
*Item 2`;
    const expectedMarkdown = "* Item 1\n* Item 2";
    expect(convertLists(wikitext)).toBe(expectedMarkdown);
  });

  it("should add empty line after list when followed by non-list content", () => {
    const wikitext = `* Item 1
* Item 2
* Item 3
Hahmot`;
    const expectedMarkdown = "* Item 1\n* Item 2\n* Item 3\n\nHahmot";
    expect(convertLists(wikitext)).toBe(expectedMarkdown);
  });

  it("should add empty line after ordered list when followed by non-list content", () => {
    const wikitext = `# Item 1
# Item 2
# Item 3
Next section`;
    const expectedMarkdown = "1. Item 1\n1. Item 2\n1. Item 3\n\nNext section";
    expect(convertLists(wikitext)).toBe(expectedMarkdown);
  });
});
