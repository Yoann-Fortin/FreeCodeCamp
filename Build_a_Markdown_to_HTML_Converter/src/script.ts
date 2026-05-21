import { BlockquoteRule } from "./rules/blockquote.ts";
import { BoldRule } from "./rules/bold.ts";
import { HeadingRule } from "./rules/heading.ts";
import { ImageRule } from "./rules/image.ts";
import { ItalicRule } from "./rules/italic.ts";
import { LinkRule } from "./rules/link.ts";
import type { ConversionRule } from "./rules/rule.ts";

const rules: ConversionRule[] = [
	new HeadingRule(),
	new ImageRule(),
	new LinkRule(),
	new BlockquoteRule(),
	new BoldRule(),
	new ItalicRule(),
];

function convertMarkdown(): string {
	const input = document.querySelector<HTMLTextAreaElement>("#markdown-input");
	if (!input) return "";
	return input.value
		.split("\n")
		.map((line: string): string =>
			rules.reduce((result, rule) => rule.apply(result), line),
		)
		.join("");
}

window.convertMarkdown = convertMarkdown;

const markdownInput = document.querySelector<HTMLTextAreaElement>("#markdown-input");
if (markdownInput) {
	markdownInput.addEventListener("input", (): void => {
		const html = convertMarkdown();
		const htmlOutput = document.querySelector("#html-output");
		if (htmlOutput) htmlOutput.textContent = html;
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		const preview = document.querySelector("#preview");
		if (preview) preview.replaceChildren(...doc.body.childNodes);
	});
}
