import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createContext, Script } from "node:vm";
import { beforeEach, describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptFile = resolve(__dirname, "script.js");

function loadScript() {
	const scriptContent = readFileSync(scriptFile, "utf-8");
	const wrapped = `(function() {\n${scriptContent}\nreturn { BankAccount, myAccount: typeof myAccount !== "undefined" ? myAccount : undefined };\n})()`;
	const sandbox = {};
	createContext(sandbox);
	const script = new Script(wrapped);
	return script.runInNewContext(sandbox);
}

describe("Bank Account", () => {
	let BankAccount;
	let account;

	beforeEach(() => {
		const ctx = loadScript();
		BankAccount = ctx.BankAccount;
		account = new BankAccount();
	});

	it("should define a class named BankAccount", () => {
		expect(typeof BankAccount).toBe("function");
	});

	it("should have balance 0 and empty transactions by default", () => {
		expect(account.balance).toBe(0);
		expect(account.transactions).toEqual([]);
	});

	it("should have a deposit method", () => {
		expect(typeof account.deposit).toBe("function");
	});

	it("should have a withdraw method", () => {
		expect(typeof account.withdraw).toBe("function");
	});

	it("should have a checkBalance method", () => {
		expect(typeof account.checkBalance).toBe("function");
	});

	it("should have a listAllDeposits method", () => {
		expect(typeof account.listAllDeposits).toBe("function");
	});

	it("should have a listAllWithdrawals method", () => {
		expect(typeof account.listAllWithdrawals).toBe("function");
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
});
