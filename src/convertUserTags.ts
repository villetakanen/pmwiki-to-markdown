/**
 * PmWiki uses ~uid for user tags, we need to convert these to more standard @uid tags.
 *
 * Additionally, some user tags are used in links, we need to convert these as well:
 * [[~V]] -> @V
 */
export function convertUserTags(text: string): string {
  //return text.replace(/~(.*?)(\s|$)/g, "@$1$2");
  return text
    .replace(/\[\[~(.*?)\]\]/g, (match, p1) => {
      return `@${p1}`;
    })
    .replace(/~(.*?)(\s|$)/g, "@$1$2");
}
