import type { AudioPlayer } from "../ports/audio-player.ts";

export interface Command {
	execute: () => void;
}

export class PlayPadCommand implements Command {
	private readonly audioPlayer: AudioPlayer;
	private readonly key: string;
	private readonly name: string;
	private readonly onPlay: (name: string) => void;

	constructor(
		audioPlayer: AudioPlayer,
		key: string,
		name: string,
		onPlay: (name: string) => void,
	) {
		this.audioPlayer = audioPlayer;
		this.key = key;
		this.name = name;
		this.onPlay = onPlay;
	}

	execute(): void {
		this.audioPlayer.play(this.key);
		this.onPlay(this.name);
	}
}
