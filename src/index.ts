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
  .option("-u, --uid <uid>", "User id to use for the conversion")
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
      // its a folder
      const files = fs.readdirSync(inputFilePath);
      for (const file of files) {
        const input = `${inputFilePath}/${file}`;
        convertPmWikiFileToMarkdown(input, outputFilePath, options.uid);
      }
    } else {
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
    const outputFile = `${siteFolder}/${mdd.name}.md`;
    fs.writeFileSync(outputFile, mdd.toMarkdown());
    console.log("Converted page:", outputFile);
  } catch (err) {
    console.error("Error writing the file:", err);
  }
}

function convertPmWikiFileToMarkdown(
  inputFilePath: string,
  outputFilePath: string,
  uid?: string,
) {
  try {
    const data = fs.readFileSync(inputFilePath, "utf8");
    const md = MarkdownPage.fromPmWikiFile(data);
    if (uid) {
      md.author = uid;
    }
    writeMarkdownFile(md, outputFilePath);
  } catch (err) {
    console.error("Error reading the file:", err);
  }
}

convertPmWikiToMarkdown(options.input, options.output);
