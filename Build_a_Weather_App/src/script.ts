import { createApiWeatherProvider } from "./adapters/api-weather-provider.ts";
import { createDomWeatherDisplay } from "./adapters/dom-weather-display.ts";
import { WeatherService } from "./domain/weather-service.ts";

const service = new WeatherService(
	createApiWeatherProvider(),
	createDomWeatherDisplay(),
);

const btn = document.querySelector("#get-weather-btn");
if (btn) {
	btn.addEventListener("click", () => {
		const select = document.querySelector("select") as HTMLSelectElement | null;
		const city = select?.value;
		if (city) {
			service.showWeather(city);
		}
	});
}
