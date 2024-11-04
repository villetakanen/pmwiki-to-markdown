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
				convertWikiLinks(
					stripWikiDirectives(flattenInLineStyles(stripWikiStyles(wikitext))),
				),
			),
		),
	);
}
