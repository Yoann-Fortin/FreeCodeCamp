import type { Command } from "../domain/command.ts";
import type { TransactionStore } from "../ports/transaction-store.ts";

export class InMemoryTransactionStore implements TransactionStore {
	private readonly history: Command[] = [];

	execute(command: Command): void {
		command.execute();
		this.history.push(command);
	}

	undoLast(): Command | undefined {
		const command = this.history.pop();
		if (command) {
			command.undo();
		}
		return command;
	}

	filterByType(type: "deposit" | "withdraw"): Command[] {
		return this.history.filter((c) => c.type === type);
	}

	all(): Command[] {
		return [...this.history];
	}
}
