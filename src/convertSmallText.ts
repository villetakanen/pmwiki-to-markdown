/**
 * Converts PMWiki small text markup [-text-] to HTML span tags
 * [-text-] -> <span class="text-small">text</span>
 */
export function convertSmallText(text: string): string {
  return text.replace(
    /\[-([\s\S]*?)-\]/g,
    '<span class="text-small">$1</span>',
  );
}
