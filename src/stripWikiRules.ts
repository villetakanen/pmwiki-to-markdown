/**
 * An inline style starts with %25[term]%25 and ends with %25%25. We need
 * flatten these to remove the inline styles.
 *
 * e.g. "%25rfloat width=234px%25ramalama and some more%25%25 text" -> "ramalama and some more text"
 */
function flattenInLineStyles(wikitext: string) {
  const withTerminator = wikitext
    .replace(/%25(.*?)%25(.*?)%25%25/g, "$2")
    .replace(/%25(.*?)%25/g, "");
  const terminatesAtLineEnd = withTerminator
    .replace(/%25(.*?)%25(.*?)$/g, "$2")
    .replace(/%25(.*?)%25/g, "");
  return terminatesAtLineEnd;
}

/**
 * Wiki directives are surrounded by (: and :). We need to strip these out.
 */

function stripWikiDirectives(wikitext: string) {
  return wikitext.replace(/\(:.*?:\)/g, "");
}

export function stripWikiRules(wikitext: string): string {
  const inline = flattenInLineStyles(wikitext);
  return stripWikiDirectives(inline);
}
