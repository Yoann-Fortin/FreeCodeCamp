import { RegexRule } from "./rule.ts";

export class ImageRule extends RegexRule {
	protected pattern = /!\[(.+?)\]\((.+?)\)/g;
	protected replacement = '<img alt="$1" src="$2">';
}
