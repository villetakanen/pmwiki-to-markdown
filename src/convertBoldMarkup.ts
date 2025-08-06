/**
 * Converts PMWiki bold markup [+text+] to markdown **text**
 * [+[Link Text](url) additional text+] -> **[Link Text](url) additional text**
 */
export function convertBoldMarkup(text: string): string {
  return text.replace(/\[\+([\s\S]*?)\+\]/g, "**$1**");
}
