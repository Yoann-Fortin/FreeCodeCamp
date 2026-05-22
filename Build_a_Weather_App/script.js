"use strict";
(() => {
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
  function formatValue(value) {
    if (value === void 0) {
      return "N/A";
    }
    return String(value);
  }
  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = formatValue(value);
    }
  }
  async function showWeather(city) {
    const data = await getWeather(city);
    if (!data) {
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
        "#weather-icon"
      );
      if (img) {
        img.src = icon;
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
