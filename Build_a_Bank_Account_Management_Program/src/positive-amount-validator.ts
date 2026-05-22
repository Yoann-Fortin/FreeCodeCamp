import { type ValidationContext, Validator } from "./validator.ts";

export class PositiveAmountValidator extends Validator {
	private readonly errorMessage: string;

	constructor(errorMessage: string) {
		super();
		this.errorMessage = errorMessage;
	}

	protected check(context: ValidationContext): string | null {
		if (context.amount <= 0) {
			return this.errorMessage;
		}
		return null;
	}
}
