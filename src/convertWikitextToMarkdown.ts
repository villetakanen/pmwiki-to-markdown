import { cleanWikiMarkers } from "./cleanWikiMarkers";
import { convertImageLinks } from "./convertImageLinks";
import { stripWikiRules } from "./stripWikiRules";

interface ConversionOptions {
  webp?: boolean;
}

/**
 * In Wikitext, a style starts with >>[style]3c%3c, we need to strip this out.
 */
function stripWikiStyles(wikitext: string) {
  return wikitext.replace(/>>.*?3c%3c/g, "");
}

/**
 * We need to convert lines like
 * !Heading 1
 * to # Heading 1
 * and
 * !!Heading 2
 * to ## Heading 2
 *
 * to level 4 headings.
 */
function convertHeadings(text: string): string {
  return text.replace(/!{1,4}/g, (match) => {
    return `${"#".repeat(match.length)} `;
  });
}

/**
 * PmWiki uses ~uid for user tags, we need to convert these to more standard @uid tags.
 *
 * Additionally, some user tags are used in links, we need to convert these as well:
 * [[~V]] -> @V
 */
export function convertUserTags(text: string): string {
  //return text.replace(/~(.*?)(\s|$)/g, "@$1$2");
  return text
    .replace(/\[\[~(.*?)\]\]/g, (match, p1) => {
      return `@${p1}`;
    })
    .replace(/~(.*?)(\s|$)/g, "@$1$2");
}

/**
 * PmWiki uses * for unordered lists and # for ordered lists. While these are similar to markdown,
 * intended lists are done with co-joined * or # characters. We need to convert these to proper
 * markdown lists.
 *
 * Additionally we need to convert # used for ordered lists in PmWiki to markdown ordered lists
 * 1. 2. 3. etc.
 *
 * Note: a PmWiki list start does not need to have a whitespace after the * or #, we need to add
 * this, if it is missing.
 *
 * @param text
 */
export function convertLists(text: string): string {
  // First lets convert unordered lists, this is straightforward, just add a space after each *
  // then lets convert ordered lists, we do a naive
  // conversion by replacing all # with 1. and then all ## with '  1.' etc.
  let result = text
    .replace(/^\*{1,4}\s*/gm, (match) => {
      return `${"  ".repeat(match.trim().length - 1)}* `;
    })
    .replace(/^#{1,4}\s*/gm, (match) => {
      return `${"  ".repeat(match.trim().length - 1)}1. `;
    });

  // Add empty lines after lists when followed by non-list content
  // Match a list item (lines starting with markdown list markers) followed directly by a non-list line
  result = result.replace(
    /^(\s*(?:\*|1\.) .+)(\n)(?=^(?!\s*(?:\*|1\.) |\s*$)[^\n])/gm,
    "$1\n$2",
  );

  return result;
}

/**
 * Converts PmWiki line breaks to markdown line breaks %0a -> \n
 *
 * PMWiki uses \\%0a for a forced line break, we need to convert this to a two space line break - '  \n'
 *
 */
export function convertLineBreaks(text: string): string {
  // First we need to convert forced line breaks \\%0a to a two space line break
  return text.replace(/\\\\%0a/g, "  \n").replace(/%0a/g, "\n");
}

/**
 * Converts wikilinks to markdown links
 *
 * [[Page Name]] -> [Page Name](PageName.md)
 * [[PageName | Link Text]] -> [Link Text](PageName.md)
 */
function convertWikiLinks(text: string): string {
  return text.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
    const parts = p1.split("|");
    const pageName = parts[0].replace(/ /g, "");
    const linkText = parts[1] ? parts[1] : parts[0];
    return `[${linkText}](${pageName.toLowerCase()})`;
  });
}

/**
 * PmWiki uses --- or ---- to represent a horizontal rule. We need to convert this to --- in markdown.
 *
 * Also adding a newline before and after the horizontal rule, to prevent it from being a header
 * underline.
 *
 * Note: We need to be careful not to break markdown table separator rows (|---|---|---|)
 */
export function convertHorizontalRules(text: string): string {
  return text.replace(/----/g, "---").replace(/^---$/gm, "\n\n---\n\n"); // Only convert standalone --- lines on their own
}

/**
 * Stream parse the inline styles, we need to ensure that we have the correct amount of whitespaces
 * around the bold and italic text.
 */
function parseInlineBold(remainingText: string, inside = false): string {
  // On bold, add __ to the blocks array
  const boldTokenIndex = remainingText.indexOf("'''");
  if (!inside) {
    if (boldTokenIndex > -1) {
      // We are inside a bold block, so we want to return the text starting with ' __'
      const before =
        boldTokenIndex === 0 ? "" : remainingText.slice(0, boldTokenIndex);
      const after = parseInlineBold(
        remainingText.slice(boldTokenIndex + 3),
        true,
      );
      return `${before.trim()} __${after.trim()}`;
    }
    // the remaining text does not contain any bold tokens, so we can just return the text
    return remainingText;
  }
  if (boldTokenIndex > -1) {
    // We are inside a bold block, so we want to return the text starting with '__ '
    const before = remainingText.slice(0, boldTokenIndex);
    const after = parseInlineBold(remainingText.slice(boldTokenIndex + 3));
    return `${before.trim()}__ ${after?.trim()}`;
  }
  return remainingText;
}
function parseInlineItalic(remainingText: string, inside = false): string {
  // On italic, add _ to the blocks array
  const italicTokenIndex = remainingText.indexOf("''");
  if (!inside) {
    if (italicTokenIndex > -1) {
      // We are inside a italic block, so we want to return the text starting with ' _'
      const before =
        italicTokenIndex === 0 ? "" : remainingText.slice(0, italicTokenIndex);
      const after = parseInlineItalic(
        remainingText.slice(italicTokenIndex + 2),
        true,
      );
      return `${before.trim()} _${after.trim()}`;
    }
    // the remaining text does not contain any italic tokens, so we can just return the text
    return remainingText;
  }
  if (italicTokenIndex > -1) {
    // We are inside a italic block, so we want to return the text starting with '_ '
    const before = remainingText.slice(0, italicTokenIndex);
    const after = parseInlineItalic(remainingText.slice(italicTokenIndex + 2));
    return `${before.trim()}_ ${after?.trim()}`;
  }
  return remainingText;
}

/**
 * Converts PMWiki small text markup [-text-] to HTML span tags
 * [-text-] -> <span class="text-small">text</span>
 */
export function convertSmallText(text: string): string {
  return text.replace(
    /\[-([\s\S]*?)-\]/g,
    '<span class="text-small">$1</span>',
  );
}

/**
 * Converts PMWiki blockquotes to markdown blockquotes
 * ->text -> > text
 */
export function convertBlockquotes(text: string): string {
  return text.replace(/^->/gm, "> ");
}

/**
 * Converts PMWiki bold markup [+text+] to markdown **text**
 * [+[Link Text](url) additional text+] -> **[Link Text](url) additional text**
 */
export function convertBoldMarkup(text: string): string {
  return text.replace(/\[\+([\s\S]*?)\+\]/g, "**$1**");
}

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
/**
 * Converts inline styles to markdown
 * ''bold'' -> __bold__
 * '''italic''' -> _italic_
 */
export function convertInlineStyles(text: string): string {
  const bold = parseInlineBold(text);
  return parseInlineItalic(bold);
}

export function convertWikitextToMarkdown(
  wikitext: string,
  options?: ConversionOptions,
) {
  const directiveTables = convertDirectiveTables(wikitext);
  const stripped = stripWikiRules(directiveTables);
  const lineBreaks = convertLineBreaks(stripped);
  const inlineStyles = convertInlineStyles(lineBreaks);
  const rulers = convertHorizontalRules(inlineStyles);
  const lists = convertLists(rulers);
  const headigns = convertHeadings(lists);
  const images = convertImageLinks(headigns, options);
  const userTags = convertUserTags(images);
  const markers = cleanWikiMarkers(userTags);
  const wikiLinks = convertWikiLinks(markers);
  const finalInlineStyles = convertInlineStyles(wikiLinks);
  const boldMarkup = convertBoldMarkup(finalInlineStyles);
  const smallText = convertSmallText(boldMarkup);
  const blockquotes = convertBlockquotes(smallText);
  const tables = convertTables(blockquotes);
  return tables;
}
