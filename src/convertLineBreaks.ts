/**
 * Converts PMWiki line breaks to markdown line breaks %0a -> \n
 *
 * PMWiki uses \\%0a for a forced line break, we need to convert this to a two space line break - '  \n'
 *
 */
export function convertLineBreaks(text: string): string {
  // First we need to convert forced line breaks \\%0a to a two space line break
  return text.replace(/\\\\%0a/g, "  \n").replace(/%0a/g, "\n");
}
