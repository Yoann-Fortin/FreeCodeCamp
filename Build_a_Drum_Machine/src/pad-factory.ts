export interface PadConfig {
	key: string;
	name: string;
	src: string;
}

export class PadFactory {
	static create(config: PadConfig): HTMLButtonElement {
		const button = document.createElement("button");
		button.type = "button";
		button.classList.add("drum-pad");
		button.id = config.name.toLowerCase().replace(/[' ]/g, "-");
		button.textContent = config.key;

		const audio = document.createElement("audio");
		audio.classList.add("clip");
		audio.id = config.key;
		audio.src = config.src;

		const track = document.createElement("track");
		track.kind = "captions";
		audio.appendChild(track);

		button.appendChild(audio);
		return button;
	}

	static createAll(configs: PadConfig[]): HTMLButtonElement[] {
		return configs.map((config) => PadFactory.create(config));
	}
}
