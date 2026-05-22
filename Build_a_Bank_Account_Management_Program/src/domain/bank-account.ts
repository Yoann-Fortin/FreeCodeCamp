import type { TransactionStore } from "../ports/transaction-store.ts";
import { DepositCommand } from "./deposit-command.ts";
import { AccountMemento } from "./memento.ts";
import { MementoCaretaker } from "./memento-caretaker.ts";
import { PositiveAmountValidator } from "./positive-amount-validator.ts";
import { SufficientBalanceValidator } from "./sufficient-balance-validator.ts";
import type { Validator } from "./validator.ts";
import { WithdrawCommand } from "./withdraw-command.ts";

const DEPOSIT_ERROR = "Deposit amount must be greater than zero.";
const WITHDRAW_ERROR = "Insufficient balance or invalid amount.";

function buildDepositChain(): Validator {
	return new PositiveAmountValidator(DEPOSIT_ERROR);
}

function buildWithdrawChain(): Validator {
	const positiveCheck = new PositiveAmountValidator(WITHDRAW_ERROR);
	positiveCheck.setNext(new SufficientBalanceValidator(WITHDRAW_ERROR));
	return positiveCheck;
}

export class BankAccount {
	balance = 0;
	private readonly store: TransactionStore;
	private readonly caretaker = new MementoCaretaker();
	private readonly depositChain = buildDepositChain();
	private readonly withdrawChain = buildWithdrawChain();

	constructor(store: TransactionStore) {
		this.store = store;
	}

	private saveSnapshot(): void {
		this.caretaker.save(new AccountMemento(this.balance, this.store.all()));
	}

	deposit(amount: number): string {
		const error = this.depositChain.validate({ amount, balance: this.balance });
		if (error) {
			return error;
		}
		this.saveSnapshot();
		this.store.execute(new DepositCommand(this, amount));
		return `Successfully deposited $${amount}. New balance: $${this.balance}`;
	}

	withdraw(amount: number): string {
		const error = this.withdrawChain.validate({
			amount,
			balance: this.balance,
		});
		if (error) {
			return error;
		}
		this.saveSnapshot();
		this.store.execute(new WithdrawCommand(this, amount));
		return `Successfully withdrew $${amount}. New balance: $${this.balance}`;
	}

	undoLast(): string {
		const command = this.store.undoLast();
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
		const amounts = this.store.filterByType("deposit").map((c) => c.amount);
		return `Deposits: ${amounts.join(",")}`;
	}

	listAllWithdrawals(): string {
		const amounts = this.store.filterByType("withdraw").map((c) => c.amount);
		return `Withdrawals: ${amounts.join(",")}`;
	}

	get transactions(): { type: string; amount: number }[] {
		return this.store.all().map((c) => ({ type: c.type, amount: c.amount }));
	}
}
