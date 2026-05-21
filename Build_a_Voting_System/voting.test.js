import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createContext, runInNewContext } from "node:vm";
import { beforeEach, describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptFile = resolve(__dirname, "script.js");

function loadScript() {
	const sandbox = { Map, Set };
	createContext(sandbox);
	const scriptContent = readFileSync(scriptFile, "utf-8");
	runInNewContext(scriptContent, sandbox);
	return sandbox;
}

describe("Voting System", () => {
	let ctx;

	beforeEach(() => {
		ctx = loadScript();
	});

	it("should have a poll variable initialized to a Map", () => {
		expect(ctx.poll).toBeInstanceOf(Map);
	});

	it("should have an addOption function", () => {
		expect(typeof ctx.addOption).toBe("function");
	});

	it("should have a vote function", () => {
		expect(typeof ctx.vote).toBe("function");
	});

	it("should have a displayResults function", () => {
		expect(typeof ctx.displayResults).toBe("function");
	});
});
