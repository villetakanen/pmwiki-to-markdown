const { convertWikitextToMarkdown } = require("../../dist/index.js");

// Test the new post-processing functionality with content similar to Abel.md
const testText =
  "'''HP''' 75/99 (8d8, +48 con +8 fcb, Burn -24 (non-lethal))\\%0a'''Force ward HP''': 20 (regen 2pts/minute)\\%0a'''Fort''' +16  (con +6, trait+1, resistance +3, class +6)\\%0a'''Refl''' +14 (dex +5, resistance +3, class +6)\\%0a'''Will''' +7 (wis 1, trait+1, resistance +3, class +2)";

console.log("=== Testing Post-Processing Functionality ===");
console.log("Original PMWiki text:");
console.log(testText);

console.log("\n--- Converted markdown ---");
const result = convertWikitextToMarkdown(testText);
console.log(result);

console.log("\n--- JSON representation (shows line breaks) ---");
console.log(JSON.stringify(result));

// Test another example with mixed content
const mixedContent =
  "!Character Stats\\%0a'''HP''' 75/99\\%0a'''AC''' 27\\%0a\\%0a!!Skills\\%0a* Acrobatics +9\\%0a* Diplomacy +9\\%0a\\%0aRegular text line 1\\%0aRegular text line 2";

console.log("\n\n=== Testing Mixed Content ===");
console.log("Original PMWiki text:");
console.log(mixedContent);

console.log("\n--- Converted markdown ---");
const mixedResult = convertWikitextToMarkdown(mixedContent);
console.log(mixedResult);

console.log("\n--- JSON representation ---");
console.log(JSON.stringify(mixedResult));
