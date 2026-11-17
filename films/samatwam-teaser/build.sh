#!/bin/sh
# One command: narrator, picture, sound events, score + mix, master. Needs the Lemo-Opuscar library (LIB) with
# its core and voice tiers installed, and ffmpeg 7+.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
cd "$LIB"
"$LIB/.venv/bin/python" core/tts/tts.py "$HERE/vo/lines.json" "$HERE/vo/"
node core/render/events.mjs "$HERE"
node core/render/video.mjs "$HERE" --fps 60 --workers 4 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/cues.json" "$HERE/samatwam-teaser.srt"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/samatwam-teaser.mp4" 60 0
