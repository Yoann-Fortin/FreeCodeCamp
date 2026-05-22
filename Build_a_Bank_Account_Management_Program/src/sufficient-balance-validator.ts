import { type ValidationContext, Validator } from "./validator.ts";

export class SufficientBalanceValidator extends Validator {
	private readonly errorMessage: string;

	constructor(errorMessage: string) {
		super();
		this.errorMessage = errorMessage;
	}

	protected check(context: ValidationContext): string | null {
		if (context.amount > context.balance) {
			return this.errorMessage;
		}
		return null;
	}
}
