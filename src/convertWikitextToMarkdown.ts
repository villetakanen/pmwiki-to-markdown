import { cleanWikiMarkers } from "./cleanWikiMarkers";
import { convertImageLinks } from "./convertImageLinks";
import { stripWikiRules } from "./stripWikiRules";

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
    return `[${linkText}](${pageName.toLowerCase()})`;
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
 * Converts PMWiki blockquotes to markdown blockquotes
 * ->text -> > text
 */
export function convertBlockquotes(text: string): string {
  return text.replace(/^->/gm, '> ');
}

/**
 * Converts PMWiki bold markup [+text+] to markdown **text**
 * [+[Link Text](url) additional text+] -> **[Link Text](url) additional text**
 */
export function convertBoldMarkup(text: string): string {
  return text.replace(/\[\+([\s\S]*?)\+\]/g, '**$1**');
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
  const stripped = stripWikiRules(wikitext);
  const lineBreaks = convertLineBreaks(stripped);
  const inlineStyles = convertInlineStyles(lineBreaks);
  const rulers = convertHorizontalRules(inlineStyles);
  const lists = convertLists(rulers);
  const headigns = convertHeadings(lists);
  const images = convertImageLinks(headigns);
  const userTags = convertUserTags(images);
  const markers = cleanWikiMarkers(userTags);
  const wikiLinks = convertWikiLinks(markers);
  const finalInlineStyles = convertInlineStyles(wikiLinks);
  const boldMarkup = convertBoldMarkup(finalInlineStyles);
  const blockquotes = convertBlockquotes(boldMarkup);
  return blockquotes;
}
