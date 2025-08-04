/**
 * Cleans PmWiki section markers from text content
 * Removes patterns like >>aika%3c%3c and >>%3c%3c
 */
export function cleanWikiMarkers(content: string): string {
  // Handle the specific pattern where there's content before the opening marker
  // Transform "content\n    \n>>marker\n" into "content\n\n    \n"
  let cleaned = content.replace(/(\n\s+)\n>>.*?%3c%3c\n/g, "\n$1\n");

  // Handle opening markers that directly follow content (without space line before)
  // Just remove the marker line
  cleaned = cleaned.replace(/\n>>.*?%3c%3c\n/g, "\n");

  // Handle closing markers - just remove them
  cleaned = cleaned.replace(/\n>>%3c%3c\n/g, "\n");

  // Handle closing markers at the end without trailing newline
  cleaned = cleaned.replace(/\n>>%3c%3c$/g, "");

  return cleaned;
}
