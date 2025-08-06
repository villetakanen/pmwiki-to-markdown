const { addParagraphLineBreaks } = require("./dist/index.js");

// Test the exact scenario from Abel.md
const testInput = `Male Vanara __Kineticist (Aether/Air) 8__
Neutral Medium/Small Humanoid (shapechanger)  
__Player__ @Nostrix (%3c140263-16>)`;

console.log("=== Input ===");
console.log(JSON.stringify(testInput));

console.log("=== Output ===");
const result = addParagraphLineBreaks(testInput);
console.log(JSON.stringify(result));

console.log("=== Formatted ===");
console.log(result);
