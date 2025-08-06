import { describe, expect, it } from "vitest";
import { convertHorizontalRules } from "../src/convertHorizontalRules";

describe("Test horizontal rules function specifically", () => {
  it("should handle the specific pattern from Abel", () => {
    // This is exactly what gets passed to convertHorizontalRules
    const input =
      " __Init__ +6 (+5 dex +1 insight)\\\n __Senses__ Perception +7, low-light vision\n----";

    console.log("Input to convertHorizontalRules:", JSON.stringify(input));

    const result = convertHorizontalRules(input);
    console.log("Output from convertHorizontalRules:", JSON.stringify(result));

    expect(result).toContain("__Init__");
    expect(result).toContain("__Senses__");
    expect(result).toContain("---");
    expect(result).not.toContain("----");

    // The key issue: there should be proper separation
    expect(result).not.toContain("--- __Init__");
  });

  it("should convert ---- to ---", () => {
    expect(convertHorizontalRules("----")).toContain("---");
    expect(convertHorizontalRules("----")).not.toContain("----");
  });

  it("should handle simple case", () => {
    const input = "text\n----";
    const result = convertHorizontalRules(input);
    console.log("Simple case input:", JSON.stringify(input));
    console.log("Simple case output:", JSON.stringify(result));
    expect(result).toContain("---");
  });
});
