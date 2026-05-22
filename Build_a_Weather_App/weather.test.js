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

describe("Weather App", () => {
	let window;

	beforeEach(() => {
		window = loadPage();
	});

	it("should have a button with id 'get-weather-btn'", () => {
		const btn = window.document.querySelector("#get-weather-btn");
		expect(btn).not.toBeNull();
		expect(btn.tagName).toBe("BUTTON");
	});

	it("should have a select element", () => {
		const select = window.document.querySelector("select");
		expect(select).not.toBeNull();
	});

	it("should have an empty first option", () => {
		const firstOption = window.document.querySelector("select option");
		expect(firstOption.value).toBe("");
		expect(firstOption.textContent).toBe("");
	});

	it("should have 6 city options", () => {
		const options = window.document.querySelectorAll("select option");
		const cities = [...options].slice(1).map((o) => o.textContent);
		expect(cities).toEqual([
			"New York",
			"Los Angeles",
			"Chicago",
			"Paris",
			"Tokyo",
			"London",
		]);
		for (const option of [...options].slice(1)) {
			expect(option.value).toBe(option.textContent.toLowerCase());
		}
	});
});
