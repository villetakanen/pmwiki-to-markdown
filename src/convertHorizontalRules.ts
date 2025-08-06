/**
 * PmWiki uses --- or ---- to represent a horizontal rule. We need to convert this to --- in markdown.
 *
 * Also adding a newline before and after the horizontal rule, to prevent it from being a header
 * underline.
 *
 * Note: We need to be careful not to break markdown table separator rows (|---|---|---|)
 */
export function convertHorizontalRules(text: string): string {
  // First convert ---- to ---
  let result = text.replace(/----/g, "---");

  // Then handle standalone --- lines, being careful about existing newlines
  result = result.replace(
    /(\n?)^(---)$(\n?)/gm,
    (match, beforeNewline, rule, afterNewline) => {
      // Ensure we have newlines before and after, but don't duplicate them
      const newlineBefore = beforeNewline || "\n\n";
      const newlineAfter = afterNewline || "\n\n";

      // If we already have newlines, don't add duplicates
      const finalBefore = newlineBefore === "\n" ? "\n\n" : newlineBefore;
      const finalAfter = newlineAfter === "\n" ? "\n\n" : newlineAfter;

      return `${finalBefore}${rule}${finalAfter}`;
    },
  );

  return result;
}
