import { getWeather } from "./weather-api.ts";

function formatValue(value: unknown): string {
	if (value === undefined) {
		return "N/A";
	}
	return String(value);
}

function setText(selector: string, value: unknown): void {
	const el = document.querySelector(selector);
	if (el) {
		el.textContent = formatValue(value);
	}
}

async function showWeather(city: string): Promise<void> {
	const data = await getWeather(city);
	if (!data) {
		// biome-ignore lint/suspicious/noAlert: required by FreeCodeCamp
		alert("Something went wrong, please try again later.");
		return;
	}
	setText("#location", data.name);
	setText("#main-temperature", data.main?.temp);
	setText("#feels-like", data.main?.feels_like);
	setText("#humidity", data.main?.humidity);
	setText("#wind", data.wind?.speed);
	setText("#wind-gust", data.wind?.gust);
	setText("#weather-main", data.weather?.[0]?.main);
	const icon = data.weather?.[0]?.icon;
	if (icon) {
		const img = document.querySelector(
			"#weather-icon",
		) as HTMLImageElement | null;
		if (img) {
			img.src = icon;
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
