import { ConverterBuilder } from "./converter-builder.ts";
import { BlockquoteRule } from "./rules/blockquote.ts";
import { AsteriskBoldRule, UnderscoreBoldRule } from "./rules/bold.ts";
import { CompositeRule } from "./rules/composite.ts";
import { HeadingRule } from "./rules/heading.ts";
import { ImageRule } from "./rules/image.ts";
import { AsteriskItalicRule, UnderscoreItalicRule } from "./rules/italic.ts";
import { LinkRule } from "./rules/link.ts";

const convert = new ConverterBuilder()
	.withRule(new HeadingRule())
	.withRule(new ImageRule())
	.withRule(new LinkRule())
	.withRule(new BlockquoteRule())
	.withRule(new CompositeRule(new AsteriskBoldRule(), new UnderscoreBoldRule()))
	.withRule(new CompositeRule(new AsteriskItalicRule(), new UnderscoreItalicRule()))
	.build();

function convertMarkdown(): string {
	const input = document.querySelector<HTMLTextAreaElement>("#markdown-input");
	if (!input) return "";
	return convert(input.value);
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
