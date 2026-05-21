import { DomAudioPlayer } from "./adapters/dom-audio-player.ts";
import { createAllPads } from "./adapters/dom-pad-factory.ts";
import { DrumMachine } from "./domain/drum-machine.ts";
import type { PadConfig } from "./domain/pad-config.ts";

const CDN = "https://cdn.freecodecamp.org/curriculum/drum";

const PADS: PadConfig[] = [
	{ key: "Q", name: "Heater 1", src: `${CDN}/Heater-1.mp3` },
	{ key: "W", name: "Heater 2", src: `${CDN}/Heater-2.mp3` },
	{ key: "E", name: "Heater 3", src: `${CDN}/Heater-3.mp3` },
	{ key: "A", name: "Heater 4", src: `${CDN}/Heater-4_1.mp3` },
	{ key: "S", name: "Clap", src: `${CDN}/Heater-6.mp3` },
	{ key: "D", name: "Open-HH", src: `${CDN}/Dsc_Oh.mp3` },
	{ key: "Z", name: "Kick-n'-Hat", src: `${CDN}/Kick_n_Hat.mp3` },
	{ key: "X", name: "Kick", src: `${CDN}/RP4_KICK_1.mp3` },
	{ key: "C", name: "Closed-HH", src: `${CDN}/Cev_H2.mp3` },
];

const padBank = document.querySelector("#pad-bank");
if (padBank) {
	for (const button of createAllPads(PADS)) {
		padBank.appendChild(button);
	}
}

const machine = new DrumMachine(PADS, new DomAudioPlayer());

const display = document.querySelector("#display");
if (display) {
	machine.bus.on("pad-played", (name: string) => {
		display.textContent = name;
	});
}

for (const pad of document.querySelectorAll(".drum-pad")) {
	pad.addEventListener("click", () => {
		const key = pad.textContent?.trim();
		if (key) {
			machine.trigger(key);
		}
	});
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
	const key = e.key.toUpperCase();
	if (machine.hasKey(key)) {
		machine.trigger(key);
	}
});
