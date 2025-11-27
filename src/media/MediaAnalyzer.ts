export interface AnalysisWindow {
  start: number;
  end: number;
}

export class MediaAnalyzer {
  extractWaveform(_window: AnalysisWindow): number[] {
    return [];
  }

  extractSpectrogram(_window: AnalysisWindow): number[][] {
    return [];
  }
}
