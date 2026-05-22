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

	it("should have an img element with id 'weather-icon'", () => {
		const el = window.document.querySelector("#weather-icon");
		expect(el).not.toBeNull();
		expect(el.tagName).toBe("IMG");
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

	it("should have a getWeather function", () => {
		expect(typeof window.getWeather).toBe("function");
	});

	it("should have a showWeather function", () => {
		expect(typeof window.showWeather).toBe("function");
	});

	describe("getWeather", () => {
		it("should fetch and return weather data", async () => {
			const fakeData = { name: "London", main: { temp: 15 } };
			window.fetch = () =>
				Promise.resolve({ ok: true, json: () => Promise.resolve(fakeData) });
			const result = await window.getWeather("london");
			expect(result.name).toBe("London");
		});

		it("should log errors and return undefined on failure", async () => {
			const errors = [];
			window.console.error = (e) => errors.push(e);
			window.fetch = () => Promise.reject(new Error("Network error"));
			const result = await window.getWeather("london");
			expect(result).toBeUndefined();
			expect(errors.length).toBeGreaterThan(0);
		});
	});

	describe("showWeather", () => {
		it("should display weather data in elements", async () => {
			const fakeData = {
				name: "London",
				weather: [{ main: "Clear", icon: "icon.png" }],
				main: { temp: 15, feels_like: 12, humidity: 60 },
				wind: { speed: 5, gust: 8 },
			};
			window.fetch = () =>
				Promise.resolve({ ok: true, json: () => Promise.resolve(fakeData) });
			await window.showWeather("london");
			expect(window.document.querySelector("#location").textContent).toBe(
				"London",
			);
			expect(
				window.document.querySelector("#main-temperature").textContent,
			).toBe("15");
			expect(window.document.querySelector("#feels-like").textContent).toBe(
				"12",
			);
			expect(window.document.querySelector("#humidity").textContent).toBe("60");
			expect(window.document.querySelector("#wind").textContent).toBe("5");
			expect(window.document.querySelector("#wind-gust").textContent).toBe("8");
			expect(window.document.querySelector("#weather-main").textContent).toBe(
				"Clear",
			);
			expect(window.document.querySelector("#weather-icon").src).toContain(
				"icon.png",
			);
		});

		it("should show N/A for undefined values", async () => {
			const fakeData = {
				name: "London",
				weather: [{}],
				main: { temp: 15 },
				wind: {},
			};
			window.fetch = () =>
				Promise.resolve({ ok: true, json: () => Promise.resolve(fakeData) });
			await window.showWeather("london");
			expect(window.document.querySelector("#wind-gust").textContent).toBe(
				"N/A",
			);
			expect(window.document.querySelector("#weather-main").textContent).toBe(
				"N/A",
			);
		});

		it("should alert on error", async () => {
			let alertMsg = "";
			window.alert = (msg) => {
				alertMsg = msg;
			};
			window.fetch = () => Promise.reject(new Error("fail"));
			await window.showWeather("paris");
			expect(alertMsg).toBe("Something went wrong, please try again later.");
		});
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
