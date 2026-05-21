import type { PadConfig } from "../domain/pad-config.ts";

export function createPad(config: PadConfig): HTMLButtonElement {
	const button = document.createElement("button");
	button.type = "button";
	button.classList.add("drum-pad");
	button.id = config.name.toLowerCase().replace(/[' ]/gu, "-");
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

export function createAllPads(configs: PadConfig[]): HTMLButtonElement[] {
	return configs.map((config) => createPad(config));
}
