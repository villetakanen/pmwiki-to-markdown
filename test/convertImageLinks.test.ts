import { describe, expect, it } from "vitest";
import { convertImageLinks } from "../src/convertImageLinks";

describe("convertImageLinks", () => {
  it("should convert http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.JPG to markdown image", () => {
    const wikitext =
      "http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.JPG";
    const expectedMarkdown =
      "![a converted image link](http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.JPG)";
    expect(convertImageLinks(wikitext)).toBe(expectedMarkdown);
  });
  it("Should not touch Attachment links", () => {
    const wikitext = "Attach:image.png";
    const expectedMarkdown = "Attach:image.png";
    expect(convertImageLinks(wikitext)).toBe(expectedMarkdown);
  });
});
