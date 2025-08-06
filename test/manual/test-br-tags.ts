import { addParagraphLineBreaks } from "../src/addParagraphLineBreaks";

// Test the new <br> functionality directly
const testInput = `__HP__ 75/99 (8d8, +48 con +8 fcb, Burn -24 (non-lethal))
__Force ward HP__ : 20 (regen 2pts/minute)
__Fort__ +16  (con +6, trait+1, resistance +3, class +6)`;

console.log("=== Testing addParagraphLineBreaks directly ===");
console.log("Input:");
console.log(testInput);

console.log("\nOutput:");
const result = addParagraphLineBreaks(testInput);
console.log(result);

console.log("\nJSON representation:");
console.log(JSON.stringify(result));
