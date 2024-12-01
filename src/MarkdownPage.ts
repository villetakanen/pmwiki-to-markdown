export class MarkdownPage {
	title = "";
	site = "";
	updated = new Date().toISOString();
	body = "";

	toMarkdown() {
		return `---
title: ${this.title}
site: 
updated:
---
${this.body}
`;
	}
}
