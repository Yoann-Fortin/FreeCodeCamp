import type { NormalizedWeather } from "../domain/normalized-weather.ts";
import { formatValue } from "../domain/normalized-weather.ts";
import type { WeatherProvider } from "../ports/weather-provider.ts";

// biome-ignore lint/style/useNamingConvention: matches external API field names
interface ApiResponse {
	name: string;
	weather?: { main?: string; description?: string; icon?: string }[];
	main?: {
		temp?: number;
		// biome-ignore lint/style/useNamingConvention: API field name
		feels_like?: number;
		humidity?: number;
	};
	wind?: { speed?: number; gust?: number };
}

const API_BASE = "https://weather-proxy.freecodecamp.rocks/api/city";

function adapt(data: ApiResponse): NormalizedWeather {
	return {
		location: formatValue(data.name),
		temperature: formatValue(data.main?.temp),
		feelsLike: formatValue(data.main?.feels_like),
		humidity: formatValue(data.main?.humidity),
		windSpeed: formatValue(data.wind?.speed),
		windGust: formatValue(data.wind?.gust),
		weatherType: formatValue(data.weather?.[0]?.main),
		icon: data.weather?.[0]?.icon ?? "",
	};
}

export function createApiWeatherProvider(): WeatherProvider {
	return {
		async fetch(city: string): Promise<NormalizedWeather | undefined> {
			try {
				const response = await globalThis.fetch(`${API_BASE}/${city}`);
				const data = (await response.json()) as ApiResponse;
				return adapt(data);
			} catch {
				// returns undefined, handled by WeatherService.showWeather
			}
		},
	};
}
