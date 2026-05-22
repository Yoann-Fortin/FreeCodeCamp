import type { WeatherData } from "./weather-api.ts";

declare global {
	interface Window {
		getWeather: (city: string) => Promise<WeatherData | undefined>;
		showWeather: (city: string) => Promise<void>;
	}
}
