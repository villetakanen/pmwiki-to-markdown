import { describe, expect, it } from "vitest";
import { convertHorizontalRules } from "../src/convertHorizontalRules";

describe("convertHorizontalRules", () => {
  it("should convert 4l horizontal rules to markdown", () => {
    const wikitext = "----";
    const expectedMarkdown = "\n\n---\n\n";
    expect(convertHorizontalRules(wikitext)).toBe(expectedMarkdown);
  });
  it("should convert 3l horizontal rules to markdown", () => {
    const wikitext = "---";
    const expectedMarkdown = "\n\n---\n\n";
    expect(convertHorizontalRules(wikitext)).toBe(expectedMarkdown);
  });
});
