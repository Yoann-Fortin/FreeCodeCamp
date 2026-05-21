import { RegexRule } from "./rule.ts";

export class LinkRule extends RegexRule {
	protected pattern = /\[(.+?)\]\((.+?)\)/g;
	protected replacement = '<a href="$2">$1</a>';
}
