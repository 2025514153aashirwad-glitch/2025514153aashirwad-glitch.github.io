#!/bin/sh
# One command after the plates exist: narrator, plates to 24 fps, picture, score + mix, subtitles, master.
# Plates: sh blender/queue.sh (Blender 4.5, about 3.5 h on a 4-core CPU; minutes on a GPU).
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=${LIB:-$HOME/lemo-opuscar}; export LIB; cd "$LIB"
"$LIB/.venv/bin/python" core/tts/tts.py "$HERE/vo/lines.json" "$HERE/vo/"
sh "$HERE/plates24.sh"
node core/render/video.mjs "$HERE" --fps 24 --workers 2 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/cues.json" "$HERE/samatva-the-vessel-and-the-light.srt"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/samatva-the-vessel-and-the-light.mp4" 24 1
