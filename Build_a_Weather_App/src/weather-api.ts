const API_BASE = "https://weather-proxy.freecodecamp.rocks/api/city";

// biome-ignore lint/style/useNamingConvention: matches external API field names
export interface WeatherData {
	name: string;
	weather?: { main?: string; description?: string; icon?: string }[];
	main?: {
		temp?: number;
		// biome-ignore lint/style/useNamingConvention: API field name
		feels_like?: number;
		// biome-ignore lint/style/useNamingConvention: API field name
		temp_min?: number;
		// biome-ignore lint/style/useNamingConvention: API field name
		temp_max?: number;
		pressure?: number;
		humidity?: number;
	};
	visibility?: number;
	wind?: { speed?: number; deg?: number; gust?: number };
}

export async function getWeather(
	city: string,
): Promise<WeatherData | undefined> {
	try {
		const response = await fetch(`${API_BASE}/${city}`);
		return (await response.json()) as WeatherData;
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: required by FreeCodeCamp
		console.error(error);
	}
}
