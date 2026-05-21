import type { HtmlRenderer } from "../ports/html-renderer.ts";

export class DomHtmlRenderer implements HtmlRenderer {
	private readonly rawOutput: Element;
	private readonly preview: Element;

	constructor(rawSelector: string, previewSelector: string) {
		const raw = document.querySelector(rawSelector);
		const prev = document.querySelector(previewSelector);
		if (!raw) throw new Error(`Element not found: ${rawSelector}`);
		if (!prev) throw new Error(`Element not found: ${previewSelector}`);
		this.rawOutput = raw;
		this.preview = prev;
	}

	renderRaw(html: string): void {
		this.rawOutput.textContent = html;
	}

	renderPreview(html: string): void {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		this.preview.replaceChildren(...doc.body.childNodes);
	}
}
