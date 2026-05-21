import type { ConversionRule } from "./rule.ts";

export class BlockquoteRule implements ConversionRule {
	apply(line: string): string {
		return line.replace(/^>\s+(.+)$/, "<blockquote>$1</blockquote>");
	}
}
