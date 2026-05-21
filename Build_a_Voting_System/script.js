var poll = new Map();

function addOption(option) {
	if (!option) {
		return "Option cannot be empty.";
	}
	if (poll.has(option)) {
		return `Option "${option}" already exists.`;
	}
	poll.set(option, new Set());
	return `Option "${option}" added to the poll.`;
}

function vote(option, voterId) {
	if (!poll.has(option)) {
		return `Option "${option}" does not exist.`;
	}
	var voters = poll.get(option);
	if (voters.has(voterId)) {
		return `Voter ${voterId} has already voted for "${option}".`;
	}
	voters.add(voterId);
	return `Voter ${voterId} voted for "${option}".`;
}

function displayResults() {
}
