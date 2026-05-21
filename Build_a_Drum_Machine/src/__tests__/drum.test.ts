import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";

const TOTAL_PADS = 9;
const PAD_KEYS = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlFile = resolve(__dirname, "..", "..", "index.html");
const scriptFile = resolve(__dirname, "..", "..", "script.js");

interface DrumWindow {
	document: Document;
	Event: typeof Event;
	KeyboardEvent: typeof KeyboardEvent;
}

let window: DrumWindow;

function loadPage(): DrumWindow {
	const html = readFileSync(htmlFile, "utf-8");
	const dom = new JSDOM(html, { runScripts: "dangerously" });
	const scriptContent = readFileSync(scriptFile, "utf-8");
	dom.window.eval(scriptContent);
	return dom.window as unknown as DrumWindow;
}

function query(selector: string): Element | null {
	return window.document.querySelector(selector);
}

function queryAll(selector: string): NodeListOf<Element> {
	return window.document.querySelectorAll(selector);
}

function stubAudioPlay(): string[] {
	const playedIds: string[] = [];
	for (const audio of queryAll("audio.clip")) {
		(audio as HTMLAudioElement).play = (): Promise<void> => {
			playedIds.push(audio.id);
			return Promise.resolve();
		};
	}
	return playedIds;
}

function clickPad(selector: string): void {
	(query(selector) as HTMLButtonElement).click();
}

function getDisplayText(): string {
	return query("#display")!.textContent!;
}

function assertElement(selector: string, tagName: string): void {
	it(`should have a ${tagName.toLowerCase()} element matching '${selector}'`, () => {
		const element = query(selector);
		expect(element).not.toBeNull();
		expect(element!.tagName).toBe(tagName);
	});
}

describe("Drum Machine", () => {
	beforeEach(() => {
		window = loadPage();
	});

	describe("structure", () => {
		assertElement("#drum-machine", "DIV");
		assertElement("#drum-machine #pad-bank", "DIV");
		assertElement("#drum-machine #display", "P");

		it("should have nine drum-pad buttons inside #pad-bank", () => {
			const pads = queryAll("#pad-bank .drum-pad");
			expect(pads.length).toBe(TOTAL_PADS);
			for (const pad of pads) {
				expect(pad.tagName).toBe("BUTTON");
			}
		});

		it("should have drum pads with letters Q, W, E, A, S, D, Z, X, C in order", () => {
			const pads = queryAll("#pad-bank .drum-pad");
			const letters = [...pads].map((pad) => pad.textContent!.trim());
			expect(letters).toEqual(PAD_KEYS);
		});

		it("should have an audio element with class 'clip' inside each drum-pad", () => {
			for (const pad of queryAll("#pad-bank .drum-pad")) {
				const audio = pad.querySelector("audio.clip");
				expect(audio).not.toBeNull();
				expect(audio!.hasAttribute("src")).toBe(true);
				expect(audio!.id).toBe(pad.textContent!.trim());
			}
		});
	});

	describe("behavior", () => {
		it("should play audio when a drum-pad is clicked", () => {
			const playedIds = stubAudioPlay();
			clickPad(".drum-pad");
			expect(playedIds.length).toBe(1);
		});

		it("should play audio when the corresponding key is pressed", () => {
			const playedIds = stubAudioPlay();
			window.document.dispatchEvent(
				new window.KeyboardEvent("keydown", { key: "q" }),
			);
			expect(playedIds).toContain("Q");
		});

		it("should display the drum name when a pad is triggered", () => {
			stubAudioPlay();
			clickPad(".drum-pad");
			expect(getDisplayText().length).toBeGreaterThan(0);
		});

		it("should display unique names for each pad", () => {
			stubAudioPlay();
			const names = new Set<string>();
			for (const pad of queryAll(".drum-pad")) {
				(pad as HTMLButtonElement).click();
				names.add(getDisplayText());
			}
			expect(names.size).toBe(TOTAL_PADS);
		});
	});
});
