class BankAccount {
	constructor() {
		this.balance = 0;
		this.transactions = [];
	}

	deposit(amount) {
		if (amount <= 0) {
			return "Deposit amount must be greater than zero.";
		}
		this.transactions.push({ type: "deposit", amount });
		this.balance += amount;
		return `Successfully deposited $${amount}. New balance: $${this.balance}`;
	}

	withdraw(amount) {
		if (amount <= 0 || amount > this.balance) {
			return "Insufficient balance or invalid amount.";
		}
		this.transactions.push({ type: "withdraw", amount });
		this.balance -= amount;
		return `Successfully withdrew $${amount}. New balance: $${this.balance}`;
	}

	checkBalance() {
	}

	listAllDeposits() {
	}

	listAllWithdrawals() {
	}
}
