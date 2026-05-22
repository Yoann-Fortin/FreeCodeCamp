"use strict";
(() => {
  // Build_a_Weather_App/src/domain/normalized-weather.ts
  function formatValue(value) {
    if (value === void 0) {
      return "N/A";
    }
    return String(value);
  }

  // Build_a_Weather_App/src/adapters/api-weather-provider.ts
  var API_BASE = "https://weather-proxy.freecodecamp.rocks/api/city";
  function adapt(data) {
    return {
      location: formatValue(data.name),
      temperature: formatValue(data.main?.temp),
      feelsLike: formatValue(data.main?.feels_like),
      humidity: formatValue(data.main?.humidity),
      windSpeed: formatValue(data.wind?.speed),
      windGust: formatValue(data.wind?.gust),
      weatherType: formatValue(data.weather?.[0]?.main),
      icon: data.weather?.[0]?.icon ?? ""
    };
  }
  function createApiWeatherProvider() {
    return {
      async fetch(city) {
        try {
          const response = await globalThis.fetch(`${API_BASE}/${city}`);
          const data = await response.json();
          return adapt(data);
        } catch {
        }
      }
    };
  }

  // Build_a_Weather_App/src/adapters/dom-weather-display.ts
  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = value;
    }
  }
  function createDomWeatherDisplay() {
    return {
      render(weather) {
        setText("#error", "");
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
      },
      showError(message) {
        setText("#error", message);
      }
    };
  }

  // Build_a_Weather_App/src/domain/weather-service.ts
  var WeatherService = class {
    constructor(provider, display) {
      this.provider = provider;
      this.display = display;
    }
    getWeather(city) {
      return this.provider.fetch(city);
    }
    async showWeather(city) {
      const weather = await this.provider.fetch(city);
      if (!weather) {
        this.display.showError("Something went wrong, please try again later.");
        return;
      }
      this.display.render(weather);
    }
  };

  // Build_a_Weather_App/src/script.ts
  var service = new WeatherService(
    createApiWeatherProvider(),
    createDomWeatherDisplay()
  );
  var btn = document.querySelector("#get-weather-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      const select = document.querySelector("select");
      const city = select?.value;
      if (city) {
        service.showWeather(city);
      }
    });
  }
})();
