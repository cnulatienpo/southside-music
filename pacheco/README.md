# Pacheco Notation Environment

Functional scaffold for the Pacheco Electron + React + TypeScript environment. Logic is stubbed; wiring is present.

## Install

```
npm install
```

## Development

Run renderer dev server, TypeScript compilation for main/preload, and Electron together:

```
npm run dev
```

## Build

Render React bundle and compile Electron entry:

```
npm run build
```

## Notes

- Electron renderer runs with contextIsolation enabled and no Node integration.
- Preload exposes file loading and a basic open dialog bridge.
- Engines emit events through simple subscription sets and return placeholders.
