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

interface ConversionOptions {
  webp?: boolean;
}

/**
 * Convert image file extensions to webp if the webp option is enabled
 * @param imageUrl - The image URL to potentially convert
 * @param options - Conversion options
 * @returns The image URL with potentially converted extension
 */
function convertToWebp(imageUrl: string, options?: ConversionOptions): string {
  if (!options?.webp) {
    return imageUrl;
  }

  // Convert jpg, jpeg, png, gif to webp (case insensitive)
  return imageUrl.replace(/\.(jpe?g|png|gif)$/gi, ".webp");
}

/**
 * Some example wikitext:
 * w:  http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.JPG
 * md: !(http://images.wikia.com/forgottenrealms/images/e/ed/Pseudodragon.JPG)
 *
 *
 * w:  Attach:image.png
 * md: Attach:image.png
 * @param wikitext
 * @param options - Conversion options including webp flag
 * @returns
 */
export function convertImageLinks(
  wikitext: string,
  options?: ConversionOptions,
) {
  const extensionsPattern = extensions.join("|");
  const regex = new RegExp(
    `\\bhttp:\\/\\/\\S+\\.(${extensionsPattern})\\b`,
    "gi",
  );

  // Convert HTTP image links
  let result = wikitext.replace(regex, (match) => {
    const convertedUrl = convertToWebp(match, options);
    return `![a converted image link](${convertedUrl})`;
  });

  // Convert Attach: image links
  if (options?.webp) {
    result = result.replace(
      /Attach:([^.\s]+)\.(jpe?g|png|gif)/gi,
      "Attach:$1.webp",
    );
  }

  return result;
}
