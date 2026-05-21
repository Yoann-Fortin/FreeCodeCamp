import type { PadConfig } from "./pad-factory.ts";

export class DrumMediator {
	private readonly pads: PadConfig[];
	private readonly display: Element;

	constructor(pads: PadConfig[], display: Element) {
		this.pads = pads;
		this.display = display;
	}

	trigger(key: string): void {
		const audio = document.querySelector(`#${key}`) as HTMLAudioElement | null;
		if (!audio) {
			return;
		}
		const pad = this.pads.find((p) => p.key === key);
		if (!pad) {
			return;
		}
		audio.currentTime = 0;
		audio.play();
		this.display.textContent = pad.name;
	}
}
