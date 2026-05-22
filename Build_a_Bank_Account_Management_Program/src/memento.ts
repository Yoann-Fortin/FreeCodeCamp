import type { Command } from "./command.ts";

export class AccountMemento {
	readonly balance: number;
	readonly transactions: { type: string; amount: number }[];

	constructor(balance: number, transactions: Command[]) {
		this.balance = balance;
		this.transactions = transactions.map((c) => ({
			type: c.type,
			amount: c.amount,
		}));
	}
}
