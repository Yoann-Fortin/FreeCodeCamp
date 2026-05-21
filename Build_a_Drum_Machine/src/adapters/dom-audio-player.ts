import type { AudioPlayer } from "../ports/audio-player.ts";

const AUDIO_START_TIME = 0;

export class DomAudioPlayer implements AudioPlayer {
	private readonly root: Document;

	constructor(root: Document = document) {
		this.root = root;
	}

	play(key: string): void {
		const audio = this.root.querySelector(`#${key}`) as HTMLAudioElement | null;
		if (!audio) {
			return;
		}
		audio.currentTime = AUDIO_START_TIME;
		audio.play();
	}
}
