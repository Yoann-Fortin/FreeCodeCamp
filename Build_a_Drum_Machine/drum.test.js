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
});
