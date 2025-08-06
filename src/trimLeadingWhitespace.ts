/**
 * Trims leading whitespace from each line while preserving intentional indentation
 * for lists and code blocks. This fixes issues where PmWiki content has unintended
 * leading spaces before markup.
 */
export function trimLeadingWhitespace(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      // Don't trim lines that are part of lists (markdown list markers)
      if (/^\s*[*+-]\s/.test(line) || /^\s*\d+\.\s/.test(line)) {
        return line;
      }
      // Don't trim lines that are part of code blocks or tables
      if (/^\s*\|/.test(line) || /^\s*```/.test(line) || /^\s{4}/.test(line)) {
        return line;
      }
      // Trim leading whitespace from other lines
      return line.trimStart();
    })
    .join("\n");
}
