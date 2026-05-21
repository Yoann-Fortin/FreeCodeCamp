import type { ConversionRule } from "./rule.ts";

export class BoldRule implements ConversionRule {
	apply(line: string): string {
		return line
			.replace(/\*\*(.+)\*\*/g, "<strong>$1</strong>")
			.replace(/__(.+?)__/g, "<strong>$1</strong>");
	}
}
