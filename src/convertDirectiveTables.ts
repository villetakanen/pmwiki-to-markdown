/**
 * Converts PMWiki directive-based tables to markdown tables
 * PMWiki tables are column-oriented: first all column headers, then rows with row headers + data
 * (:table class=light:)
 * (:headnr:)Column1 (:head:)Column2 (:head:)Column3
 * (:headnr:)Row1Name (:cell:)Data1 (:cell:)Data2
 * (:tableend:)
 *
 * becomes:
 * |   |   |   |
 * |---|---|---|
 * | **Column1** | **Column2** | **Column3** |
 * | **Row1Name** | Data1 | Data2 |
 */
export function convertDirectiveTables(text: string): string {
  // Match directive-based tables - handle both %0a and \n line breaks
  const tableRegex = /\(:table[^:]*:\)(.*?)\(:tableend:\)/gs;

  return text.replace(tableRegex, (match, tableContent) => {
    // Convert URL-encoded line breaks to actual line breaks for processing
    const normalizedContent = tableContent.replace(/%0a/g, "\n");
    const lines = normalizedContent
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line);

    if (lines.length === 0) return "";

    const markdownRows: string[] = [];
    const columnHeaders: string[] = [];
    const dataRows: Array<{ rowHeader: string; cells: string[] }> = [];
    let currentRowHeader = "";
    let currentRowCells: string[] = [];
    let hasSeenFirstCell = false;

    // Parse the table content - PMWiki tables are column-oriented
    for (const line of lines) {
      if (line.startsWith("(:headnr:)") || line.startsWith("(:head")) {
        const headerContent = line.replace(/^\(:head[^:]*:\)/, "").trim();

        if (!hasSeenFirstCell) {
          // This is a column header (we haven't seen any cells yet)
          columnHeaders.push(headerContent);
        } else {
          // This is a row header, finish previous row if exists
          if (currentRowHeader || currentRowCells.length > 0) {
            dataRows.push({
              rowHeader: currentRowHeader,
              cells: [...currentRowCells],
            });
          }
          // Start new row
          currentRowHeader = headerContent;
          currentRowCells = [];
        }
      } else if (line.startsWith("(:cellnr:)") || line.startsWith("(:cell")) {
        // This marks that we've transitioned from headers to data
        if (!hasSeenFirstCell) {
          hasSeenFirstCell = true;
          // The last column header was actually a row header
          if (columnHeaders.length > 0) {
            currentRowHeader = columnHeaders.pop() || "";
          }
        }

        const cellContent = line.replace(/^\(:cell[^:]*:\)/, "").trim();
        currentRowCells.push(cellContent);
      } else if (line.startsWith("(:")) {
        // Other directives - ignore for now
      }
    }

    // Don't forget the last row
    if (currentRowHeader || currentRowCells.length > 0) {
      dataRows.push({
        rowHeader: currentRowHeader,
        cells: [...currentRowCells],
      });
    }

    // Calculate table dimensions
    const numColumns = Math.max(
      columnHeaders.length + 1, // +1 for row header column
      dataRows.reduce((max, row) => Math.max(max, row.cells.length + 1), 0), // +1 for row header
    );

    if (numColumns === 0) return "";

    // Pad column headers to match number of columns (accounting for row header column)
    const allColumnHeaders = ["", ...columnHeaders]; // Empty first column for row headers
    while (allColumnHeaders.length < numColumns) {
      allColumnHeaders.push("");
    }

    // Add empty header row (markdown requirement)
    const emptyHeaders = Array(numColumns).fill("   ").join("|");
    markdownRows.push(`|${emptyHeaders}|`);

    // Add separator row
    const separators = Array(numColumns).fill("---");
    markdownRows.push(`|${separators.join("|")}|`);

    // Add column headers row (all bolded as they are headers)
    const formattedColumnHeaders = allColumnHeaders.map((header) =>
      header.trim() ? `**${header.trim()}**` : "",
    );
    markdownRows.push(`| ${formattedColumnHeaders.join(" | ")} |`);

    // Add data rows
    for (const row of dataRows) {
      const cells = [row.rowHeader, ...row.cells];

      // Pad row to match number of columns
      while (cells.length < numColumns) {
        cells.push("");
      }

      // Bold the first cell (row header)
      const formattedCells = cells.map((cell, index) => {
        const trimmed = cell.trim();
        return index === 0 && trimmed ? `**${trimmed}**` : trimmed;
      });

      markdownRows.push(`| ${formattedCells.join(" | ")} |`);
    }

    return `${markdownRows.join("\n")}\n`;
  });
}
