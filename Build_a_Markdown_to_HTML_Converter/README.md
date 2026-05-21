# Markdown to HTML Converter

A lightweight Markdown to HTML converter built with vanilla JavaScript, developed as part of the [freeCodeCamp JavaScript Algorithms and Data Structures certification](https://www.freecodecamp.org/).

## Supported Syntax

| Markdown | HTML | Description |
|----------|------|-------------|
| `# text` | `<h1>text</h1>` | Heading level 1 |
| `## text` | `<h2>text</h2>` | Heading level 2 |
| `### text` | `<h3>text</h3>` | Heading level 3 |
| `**text**` or `__text__` | `<strong>text</strong>` | Bold |
| `*text*` or `_text_` | `<em>text</em>` | Italic |
| `![alt](src)` | `<img alt="alt" src="src">` | Image |
| `[text](url)` | `<a href="url">text</a>` | Link |
| `> text` | `<blockquote>text</blockquote>` | Blockquote |

## Approach

This project follows a **TDD (Test-Driven Development)** workflow using [Vitest](https://vitest.dev/). Each conversion rule is implemented through the Red-Green-Refactor cycle:

1. Write a failing test for the expected behavior
2. Write the minimal code to make it pass
3. Refactor if needed

### Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Minimal implementation, passes all 51 certification tests |
| `feature/typescript` | Migration to TypeScript |
| `feature/strategy-pattern` | Each conversion rule extracted as an independent strategy |
| `feature/hexagonal` | Hexagonal architecture (Ports & Adapters) with domain isolation |

The `main` branch deliberately keeps things simple: a single `convertMarkdown` function using regex replacements. The feature branches exist purely for pedagogical purposes, exploring how design patterns and hexagonal architecture apply even to a small project.

## Getting Started

Open `index.html` in a browser. Type Markdown in the input area, raw HTML and a live preview update in real time.

### Running tests

```bash
npm install
npm test
```

## Tech Stack

- HTML / CSS / Vanilla JavaScript
- Vitest (testing)
