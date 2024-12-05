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
 * ''bold'' -> __bold__
 * '''italic''' -> _italic_
 */
export function convertInlineStyles(text: string): string {
	// First we need to convert bold and italic text
	const phase1 = text
		.replace(/'''\s*(.*?)\s*'''/g, "__$1__")
		.replace(/''\s*(.*?)\s*''/g, "_$1_");
	// Lasttly, PmWiki lets you omit the whitespace _after_ the style and the text after the style
	// so we need to add this back in. '_italic_, __bold__and _italic_' -> _italic_, __bold__ and _italic_'
	return phase1.replace(/(__|\*)\s*(.*?)\s*(__|\*)([^\s])/g, "$1$2$3 $4");
}

export function convertWikitextToMarkdown(wikitext: string) {
	const inlineStyles = convertInlineStyles(wikitext);
	const lineBreaks = convertLineBreaks(inlineStyles);
	return convertHeadings(
		convertInlineStyles(
			convertLists(
				convertHorizontalRules(
					convertWikiLinks(
						stripWikiDirectives(
							flattenInLineStyles(stripWikiStyles(lineBreaks)),
						),
					),
				),
			),
		),
	);
}
