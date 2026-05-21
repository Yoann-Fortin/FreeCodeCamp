type Listener = (data: string) => void;

export class EventBus {
	private readonly listeners: Map<string, Listener[]> = new Map();

	on(event: string, listener: Listener): void {
		const existing = this.listeners.get(event) ?? [];
		existing.push(listener);
		this.listeners.set(event, existing);
	}

	emit(event: string, data: string): void {
		const listeners = this.listeners.get(event) ?? [];
		for (const listener of listeners) {
			listener(data);
		}
	}
}
