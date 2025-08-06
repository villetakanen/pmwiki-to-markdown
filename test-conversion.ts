import { readFileSync } from "fs";
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

  console.log("=== Full conversion ===");
  const fullConversion = convertWikitextToMarkdown(wikitext);
  console.log(fullConversion);
}
