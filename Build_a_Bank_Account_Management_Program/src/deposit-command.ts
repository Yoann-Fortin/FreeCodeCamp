import type { Command } from "./command.ts";

export class DepositCommand implements Command {
	readonly type = "deposit" as const;
	readonly amount: number;
	private readonly account: { balance: number };

	constructor(account: { balance: number }, amount: number) {
		this.account = account;
		this.amount = amount;
	}

	execute(): void {
		this.account.balance += this.amount;
	}

	undo(): void {
		this.account.balance -= this.amount;
	}
}
