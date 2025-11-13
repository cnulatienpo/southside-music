#!/bin/bash
echo "Installing Southside Music App dependencies..."

# Install dependencies
npm install --legacy-peer-deps

# Install Electron & React
npm install electron electron-builder concurrently wait-on --save-dev
npx create-react-app . --template typescript
npm install react-router-dom

# Clean up
rm -rf src/App.css src/App.test.tsx src/logo.svg src/reportWebVitals.ts src/setupTests.ts
touch src/data/theoryCards.json

echo "Setup complete. Run with: npm run dev"
