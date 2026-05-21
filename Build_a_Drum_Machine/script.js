"use strict";
(() => {
  // Build_a_Drum_Machine/src/command.ts
  var AUDIO_START_TIME = 0;
  var PlayPadCommand = class {
    constructor(audio, name, onPlay) {
      this.audio = audio;
      this.name = name;
      this.onPlay = onPlay;
    }
    execute() {
      this.audio.currentTime = AUDIO_START_TIME;
      this.audio.play();
      this.onPlay(this.name);
    }
  };

  // Build_a_Drum_Machine/src/command-history.ts
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

  // Build_a_Drum_Machine/src/event-bus.ts
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

  // Build_a_Drum_Machine/src/pad-factory.ts
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
  var bus = new EventBus();
  var history = new CommandHistory();
  var display = document.querySelector("#display");
  if (display) {
    bus.on("pad-played", (name) => {
      display.textContent = name;
    });
  }
  var padBank = document.querySelector("#pad-bank");
  if (padBank) {
    for (const button of createAllPads(PADS)) {
      padBank.appendChild(button);
    }
  }
  function playPad(key) {
    const audio = document.querySelector(`#${key}`);
    if (!audio) {
      return;
    }
    const pad = PADS.find((p) => p.key === key);
    if (!pad) {
      return;
    }
    const command = new PlayPadCommand(
      audio,
      pad.name,
      (name) => bus.emit("pad-played", name)
    );
    history.execute(command);
  }
  for (const pad of document.querySelectorAll(".drum-pad")) {
    pad.addEventListener("click", () => {
      const key = pad.textContent?.trim();
      if (key) {
        playPad(key);
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    if (PADS.some((p) => p.key === key)) {
      playPad(key);
    }
  });
})();
