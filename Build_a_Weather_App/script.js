const API_BASE = "https://weather-proxy.freecodecamp.rocks/api/city";

async function getWeather(city) {
	try {
		const response = await fetch(`${API_BASE}/${city}`);
		return await response.json();
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: required by FreeCodeCamp
		console.error(error);
	}
}

function formatValue(value) {
	if (value === undefined) {
		return "N/A";
	}
	return String(value);
}

async function showWeather(city) {
	const data = await getWeather(city);
	if (!data) {
		// biome-ignore lint/suspicious/noAlert: required by FreeCodeCamp
		alert("Something went wrong, please try again later.");
		return;
	}
	document.querySelector("#location").textContent = formatValue(data.name);
	document.querySelector("#main-temperature").textContent = formatValue(
		data.main?.temp,
	);
	document.querySelector("#feels-like").textContent = formatValue(
		data.main?.feels_like,
	);
	document.querySelector("#humidity").textContent = formatValue(
		data.main?.humidity,
	);
	document.querySelector("#wind").textContent = formatValue(data.wind?.speed);
	document.querySelector("#wind-gust").textContent = formatValue(
		data.wind?.gust,
	);
	document.querySelector("#weather-main").textContent = formatValue(
		data.weather?.[0]?.main,
	);
	const icon = data.weather?.[0]?.icon;
	if (icon) {
		document.querySelector("#weather-icon").src = icon;
	}
}

document.querySelector("#get-weather-btn").addEventListener("click", () => {
	const city = document.querySelector("select").value;
	if (city) {
		showWeather(city);
	}
});
