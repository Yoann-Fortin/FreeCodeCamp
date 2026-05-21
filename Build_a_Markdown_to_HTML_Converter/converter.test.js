import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlFile = resolve(__dirname, "index.html");
const scriptFile = resolve(__dirname, "script.js");

function loadPage() {
	const html = readFileSync(htmlFile, "utf-8");
	const dom = new JSDOM(html, { runScripts: "dangerously" });
	const scriptContent = readFileSync(scriptFile, "utf-8");
	dom.window.eval(scriptContent);
	return dom.window;
}

describe("convertMarkdown", () => {
	let window;

	beforeEach(() => {
		window = loadPage();
	});

	it("should be a function", () => {
		expect(typeof window.convertMarkdown).toBe("function");
	});

	it("should convert '# title 1' to '<h1>title 1</h1>'", () => {
		window.document.querySelector("#markdown-input").value = "# title 1";
		expect(window.convertMarkdown()).toBe("<h1>title 1</h1>");
	});

	it("should display '<h1>title 1</h1>' inside #html-output when input is '# title 1'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "# title 1";
		input.dispatchEvent(new window.Event("input"));
		expect(window.document.querySelector("#html-output").textContent).toBe("<h1>title 1</h1>");
	});

	it("should render an h1 element inside #preview when input is '# title 1'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "# title 1";
		input.dispatchEvent(new window.Event("input"));
		const h1 = window.document.querySelector("#preview h1");
		expect(h1).not.toBeNull();
		expect(h1.textContent).toBe("title 1");
	});

	it("should not convert '# title 1' when preceded by other text", () => {
		window.document.querySelector("#markdown-input").value = "some text # title 1";
		expect(window.convertMarkdown()).toBe("some text # title 1");
	});

	it("should convert multiple h1 headings on separate lines", () => {
		window.document.querySelector("#markdown-input").value = "# title 1\n# alternate title";
		expect(window.convertMarkdown()).toBe("<h1>title 1</h1><h1>alternate title</h1>");
	});

	it("should convert '## title 2' to '<h2>title 2</h2>'", () => {
		window.document.querySelector("#markdown-input").value = "## title 2";
		expect(window.convertMarkdown()).toBe("<h2>title 2</h2>");
	});

	it("should display '<h2>title 2</h2>' inside #html-output when input is '## title 2'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "## title 2";
		input.dispatchEvent(new window.Event("input"));
		expect(window.document.querySelector("#html-output").textContent).toBe("<h2>title 2</h2>");
	});

	it("should render an h2 element inside #preview when input is '## title 2'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "## title 2";
		input.dispatchEvent(new window.Event("input"));
		const h2 = window.document.querySelector("#preview h2");
		expect(h2).not.toBeNull();
		expect(h2.textContent).toBe("title 2");
	});

	it("should not convert '## title 2' when preceded by other text", () => {
		window.document.querySelector("#markdown-input").value = "some text ## title 2";
		expect(window.convertMarkdown()).toBe("some text ## title 2");
	});

	it("should convert multiple h2 headings on separate lines", () => {
		window.document.querySelector("#markdown-input").value = "## title 2\n## title 2 alt";
		expect(window.convertMarkdown()).toBe("<h2>title 2</h2><h2>title 2 alt</h2>");
	});

	it("should convert '### title 3' to '<h3>title 3</h3>'", () => {
		window.document.querySelector("#markdown-input").value = "### title 3";
		expect(window.convertMarkdown()).toBe("<h3>title 3</h3>");
	});

	it("should display '<h3>title 3</h3>' inside #html-output when input is '### title 3'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "### title 3";
		input.dispatchEvent(new window.Event("input"));
		expect(window.document.querySelector("#html-output").textContent).toBe("<h3>title 3</h3>");
	});

	it("should render an h3 element inside #preview when input is '### title 3'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "### title 3";
		input.dispatchEvent(new window.Event("input"));
		const h3 = window.document.querySelector("#preview h3");
		expect(h3).not.toBeNull();
		expect(h3.textContent).toBe("title 3");
	});

	it("should not convert '### title 3' when preceded by other text", () => {
		window.document.querySelector("#markdown-input").value = "some text ### title 3";
		expect(window.convertMarkdown()).toBe("some text ### title 3");
	});

	it("should convert multiple h3 headings on separate lines", () => {
		window.document.querySelector("#markdown-input").value = "### title 3\n### third title";
		expect(window.convertMarkdown()).toBe("<h3>title 3</h3><h3>third title</h3>");
	});

	it("should convert '**this is bold**' to '<strong>this is bold</strong>'", () => {
		window.document.querySelector("#markdown-input").value = "**this is bold**";
		expect(window.convertMarkdown()).toBe("<strong>this is bold</strong>");
	});

	it("should display '<strong>this is bold</strong>' inside #html-output", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "**this is bold**";
		input.dispatchEvent(new window.Event("input"));
		expect(window.document.querySelector("#html-output").textContent).toBe("<strong>this is bold</strong>");
	});

	it("should render a strong element inside #preview when input is '**this is bold**'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "**this is bold**";
		input.dispatchEvent(new window.Event("input"));
		const strong = window.document.querySelector("#preview strong");
		expect(strong).not.toBeNull();
		expect(strong.textContent).toBe("this is bold");
	});

	it("should convert multiple **bold** on separate lines", () => {
		window.document.querySelector("#markdown-input").value = "**this is bold**\n**this is also bold**";
		expect(window.convertMarkdown()).toBe("<strong>this is bold</strong><strong>this is also bold</strong>");
	});

	it("should display '<strong>this is bold</strong>' inside #html-output for '__this is bold__'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "__this is bold__";
		input.dispatchEvent(new window.Event("input"));
		expect(window.document.querySelector("#html-output").textContent).toBe("<strong>this is bold</strong>");
	});

	it("should render a strong element inside #preview when input is '__this is bold__'", () => {
		const input = window.document.querySelector("#markdown-input");
		input.value = "__this is bold__";
		input.dispatchEvent(new window.Event("input"));
		const strong = window.document.querySelector("#preview strong");
		expect(strong).not.toBeNull();
		expect(strong.textContent).toBe("this is bold");
	});

	it("should convert multiple __bold__ on separate lines", () => {
		window.document.querySelector("#markdown-input").value = "__this is bold__\n__this is also bold__";
		expect(window.convertMarkdown()).toBe("<strong>this is bold</strong><strong>this is also bold</strong>");
	});
});
