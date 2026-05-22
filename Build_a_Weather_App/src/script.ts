import { adaptWeather } from "./weather-adapter.ts";
import { getWeather } from "./weather-api.ts";

function setText(selector: string, value: string): void {
	const el = document.querySelector(selector);
	if (el) {
		el.textContent = value;
	}
}

async function showWeather(city: string): Promise<void> {
	const data = await getWeather(city);
	if (!data) {
		// biome-ignore lint/suspicious/noAlert: required by FreeCodeCamp
		alert("Something went wrong, please try again later.");
		return;
	}
	const weather = adaptWeather(data);
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
}

// biome-ignore lint/nursery/useGlobalThis: window needed for type safety with declare global
window.getWeather = getWeather;
// biome-ignore lint/nursery/useGlobalThis: window needed for type safety with declare global
window.showWeather = showWeather;

const btn = document.querySelector("#get-weather-btn");
if (btn) {
	btn.addEventListener("click", () => {
		const select = document.querySelector("select") as HTMLSelectElement | null;
		const city = select?.value;
		if (city) {
			showWeather(city);
		}
	});
}
