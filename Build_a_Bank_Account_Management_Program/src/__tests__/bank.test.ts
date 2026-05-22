import { beforeEach, describe, expect, it } from "vitest";
import { BankAccount } from "../bank-account.ts";

describe("BankAccount", () => {
	let account: BankAccount;

	beforeEach(() => {
		account = new BankAccount();
	});

	it("should have balance 0 and empty transactions by default", () => {
		expect(account.balance).toBe(0);
		expect(account.transactions).toEqual([]);
	});

	describe("deposit", () => {
		it("should deposit and return success message", () => {
			expect(account.deposit(100)).toBe(
				"Successfully deposited $100. New balance: $100",
			);
		});

		it("should reject negative amount", () => {
			expect(account.deposit(-50)).toBe(
				"Deposit amount must be greater than zero.",
			);
		});

		it("should reject zero amount", () => {
			expect(account.deposit(0)).toBe(
				"Deposit amount must be greater than zero.",
			);
		});
	});

	describe("withdraw", () => {
		it("should reject when balance insufficient", () => {
			account.deposit(100);
			expect(account.withdraw(150)).toBe(
				"Insufficient balance or invalid amount.",
			);
		});

		it("should reject negative amount", () => {
			expect(account.withdraw(-50)).toBe(
				"Insufficient balance or invalid amount.",
			);
		});

		it("should reject zero amount", () => {
			expect(account.withdraw(0)).toBe(
				"Insufficient balance or invalid amount.",
			);
		});

		it("should withdraw and return success message", () => {
			account.deposit(200);
			expect(account.withdraw(150)).toBe(
				"Successfully withdrew $150. New balance: $50",
			);
		});
	});

	describe("checkBalance", () => {
		it("should return formatted balance", () => {
			account.deposit(200);
			expect(account.checkBalance()).toBe("Current balance: $200");
		});
	});

	describe("listAllDeposits", () => {
		it("should return all deposits formatted", () => {
			account.deposit(10);
			account.deposit(35);
			account.deposit(90);
			expect(account.listAllDeposits()).toBe("Deposits: 10,35,90");
		});
	});

	describe("listAllWithdrawals", () => {
		it("should return all withdrawals formatted", () => {
			account.deposit(200);
			account.withdraw(20);
			account.withdraw(50);
			account.withdraw(100);
			expect(account.listAllWithdrawals()).toBe("Withdrawals: 20,50,100");
		});
	});

	describe("undoLast", () => {
		it("should undo last deposit", () => {
			account.deposit(100);
			expect(account.undoLast()).toBe("Undid deposit of $100. New balance: $0");
			expect(account.balance).toBe(0);
		});

		it("should undo last withdrawal", () => {
			account.deposit(200);
			account.withdraw(50);
			expect(account.undoLast()).toBe(
				"Undid withdraw of $50. New balance: $200",
			);
			expect(account.balance).toBe(200);
		});

		it("should return message when no transactions to undo", () => {
			expect(account.undoLast()).toBe("No transactions to undo.");
		});
	});
});
