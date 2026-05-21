import type { AudioPlayer } from "../ports/audio-player.ts";
import { PlayPadCommand } from "./command.ts";
import { CommandHistory } from "./command-history.ts";
import { EventBus } from "./event-bus.ts";
import type { PadConfig } from "./pad-config.ts";

export class DrumMachine {
	private readonly pads: PadConfig[];
	private readonly audioPlayer: AudioPlayer;
	private readonly commandHistory: CommandHistory;
	readonly bus: EventBus;

	constructor(pads: PadConfig[], audioPlayer: AudioPlayer) {
		this.pads = pads;
		this.audioPlayer = audioPlayer;
		this.commandHistory = new CommandHistory();
		this.bus = new EventBus();
	}

	trigger(key: string): void {
		const pad = this.pads.find((p) => p.key === key);
		if (!pad) {
			return;
		}
		const command = new PlayPadCommand(
			this.audioPlayer,
			key,
			pad.name,
			(name) => this.bus.emit("pad-played", name),
		);
		this.commandHistory.execute(command);
	}

	hasKey(key: string): boolean {
		return this.pads.some((p) => p.key === key);
	}

	getHistory(): import("./command.ts").Command[] {
		return this.commandHistory.getHistory();
	}
}
