/**
 * Adds line breaks where two or more lines of text exist in the same markdown paragraph.
 * PMWiki often had content that should be formatted with line breaks but appears as
 * separate lines in the same paragraph in markdown.
 * 
 * This function identifies consecutive non-empty lines that are not:
 * - Headers (starting with #)
 * - Lists (starting with * or 1.)
 * - Tables (containing |)
 * - Horizontal rules (---)
 * - Code blocks
 * - Block quotes (starting with >)
 * 
 * And adds explicit <br> tags at the end of each line (except the last) to create proper
 * line breaks for better legibility.
 */
export function addParagraphLineBreaks(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];
    
    // Add the current line to result
    let lineToAdd = currentLine;
    
    // Check if we should add a line break
    if (shouldAddLineBreak(currentLine, nextLine)) {
      // Replace trailing spaces or add <br> tag for explicit line break
      if (currentLine.endsWith('  ')) {
        // Replace trailing spaces with <br> tag
        lineToAdd = currentLine.replace(/\s{2,}$/, '<br>');
      } else if (!currentLine.endsWith('<br>') && !currentLine.endsWith('\\')) {
        // Add <br> tag if no line break marker exists
        lineToAdd = `${currentLine}<br>`;
      }
    }
    
    result.push(lineToAdd);
  }
  
  return result.join('\n');
}

/**
 * Determines if a line break should be added between current and next line
 */
function shouldAddLineBreak(currentLine: string, nextLine: string): boolean {
  // Don't add line break if there's no next line
  if (nextLine === undefined) {
    return false;
  }

  // Don't add line break if current line is empty
  if (currentLine.trim() === "") {
    return false;
  }

  // Don't add line break if next line is empty (paragraph break)
  if (nextLine.trim() === "") {
    return false;
  }

  // Don't add line break if current line already ends with line break markers
  if (currentLine.endsWith('\\') || currentLine.endsWith('<br>')) {
    return false;
  }

  // Don't add line break if either line is a special markdown element
  if (isSpecialMarkdownLine(currentLine) || isSpecialMarkdownLine(nextLine)) {
    return false;
  }

  // Don't add line break if current line ends with certain punctuation that suggests a paragraph end
  if (/[.!?:]$/.test(currentLine.trim()) && !isListItemOrSimilar(currentLine)) {
    return false;
  }

  // Add line break for consecutive text lines
  return true;
}

/**
 * Checks if a line is a special markdown element that shouldn't have line breaks added
 */
function isSpecialMarkdownLine(line: string): boolean {
  const trimmed = line.trim();

  if (trimmed === "") return true;

  // Headers
  if (trimmed.startsWith("#")) return true;

  // Lists
  if (/^\s*[*+-]\s/.test(line) || /^\s*\d+\.\s/.test(line)) return true;

  // Tables
  if (trimmed.includes("|")) return true;

  // Horizontal rules
  if (/^-{3,}$/.test(trimmed)) return true;

  // Code blocks
  if (trimmed.startsWith("```") || trimmed.startsWith("    ")) return true;

  // Block quotes
  if (trimmed.startsWith(">")) return true;

  // HTML tags
  if (trimmed.startsWith("<") && trimmed.endsWith(">")) return true;

  // Markdown front matter or similar
  if (trimmed.startsWith("---")) return true;

  return false;
}

/**
 * Checks if a line looks like a list item or similar structured content
 */
function isListItemOrSimilar(line: string): boolean {
  const trimmed = line.trim();

  // List items
  if (/^\s*[*+-]\s/.test(line) || /^\s*\d+\.\s/.test(line)) return true;

  // Definition list style (bold term followed by colon)
  if (/^__.*?__\s*:/.test(trimmed) || /^\*\*.*?\*\*\s*:/.test(trimmed))
    return true;

  return false;
}
