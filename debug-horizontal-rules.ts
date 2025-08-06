import { convertWikitextToMarkdown } from "./src/convertWikitextToMarkdown";

// This is the problematic text from Abel's file
const testText = "'''Init''' +6 (+5 dex +1 insight)\\%0a'''Senses''' Perception +7, low-light vision%0a----";

console.log("=== Original text ===");
console.log(JSON.stringify(testText));

console.log("\n=== Full conversion ===");
const result = convertWikitextToMarkdown(testText);
console.log(JSON.stringify(result));
console.log("Actual output:");
console.log(result);
