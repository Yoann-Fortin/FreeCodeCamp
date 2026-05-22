import type { NormalizedWeather } from "../domain/normalized-weather.ts";

export interface WeatherProvider {
	fetch: (city: string) => Promise<NormalizedWeather | undefined>;
}
