export interface ValidationContext {
	amount: number;
	balance: number;
}

export abstract class Validator {
	private next: Validator | null = null;

	setNext(validator: Validator): Validator {
		this.next = validator;
		return validator;
	}

	validate(context: ValidationContext): string | null {
		const error = this.check(context);
		if (error) {
			return error;
		}
		if (this.next) {
			return this.next.validate(context);
		}
		return null;
	}

	protected abstract check(context: ValidationContext): string | null;
}
