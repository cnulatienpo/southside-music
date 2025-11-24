import WaveSurfer from "wavesurfer.js";

export type VisualizerMode = "audio" | "visual" | "dual";

type VisualStyle = "bars" | "circles";

export class VisualizerEngine {
  private readonly containerId: string;
  private readonly audioElementId?: string;
  private container?: HTMLElement;
  private waveformContainer?: HTMLDivElement;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D | null;
  private waveSurfer?: WaveSurfer;
  private analyser?: AnalyserNode;
  private dataArray?: Uint8Array;
  private rafId?: number;
  private mode: VisualizerMode;
  private visualStyle: VisualStyle = "bars";

  constructor(options: {
    containerId: string;
    audioElementId?: string;
    initialMode?: VisualizerMode;
  }) {
    this.containerId = options.containerId;
    this.audioElementId = options.audioElementId;
    this.mode = options.initialMode ?? "dual";
  }

  public async init(): Promise<void> {
    try {
      const container = document.getElementById(this.containerId);
      if (!container) {
        throw new Error(`Visualizer container with id "${this.containerId}" not found.`);
      }
      this.container = container;

      this.waveformContainer = document.createElement("div");
      this.waveformContainer.className = "visualizer-waveform";
      container.appendChild(this.waveformContainer);

      this.canvas = document.createElement("canvas");
      this.canvas.className = "visualizer-canvas";
      container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();

      this.waveSurfer = WaveSurfer.create({
        container: this.waveformContainer,
        waveColor: "#555555",
        progressColor: "#ffffff",
        height: 120,
        responsive: true,
        normalize: true,
        backend: "WebAudio",
      });

      if (this.audioElementId) {
        const audioElement = document.getElementById(this.audioElementId);
        if (!audioElement) {
          throw new Error(`Audio element with id "${this.audioElementId}" not found.`);
        }
        if (!(audioElement instanceof HTMLAudioElement)) {
          throw new Error("Provided audio element id does not reference an HTMLAudioElement.");
        }
        this.attachAudioElement(audioElement);
      }

      this.setupAnalyser();
      this.setMode(this.mode);
    } catch (error) {
      console.error("VisualizerEngine init failed:", error);
    }
  }

  public setMode(mode: VisualizerMode): void {
    this.mode = mode;

    if (this.waveformContainer) {
      this.waveformContainer.style.display = mode === "visual" ? "none" : "block";
    }

    if (this.canvas) {
      this.canvas.style.display = mode === "audio" ? "none" : "block";
      if (mode === "audio" && this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  public async loadAudioFromUrl(url: string): Promise<void> {
    try {
      if (!this.waveSurfer) {
        throw new Error("WaveSurfer has not been initialized. Call init() first.");
      }
      await this.waveSurfer.load(url);
    } catch (error) {
      console.error("Failed to load audio from URL:", error);
    }
  }

  public attachAudioElement(audioElement: HTMLAudioElement): void {
    if (!this.waveSurfer) {
      throw new Error("WaveSurfer has not been initialized. Call init() first.");
    }
    this.waveSurfer.setOptions({ media: audioElement });
  }

  public start(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    const render = () => {
      this.renderFrame();
      this.rafId = requestAnimationFrame(render);
    };
    this.rafId = requestAnimationFrame(render);
  }

  public stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  public destroy(): void {
    this.stop();
    if (this.waveSurfer) {
      this.waveSurfer.destroy();
      this.waveSurfer = undefined;
    }

    if (this.canvas && this.container) {
      this.container.removeChild(this.canvas);
    }

    if (this.waveformContainer && this.container) {
      this.container.removeChild(this.waveformContainer);
    }

    this.canvas = undefined;
    this.ctx = undefined;
    this.analyser = undefined;
    this.dataArray = undefined;
    this.waveformContainer = undefined;
  }

  public initThreeScene(): void {
    console.log("Three.js scene hook not implemented yet.");
  }

  public initPixiScene(): void {
    console.log("Pixi.js scene hook not implemented yet.");
  }

  private resizeCanvas(): void {
    if (!this.canvas || !this.container) return;
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  private setupAnalyser(): void {
    if (!this.waveSurfer) return;
    const backend = (this.waveSurfer as unknown as { backend?: any }).backend;
    if (backend?.analyser) {
      this.analyser = backend.analyser as AnalyserNode;
    } else if (backend?.ac && backend?.gainNode) {
      const analyser = backend.ac.createAnalyser();
      backend.gainNode.connect(analyser);
      analyser.connect(backend.ac.destination);
      this.analyser = analyser;
    }

    if (this.analyser) {
      this.analyser.fftSize = 2048;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }
  }

  private renderFrame(): void {
    if (!this.analyser || !this.dataArray || !this.canvas || !this.ctx) {
      return;
    }

    if (this.mode === "audio") {
      return;
    }

    this.resizeCanvas();
    this.analyser.getByteFrequencyData(this.dataArray);

    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = "#111111";
    this.ctx.fillRect(0, 0, width, height);

    if (this.visualStyle === "bars") {
      this.renderBars(width, height);
    } else {
      this.renderCircles(width, height);
    }
  }

  private renderBars(width: number, height: number): void {
    if (!this.ctx || !this.dataArray) return;

    const barWidth = (width / this.dataArray.length) * 2;
    let x = 0;

    for (let i = 0; i < this.dataArray.length; i += 1) {
      const barHeight = (this.dataArray[i] / 255) * height;
      this.ctx.fillStyle = `rgb(${this.dataArray[i]}, 200, 200)`;
      this.ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  private renderCircles(width: number, height: number): void {
    if (!this.ctx || !this.dataArray) return;

    const avg = this.dataArray.reduce((sum, value) => sum + value, 0) / this.dataArray.length;
    const radius = (avg / 255) * Math.min(width, height) * 0.4;
    const centerX = width / 2;
    const centerY = height / 2;

    this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, avg / 255)})`;
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, Math.max(radius, 10), 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.fillStyle = `rgba(100, 150, 255, ${Math.min(1, avg / 255)})`;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, Math.max(radius * 0.6, 6), 0, Math.PI * 2);
    this.ctx.fill();
  }
}

/*
Example usage:

import { VisualizerEngine } from "./visualizerEngine";

const visualizer = new VisualizerEngine({
  containerId: "visualizer-container",
  audioElementId: "audio-element",
});

visualizer.init().then(() => {
  visualizer.loadAudioFromUrl("/music/sample.mp3");
  visualizer.setMode("dual");
  visualizer.start();
});
*/
