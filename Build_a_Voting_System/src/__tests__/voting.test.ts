import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPollStore } from "../adapters/in-memory-poll-store.ts";
import { PollService } from "../domain/poll-service.ts";

describe("Voting System", () => {
	let store: InMemoryPollStore;
	let service: PollService;

	beforeEach(() => {
		store = new InMemoryPollStore();
		service = new PollService(store);
	});

	describe("addOption", () => {
		it("should add a new option and return confirmation message", () => {
			expect(service.addOption("Egypt")).toBe(
				'Option "Egypt" added to the poll.',
			);
		});

		it("should return error message for empty option", () => {
			expect(service.addOption("")).toBe("Option cannot be empty.");
		});

		it("should return error message for duplicate option", () => {
			service.addOption("Turkey");
			expect(service.addOption("Turkey")).toBe(
				'Option "Turkey" already exists.',
			);
		});

		it("should map each option to a Set", () => {
			service.addOption("Turkey");
			expect(store.getVoters("Turkey")).toBeInstanceOf(Set);
		});
	});

	describe("vote", () => {
		it("should return error when option does not exist", () => {
			expect(service.vote("Nigeria", "traveler2")).toBe(
				'Option "Nigeria" does not exist.',
			);
		});

		it("should register a vote and return confirmation", () => {
			service.addOption("Malaysia");
			expect(service.vote("Malaysia", "traveler1")).toBe(
				'Voter traveler1 voted for "Malaysia".',
			);
		});

		it("should update the Set of voters for an option", () => {
			service.addOption("Malaysia");
			service.vote("Malaysia", "traveler1");
			expect(store.getVoters("Malaysia")?.has("traveler1")).toBe(true);
		});

		it("should prevent duplicate voting", () => {
			service.addOption("Algeria");
			service.vote("Algeria", "traveler1");
			expect(service.vote("Algeria", "traveler1")).toBe(
				'Voter traveler1 has already voted for "Algeria".',
			);
		});

		it("should not increase Set size on duplicate vote", () => {
			service.addOption("Algeria");
			service.vote("Algeria", "traveler1");
			service.vote("Algeria", "traveler1");
			expect(store.getVoters("Algeria")?.size).toBe(1);
		});

		it("should allow multiple voters on the same option", () => {
			service.addOption("Turkey");
			service.vote("Turkey", "traveler1");
			service.vote("Turkey", "traveler2");
			expect(store.getVoters("Turkey")?.size).toBe(2);
		});
	});
});
