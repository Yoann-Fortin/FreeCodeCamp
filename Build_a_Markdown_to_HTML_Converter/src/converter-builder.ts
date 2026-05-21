import type { ConversionRule } from "./rules/rule.ts";

export class ConverterBuilder {
	private readonly rules: ConversionRule[] = [];

	withRule(rule: ConversionRule): ConverterBuilder {
		this.rules.push(rule);
		return this;
	}

	build(): (input: string) => string {
		const rules = [...this.rules];
		return (input: string): string =>
			input
				.split("\n")
				.map((line: string): string =>
					rules.reduce((result, rule) => rule.apply(result), line),
				)
				.join("");
	}
}
