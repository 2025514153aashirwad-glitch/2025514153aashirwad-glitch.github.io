#!/bin/sh
# Picture-only master. After the plates exist (sh blender/queue.sh): plates to 24 fps, picture, then a fine film grain.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=${LIB:-$HOME/lemo-opuscar}; export LIB; cd "$LIB"
sh "$HERE/plates24.sh"
node core/render/video.mjs "$HERE" --fps 24 --workers 2 --out "$HERE/out/video.mp4"
ffmpeg -loglevel error -y -i "$HERE/out/video.mp4" -vf "noise=alls=5:allf=t,format=yuv420p" \
  -c:v libx264 -preset slow -crf 15 -tune film -movflags +faststart -an "$HERE/samatva-the-vessel-and-the-light.mp4"
