/**
 * Converts PMWiki blockquotes to markdown blockquotes
 * ->text -> > text
 */
export function convertBlockquotes(text: string): string {
  return text.replace(/^->/gm, "> ");
}
