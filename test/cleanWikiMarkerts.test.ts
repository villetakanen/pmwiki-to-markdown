import { describe, expect, it } from "vitest";
import { cleanWikiMarkers } from "../src/cleanWikiMarkers";

describe("Wiki Marker Cleaner", () => {
  it("removes PmWiki section markers", () => {
    const input = `Some regular content
    
>>aika%3c%3c
:Rating 1: Koulut, terveyskeskukset, muut matalan prioriteetin julkiset tilat
:Rating 2: Taksit, rahtausalueet, isot varastot, ostoskeskukset
:Rating 3: Luxus taxit, yhtiöiden aulat, luxustalot, ravintolat
>>%3c%3c

More content after the section.`;

    const expected = `Some regular content

    
:Rating 1: Koulut, terveyskeskukset, muut matalan prioriteetin julkiset tilat
:Rating 2: Taksit, rahtausalueet, isot varastot, ostoskeskukset
:Rating 3: Luxus taxit, yhtiöiden aulat, luxustalot, ravintolat

More content after the section.`;

    expect(cleanWikiMarkers(input)).toBe(expected);
  });

  it("handles multiple section markers", () => {
    const input = `First section
>>aika%3c%3c
Content 1
>>%3c%3c

Second section
>>toinen%3c%3c
Content 2
>>%3c%3c`;

    const expected = `First section
Content 1

Second section
Content 2`;

    expect(cleanWikiMarkers(input)).toBe(expected);
  });
});
