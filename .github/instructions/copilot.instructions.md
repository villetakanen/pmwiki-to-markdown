<environment>
Use pnpm explicitly to run commands.

Testing the conversion logic should be done by using the scripts in package.json, if possible.

Manual testing utilities must be placed in the `test/manual` directory.
</environment>

<conversion-pipeline>
The conversion pipeline processes Wikitext to Markdown, handling various elements like images, links, and formatting. It includes functions to clean up wiki markers, convert user tags, and apply inline styles. The final output is a cleaned-up Markdown string ready for use.

When debugging the conversion pipeline, focus on the order of operations and ensure that each step correctly transforms the input. Pay attention to how inline styles are applied and how they interact with other formatting elements.
</conversion-pipeline>