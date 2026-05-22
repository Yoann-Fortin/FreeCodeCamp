import type { WeatherDisplay } from "../ports/weather-display.ts";
import type { WeatherProvider } from "../ports/weather-provider.ts";
import type { NormalizedWeather } from "./normalized-weather.ts";

export class WeatherService {
	private readonly provider: WeatherProvider;
	private readonly display: WeatherDisplay;

	constructor(provider: WeatherProvider, display: WeatherDisplay) {
		this.provider = provider;
		this.display = display;
	}

	getWeather(city: string): Promise<NormalizedWeather | undefined> {
		return this.provider.fetch(city);
	}

	async showWeather(city: string): Promise<void> {
		const weather = await this.provider.fetch(city);
		if (!weather) {
			this.display.showError("Something went wrong, please try again later.");
			return;
		}
		this.display.render(weather);
	}
}
