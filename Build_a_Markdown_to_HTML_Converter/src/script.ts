import { DomHtmlRenderer } from "./adapters/dom-html-renderer.ts";
import { DomMarkdownReader } from "./adapters/dom-markdown-reader.ts";
import { ConverterBuilder } from "./domain/converter-builder.ts";
import { BlockquoteRule } from "./domain/rules/blockquote.ts";
import { AsteriskBoldRule, UnderscoreBoldRule } from "./domain/rules/bold.ts";
import { CompositeRule } from "./domain/rules/composite.ts";
import { HeadingRule } from "./domain/rules/heading.ts";
import { ImageRule } from "./domain/rules/image.ts";
import { AsteriskItalicRule, UnderscoreItalicRule } from "./domain/rules/italic.ts";
import { LinkRule } from "./domain/rules/link.ts";

const reader = new DomMarkdownReader("#markdown-input");
const renderer = new DomHtmlRenderer("#html-output", "#preview");

const convert = new ConverterBuilder()
	.withRule(new HeadingRule())
	.withRule(new ImageRule())
	.withRule(new LinkRule())
	.withRule(new BlockquoteRule())
	.withRule(new CompositeRule(new AsteriskBoldRule(), new UnderscoreBoldRule()))
	.withRule(new CompositeRule(new AsteriskItalicRule(), new UnderscoreItalicRule()))
	.build();

function convertMarkdown(): string {
	return convert(reader.read());
}

window.convertMarkdown = convertMarkdown;

const markdownInput = document.querySelector("#markdown-input");
if (markdownInput) {
	markdownInput.addEventListener("input", (): void => {
		const html = convertMarkdown();
		renderer.renderRaw(html);
		renderer.renderPreview(html);
	});
}
