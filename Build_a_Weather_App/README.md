# Weather App

A weather information app that fetches data from an API for different cities, developed as part of the [freeCodeCamp JavaScript Algorithms and Data Structures certification](https://www.freecodecamp.org/).

## Features

- Select from 6 cities (New York, Los Angeles, Chicago, Paris, Tokyo, London)
- Fetch live weather data from the freeCodeCamp Weather Proxy API
- Display temperature, humidity, wind speed, weather icon
- Handle API errors gracefully with user-friendly alerts
- Show "N/A" for missing data

## API

| Function | Description |
|----------|------------|
| `getWeather(city)` | Fetch weather data for a city, returns JSON |
| `showWeather(city)` | Display weather data in the UI |

## Approach

This project follows a **TDD (Test-Driven Development)** workflow using [Vitest](https://vitest.dev/). Each feature is implemented through the Red-Green-Refactor cycle.

### Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Minimal implementation, passes all certification tests |
| `weather/feature/typescript` | Migration to TypeScript |
| `weather/feature/adapter` | Adapter pattern: normalize API response |
| `weather/feature/hexagonal` | Hexagonal architecture with domain isolation |

### Running tests

```bash
npm install
npm test
```

## Tech Stack

- HTML / CSS / Vanilla JavaScript
- Vitest (testing)
