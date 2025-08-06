const { convertWikitextToMarkdown } = require("./dist/index.js");

// Test the problematic pattern
const testInput = `'''%25blue%25Force ward HP''': 20 (regen 2pts/minute)%25%25\\%0a '''Fort''' +16  (con +6, trait+1, resistance +3, class +6) \\%0a '''Refl''' +14 (dex +5, resistance +3, class +6) \\%0a '''Will''' +7 (wis 1, trait+1, resistance +3, class +2) \\%0a`;

console.log("Input:");
console.log(JSON.stringify(testInput));
console.log("\nOutput:");
console.log(JSON.stringify(convertWikitextToMarkdown(testInput)));
console.log("\nFormatted output:");
console.log(convertWikitextToMarkdown(testInput));
