import type { Command } from "../domain/command.ts";

export interface TransactionStore {
	execute: (command: Command) => void;
	undoLast: () => Command | undefined;
	filterByType: (type: "deposit" | "withdraw") => Command[];
	all: () => Command[];
}
