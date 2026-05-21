export interface ConversionRule {
	apply(line: string): string;
}
