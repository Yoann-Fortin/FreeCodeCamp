import { EventBus } from "./event-bus.ts";
import { type PadConfig, PadFactory } from "./pad-factory.ts";

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

const bus = new EventBus();

const display = document.getElementById("display");
if (display) {
	bus.on("pad-played", (name: string) => {
		display.textContent = name;
	});
}

const padBank = document.getElementById("pad-bank");
if (padBank) {
	for (const button of PadFactory.createAll(PADS)) {
		padBank.appendChild(button);
	}
}

function playPad(key: string): void {
	const audio = document.getElementById(key) as HTMLAudioElement | null;
	if (!audio) return;
	audio.currentTime = 0;
	audio.play();
	const pad = PADS.find((p) => p.key === key);
	if (pad) {
		bus.emit("pad-played", pad.name);
	}
}

document.querySelectorAll(".drum-pad").forEach((pad) => {
	pad.addEventListener("click", () => {
		const key = pad.textContent?.trim();
		if (key) playPad(key);
	});
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
	const key = e.key.toUpperCase();
	if (PADS.some((p) => p.key === key)) {
		playPad(key);
	}
});
