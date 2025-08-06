import { describe, expect, it } from "vitest";
import { applyPostProcessing } from "../src/postProcessing";

describe("applyPostProcessing", () => {
  it("should apply both trimming and line break processing", () => {
    const markdown = `   # Header with leading space
Regular text line 1
Regular text line 2

Another paragraph`;

    const expected = `# Header with leading space
Regular text line 1<br>
Regular text line 2

Another paragraph`;

    expect(applyPostProcessing(markdown)).toBe(expected);
  });

  it("should handle character sheet style content", () => {
    const markdown = `__HP__ 75/99 (8d8, +48 con +8 fcb, Burn -24 (non-lethal))
__Force ward HP__ : 20 (regen 2pts/minute)
__Fort__ +16  (con +6, trait+1, resistance +3, class +6)
__Refl__ +14 (dex +5, resistance +3, class +6)
__Will__ +7 (wis 1, trait+1, resistance +3, class +2)`;

    const expected = `__HP__ 75/99 (8d8, +48 con +8 fcb, Burn -24 (non-lethal))<br>
__Force ward HP__ : 20 (regen 2pts/minute)<br>
__Fort__ +16  (con +6, trait+1, resistance +3, class +6)<br>
__Refl__ +14 (dex +5, resistance +3, class +6)<br>
__Will__ +7 (wis 1, trait+1, resistance +3, class +2)`;

    expect(applyPostProcessing(markdown)).toBe(expected);
  });
});
