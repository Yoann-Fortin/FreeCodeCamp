import { RegexRule } from "./rule.ts";

export class AsteriskItalicRule extends RegexRule {
	protected pattern = /\*(.+?)\*/g;
	protected replacement = "<em>$1</em>";
}

export class UnderscoreItalicRule extends RegexRule {
	protected pattern = /_(.+?)_/g;
	protected replacement = "<em>$1</em>";
}
