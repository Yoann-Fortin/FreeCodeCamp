import type { AccountMemento } from "./memento.ts";

export class MementoCaretaker {
	private readonly snapshots: AccountMemento[] = [];

	save(memento: AccountMemento): void {
		this.snapshots.push(memento);
	}

	restore(): AccountMemento | undefined {
		return this.snapshots.pop();
	}

	history(): AccountMemento[] {
		return [...this.snapshots];
	}
}
