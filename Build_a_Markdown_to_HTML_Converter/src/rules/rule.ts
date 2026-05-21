export interface ConversionRule {
	apply(line: string): string;
}

export abstract class RegexRule implements ConversionRule {
	protected abstract pattern: RegExp;
	protected abstract replacement: string | ((...args: string[]) => string);

	apply(line: string): string {
		return line.replace(this.pattern, this.replacement as string);
	}
}
