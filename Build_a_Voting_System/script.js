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
}

function displayResults() {
}
