import { cleanWikiMarkers } from "./src/cleanWikiMarkers";

const input1 = `Some regular content
    
>>aika%3c%3c
:Rating 1: Koulut, terveyskeskukset, muut matalan prioriteetin julkiset tilat
:Rating 2: Taksit, rahtausalueet, isot varastot, ostoskeskukset
:Rating 3: Luxus taxit, yhtiöiden aulat, luxustalot, ravintolat
>>%3c%3c

More content after the section.`;

const expected1 = `Some regular content

    
:Rating 1: Koulut, terveyskeskukset, muut matalan prioriteetin julkiset tilat
:Rating 2: Taksit, rahtausalueet, isot varastot, ostoskeskukset
:Rating 3: Luxus taxit, yhtiöiden aulat, luxustalot, ravintolat

More content after the section.`;

console.log('=== INPUT 1 ===');
console.log(JSON.stringify(input1));
console.log('\n=== EXPECTED 1 ===');
console.log(JSON.stringify(expected1));
console.log('\n=== ACTUAL 1 ===');
const actual1 = cleanWikiMarkers(input1);
console.log(JSON.stringify(actual1));
console.log('\n=== MATCH 1 ===');
console.log(actual1 === expected1);

console.log('\n\n=== INPUT 2 ===');
const input2 = `First section
>>aika%3c%3c
Content 1
>>%3c%3c

Second section
>>toinen%3c%3c
Content 2
>>%3c%3c`;

const expected2 = `First section
Content 1

Second section
Content 2`;

console.log(JSON.stringify(input2));
console.log('\n=== EXPECTED 2 ===');
console.log(JSON.stringify(expected2));
console.log('\n=== ACTUAL 2 ===');
const actual2 = cleanWikiMarkers(input2);
console.log(JSON.stringify(actual2));
console.log('\n=== MATCH 2 ===');
console.log(actual2 === expected2);
