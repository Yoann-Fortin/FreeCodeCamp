const AUDIO_START_TIME = 0;

export interface Command {
	execute: () => void;
}

export class PlayPadCommand implements Command {
	private readonly audio: HTMLAudioElement;
	private readonly name: string;
	private readonly onPlay: (name: string) => void;

	constructor(
		audio: HTMLAudioElement,
		name: string,
		onPlay: (name: string) => void,
	) {
		this.audio = audio;
		this.name = name;
		this.onPlay = onPlay;
	}

	execute(): void {
		this.audio.currentTime = AUDIO_START_TIME;
		this.audio.play();
		this.onPlay(this.name);
	}
}
