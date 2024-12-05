/**
 * In Wikitext, line breaks are represented by a %0a character. This function replaces all
 * instances of %0a with two newlines in order to convert the text to markdown.
 */
function addLineBreaks(text: string) {
	return text.replace(/%0a/g, "\n");
}

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
 * @param text
 */
function convertLists(text: string): string {
	// First lets convert unordered lists, this is straightforward, just add a space after each *
	// then lets convert ordered lists, we do a naive
	// conversion by replacing all # with 1. and then all ## with '  1.' etc.
	return text.replace(/\*{1,4}/g, (match) => {
		return `${"*".repeat(match.length)} `;
	})
	.replace(/#{1,4}/g, (match) => {
		return `${" ".repeat(match.length - 1)}1. `;
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
		return `[${linkText}](${pageName})`;
	});
}

/** 
 * PmWiki uses ---- to represent a horizontal rule. We need to convert this to --- in markdown.
 * 
 * Also adding a newline before and after the horizontal rule, to prevent it from being a header
 * underline.
 */
function convertHorizontalRules(text: string): string {
	return text.replace(/----/g, "\n---\n");
}

/**
 * Converts inline styles to markdown
 * ''bold'' -> **bold**
 * '''italic''' -> *italic*
 */
function convertInlineStyles(text: string): string {
	return text.replace(/'''(.*?)'''/g, "**$1**").replace(/''(.*?)''/g, "*$1*");
}

export function convertWikitextToMarkdown(wikitext: string) {
	return addLineBreaks(
		convertHeadings(
			convertInlineStyles(
				convertLists(
					convertHorizontalRules(
					convertWikiLinks(
						stripWikiDirectives(flattenInLineStyles(stripWikiStyles(wikitext))),
					)
				)
				),
			),
		),
	);
}
