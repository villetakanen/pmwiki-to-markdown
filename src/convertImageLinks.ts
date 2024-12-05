/**
 * Some example wikitext:
 * w:  http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.JPG
 * md: !(http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.JPG)
 *
 *
 * w:  Attach:image.png
 * md: Attach:image.png
 * @param wikitext
 * @returns
 */
export function convertImageLinks(wikitext: string) {
  return wikitext.replace(/\bhttp:\/\/\S+\b/g, (match) => {
    return `![a converted image link](${match})`;
  });
}
