#!/bin/bash

echo "🎶 Setting up Southside School of Music dev environment..."

# Make folders
mkdir -p game docs assets tools build

# Optional: install itch.io butler for builds
if ! command -v butler &> /dev/null
then
    echo "Installing Butler (for itch.io builds)..."
    curl -L -o butler.zip https://broth.itch.ovh/butler/darwin-amd64/head/archive.zip
    unzip butler.zip -d tools/butler
    chmod +x tools/butler/butler
    echo 'export PATH="$PWD/tools/butler:$PATH"' >> ~/.bash_profile
    echo "🔧 Butler installed. Restart terminal or run 'source ~/.bash_profile'"
fi

echo "✅ Project folders ready. Link GameMaker Studio to /game/"
