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

	describe("vote", () => {
		it("should return error when option does not exist", () => {
			expect(ctx.vote("Nigeria", "traveler2")).toBe('Option "Nigeria" does not exist.');
		});

		it("should register a vote and return confirmation", () => {
			ctx.addOption("Malaysia");
			expect(ctx.vote("Malaysia", "traveler1")).toBe('Voter traveler1 voted for "Malaysia".');
		});

		it("should update the Set of voters for an option", () => {
			ctx.addOption("Malaysia");
			ctx.vote("Malaysia", "traveler1");
			expect(ctx.poll.get("Malaysia").has("traveler1")).toBe(true);
		});

		it("should prevent duplicate voting", () => {
			ctx.addOption("Algeria");
			ctx.vote("Algeria", "traveler1");
			expect(ctx.vote("Algeria", "traveler1")).toBe('Voter traveler1 has already voted for "Algeria".');
		});

		it("should not increase Set size on duplicate vote", () => {
			ctx.addOption("Algeria");
			ctx.vote("Algeria", "traveler1");
			ctx.vote("Algeria", "traveler1");
			expect(ctx.poll.get("Algeria").size).toBe(1);
		});

		it("should allow multiple voters on the same option", () => {
			ctx.addOption("Turkey");
			ctx.vote("Turkey", "traveler1");
			ctx.vote("Turkey", "traveler2");
			expect(ctx.poll.get("Turkey").size).toBe(2);
		});
	});

	describe("addOption", () => {
		it("should add a new option and return confirmation message", () => {
			expect(ctx.addOption("Egypt")).toBe('Option "Egypt" added to the poll.');
		});

		it("should return error message for empty option", () => {
			expect(ctx.addOption("")).toBe("Option cannot be empty.");
		});

		it("should return error message for duplicate option", () => {
			ctx.addOption("Turkey");
			expect(ctx.addOption("Turkey")).toBe('Option "Turkey" already exists.');
		});

		it("should map each option to a Set", () => {
			ctx.addOption("Turkey");
			expect(ctx.poll.get("Turkey")).toBeInstanceOf(Set);
		});
	});
});
