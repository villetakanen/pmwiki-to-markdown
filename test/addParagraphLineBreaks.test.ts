import { describe, expect, it } from "vitest";
import { addParagraphLineBreaks } from "../src/addParagraphLineBreaks";

describe("addParagraphLineBreaks", () => {
  it("should add line breaks between consecutive text lines", () => {
    const markdown = `__HP__ 75/99 (8d8, +48 con +8 fcb, Burn -24 (non-lethal))
__Force ward HP__ : 20 (regen 2pts/minute)
__Fort__ +16  (con +6, trait+1, resistance +3, class +6)
__Refl__ +14 (dex +5, resistance +3, class +6)`;

    const expected = `__HP__ 75/99 (8d8, +48 con +8 fcb, Burn -24 (non-lethal))<br>
__Force ward HP__ : 20 (regen 2pts/minute)<br>
__Fort__ +16  (con +6, trait+1, resistance +3, class +6)<br>
__Refl__ +14 (dex +5, resistance +3, class +6)`;

    expect(addParagraphLineBreaks(markdown)).toBe(expected);
  });

  it("should not add line breaks after headers", () => {
    const markdown = `# Header 1
Some text
## Header 2
More text`;

    const expected = `# Header 1
Some text
## Header 2
More text`;

    expect(addParagraphLineBreaks(markdown)).toBe(expected);
  });

  it("should not add line breaks for list items", () => {
    const markdown = `* Item 1
* Item 2
* Item 3`;

    expect(addParagraphLineBreaks(markdown)).toBe(markdown);
  });

  it("should not add line breaks when empty lines separate paragraphs", () => {
    const markdown = `First paragraph line 1
First paragraph line 2

Second paragraph line 1
Second paragraph line 2`;

    const expected = `First paragraph line 1<br>
First paragraph line 2

Second paragraph line 1<br>
Second paragraph line 2`;

    expect(addParagraphLineBreaks(markdown)).toBe(expected);
  });

  it("should replace trailing spaces with <br> tags and not duplicate line break markers", () => {
    const markdown = `Line with existing break  
Next line
Another line\\
Line with existing br<br>
Final line`;

    const expected = `Line with existing break<br>
Next line<br>
Another line\\
Line with existing br<br>
Final line`;

    expect(addParagraphLineBreaks(markdown)).toBe(expected);
  });

  it("should not add line breaks for table content", () => {
    const markdown = `| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |`;

    expect(addParagraphLineBreaks(markdown)).toBe(markdown);
  });

  it("should handle mixed content correctly", () => {
    const markdown = `# Character Stats

__HP__ 75/99
__AC__ 27

## Skills
* Acrobatics +9
* Diplomacy +9

Regular text line 1
Regular text line 2`;

    const expected = `# Character Stats

__HP__ 75/99<br>
__AC__ 27

## Skills
* Acrobatics +9
* Diplomacy +9

Regular text line 1<br>
Regular text line 2`;

    expect(addParagraphLineBreaks(markdown)).toBe(expected);
  });

  it("should not add line breaks after lines ending with sentence-ending punctuation", () => {
    const markdown = `This is a complete sentence.
This is another sentence.
This continues the thought`;

    const expected = `This is a complete sentence.
This is another sentence.
This continues the thought`;

    expect(addParagraphLineBreaks(markdown)).toBe(expected);
  });

  it("should add line breaks for definition-style content with colons", () => {
    const markdown = `__Init__ +6 (+5 dex +1 insight)
__Senses__ Perception +7, low-light vision
__AC__ 27, touch 15, flat-footed 18`;

    const expected = `__Init__ +6 (+5 dex +1 insight)<br>
__Senses__ Perception +7, low-light vision<br>
__AC__ 27, touch 15, flat-footed 18`;

    expect(addParagraphLineBreaks(markdown)).toBe(expected);
  });

  it("should add line breaks before lines starting with bold text even without colons", () => {
    const markdown = `Male Vanara __Kineticist (Aether/Air) 8__
Neutral Medium/Small Humanoid (shapechanger)
__Player__ @Nostrix (%3c140263-16>)`;

    const expected = `Male Vanara __Kineticist (Aether/Air) 8__<br>
Neutral Medium/Small Humanoid (shapechanger)<br>
__Player__ @Nostrix (%3c140263-16>)`;

    expect(addParagraphLineBreaks(markdown)).toBe(expected);
  });
});
