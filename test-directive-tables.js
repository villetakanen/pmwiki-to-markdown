const fs = require("fs");

// Import the TypeScript files directly
const {
  convertDirectiveTables,
  convertWikitextToMarkdown,
} = require("./src/convertWikitextToMarkdown.ts");

// Read the test file
const content = fs.readFileSync(
  "./test-materials/MyrinSankarit.Alvan-Orm",
  "utf8",
);

// Extract just the text content (after text=)
const textMatch = content.match(/text=(.*)/s);
if (textMatch) {
  const wikitext = decodeURIComponent(textMatch[1]);
  console.log("=== Original PMWiki directive table (first 1000 chars) ===");
  console.log(wikitext.substring(0, 1000));

  console.log("\n=== After directive table conversion ===");
  const converted = convertDirectiveTables(wikitext);
  console.log(converted.substring(0, 1500));

  console.log("\n=== Full conversion ===");
  const fullConversion = convertWikitextToMarkdown(wikitext);
  console.log(fullConversion.substring(0, 1500));
}
