import { describe, expect, it } from "vitest";
import { convertTables } from "../src/convertTables";

describe("convertTables", () => {
  it("should convert simple PMWiki table to markdown", () => {
    const input = `||border=1 
||Cell 1||Cell 2||Cell 3||
||Cell 4||Cell 5||Cell 6||`;

    const expected = `|   |   |   |
|---|---|---|
| Cell 1 | Cell 2 | Cell 3 |
| Cell 4 | Cell 5 | Cell 6 |`;

    expect(convertTables(input)).toBe(expected);
  });

  it("should convert complex PMWiki table with varied content", () => {
    const input = `__Skills__ ||border=1 
||Acrobatics +14•   ||Arcana +11    ||Athletics +12•    ||
||Crafting +11     ||Deception +13• ||Diplomacy +17•••    ||
||Intimidation +11 ||Lore (Library) +13•  ||Lore (Pathfinder Society) +13• ||`;

    const expected = `__Skills__ 
|   |   |   |
|---|---|---|
| Acrobatics +14• | Arcana +11 | Athletics +12• |
| Crafting +11 | Deception +13• | Diplomacy +17••• |
| Intimidation +11 | Lore (Library) +13• | Lore (Pathfinder Society) +13• |`;

    expect(convertTables(input)).toBe(expected);
  });

  it("should handle table with different number of columns", () => {
    const input = `||border=1 
||Header 1||Header 2||
||Row 1 Col 1||Row 1 Col 2||
||Row 2 Col 1||Row 2 Col 2||`;

    const expected = `|   |   |
|---|---|
| Header 1 | Header 2 |
| Row 1 Col 1 | Row 1 Col 2 |
| Row 2 Col 1 | Row 2 Col 2 |`;

    expect(convertTables(input)).toBe(expected);
  });

  it("should not affect non-table content", () => {
    const input = "This is regular text with no tables.";
    expect(convertTables(input)).toBe(input);
  });

  it("should handle multiple tables in the same text", () => {
    const input = `First table:
||border=1 
||A||B||
||C||D||

Some text in between.

Second table:
||border=1 
||E||F||
||G||H||`;

    const expected = `First table:
|   |   |
|---|---|
| A | B |
| C | D |

Some text in between.

Second table:
|   |   |
|---|---|
| E | F |
| G | H |`;

    expect(convertTables(input)).toBe(expected);
  });
});
