import { describe, expect, it } from "vitest";
import { adaptWeather } from "../weather-adapter.ts";

describe("adaptWeather", () => {
	it("should normalize complete weather data", () => {
		const result = adaptWeather({
			name: "London",
			weather: [{ main: "Clear", icon: "icon.png" }],
			main: { temp: 15, feels_like: 12, humidity: 60 },
			wind: { speed: 5, gust: 8 },
		});
		expect(result.location).toBe("London");
		expect(result.temperature).toBe("15");
		expect(result.feelsLike).toBe("12");
		expect(result.humidity).toBe("60");
		expect(result.windSpeed).toBe("5");
		expect(result.windGust).toBe("8");
		expect(result.weatherType).toBe("Clear");
		expect(result.icon).toBe("icon.png");
	});

	it("should return N/A for missing values", () => {
		const result = adaptWeather({
			name: "London",
			weather: [{}],
			main: {},
			wind: {},
		});
		expect(result.temperature).toBe("N/A");
		expect(result.feelsLike).toBe("N/A");
		expect(result.humidity).toBe("N/A");
		expect(result.windSpeed).toBe("N/A");
		expect(result.windGust).toBe("N/A");
		expect(result.weatherType).toBe("N/A");
		expect(result.icon).toBe("");
	});
});
