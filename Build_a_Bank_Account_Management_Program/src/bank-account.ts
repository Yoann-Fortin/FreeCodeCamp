import { DepositCommand } from "./deposit-command.ts";
import { AccountMemento } from "./memento.ts";
import { MementoCaretaker } from "./memento-caretaker.ts";
import { TransactionHistory } from "./transaction-history.ts";
import { WithdrawCommand } from "./withdraw-command.ts";

export class BankAccount {
	balance = 0;
	private readonly history = new TransactionHistory();
	private readonly caretaker = new MementoCaretaker();

	private saveSnapshot(): void {
		this.caretaker.save(new AccountMemento(this.balance, this.history.all()));
	}

	deposit(amount: number): string {
		if (amount <= 0) {
			return "Deposit amount must be greater than zero.";
		}
		this.saveSnapshot();
		this.history.execute(new DepositCommand(this, amount));
		return `Successfully deposited $${amount}. New balance: $${this.balance}`;
	}

	withdraw(amount: number): string {
		if (amount <= 0 || amount > this.balance) {
			return "Insufficient balance or invalid amount.";
		}
		this.saveSnapshot();
		this.history.execute(new WithdrawCommand(this, amount));
		return `Successfully withdrew $${amount}. New balance: $${this.balance}`;
	}

	undoLast(): string {
		const command = this.history.undoLast();
		if (!command) {
			return "No transactions to undo.";
		}
		return `Undid ${command.type} of $${command.amount}. New balance: $${this.balance}`;
	}

	restoreLastSnapshot(): string {
		const snapshot = this.caretaker.restore();
		if (!snapshot) {
			return "No snapshot to restore.";
		}
		this.balance = snapshot.balance;
		return `Restored to balance: $${this.balance}`;
	}

	checkBalance(): string {
		return `Current balance: $${this.balance}`;
	}

	listAllDeposits(): string {
		const amounts = this.history.filterByType("deposit").map((c) => c.amount);
		return `Deposits: ${amounts.join(",")}`;
	}

	listAllWithdrawals(): string {
		const amounts = this.history.filterByType("withdraw").map((c) => c.amount);
		return `Withdrawals: ${amounts.join(",")}`;
	}

	get transactions(): { type: string; amount: number }[] {
		return this.history.all().map((c) => ({ type: c.type, amount: c.amount }));
	}
}
