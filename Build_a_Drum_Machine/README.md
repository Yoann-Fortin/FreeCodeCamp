# Drum Machine

An interactive drum machine built with vanilla JavaScript, developed as part of the [freeCodeCamp JavaScript Algorithms and Data Structures certification](https://www.freecodecamp.org/).

## Features

- 9 drum pads triggered by click or keyboard (Q, W, E, A, S, D, Z, X, C)
- Live display showing the name of the last played sound
- Audio samples from the freeCodeCamp CDN

## Sounds

| Key | Drum name |
|-----|-----------|
| Q | Heater 1 |
| W | Heater 2 |
| E | Heater 3 |
| A | Heater 4 |
| S | Clap |
| D | Open-HH |
| Z | Kick-n'-Hat |
| X | Kick |
| C | Closed-HH |

## Approach

This project follows a **TDD (Test-Driven Development)** workflow using [Vitest](https://vitest.dev/). Each feature is implemented through the Red-Green-Refactor cycle.

### Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Minimal implementation, passes all 10 certification tests |
| `drum/feature/typescript` | Migration to TypeScript |
| `drum/feature/factory-observer` | Factory for pad creation, Observer for display updates |
| `drum/feature/hexagonal` | Hexagonal architecture (Ports & Adapters) with domain isolation |

### Running tests

```bash
npm install
npm test
```

## Tech Stack

- HTML / CSS / Vanilla JavaScript
- Vitest (testing)
