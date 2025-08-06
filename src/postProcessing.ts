import { addParagraphLineBreaks } from "./addParagraphLineBreaks";
import { trimLeadingWhitespace } from "./trimLeadingWhitespace";

/**
 * Applies post-processing steps to markdown that has already been converted
 * from PMWiki format. These steps clean up formatting issues and improve
 * the final markdown output.
 *
 * Post-processing steps are applied after the main wiki-to-markdown conversion
 * and work on mostly clean markdown content.
 *
 * @param markdown The markdown text to post-process
 * @returns The post-processed markdown
 */
export function applyPostProcessing(markdown: string): string {
  // Step 1: Trim leading whitespace that may cause rendering issues
  const trimmed = trimLeadingWhitespace(markdown);

  // Step 2: Add line breaks where consecutive text lines exist in paragraphs
  const withLineBreaks = addParagraphLineBreaks(trimmed);

  return withLineBreaks;
}
