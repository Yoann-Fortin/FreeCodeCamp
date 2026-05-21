import { beforeEach, describe, expect, it } from "vitest";
import { addOption, poll, vote } from "../poll.ts";

describe("Voting System", () => {
	beforeEach(() => {
		poll.clear();
	});

	it("should have a poll initialized to a Map", () => {
		expect(poll).toBeInstanceOf(Map);
	});

	it("should have an addOption function", () => {
		expect(typeof addOption).toBe("function");
	});

	it("should have a vote function", () => {
		expect(typeof vote).toBe("function");
	});

	describe("addOption", () => {
		it("should add a new option and return confirmation message", () => {
			expect(addOption("Egypt")).toBe('Option "Egypt" added to the poll.');
		});

		it("should return error message for empty option", () => {
			expect(addOption("")).toBe("Option cannot be empty.");
		});

		it("should return error message for duplicate option", () => {
			addOption("Turkey");
			expect(addOption("Turkey")).toBe('Option "Turkey" already exists.');
		});

		it("should map each option to a Set", () => {
			addOption("Turkey");
			expect(poll.get("Turkey")).toBeInstanceOf(Set);
		});
	});

	describe("vote", () => {
		it("should return error when option does not exist", () => {
			expect(vote("Nigeria", "traveler2")).toBe(
				'Option "Nigeria" does not exist.',
			);
		});

		it("should register a vote and return confirmation", () => {
			addOption("Malaysia");
			expect(vote("Malaysia", "traveler1")).toBe(
				'Voter traveler1 voted for "Malaysia".',
			);
		});

		it("should update the Set of voters for an option", () => {
			addOption("Malaysia");
			vote("Malaysia", "traveler1");
			expect(poll.get("Malaysia")!.has("traveler1")).toBe(true);
		});

		it("should prevent duplicate voting", () => {
			addOption("Algeria");
			vote("Algeria", "traveler1");
			expect(vote("Algeria", "traveler1")).toBe(
				'Voter traveler1 has already voted for "Algeria".',
			);
		});

		it("should not increase Set size on duplicate vote", () => {
			addOption("Algeria");
			vote("Algeria", "traveler1");
			vote("Algeria", "traveler1");
			expect(poll.get("Algeria")!.size).toBe(1);
		});

		it("should allow multiple voters on the same option", () => {
			addOption("Turkey");
			vote("Turkey", "traveler1");
			vote("Turkey", "traveler2");
			expect(poll.get("Turkey")!.size).toBe(2);
		});
	});
});
