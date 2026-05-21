import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlFile = resolve(__dirname, "..", "..", "index.html");
const scriptFile = resolve(__dirname, "..", "..", "script.js");

interface ConverterWindow {
	convertMarkdown: () => string;
	document: Document;
	Event: typeof Event;
}

let window: ConverterWindow;

function loadPage(): ConverterWindow {
	const html = readFileSync(htmlFile, "utf-8");
	const dom = new JSDOM(html, { runScripts: "dangerously" });
	const scriptContent = readFileSync(scriptFile, "utf-8");
	dom.window.eval(scriptContent);
	return dom.window as unknown as ConverterWindow;
}

function setInput(value: string): void {
	(
		window.document.querySelector("#markdown-input") as HTMLTextAreaElement
	).value = value;
}

function triggerInput(value: string): void {
	const input = window.document.querySelector(
		"#markdown-input",
	) as HTMLTextAreaElement;
	input.value = value;
	input.dispatchEvent(new window.Event("input"));
}

function getHtmlOutput(): string {
	return window.document.querySelector("#html-output")!.textContent!;
}

interface PreviewCheck {
	selector: string;
	text?: string;
	attributes?: Record<string, string>;
}

function assertConversion(
	markdown: string,
	expectedHtml: string,
	preview?: PreviewCheck,
): void {
	it(`should convert '${markdown}' to '${expectedHtml}'`, () => {
		setInput(markdown);
		expect(window.convertMarkdown()).toBe(expectedHtml);
	});

	it(`should display '${expectedHtml}' inside #html-output for '${markdown}'`, () => {
		triggerInput(markdown);
		expect(getHtmlOutput()).toBe(expectedHtml);
	});

	if (preview) {
		const { selector, text, attributes } = preview;
		it(`should render '${markdown}' as ${selector} inside #preview`, () => {
			triggerInput(markdown);
			const element = window.document.querySelector(`#preview ${selector}`);
			expect(element).not.toBeNull();
		});

		if (text) {
			it(`should render '${markdown}' with text '${text}' inside #preview`, () => {
				triggerInput(markdown);
				const element = window.document.querySelector(`#preview ${selector}`);
				expect(element!.textContent).toBe(text);
			});
		}

		if (attributes) {
			it(`should render '${markdown}' with correct attributes inside #preview`, () => {
				triggerInput(markdown);
				const element = window.document.querySelector(`#preview ${selector}`);
				for (const [attr, value] of Object.entries(attributes)) {
					expect(element!.getAttribute(attr)).toBe(value);
				}
			});
		}
	}
}

function assertNoConversion(markdown: string): void {
	it(`should not convert '${markdown}'`, () => {
		setInput(markdown);
		expect(window.convertMarkdown()).toBe(markdown);
	});
}

function assertMultiline(markdown: string, expectedHtml: string): void {
	it(`should convert multiline '${markdown}'`, () => {
		setInput(markdown);
		expect(window.convertMarkdown()).toBe(expectedHtml);
	});
}

describe("convertMarkdown", () => {
	beforeEach(() => {
		window = loadPage();
	});

	it("should be a function", () => {
		expect(typeof window.convertMarkdown).toBe("function");
	});

	describe("headings", () => {
		assertConversion("# title 1", "<h1>title 1</h1>", {
			selector: "h1",
			text: "title 1",
		});
		assertConversion("## title 2", "<h2>title 2</h2>", {
			selector: "h2",
			text: "title 2",
		});
		assertConversion("### title 3", "<h3>title 3</h3>", {
			selector: "h3",
			text: "title 3",
		});

		assertNoConversion("some text # title 1");
		assertNoConversion("some text ## title 2");
		assertNoConversion("some text ### title 3");

		assertMultiline(
			"# title 1\n# alternate title",
			"<h1>title 1</h1><h1>alternate title</h1>",
		);
		assertMultiline(
			"## title 2\n## title 2 alt",
			"<h2>title 2</h2><h2>title 2 alt</h2>",
		);
		assertMultiline(
			"### title 3\n### third title",
			"<h3>title 3</h3><h3>third title</h3>",
		);
	});

	describe("bold", () => {
		assertConversion("**this is bold**", "<strong>this is bold</strong>", {
			selector: "strong",
			text: "this is bold",
		});
		assertConversion("__this is bold__", "<strong>this is bold</strong>", {
			selector: "strong",
			text: "this is bold",
		});

		assertMultiline(
			"**this is bold**\n**this is also bold**",
			"<strong>this is bold</strong><strong>this is also bold</strong>",
		);
		assertMultiline(
			"__this is bold__\n__this is also bold__",
			"<strong>this is bold</strong><strong>this is also bold</strong>",
		);
	});

	describe("italic", () => {
		assertConversion("*this is italic*", "<em>this is italic</em>", {
			selector: "em",
			text: "this is italic",
		});
		assertConversion("_this is italic_", "<em>this is italic</em>", {
			selector: "em",
			text: "this is italic",
		});

		assertMultiline(
			"*this is italic*\n*this is also italic*",
			"<em>this is italic</em><em>this is also italic</em>",
		);
		assertMultiline(
			"_this is italic_\n_this is also italic_",
			"<em>this is italic</em><em>this is also italic</em>",
		);
	});

	describe("combined heading + bold", () => {
		assertConversion("# **title 1**", "<h1><strong>title 1</strong></h1>", {
			selector: "h1 strong",
		});
		assertConversion("# __title 1__", "<h1><strong>title 1</strong></h1>");
	});

	describe("images", () => {
		assertConversion(
			"![alt-text](image-source)",
			'<img alt="alt-text" src="image-source">',
			{ selector: "img", attributes: { alt: "alt-text", src: "image-source" } },
		);

		assertMultiline(
			"![alt-text](image-source)\n![alt-text-2](image-source-2)",
			'<img alt="alt-text" src="image-source"><img alt="alt-text-2" src="image-source-2">',
		);
	});

	describe("links", () => {
		assertConversion("[link text](URL)", '<a href="URL">link text</a>', {
			selector: "a",
			text: "link text",
			attributes: { href: "URL" },
		});

		assertMultiline(
			"[link text](URL)\n[link text 2](URL2)",
			'<a href="URL">link text</a><a href="URL2">link text 2</a>',
		);
	});

	describe("blockquotes", () => {
		assertConversion(
			"> this is a quote",
			"<blockquote>this is a quote</blockquote>",
			{ selector: "blockquote", text: "this is a quote" },
		);

		assertMultiline(
			"> this is a quote\n> this is another quote",
			"<blockquote>this is a quote</blockquote><blockquote>this is another quote</blockquote>",
		);

		assertNoConversion("some text > not a quote anymore");

		assertConversion(
			"> **this is a *quote***",
			"<blockquote><strong>this is a <em>quote</em></strong></blockquote>",
			{ selector: "blockquote strong em" },
		);
	});

	it("should have only one script element in the HTML", () => {
		const scripts = window.document.querySelectorAll("script");
		expect(scripts.length).toBe(1);
	});
});
