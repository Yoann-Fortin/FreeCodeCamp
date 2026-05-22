import { describe, expect, it } from "vitest";
import type { NormalizedWeather } from "../domain/normalized-weather.ts";
import { formatValue } from "../domain/normalized-weather.ts";
import { WeatherService } from "../domain/weather-service.ts";
import type { WeatherDisplay } from "../ports/weather-display.ts";
import type { WeatherProvider } from "../ports/weather-provider.ts";

const FAKE_WEATHER: NormalizedWeather = {
	location: "London",
	temperature: "15",
	feelsLike: "12",
	humidity: "60",
	windSpeed: "5",
	windGust: "8",
	weatherType: "Clear",
	icon: "icon.png",
};

function createStubProvider(
	data: NormalizedWeather | undefined,
): WeatherProvider {
	return { fetch: () => Promise.resolve(data) };
}

function createSpyDisplay(): WeatherDisplay & {
	rendered: NormalizedWeather | null;
	errorMsg: string;
} {
	return {
		rendered: null,
		errorMsg: "",
		render(weather: NormalizedWeather): void {
			this.rendered = weather;
		},
		showError(message: string): void {
			this.errorMsg = message;
		},
	};
}

describe("formatValue", () => {
	it("should return string for defined values", () => {
		expect(formatValue(42)).toBe("42");
		expect(formatValue("hello")).toBe("hello");
	});

	it("should return N/A for undefined", () => {
		expect(formatValue(undefined)).toBe("N/A");
	});
});

describe("WeatherService", () => {
	it("should render weather data on success", async () => {
		const display = createSpyDisplay();
		const service = new WeatherService(
			createStubProvider(FAKE_WEATHER),
			display,
		);
		await service.showWeather("london");
		expect(display.rendered).toEqual(FAKE_WEATHER);
	});

	it("should show error when provider returns undefined", async () => {
		const display = createSpyDisplay();
		const service = new WeatherService(createStubProvider(undefined), display);
		await service.showWeather("paris");
		expect(display.errorMsg).toBe(
			"Something went wrong, please try again later.",
		);
		expect(display.rendered).toBeNull();
	});

	it("should return weather data from getWeather", async () => {
		const display = createSpyDisplay();
		const service = new WeatherService(
			createStubProvider(FAKE_WEATHER),
			display,
		);
		const result = await service.getWeather("london");
		expect(result).toEqual(FAKE_WEATHER);
	});
});
