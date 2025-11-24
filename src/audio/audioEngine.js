import * as Tone from "tone";
import { Howl, Howler } from "howler";
import Meyda from "meyda";
import audioBufferUtils from "audio-buffer-utils";
import audioDecode from "audio-decode";
import * as Pitchfinder from "pitchfinder";

class AudioEngine {
  constructor() {
    // Core audio components
    this.audioContext = null;
    this.masterGain = null;
    this.analyser = null;

    // Tone.js components
    this.toneReady = false;
    this.noteSynth = null;

    // Sample playback
    this.sampleMap = new Map();

    // Analysis helpers
    this.meydaAnalyzer = null;
  }

  // Initialize Web Audio, Tone.js, and Meyda
  async init() {
    if (typeof window === "undefined") {
      console.error("AudioEngine: window is not available; cannot initialize audio.");
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.error("AudioEngine: Web Audio API is not supported in this environment.");
      return;
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContextClass();
    }

    if (!this.masterGain) {
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 1;
    }

    if (!this.analyser) {
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
    }

    // Connect masterGain -> analyser -> destination
    try {
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } catch (error) {
      console.error("AudioEngine: Error connecting audio graph", error);
    }

    // Sync Tone.js with the existing AudioContext
    try {
      const toneContext = new Tone.Context({ rawContext: this.audioContext });
      Tone.setContext(toneContext);
    } catch (error) {
      console.warn("AudioEngine: Unable to bind Tone.js to existing AudioContext", error);
    }

    // Create a simple Tone Synth for note playback
    if (!this.noteSynth) {
      try {
        this.noteSynth = new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5 },
        });
        this.noteSynth.connect(Tone.Destination);
      } catch (error) {
        console.error("AudioEngine: Failed to initialize Tone.Synth", error);
      }
    }

    // Prepare Meyda analyzer if available
    if (Meyda && Meyda.createMeydaAnalyzer) {
      try {
        this.meydaAnalyzer = Meyda.createMeydaAnalyzer({
          audioContext: this.audioContext,
          source: this.analyser,
          bufferSize: this.analyser.fftSize,
          featureExtractors: ["rms"],
        });
      } catch (error) {
        console.warn("AudioEngine: Unable to create Meyda analyzer", error);
      }
    }

    // Reset Tone readiness; must be started on a user gesture
    this.toneReady = false;
  }

  // Resume suspended contexts and unlock Tone.js on user gesture
  async resumeContext() {
    try {
      if (this.audioContext && this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.warn("AudioEngine: Unable to resume AudioContext", error);
    }

    if (!this.toneReady) {
      try {
        await Tone.start();
        this.toneReady = true;
      } catch (error) {
        console.warn("AudioEngine: Tone.js failed to start", error);
      }
    }
  }

  // Expose the analyser node for visualization / training tools
  getAnalyserNode() {
    return this.analyser;
  }

  // Play a raw frequency for a specified duration
  playTone(freqHz, durationMs, options = {}) {
    if (!this.noteSynth) {
      console.warn("AudioEngine: noteSynth is not initialized. Call init() first.");
      return;
    }

    if (options.type && this.noteSynth.oscillator) {
      this.noteSynth.oscillator.type = options.type;
    }

    const durationSeconds = (durationMs || 0) / 1000;
    this.noteSynth.triggerAttackRelease(freqHz, durationSeconds || undefined);
  }

  // Play a musical note name like "C4" or "A3"
  playNote(noteName, durationMs, options = {}) {
    if (!this.noteSynth) {
      console.warn("AudioEngine: noteSynth is not initialized. Call init() first.");
      return;
    }

    if (options.type && this.noteSynth.oscillator) {
      this.noteSynth.oscillator.type = options.type;
    }

    const durationSeconds = (durationMs || 0) / 1000;
    this.noteSynth.triggerAttackRelease(noteName, durationSeconds || undefined);
  }

  // Load an audio sample using Howler and store it under a key
  loadSample(key, urlOrPath) {
    if (!key || !urlOrPath) {
      console.warn("AudioEngine: loadSample requires a key and url/path.");
      return;
    }

    try {
      const howl = new Howl({
        src: [urlOrPath],
        html5: true,
      });
      this.sampleMap.set(key, howl);
    } catch (error) {
      console.error(`AudioEngine: Failed to load sample for key ${key}`, error);
    }
  }

  // Play a previously loaded sample
  playSample(key, options = {}) {
    if (!this.sampleMap.has(key)) {
      console.warn(`AudioEngine: Sample not found for key ${key}`);
      return;
    }

    const howl = this.sampleMap.get(key);
    if (typeof options.volume === "number") {
      howl.volume(options.volume);
    }

    try {
      howl.play();
    } catch (error) {
      console.error(`AudioEngine: Error playing sample for key ${key}`, error);
    }
  }

  // Stop a specific sample by key
  stopSample(key) {
    const howl = this.sampleMap.get(key);
    if (howl) {
      try {
        howl.stop();
      } catch (error) {
        console.error(`AudioEngine: Error stopping sample for key ${key}`, error);
      }
    }
  }

  // Stop all active transports and samples
  stopAll() {
    try {
      Tone.Transport.stop();
    } catch (error) {
      console.warn("AudioEngine: Unable to stop Tone.Transport", error);
    }

    this.sampleMap.forEach((howl, key) => {
      try {
        howl.stop();
      } catch (error) {
        console.error(`AudioEngine: Error stopping sample for key ${key}`, error);
      }
    });
  }

  // Connect an external media element (e.g., video or audio tag) to the analyser chain
  connectExternalMediaElement(mediaElement) {
    if (!this.audioContext) {
      console.warn("AudioEngine: audioContext is not initialized.");
      return;
    }

    try {
      const sourceNode = this.audioContext.createMediaElementSource(mediaElement);
      sourceNode.connect(this.masterGain);
    } catch (error) {
      console.warn("AudioEngine: Unable to connect media element", error);
    }
  }

  // Compute current RMS value using Meyda or manual analysis
  getCurrentRMS() {
    if (this.meydaAnalyzer) {
      try {
        const rms = this.meydaAnalyzer.get("rms");
        if (typeof rms === "number") return rms;
      } catch (error) {
        console.warn("AudioEngine: Meyda RMS extraction failed", error);
      }
    }

    if (!this.analyser) return null;

    const bufferLength = this.analyser.fftSize;
    const timeDomainData = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(timeDomainData);

    let sumSquares = 0;
    for (let i = 0; i < bufferLength; i += 1) {
      sumSquares += timeDomainData[i] * timeDomainData[i];
    }

    return Math.sqrt(sumSquares / bufferLength);
  }

  // Estimate current pitch using Pitchfinder utilities
  getCurrentPitchEstimate() {
    if (!this.analyser) return null;

    const bufferLength = this.analyser.fftSize;
    const timeDomainData = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(timeDomainData);

    try {
      const detectPitch = Pitchfinder.YIN({ sampleRate: this.audioContext?.sampleRate });
      const frequency = detectPitch(timeDomainData);
      return typeof frequency === "number" ? frequency : null;
    } catch (error) {
      console.warn("AudioEngine: Pitch detection failed", error);
      return null;
    }
  }

  // Tear down all audio resources
  async destroy() {
    try {
      this.stopAll();
    } catch (error) {
      console.warn("AudioEngine: Error while stopping all sounds", error);
    }

    if (this.noteSynth) {
      try {
        this.noteSynth.dispose();
      } catch (error) {
        console.warn("AudioEngine: Error disposing noteSynth", error);
      }
    }

    if (this.meydaAnalyzer) {
      try {
        this.meydaAnalyzer.stop();
      } catch (error) {
        console.warn("AudioEngine: Error stopping Meyda analyzer", error);
      }
    }

    this.sampleMap.forEach((howl) => {
      try {
        howl.stop();
      } catch (error) {
        console.warn("AudioEngine: Error stopping Howl instance during destroy", error);
      }
    });
    this.sampleMap.clear();

    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch (error) {
        console.warn("AudioEngine: Error disconnecting masterGain", error);
      }
    }

    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch (error) {
        console.warn("AudioEngine: Error disconnecting analyser", error);
      }
    }

    if (this.audioContext) {
      try {
        await this.audioContext.close();
      } catch (error) {
        console.warn("AudioEngine: Error closing AudioContext", error);
      }
    }

    this.audioContext = null;
    this.masterGain = null;
    this.analyser = null;
    this.noteSynth = null;
    this.meydaAnalyzer = null;
    this.toneReady = false;
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
export { AudioEngine };

/*
Example usage:

import audioEngine from "../audio/audioEngine";

(async () => {
  await audioEngine.init();
  await audioEngine.resumeContext();

  audioEngine.playNote("C4", 500);
  audioEngine.loadSample("kick", "./samples/kick.wav");
  audioEngine.playSample("kick");
})();
*/
