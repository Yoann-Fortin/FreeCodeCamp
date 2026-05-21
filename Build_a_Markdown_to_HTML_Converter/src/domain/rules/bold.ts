import { RegexRule } from "./rule.ts";

export class AsteriskBoldRule extends RegexRule {
	protected pattern = /\*\*(.+)\*\*/g;
	protected replacement = "<strong>$1</strong>";
}

export class UnderscoreBoldRule extends RegexRule {
	protected pattern = /__(.+?)__/g;
	protected replacement = "<strong>$1</strong>";
}
