#!/bin/sh
# Smooths each Blender plate to 24 fps (motion-compensated), scales to 1920x1080 and sharpens lightly.
cd "$(dirname "$0")"
for d in plates/*-metal plates/*-thermal; do
  n=$(basename $d); [ -d "$d" ] || continue
  case $n in reform-thermal) fps=12;; *) fps=8;; esac
  mkdir -p plates24/$n
  ffmpeg -loglevel error -y -framerate $fps -i $d/%04d.png \
    -vf "minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=1920:1080:flags=lanczos,unsharp=5:5:0.55:5:5:0" \
    -q:v 2 -start_number 1 plates24/$n/%04d.jpg && echo "$n $(ls plates24/$n | wc -l)"
done
