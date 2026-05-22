"use strict";
(() => {
  // Build_a_Weather_App/src/weather-adapter.ts
  function format(value) {
    if (value === void 0) {
      return "N/A";
    }
    return String(value);
  }
  function adaptWeather(data) {
    return {
      location: format(data.name),
      temperature: format(data.main?.temp),
      feelsLike: format(data.main?.feels_like),
      humidity: format(data.main?.humidity),
      windSpeed: format(data.wind?.speed),
      windGust: format(data.wind?.gust),
      weatherType: format(data.weather?.[0]?.main),
      icon: data.weather?.[0]?.icon ?? ""
    };
  }

  // Build_a_Weather_App/src/weather-api.ts
  var API_BASE = "https://weather-proxy.freecodecamp.rocks/api/city";
  async function getWeather(city) {
    try {
      const response = await fetch(`${API_BASE}/${city}`);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  // Build_a_Weather_App/src/script.ts
  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = value;
    }
  }
  async function showWeather(city) {
    const data = await getWeather(city);
    if (!data) {
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
        "#weather-icon"
      );
      if (img) {
        img.src = weather.icon;
      }
    }
  }
  window.getWeather = getWeather;
  window.showWeather = showWeather;
  var btn = document.querySelector("#get-weather-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      const select = document.querySelector("select");
      const city = select?.value;
      if (city) {
        showWeather(city);
      }
    });
  }
})();
