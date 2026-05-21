import type { MarkdownReader } from "../ports/markdown-reader.ts";

export class DomMarkdownReader implements MarkdownReader {
	private readonly input: HTMLTextAreaElement;

	constructor(selector: string) {
		const element = document.querySelector<HTMLTextAreaElement>(selector);
		if (!element) throw new Error(`Element not found: ${selector}`);
		this.input = element;
	}

	read(): string {
		return this.input.value;
	}
}
