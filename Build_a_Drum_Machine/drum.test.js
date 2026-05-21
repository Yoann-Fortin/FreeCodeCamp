import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlFile = resolve(__dirname, "index.html");
const scriptFile = resolve(__dirname, "script.js");

function loadPage() {
	const html = readFileSync(htmlFile, "utf-8");
	const dom = new JSDOM(html, { runScripts: "dangerously" });
	const scriptContent = readFileSync(scriptFile, "utf-8");
	dom.window.eval(scriptContent);
	return dom.window;
}

describe("Drum Machine", () => {
	let window;

	beforeEach(() => {
		window = loadPage();
	});

	it("should have a div with id 'drum-machine'", () => {
		const drumMachine = window.document.querySelector("#drum-machine");
		expect(drumMachine).not.toBeNull();
		expect(drumMachine.tagName).toBe("DIV");
	});

	it("should have a div with id 'pad-bank' inside #drum-machine", () => {
		const padBank = window.document.querySelector("#drum-machine #pad-bank");
		expect(padBank).not.toBeNull();
		expect(padBank.tagName).toBe("DIV");
	});

	it("should have a p element with id 'display' inside #drum-machine", () => {
		const display = window.document.querySelector("#drum-machine #display");
		expect(display).not.toBeNull();
		expect(display.tagName).toBe("P");
	});

	it("should have nine drum-pad buttons inside #pad-bank", () => {
		const pads = window.document.querySelectorAll("#pad-bank .drum-pad");
		expect(pads.length).toBe(9);
		for (const pad of pads) {
			expect(pad.tagName).toBe("BUTTON");
		}
	});

	it("should have drum pads with letters Q, W, E, A, S, D, Z, X, C in order", () => {
		const pads = window.document.querySelectorAll("#pad-bank .drum-pad");
		const expected = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
		const letters = [...pads].map((pad) => pad.textContent.trim());
		expect(letters).toEqual(expected);
	});

	it("should have an audio element with class 'clip' inside each drum-pad", () => {
		const pads = window.document.querySelectorAll("#pad-bank .drum-pad");
		for (const pad of pads) {
			const audio = pad.querySelector("audio.clip");
			expect(audio).not.toBeNull();
			expect(audio.hasAttribute("src")).toBe(true);
			expect(audio.id).toBe(pad.textContent.trim());
		}
	});

	function stubAudioPlay() {
		const playedIds = [];
		const audios = window.document.querySelectorAll("audio.clip");
		for (const audio of audios) {
			audio.play = () => { playedIds.push(audio.id); };
		}
		return playedIds;
	}

	it("should play audio when a drum-pad is clicked", () => {
		const playedIds = stubAudioPlay();
		const pad = window.document.querySelector(".drum-pad");
		pad.click();
		expect(playedIds.length).toBe(1);
	});

	it("should play audio when the corresponding key is pressed", () => {
		const playedIds = stubAudioPlay();
		window.document.dispatchEvent(
			new window.KeyboardEvent("keydown", { key: "q" })
		);
		expect(playedIds).toContain("Q");
	});

	it("should display the drum name when a pad is triggered", () => {
		stubAudioPlay();
		const pad = window.document.querySelector(".drum-pad");
		pad.click();
		const display = window.document.querySelector("#display");
		expect(display.textContent.length).toBeGreaterThan(0);
	});

	it("should display unique names for each pad", () => {
		stubAudioPlay();
		const pads = window.document.querySelectorAll(".drum-pad");
		const names = new Set();
		for (const pad of pads) {
			pad.click();
			names.add(window.document.querySelector("#display").textContent);
		}
		expect(names.size).toBe(9);
	});
});
