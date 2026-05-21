interface PadConfig {
	key: string;
	name: string;
}

const PADS: PadConfig[] = [
	{ key: "Q", name: "Heater 1" },
	{ key: "W", name: "Heater 2" },
	{ key: "E", name: "Heater 3" },
	{ key: "A", name: "Heater 4" },
	{ key: "S", name: "Clap" },
	{ key: "D", name: "Open-HH" },
	{ key: "Z", name: "Kick-n'-Hat" },
	{ key: "X", name: "Kick" },
	{ key: "C", name: "Closed-HH" },
];

function playPad(key: string): void {
	const audio = document.getElementById(key) as HTMLAudioElement | null;
	if (!audio) return;
	audio.currentTime = 0;
	audio.play();
	const pad = PADS.find((p) => p.key === key);
	if (pad) {
		const display = document.getElementById("display");
		if (display) display.textContent = pad.name;
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
