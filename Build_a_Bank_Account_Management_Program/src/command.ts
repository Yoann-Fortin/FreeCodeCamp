export interface Command {
	execute: () => void;
	undo: () => void;
	type: "deposit" | "withdraw";
	amount: number;
}
