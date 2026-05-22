import type { NormalizedWeather } from "../domain/normalized-weather.ts";

export interface WeatherDisplay {
	render: (weather: NormalizedWeather) => void;
	showError: (message: string) => void;
}
