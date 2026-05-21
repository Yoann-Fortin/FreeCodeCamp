import type { ConversionRule } from "./rule.ts";

export class HeadingRule implements ConversionRule {
	apply(line: string): string {
		return line.replace(/^(#{1,6})\s+(.+)$/, (_: string, hashes: string, text: string): string => {
			const level = hashes.length;
			return `<h${level}>${text}</h${level}>`;
		});
	}
}
