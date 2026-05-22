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

export function formatValue(value: unknown): string {
	if (value === undefined) {
		return "N/A";
	}
	return String(value);
}
