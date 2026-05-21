import { RegexRule } from "./rule.ts";

export class BlockquoteRule extends RegexRule {
	protected pattern = /^>\s+(.+)$/;
	protected replacement = "<blockquote>$1</blockquote>";
}
