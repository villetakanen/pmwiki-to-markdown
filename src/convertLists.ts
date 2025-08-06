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
