"use strict";
(() => {
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
  var PadFactory = class _PadFactory {
    static create(config) {
      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("drum-pad");
      button.id = config.name.toLowerCase().replace(/[' ]/g, "-");
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
    static createAll(configs) {
      return configs.map((config) => _PadFactory.create(config));
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
  var bus = new EventBus();
  var display = document.getElementById("display");
  if (display) {
    bus.on("pad-played", (name) => {
      display.textContent = name;
    });
  }
  var padBank = document.getElementById("pad-bank");
  if (padBank) {
    for (const button of PadFactory.createAll(PADS)) {
      padBank.appendChild(button);
    }
  }
  function playPad(key) {
    const audio = document.getElementById(key);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    const pad = PADS.find((p) => p.key === key);
    if (pad) {
      bus.emit("pad-played", pad.name);
    }
  }
  document.querySelectorAll(".drum-pad").forEach((pad) => {
    pad.addEventListener("click", () => {
      const key = pad.textContent?.trim();
      if (key) playPad(key);
    });
  });
  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    if (PADS.some((p) => p.key === key)) {
      playPad(key);
    }
  });
})();
