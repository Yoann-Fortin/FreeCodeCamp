# Voting System

A poll-based voting system using Map and Set, developed as part of the [freeCodeCamp JavaScript Algorithms and Data Structures certification](https://www.freecodecamp.org/).

## Features

- Create poll options dynamically
- Prevent duplicate voting per option via Set
- Display formatted poll results

## API

| Function | Description |
|----------|------------|
| `addOption(option)` | Add a new option to the poll |
| `vote(option, voterId)` | Cast a vote for an option |

## Approach

This project follows a **TDD (Test-Driven Development)** workflow using [Vitest](https://vitest.dev/). Each feature is implemented through the Red-Green-Refactor cycle.

### Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Minimal implementation, passes all 18 certification tests |
| `voting/feature/typescript` | Migration to TypeScript |
| `voting/feature/hexagonal` | Hexagonal architecture (Ports & Adapters) with domain isolation |

### Running tests

```bash
npm install
npm test
```

## Tech Stack

- Vanilla JavaScript
- Vitest (testing)
