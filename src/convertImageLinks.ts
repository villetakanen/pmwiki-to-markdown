const extensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "bmp",
  "webp",
  "ico",
  "tiff",
  "tif",
  "JPG",
  "JPEG",
  "PNG",
  "GIF",
  "SVG",
  "BMP",
  "WEBP",
  "ICO",
  "TIFF",
  "TIF",
];

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
  const extensionsPattern = extensions.join("|");
  const regex = new RegExp(
    `\\bhttp:\\/\\/\\S+\\.(${extensionsPattern})\\b`,
    "gi",
  );

  return wikitext.replace(regex, (match) => {
    return `![a converted image link](${match})`;
  });
}
