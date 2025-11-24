#!/usr/bin/env bash
set -euo pipefail

# Southside School of Music — Full Environment Install Script
# This script sets up a full Electron-based audio/visual/music-engine environment
# with deep analysis, visualizers, synthesis, waveform tools, FFT analyzers, AI,
# and supporting utilities.

# 1. Initialize project
if [ ! -f package.json ]; then
  echo "package.json not found. Initializing new npm project..."
  npm init -y
else
  echo "package.json detected. Skipping npm init."
fi

# 2. Install Electron
npm install --save-dev electron

# 3. Install Web Audio & Synthesis Libraries
npm install \
  tone \
  howler \
  soundjs \
  webmidi \
  midi-player-js

# 4. Install Audio Analysis Libraries
npm install \
  essentia.js \
  meyda \
  dsp.js \
  audio-decode \
  audio-buffer-utils \
  pitchfinder \
  ml5

# 5. Install Visualization Tools
npm install \
  wavesurfer.js \
  @wavesurfer/regions \
  @wavesurfer/spectrogram \
  three \
  pixi.js \
  p5 \
  canvas \
  d3

# 6. Install UI Frameworks (optional but useful)
npm install \
  react \
  react-dom \
  @mui/material \
  @emotion/react \
  @emotion/styled \
  tailwindcss

# 7. Install YouTube / Media Embeds
npm install \
  youtube-player \
  soundcloud \
  ytdl-core

# 8. Install Real-Time Sync Tools
npm install \
  socket.io \
  eventemitter3 \
  rxjs

# 9. Install Data + Storage
npm install \
  lowdb \
  better-sqlite3 \
  localforage \
  nanoid

# 10. Install Utility Libraries
npm install \
  lodash \
  dayjs \
  uuid \
  jszip

# 11. Install Machine Learning / AI Bridges
npm install \
  axios \
  openai \
  @xenova/transformers \
  brain.js

# 12. Install Audio Workstation / Music Tools
npm install \
  scribbletune \
  tonal \
  midiconvert \
  webamp

# 13. Install Dev Tools
npm install --save-dev \
  electron-builder \
  nodemon \
  parcel \
  webpack \
  webpack-cli \
  eslint

# 14. Create project structure
mkdir -p src src/audio src/visual src/ui src/lib src/game src/modes src/data public

echo "Southside School of Music environment installed successfully."
