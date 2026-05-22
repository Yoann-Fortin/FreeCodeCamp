interface Transaction {
	type: "deposit" | "withdraw";
	amount: number;
}

export class BankAccount {
	balance = 0;
	transactions: Transaction[] = [];

	deposit(amount: number): string {
		if (amount <= 0) {
			return "Deposit amount must be greater than zero.";
		}
		this.transactions.push({ type: "deposit", amount });
		this.balance += amount;
		return `Successfully deposited $${amount}. New balance: $${this.balance}`;
	}

	withdraw(amount: number): string {
		if (amount <= 0 || amount > this.balance) {
			return "Insufficient balance or invalid amount.";
		}
		this.transactions.push({ type: "withdraw", amount });
		this.balance -= amount;
		return `Successfully withdrew $${amount}. New balance: $${this.balance}`;
	}

	checkBalance(): string {
		return `Current balance: $${this.balance}`;
	}

	listAllDeposits(): string {
		const deposits = this.transactions
			.filter((t) => t.type === "deposit")
			.map((t) => t.amount);
		return `Deposits: ${deposits.join(",")}`;
	}

	listAllWithdrawals(): string {
		const withdrawals = this.transactions
			.filter((t) => t.type === "withdraw")
			.map((t) => t.amount);
		return `Withdrawals: ${withdrawals.join(",")}`;
	}
}
