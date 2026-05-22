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
});
