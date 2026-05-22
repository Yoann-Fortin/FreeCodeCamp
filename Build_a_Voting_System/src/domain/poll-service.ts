import type { PollStore } from "../ports/poll-store.ts";

export class PollService {
	private readonly store: PollStore;

	constructor(store: PollStore) {
		this.store = store;
	}

	addOption(option: string): string {
		if (!option) {
			return "Option cannot be empty.";
		}
		if (this.store.hasOption(option)) {
			return `Option "${option}" already exists.`;
		}
		this.store.addOption(option);
		return `Option "${option}" added to the poll.`;
	}

	vote(option: string, voterId: string): string {
		const voters = this.store.getVoters(option);
		if (!voters) {
			return `Option "${option}" does not exist.`;
		}
		if (voters.has(voterId)) {
			return `Voter ${voterId} has already voted for "${option}".`;
		}
		voters.add(voterId);
		return `Voter ${voterId} voted for "${option}".`;
	}
}
