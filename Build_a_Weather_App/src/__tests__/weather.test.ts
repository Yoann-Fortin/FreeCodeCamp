import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlFile = resolve(__dirname, "..", "..", "index.html");
const scriptFile = resolve(__dirname, "..", "..", "script.js");

interface AppWindow {
	document: Document;
	fetch: typeof fetch;
}

let window: AppWindow;

function loadPage(): AppWindow {
	const html = readFileSync(htmlFile, "utf-8");
	const dom = new JSDOM(html, { runScripts: "dangerously" });
	const scriptContent = readFileSync(scriptFile, "utf-8");
	dom.window.eval(scriptContent);
	return dom.window as unknown as AppWindow;
}

function stubFetch(data: unknown): void {
	window.fetch = (): Promise<Response> =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(data),
		} as Response);
}

function stubFetchError(): void {
	window.fetch = (): Promise<Response> =>
		Promise.reject(new Error("Network error"));
}

function selectCity(city: string): void {
	const select = window.document.querySelector("select") as HTMLSelectElement;
	select.value = city;
}

async function clickButton(): Promise<void> {
	const btn = window.document.querySelector(
		"#get-weather-btn",
	) as HTMLButtonElement;
	btn.click();
	await new Promise((r) => {
		setTimeout(r, 0);
	});
}

function getText(selector: string): string {
	return window.document.querySelector(selector)?.textContent ?? "";
}

describe("Weather App", () => {
	beforeEach(() => {
		window = loadPage();
	});

	describe("structure", () => {
		it("should have a button with id 'get-weather-btn'", () => {
			const btn = window.document.querySelector("#get-weather-btn");
			expect(btn).not.toBeNull();
			expect(btn!.tagName).toBe("BUTTON");
		});

		it("should have a select element with empty first option", () => {
			const firstOption = window.document.querySelector("select option");
			expect(firstOption).not.toBeNull();
			expect(firstOption!.getAttribute("value")).toBe("");
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
		});

		it("should have an img element with id 'weather-icon'", () => {
			const el = window.document.querySelector("#weather-icon");
			expect(el).not.toBeNull();
			expect(el!.tagName).toBe("IMG");
		});

		it.each([
			["main-temperature"],
			["feels-like"],
			["humidity"],
			["wind"],
			["wind-gust"],
			["weather-main"],
			["location"],
			["error"],
		])("should have element with id '%s'", (id) => {
			expect(window.document.querySelector(`#${id}`)).not.toBeNull();
		});
	});

	describe("integration", () => {
		it("should display weather data after clicking button", async () => {
			stubFetch({
				name: "London",
				weather: [{ main: "Clear", icon: "icon.png" }],
				main: { temp: 15, feels_like: 12, humidity: 60 },
				wind: { speed: 5, gust: 8 },
			});
			selectCity("london");
			await clickButton();
			expect(getText("#location")).toBe("London");
			expect(getText("#main-temperature")).toBe("15");
			expect(getText("#feels-like")).toBe("12");
			expect(getText("#humidity")).toBe("60");
			expect(getText("#wind")).toBe("5");
			expect(getText("#wind-gust")).toBe("8");
			expect(getText("#weather-main")).toBe("Clear");
		});

		it("should show N/A for undefined values", async () => {
			stubFetch({
				name: "London",
				weather: [{}],
				main: { temp: 15 },
				wind: {},
			});
			selectCity("london");
			await clickButton();
			expect(getText("#wind-gust")).toBe("N/A");
			expect(getText("#weather-main")).toBe("N/A");
		});

		it("should show error message on failure", async () => {
			stubFetchError();
			selectCity("paris");
			await clickButton();
			expect(getText("#error")).toBe(
				"Something went wrong, please try again later.",
			);
		});
	});
});
