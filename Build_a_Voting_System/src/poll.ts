export const poll = new Map<string, Set<string>>();

export function addOption(option: string): string {
	if (!option) {
		return "Option cannot be empty.";
	}
	if (poll.has(option)) {
		return `Option "${option}" already exists.`;
	}
	poll.set(option, new Set());
	return `Option "${option}" added to the poll.`;
}

export function vote(option: string, voterId: string): string {
	const voters = poll.get(option);
	if (!voters) {
		return `Option "${option}" does not exist.`;
	}
	if (voters.has(voterId)) {
		return `Voter ${voterId} has already voted for "${option}".`;
	}
	voters.add(voterId);
	return `Voter ${voterId} voted for "${option}".`;
}
