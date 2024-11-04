import fs from "fs";
import { program } from "commander";
import { convertWikitextToMarkdown } from "./convertWikitextToMarkdown";

// ****************************************************************************
// * This is a program to convert PmWiki binary files to Markdown files.      *
// ****************************************************************************                                                                   *

program
	.version("1.0.0")
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
			// its a folder
			const files = fs.readdirSync(inputFilePath);
			for (const file of files) {
				const input = `${inputFilePath}/${file}`;
				convertPmWikiFileToMarkdown(input, outputFilePath);
			}
		} else {
			// its a file
			convertPmWikiFileToMarkdown(inputFilePath, outputFilePath);
		}
	} catch (err) {
		console.error("Error reading the file:", err);
	}
}

type MarkdownJSON = {
	headmatter: {
		title: string;
		site: string;
		updated: string;
	};
	content: string;
};
function writeMarkdownFile(mdd: MarkdownJSON, outputFilePath: string) {
	try {
		const data = `---
title: ${mdd.headmatter.title}
site: ${mdd.headmatter.site}
updated: ${mdd.headmatter.updated}
---
${mdd.content}`;

		// Add the site to the output folder
		const site = mdd.headmatter.site;
		const siteFolder = `${outputFilePath}/${site}`;

		// Check if the site folder exists, if not create it
		if (!fs.existsSync(siteFolder)) {
			fs.mkdirSync(siteFolder);
		}

		// Write the markdown file
		fs.writeFileSync(`${siteFolder}/${mdd.headmatter.title}.md`, data);
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
		const mdd: MarkdownJSON = {
			headmatter: {
				title: "",
				site: "",
				updated: "",
			},
			content: "",
		};
		const lines = data.split("\n");
		for (const line of lines) {
			if (line.startsWith("time=")) {
				mdd.headmatter.updated = line.split("=")[1];
			} else if (line.startsWith("name=")) {
				const name = line.split("=")[1];
				const parts = name.split(".");
				mdd.headmatter.title = parts[1];
				mdd.headmatter.site = parts[0];
			} else if (line.startsWith("text=")) {
				const wikitext = line.split("=")[1];
				mdd.content = convertWikitextToMarkdown(wikitext);
			}
		}
		writeMarkdownFile(mdd, outputFilePath);
	} catch (err) {
		console.error("Error reading the file:", err);
	}
}

convertPmWikiToMarkdown(options.input, options.output);
