/**
 * Converts PMWiki tables to markdown tables
 * ||border=1
 * ||Cell 1||Cell 2||Cell 3||
 * ||Cell 4||Cell 5||Cell 6||
 *
 * becomes:
 * |   |   |   |
 * |---|---|---|
 * | Cell 1 | Cell 2 | Cell 3 |
 * | Cell 4 | Cell 5 | Cell 6 |
 */
export function convertTables(text: string): string {
  // Match table blocks that start with ||border=1 (possibly with text before it)
  // and capture all subsequent rows that start with || and end with ||
  const tableRegex = /(.*?)\|\|border=\d+\s*\n((?:\|\|.*\|\|\n?)+)/gm;

  return text.replace(tableRegex, (match, beforeBorder, tableContent) => {
    // Check if the table content ends with a newline and preserve it
    const endsWithNewline = tableContent.endsWith("\n");

    // Split table content into rows
    const tableLines = tableContent
      .trim()
      .split("\n")
      .filter((line: string) => line.trim());

    if (tableLines.length === 0) return match;

    const markdownRows: string[] = [];

    // Add the text that was before the border declaration (like "__Skills__ ")
    const prefixText = beforeBorder ? beforeBorder.trim() : "";
    if (prefixText) {
      markdownRows.push(`${prefixText} `);
    }

    // Get the number of columns from the first row
    const firstLine = tableLines[0];
    const cleanFirstLine = firstLine.replace(/^\|\|/, "").replace(/\|\|$/, "");
    const numColumns = cleanFirstLine.split("||").length;

    // Add empty header row
    const emptyHeaders = Array(numColumns).fill("   ").join("|");
    markdownRows.push(`|${emptyHeaders}|`);

    // Add separator row
    const separators = Array(numColumns).fill("---");
    markdownRows.push(`|${separators.join("|")}|`);

    // Add all data rows
    for (const line of tableLines) {
      // Remove leading and trailing ||, then split by ||
      const cleanLine = line.replace(/^\|\|/, "").replace(/\|\|$/, "");
      const cells = cleanLine.split("||").map((cell: string) => cell.trim());

      // Create markdown table row
      const markdownRow = `| ${cells.join(" | ")} |`;
      markdownRows.push(markdownRow);
    }

    const result = markdownRows.join("\n");

    // Preserve the trailing newline if it existed in the original
    return endsWithNewline ? `${result}\n` : result;
  });
}
