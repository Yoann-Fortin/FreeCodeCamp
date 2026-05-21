import type { ConversionRule } from "./rule.ts";

export class LinkRule implements ConversionRule {
	apply(line: string): string {
		return line.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
	}
}
