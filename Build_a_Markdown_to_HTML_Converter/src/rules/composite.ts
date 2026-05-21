import type { ConversionRule } from "./rule.ts";

export class CompositeRule implements ConversionRule {
	private readonly rules: ConversionRule[];

	constructor(...rules: ConversionRule[]) {
		this.rules = rules;
	}

	apply(line: string): string {
		return this.rules.reduce((result, rule) => rule.apply(result), line);
	}
}
