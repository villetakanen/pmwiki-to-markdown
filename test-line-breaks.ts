import { convertWikitextToMarkdown } from "./src/convertWikitextToMarkdown";

// Test the new post-processing functionality
const testText = `'''HP''' 75/99 (8d8, +48 con +8 fcb, Burn -24 (non-lethal))\\%0a'''Force ward HP''': 20 (regen 2pts/minute)\\%0a'''Fort''' +16  (con +6, trait+1, resistance +3, class +6)\\%0a'''Refl''' +14 (dex +5, resistance +3, class +6)\\%0a'''Will''' +7 (wis 1, trait+1, resistance +3, class +2)`;

console.log("=== Original PMWiki text ===");
console.log(testText);

console.log("\n=== Converted markdown ===");
const result = convertWikitextToMarkdown(testText);
console.log(result);

console.log("\n=== Formatted view ===");
console.log(JSON.stringify(result));
