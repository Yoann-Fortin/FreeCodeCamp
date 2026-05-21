import type { ConversionRule } from "./rule.ts";

export class ImageRule implements ConversionRule {
	apply(line: string): string {
		return line.replace(/!\[(.+?)\]\((.+?)\)/g, '<img alt="$1" src="$2">');
	}
}
