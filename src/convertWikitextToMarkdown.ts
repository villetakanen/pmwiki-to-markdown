import { convertImageLinks } from "./convertImageLinks";

/**
 * In Wikitext, a style starts with >>[style]3c%3c, we need to strip this out.
 */
function stripWikiStyles(wikitext: string) {
  return wikitext.replace(/>>.*?3c%3c/g, "");
}

/**
 * An inline style starts with %25[term]%25 and ends with %25%25. We need
 * flatten these to ** for bold.
 */
function flattenInLineStyles(wikitext: string) {
  return wikitext.replace(/%25(.*?)%25/g, "**").replace(/%25%25/g, "**");
}

/**
 * Wiki directives are surrounded by (: and :). We need to strip these out.
 */

function stripWikiDirectives(wikitext: string) {
  return wikitext.replace(/\(:.*?:\)/g, "");
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
  return text
    .replace(/^\*{1,4}\s*/gm, (match) => {
      return `${"  ".repeat(match.trim().length - 1)}* `;
    })
    .replace(/^#{1,4}\s*/gm, (match) => {
      return `${"  ".repeat(match.trim().length - 1)}1. `;
    });
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
    return `[${linkText}](${pageName})`;
  });
}

/**
 * PmWiki uses --- or ---- to represent a horizontal rule. We need to convert this to --- in markdown.
 *
 * Also adding a newline before and after the horizontal rule, to prevent it from being a header
 * underline.
 */
export function convertHorizontalRules(text: string): string {
  return text.replace(/----/g, "---").replace(/---/g, "\n\n---\n\n");
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
 * Converts inline styles to markdown
 * ''bold'' -> __bold__
 * '''italic''' -> _italic_
 */
export function convertInlineStyles(text: string): string {
  const bold = parseInlineBold(text);
  return parseInlineItalic(bold);
}

export function convertWikitextToMarkdown(wikitext: string) {
  const stripped = stripWikiDirectives(wikitext);
  const lineBreaks = convertLineBreaks(stripped);
  const inlineStyles = convertInlineStyles(lineBreaks);
  const rulers = convertHorizontalRules(inlineStyles);
  const headigns = convertHeadings(rulers);
  const images = convertImageLinks(headigns);
  return convertInlineStyles(
      convertLists(
        convertWikiLinks(
          flattenInLineStyles(stripWikiStyles(images)),
        ),
      ),
  );
}
