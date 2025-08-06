import { describe, expect, it } from "vitest";
import { convertHorizontalRules } from "../src/convertHorizontalRules";
import { convertInlineStyles } from "../src/convertInlineStyles";
import { convertLineBreaks } from "../src/convertLineBreaks";
import { convertWikitextToMarkdown } from "../src/convertWikitextToMarkdown";
import { stripWikiRules } from "../src/stripWikiRules";

describe("Debug horizontal rules regression", () => {
  it("should reproduce the Abel.md horizontal rules issue", () => {
    // This is the problematic text from Abel's file
    const testText =
      "'''Init''' +6 (+5 dex +1 insight)\\%0a'''Senses''' Perception +7, low-light vision%0a----";

    console.log("=== Original text ===");
    console.log(JSON.stringify(testText));

    console.log("\n=== Full conversion ===");
    const result = convertWikitextToMarkdown(testText);
    console.log(JSON.stringify(result));
    console.log("Actual output:");
    console.log(result);

    // Let's test step by step to see where it breaks
    console.log("\n=== Step by step ===");

    const step1 = stripWikiRules(testText);
    console.log("After stripWikiRules:", JSON.stringify(step1));

    const step2 = convertLineBreaks(step1);
    console.log("After convertLineBreaks:", JSON.stringify(step2));

    const step3 = convertInlineStyles(step2);
    console.log("After convertInlineStyles:", JSON.stringify(step3));

    const step4 = convertHorizontalRules(step3);
    console.log("After convertHorizontalRules:", JSON.stringify(step4));

    // The issue should be that we're missing newlines before the ---
    expect(result).not.toContain("__Init__ +6 (+5 dex +1 insight) __Senses__");
    expect(result).toContain("__Init__");
    expect(result).toContain("__Senses__");
    expect(result).toContain("---");
  });

  it("should properly handle horizontal rules after content", () => {
    const input = "Some content\n----";
    const expected = "Some content\n\n---\n\n";
    expect(convertHorizontalRules(input)).toBe(expected);
  });

  it("should handle the specific case from Abel", () => {
    // After line breaks are converted, we should have:
    const afterLineBreaks =
      "'''Init''' +6 (+5 dex +1 insight)\n'''Senses''' Perception +7, low-light vision\n----";

    console.log("\nTesting specific case:");
    console.log("Input:", JSON.stringify(afterLineBreaks));

    const afterInlineStyles = convertInlineStyles(afterLineBreaks);
    console.log("After inline styles:", JSON.stringify(afterInlineStyles));

    const afterHorizontalRules = convertHorizontalRules(afterInlineStyles);
    console.log(
      "After horizontal rules:",
      JSON.stringify(afterHorizontalRules),
    );

    // The problem is likely that convertInlineStyles is not preserving newlines properly
    expect(afterInlineStyles).toContain("\n");
    expect(afterHorizontalRules).toContain("---");
  });
});
