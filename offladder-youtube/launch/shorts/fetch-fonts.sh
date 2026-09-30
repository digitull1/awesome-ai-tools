#!/usr/bin/env sh
# Download OffLadder's brand fonts (all SIL Open Font License) from Google Fonts' repository.
set -e
cd "$(dirname "$0")"
mkdir -p fonts
for f in archivoblack/ArchivoBlack-Regular.ttf hind/Hind-Regular.ttf hind/Hind-Medium.ttf hind/Hind-SemiBold.ttf \
         hind/Hind-Bold.ttf instrumentserif/InstrumentSerif-Italic.ttf; do
  curl -sSfL -o "fonts/$(basename "$f")" "https://raw.githubusercontent.com/google/fonts/main/ofl/$f"
done
echo "fonts ready in $(pwd)/fonts"
