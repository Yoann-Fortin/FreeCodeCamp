export interface HtmlRenderer {
	renderRaw(html: string): void;
	renderPreview(html: string): void;
}
