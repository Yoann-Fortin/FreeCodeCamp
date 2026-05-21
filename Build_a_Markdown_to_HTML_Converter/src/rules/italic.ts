import type { ConversionRule } from "./rule.ts";

export class ItalicRule implements ConversionRule {
	apply(line: string): string {
		return line
			.replace(/\*(.+?)\*/g, "<em>$1</em>")
			.replace(/_(.+?)_/g, "<em>$1</em>");
	}
}
