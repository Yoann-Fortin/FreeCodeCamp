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
});
