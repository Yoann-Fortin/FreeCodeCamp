import type { Command } from "./command.ts";

export class CommandHistory {
	private readonly history: Command[] = [];

	execute(command: Command): void {
		command.execute();
		this.history.push(command);
	}

	getHistory(): Command[] {
		return [...this.history];
	}
}
