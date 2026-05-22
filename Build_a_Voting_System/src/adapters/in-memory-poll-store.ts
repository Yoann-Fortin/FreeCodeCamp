import type { PollStore } from "../ports/poll-store.ts";

export class InMemoryPollStore implements PollStore {
	private readonly store = new Map<string, Set<string>>();

	hasOption(option: string): boolean {
		return this.store.has(option);
	}

	addOption(option: string): void {
		this.store.set(option, new Set());
	}

	getVoters(option: string): Set<string> | undefined {
		return this.store.get(option);
	}

	options(): Iterable<[string, Set<string>]> {
		return this.store.entries();
	}
}
