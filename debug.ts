import { readFileSync } from "fs";
import { convertDirectiveTables } from "./src/convertDirectiveTables";
import { convertWikitextToMarkdown } from "./src/convertWikitextToMarkdown";

// Read the test file
const content = readFileSync(
  "./test-materials/MyrinSankarit.Alvan-Orm",
  "utf8",
);

// Extract just the text content (after text=)
const textMatch = content.match(/text=(.*)/s);
if (textMatch) {
  const wikitext = decodeURIComponent(textMatch[1]);

  console.log("=== Original wikitext (first 500 chars) ===");
  console.log(wikitext.substring(0, 500));

  console.log("\n=== After directive table conversion ===");
  const directiveConverted = convertDirectiveTables(wikitext);
  console.log(directiveConverted.substring(0, 1000));

  console.log("\n=== Full conversion ===");
  const fullConversion = convertWikitextToMarkdown(wikitext);
  console.log(fullConversion.substring(0, 2000));
}
