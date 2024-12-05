import fs from "fs";
import { program } from "commander";
import { version } from "../package.json";
import { MarkdownPage } from "./MarkdownPage";

// ****************************************************************************
// * This is a program to convert PmWiki binary files to Markdown files.      *
// ****************************************************************************                                                                   *

program
  .version(version)
  .description("Convert pmwiki binary file to Markdown")
  .requiredOption("-i, --input <file>", "Input pmwiki file or folder")
  .option("-o, --output <file>", "Output folder, default is current folder")
  .parse(process.argv);

const options = program.opts();

// Function to convert pmwiki to Markdown
function convertPmWikiToMarkdown(
  inputFilePath: string,
  outputFilePath: string,
) {
  try {
    // lets check if input file is a file or a folder
    const stats = fs.statSync(inputFilePath);
    if (stats.isDirectory()) {
      console.log("Converting all files in the folder: ", inputFilePath);
      // its a folder
      const files = fs.readdirSync(inputFilePath);
      for (const file of files) {
        const input = `${inputFilePath}/${file}`;
        convertPmWikiFileToMarkdown(input, outputFilePath);
      }
    } else {
      console.log("Converting the file: ", inputFilePath);
      // its a file
      convertPmWikiFileToMarkdown(inputFilePath, outputFilePath);
    }
  } catch (err) {
    console.error("Error reading the file:", err);
  }
}

function writeMarkdownFile(mdd: MarkdownPage, outputFilePath: string) {
  try {
    // Add the site to the output folder
    const siteFolder = `${outputFilePath}/${mdd.site}`;

    // Check if the site folder exists, if not create it
    if (!fs.existsSync(siteFolder)) {
      fs.mkdirSync(siteFolder);
    }

    // Write the markdown file
    fs.writeFileSync(`${siteFolder}/${mdd.name}.md`, mdd.toMarkdown());
  } catch (err) {
    console.error("Error writing the file:", err);
  }
}

function convertPmWikiFileToMarkdown(
  inputFilePath: string,
  outputFilePath: string,
) {
  try {
    const data = fs.readFileSync(inputFilePath, "utf8");
    console.log("Converting the file: ", inputFilePath);
    const md = MarkdownPage.fromPmWikiFile(data);
    console.log(
      "Writing the file: ",
      `${outputFilePath}/${md.site}/${md.name}.md`,
    );
    writeMarkdownFile(md, outputFilePath);
  } catch (err) {
    console.error("Error reading the file:", err);
  }
}

convertPmWikiToMarkdown(options.input, options.output);
