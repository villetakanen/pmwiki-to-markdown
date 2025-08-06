import { cleanWikiMarkers } from "./cleanWikiMarkers";
import { convertBlockquotes } from "./convertBlockquotes";
import { convertBoldMarkup } from "./convertBoldMarkup";
import { convertDirectiveTables } from "./convertDirectiveTables";
import { convertHorizontalRules } from "./convertHorizontalRules";
import { convertImageLinks } from "./convertImageLinks";
import { convertInlineStyles } from "./convertInlineStyles";
import { convertLineBreaks } from "./convertLineBreaks";
import { convertLists } from "./convertLists";
import { convertSmallText } from "./convertSmallText";
import { convertTables } from "./convertTables";
import { convertUserTags } from "./convertUserTags";
import { applyPostProcessing } from "./postProcessing";
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
      return `${beforeTrimmed} __${afterTrimmed}`;
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
      return `${beforeTrimmed} _${afterTrimmed}`;
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

function preProcessWikitext(wikitext: string): string {
  // Convert known directives
  const directiveTables = convertDirectiveTables(wikitext);
  // Strip rest of the wiki directives and styles
  return stripWikiRules(directiveTables);
}

export function convertWikitextToMarkdown(
  wikitext: string,
  options?: ConversionOptions,
) {
  const prepared = preProcessWikitext(wikitext);
  const lineBreaks = convertLineBreaks(prepared);
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

  // Apply post-processing steps (trimming, line breaks, etc.)
  const postProcessed = applyPostProcessing(tables);

  return postProcessed;
}
