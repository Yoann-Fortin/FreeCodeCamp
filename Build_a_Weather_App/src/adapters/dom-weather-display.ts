import type { NormalizedWeather } from "../domain/normalized-weather.ts";
import type { WeatherDisplay } from "../ports/weather-display.ts";

function setText(selector: string, value: string): void {
	const el = document.querySelector(selector);
	if (el) {
		el.textContent = value;
	}
}

export function createDomWeatherDisplay(): WeatherDisplay {
	return {
		render(weather: NormalizedWeather): void {
			setText("#error", "");
			setText("#location", weather.location);
			setText("#main-temperature", weather.temperature);
			setText("#feels-like", weather.feelsLike);
			setText("#humidity", weather.humidity);
			setText("#wind", weather.windSpeed);
			setText("#wind-gust", weather.windGust);
			setText("#weather-main", weather.weatherType);
			if (weather.icon) {
				const img = document.querySelector(
					"#weather-icon",
				) as HTMLImageElement | null;
				if (img) {
					img.src = weather.icon;
				}
			}
		},
		showError(message: string): void {
			setText("#error", message);
		},
	};
}
