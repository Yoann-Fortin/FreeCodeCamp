import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlFile = resolve(__dirname, "..", "..", "index.html");
const scriptFile = resolve(__dirname, "..", "..", "script.js");

interface WeatherWindow {
	document: Document;
	getWeather: (city: string) => Promise<unknown>;
	showWeather: (city: string) => Promise<void>;
	fetch: typeof fetch;
	alert: (msg: string) => void;
	console: Console;
}

let window: WeatherWindow;

function loadPage(): WeatherWindow {
	const html = readFileSync(htmlFile, "utf-8");
	const dom = new JSDOM(html, { runScripts: "dangerously" });
	const scriptContent = readFileSync(scriptFile, "utf-8");
	dom.window.eval(scriptContent);
	return dom.window as unknown as WeatherWindow;
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
		])("should have element with id '%s'", (id) => {
			expect(window.document.querySelector(`#${id}`)).not.toBeNull();
		});
	});

	describe("getWeather", () => {
		it("should be a function", () => {
			expect(typeof window.getWeather).toBe("function");
		});

		it("should fetch and return weather data", async () => {
			const fakeData = { name: "London", main: { temp: 15 } };
			stubFetch(fakeData);
			const result = await window.getWeather("london");
			expect(result).toEqual(fakeData);
		});

		it("should return undefined on failure", async () => {
			stubFetchError();
			const result = await window.getWeather("london");
			expect(result).toBeUndefined();
		});
	});

	describe("showWeather", () => {
		it("should be a function", () => {
			expect(typeof window.showWeather).toBe("function");
		});

		it("should display weather data in elements", async () => {
			stubFetch({
				name: "London",
				weather: [{ main: "Clear", icon: "icon.png" }],
				main: { temp: 15, feels_like: 12, humidity: 60 },
				wind: { speed: 5, gust: 8 },
			});
			await window.showWeather("london");
			expect(window.document.querySelector("#location")!.textContent).toBe(
				"London",
			);
			expect(
				window.document.querySelector("#main-temperature")!.textContent,
			).toBe("15");
			expect(window.document.querySelector("#feels-like")!.textContent).toBe(
				"12",
			);
			expect(window.document.querySelector("#humidity")!.textContent).toBe(
				"60",
			);
			expect(window.document.querySelector("#wind")!.textContent).toBe("5");
			expect(window.document.querySelector("#wind-gust")!.textContent).toBe(
				"8",
			);
			expect(window.document.querySelector("#weather-main")!.textContent).toBe(
				"Clear",
			);
		});

		it("should show N/A for undefined values", async () => {
			stubFetch({
				name: "London",
				weather: [{}],
				main: { temp: 15 },
				wind: {},
			});
			await window.showWeather("london");
			expect(window.document.querySelector("#wind-gust")!.textContent).toBe(
				"N/A",
			);
			expect(window.document.querySelector("#weather-main")!.textContent).toBe(
				"N/A",
			);
		});

		it("should alert on error", async () => {
			let alertMsg = "";
			window.alert = (msg: string): void => {
				alertMsg = msg;
			};
			stubFetchError();
			await window.showWeather("paris");
			expect(alertMsg).toBe("Something went wrong, please try again later.");
		});
	});
});
