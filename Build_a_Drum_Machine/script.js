"use strict";
(() => {
  // Build_a_Drum_Machine/src/adapters/dom-audio-player.ts
  var AUDIO_START_TIME = 0;
  var DomAudioPlayer = class {
    constructor(root = document) {
      this.root = root;
    }
    play(key) {
      const audio = this.root.querySelector(`#${key}`);
      if (!audio) {
        return;
      }
      audio.currentTime = AUDIO_START_TIME;
      audio.play();
    }
  };

  // Build_a_Drum_Machine/src/adapters/dom-pad-factory.ts
  function createPad(config) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("drum-pad");
    button.id = config.name.toLowerCase().replace(/[' ]/gu, "-");
    button.textContent = config.key;
    const audio = document.createElement("audio");
    audio.classList.add("clip");
    audio.id = config.key;
    audio.src = config.src;
    const track = document.createElement("track");
    track.kind = "captions";
    audio.appendChild(track);
    button.appendChild(audio);
    return button;
  }
  function createAllPads(configs) {
    return configs.map((config) => createPad(config));
  }

  // Build_a_Drum_Machine/src/domain/command.ts
  var PlayPadCommand = class {
    constructor(audioPlayer, key, name, onPlay) {
      this.audioPlayer = audioPlayer;
      this.key = key;
      this.name = name;
      this.onPlay = onPlay;
    }
    execute() {
      this.audioPlayer.play(this.key);
      this.onPlay(this.name);
    }
  };

  // Build_a_Drum_Machine/src/domain/command-history.ts
  var CommandHistory = class {
    constructor() {
      this.history = [];
    }
    execute(command) {
      command.execute();
      this.history.push(command);
    }
    getHistory() {
      return [...this.history];
    }
  };

  // Build_a_Drum_Machine/src/domain/event-bus.ts
  var EventBus = class {
    constructor() {
      this.listeners = /* @__PURE__ */ new Map();
    }
    on(event, listener) {
      const existing = this.listeners.get(event) ?? [];
      existing.push(listener);
      this.listeners.set(event, existing);
    }
    emit(event, data) {
      const listeners = this.listeners.get(event) ?? [];
      for (const listener of listeners) {
        listener(data);
      }
    }
  };

  // Build_a_Drum_Machine/src/domain/drum-machine.ts
  var DrumMachine = class {
    constructor(pads, audioPlayer) {
      this.pads = pads;
      this.audioPlayer = audioPlayer;
      this.commandHistory = new CommandHistory();
      this.bus = new EventBus();
    }
    trigger(key) {
      const pad = this.pads.find((p) => p.key === key);
      if (!pad) {
        return;
      }
      const command = new PlayPadCommand(
        this.audioPlayer,
        key,
        pad.name,
        (name) => this.bus.emit("pad-played", name)
      );
      this.commandHistory.execute(command);
    }
    hasKey(key) {
      return this.pads.some((p) => p.key === key);
    }
    getHistory() {
      return this.commandHistory.getHistory();
    }
  };

  // Build_a_Drum_Machine/src/script.ts
  var CDN = "https://cdn.freecodecamp.org/curriculum/drum";
  var PADS = [
    { key: "Q", name: "Heater 1", src: `${CDN}/Heater-1.mp3` },
    { key: "W", name: "Heater 2", src: `${CDN}/Heater-2.mp3` },
    { key: "E", name: "Heater 3", src: `${CDN}/Heater-3.mp3` },
    { key: "A", name: "Heater 4", src: `${CDN}/Heater-4_1.mp3` },
    { key: "S", name: "Clap", src: `${CDN}/Heater-6.mp3` },
    { key: "D", name: "Open-HH", src: `${CDN}/Dsc_Oh.mp3` },
    { key: "Z", name: "Kick-n'-Hat", src: `${CDN}/Kick_n_Hat.mp3` },
    { key: "X", name: "Kick", src: `${CDN}/RP4_KICK_1.mp3` },
    { key: "C", name: "Closed-HH", src: `${CDN}/Cev_H2.mp3` }
  ];
  var padBank = document.querySelector("#pad-bank");
  if (padBank) {
    for (const button of createAllPads(PADS)) {
      padBank.appendChild(button);
    }
  }
  var machine = new DrumMachine(PADS, new DomAudioPlayer());
  var display = document.querySelector("#display");
  if (display) {
    machine.bus.on("pad-played", (name) => {
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
  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    if (machine.hasKey(key)) {
      machine.trigger(key);
    }
  });
})();
