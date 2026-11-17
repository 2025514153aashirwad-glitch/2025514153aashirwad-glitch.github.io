#!/bin/sh
# One command: narrator, sound events, picture, score + mix, subtitles, master. Needs the Lemo-Opuscar library (LIB)
# with core + voice tiers, and ffmpeg 7+. On a machine without a GPU, export LEMO_ANGLE=swiftshader.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}; export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
cd "$LIB"
"$LIB/.venv/bin/python" core/tts/tts.py "$HERE/vo/lines.json" "$HERE/vo/"
node core/render/events.mjs "$HERE"
node core/render/video.mjs "$HERE" --fps 30 --workers 4 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/cues.json" "$HERE/samatwam-01-the-line-of-a-work.srt"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/samatwam-01-the-line-of-a-work.mp4" 30 1
