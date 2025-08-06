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

  it("Should not touch Attachment links without webp option", () => {
    const wikitext = "Attach:image.png";
    const expectedMarkdown = "Attach:image.png";
    expect(convertImageLinks(wikitext)).toBe(expectedMarkdown);
  });

  it("Should not touch url-links", () => {
    const wikitext = "http://example.com";
    const expectedMarkdown = "http://example.com";
    expect(convertImageLinks(wikitext)).toBe(expectedMarkdown);
  });

  describe("webp conversion", () => {
    it("should convert Attach:image.png to Attach:image.webp when webp option is enabled", () => {
      const wikitext = "Attach:image.png";
      const expectedMarkdown = "Attach:image.webp";
      expect(convertImageLinks(wikitext, { webp: true })).toBe(
        expectedMarkdown,
      );
    });

    it("should convert Attach:image.jpg to Attach:image.webp when webp option is enabled", () => {
      const wikitext = "Attach:image.jpg";
      const expectedMarkdown = "Attach:image.webp";
      expect(convertImageLinks(wikitext, { webp: true })).toBe(
        expectedMarkdown,
      );
    });

    it("should convert Attach:image.jpeg to Attach:image.webp when webp option is enabled", () => {
      const wikitext = "Attach:image.jpeg";
      const expectedMarkdown = "Attach:image.webp";
      expect(convertImageLinks(wikitext, { webp: true })).toBe(
        expectedMarkdown,
      );
    });

    it("should convert Attach:image.gif to Attach:image.webp when webp option is enabled", () => {
      const wikitext = "Attach:image.gif";
      const expectedMarkdown = "Attach:image.webp";
      expect(convertImageLinks(wikitext, { webp: true })).toBe(
        expectedMarkdown,
      );
    });

    it("should not convert Attach:image.svg when webp option is enabled", () => {
      const wikitext = "Attach:image.svg";
      const expectedMarkdown = "Attach:image.svg";
      expect(convertImageLinks(wikitext, { webp: true })).toBe(
        expectedMarkdown,
      );
    });

    it("should convert HTTP image URLs to webp when webp option is enabled", () => {
      const wikitext =
        "http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.JPG";
      const expectedMarkdown =
        "![a converted image link](http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.webp)";
      expect(convertImageLinks(wikitext, { webp: true })).toBe(
        expectedMarkdown,
      );
    });

    it("should handle case insensitive extensions", () => {
      const wikitext = "Attach:image.PNG Attach:photo.JPG Attach:animation.GIF";
      const expectedMarkdown =
        "Attach:image.webp Attach:photo.webp Attach:animation.webp";
      expect(convertImageLinks(wikitext, { webp: true })).toBe(
        expectedMarkdown,
      );
    });

    it("should leave Attachment links unchanged when webp option is disabled", () => {
      const wikitext = "Attach:image.png";
      const expectedMarkdown = "Attach:image.png";
      expect(convertImageLinks(wikitext, { webp: false })).toBe(
        expectedMarkdown,
      );
    });
  });
});
