import type { WeatherData } from "./weather-api.ts";

function format(value: unknown): string {
	if (value === undefined) {
		return "N/A";
	}
	return String(value);
}

export interface NormalizedWeather {
	location: string;
	temperature: string;
	feelsLike: string;
	humidity: string;
	windSpeed: string;
	windGust: string;
	weatherType: string;
	icon: string;
}

export function adaptWeather(data: WeatherData): NormalizedWeather {
	return {
		location: format(data.name),
		temperature: format(data.main?.temp),
		feelsLike: format(data.main?.feels_like),
		humidity: format(data.main?.humidity),
		windSpeed: format(data.wind?.speed),
		windGust: format(data.wind?.gust),
		weatherType: format(data.weather?.[0]?.main),
		icon: data.weather?.[0]?.icon ?? "",
	};
}
