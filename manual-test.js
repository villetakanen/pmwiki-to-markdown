console.log('=== MANUAL TEST ===');

// Simulate the exact test input manually
const step1 = "Some regular content";
const step2 = "\n    ";
const step3 = "\n>>aika%3c%3c";
const step4 = "\n:Rating 1: Koulut, terveyskeskukset, muut matalan prioriteetin julkiset tilat";
const step5 = "\n:Rating 2: Taksit, rahtausalueet, isot varastot, ostoskeskukset";
const step6 = "\n:Rating 3: Luxus taxit, yhtiöiden aulat, luxustalot, ravintolat";
const step7 = "\n>>%3c%3c";
const step8 = "\n";
const step9 = "\nMore content after the section.";

const input = step1 + step2 + step3 + step4 + step5 + step6 + step7 + step8 + step9;
console.log('Input parts:');
console.log('1:', JSON.stringify(step1));
console.log('2:', JSON.stringify(step2));
console.log('3:', JSON.stringify(step3));
console.log('4:', JSON.stringify(step4));
console.log('5:', JSON.stringify(step5));
console.log('6:', JSON.stringify(step6));
console.log('7:', JSON.stringify(step7));
console.log('8:', JSON.stringify(step8));
console.log('9:', JSON.stringify(step9));

console.log('\nFull input:', JSON.stringify(input));

// What we expect
const expectedStep1 = "Some regular content";
const expectedStep2 = "\n";
const expectedStep3 = "\n    ";
const expectedStep4 = "\n:Rating 1: Koulut, terveyskeskukset, muut matalan prioriteetin julkiset tilat";
const expectedStep5 = "\n:Rating 2: Taksit, rahtausalueet, isot varastot, ostoskeskukset";
const expectedStep6 = "\n:Rating 3: Luxus taxit, yhtiöiden aulat, luxustalot, ravintolat";
const expectedStep7 = "\n";
const expectedStep8 = "\nMore content after the section.";

const expected = expectedStep1 + expectedStep2 + expectedStep3 + expectedStep4 + expectedStep5 + expectedStep6 + expectedStep7 + expectedStep8;
console.log('\nExpected:', JSON.stringify(expected));

// So the transformation is:
// step2 ("\n    ") -> expectedStep2 + expectedStep3 ("\n" + "\n    ")
// step3 ("\n>>aika%3c%3c") -> removed
// step7 ("\n>>%3c%3c") -> expectedStep7 ("\n")
// step8 ("\n") -> removed (merged with step7)

console.log('\nTransformation needed:');
console.log('Remove step3 (marker line)');
console.log('Remove step7 (closing marker line)');
console.log('But preserve the structure so we get an empty line before the indented content');
