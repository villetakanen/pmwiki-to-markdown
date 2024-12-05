import { convertWikitextToMarkdown } from "./convertWikitextToMarkdown";

export class MarkdownPage {
  name = "";
  site = "";
  updated = new Date().toISOString();
  created = new Date().toISOString();
  author = "";
  body = "";

  static fromPmWikiFile = fromPmWikiFile;

  toMarkdown() {
    return `---
name: ${this.name}
site: ${this.site}
created: ${this.created}
author: ${this.author}
updated: ${this.updated}
---
${this.body}
`;
  }
}

type FrontMatter = {
  name?: string;
  site?: string;
  time?: string;
  created?: string;
  updated?: string;
  author?: string;
};

/**
 * Front matter is in the following fields in the pmwiki file:
 * - name, name=3rdOrleans.Beta -> site: 3rdOrleans, title: Beta
 * - time, time=1257271361 -> updated: 2009-11-03T14:56:01.000Z
 * - author, author=3rdOrleans -> author: 3rdOrleans
 * - ctime, ctime=1257271361 -> created: 2009-11-03T14:56:01.000Z
 *
 * @param file
 */
function getFrontMatter(file: string): FrontMatter {
  const frontMatter: FrontMatter = {};

  const name = file.match(/name=(.*)/);
  if (name) {
    const [site, title] = name[1].split(".");
    frontMatter.name = title;
    frontMatter.site = site;
  }

  const time = file.match(/time=(.*)/);
  if (time) {
    frontMatter.updated = new Date(
      Number.parseInt(time[1], 10) * 1000,
    ).toISOString();
  }

  const author = file.match(/author=(.*)/);
  if (author) {
    frontMatter.author = author[1];
  }

  const ctime = file.match(/ctime=(.*)/);
  if (ctime) {
    frontMatter.created = new Date(
      Number.parseInt(ctime[1], 10) * 1000,
    ).toISOString();
  }

  return frontMatter;
}

/**
 *  Body is in the field "text" in the pmwiki file, we need to convert it to markdown,
 *  the field is in a single line, and line ends with a newline character
 *
 * @param file
 */
function getBody(file: string): string {
  const body = file.match(/text=(.*)/);
  if (body) {
    return convertWikitextToMarkdown(body[1]);
  }
  return "";
}

function fromPmWikiFile(file: string): MarkdownPage {
  const frontMatter = getFrontMatter(file);
  const body = getBody(file);

  const page = new MarkdownPage();

  // Set front matter
  page.name = frontMatter.name || "";
  page.site = frontMatter.site || "";
  page.updated = frontMatter.updated || "";
  page.created = frontMatter.created || "";
  page.author = frontMatter.author || "";

  page.body = body;

  console.log("returning page ", page.name, " of site ", page.site);

  return page;
}
