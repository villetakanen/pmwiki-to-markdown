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
      // Only trim spaces, not newlines to preserve line structure
      const beforeTrimmed = before.replace(/[ \t]+$/, "");
      const afterTrimmed = after.replace(/^[ \t]+/, "").replace(/[ \t]+$/, "");
      // Only add a space before __ if there's preceding text
      const spaceBefore = beforeTrimmed ? " " : "";
      return `${beforeTrimmed}${spaceBefore}__${afterTrimmed}`;
    }
    // the remaining text does not contain any bold tokens, so we can just return the text
    return remainingText;
  }
  if (boldTokenIndex > -1) {
    // We are inside a bold block, so we want to return the text starting with '__ '
    const before = remainingText.slice(0, boldTokenIndex);
    const after = parseInlineBold(remainingText.slice(boldTokenIndex + 3));
    // Only trim spaces, not newlines to preserve line structure
    const beforeTrimmed = before.replace(/[ \t]+$/, "");
    const afterTrimmed = after?.replace(/^[ \t]+/, "") || "";
    return `${beforeTrimmed}__ ${afterTrimmed}`;
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
      // Only trim spaces, not newlines to preserve line structure
      const beforeTrimmed = before.replace(/[ \t]+$/, "");
      const afterTrimmed = after.replace(/^[ \t]+/, "").replace(/[ \t]+$/, "");
      // Only add a space before _ if there's preceding text
      const spaceBefore = beforeTrimmed ? " " : "";
      return `${beforeTrimmed}${spaceBefore}_${afterTrimmed}`;
    }
    // the remaining text does not contain any italic tokens, so we can just return the text
    return remainingText;
  }
  if (italicTokenIndex > -1) {
    // We are inside a italic block, so we want to return the text starting with '_ '
    const before = remainingText.slice(0, italicTokenIndex);
    const after = parseInlineItalic(remainingText.slice(italicTokenIndex + 2));
    // Only trim spaces, not newlines to preserve line structure
    const beforeTrimmed = before.replace(/[ \t]+$/, "");
    const afterTrimmed = after?.replace(/^[ \t]+/, "") || "";
    return `${beforeTrimmed}_ ${afterTrimmed}`;
  }
  return remainingText;
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
