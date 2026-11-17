#!/bin/sh
# Brings each Blender plate folder to 24 fps at 1920x1080. Plates from the Kaggle GPU notebook carry fps.txt;
# 24 fps plates are only resized; 8 or 12 fps plates are motion-interpolated first. Light sharpening on both.
cd "$(dirname "$0")"
for d in plates/*-metal plates/*-thermal; do
  [ -d "$d" ] || continue; n=$(basename $d)
  if [ -f $d/fps.txt ]; then fps=$(cat $d/fps.txt); else case $n in reform-thermal) fps=12;; *) fps=8;; esac; fi
  ext=png; ls $d/0001.jpg >/dev/null 2>&1 && ext=jpg
  if [ "$fps" = 24 ]; then vf="scale=1920:1080:flags=lanczos,unsharp=5:5:0.35:5:5:0"
  else vf="minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=1920:1080:flags=lanczos,unsharp=5:5:0.55:5:5:0"; fi
  mkdir -p plates24/$n
  ffmpeg -loglevel error -y -framerate $fps -i $d/%04d.$ext -vf "$vf" -q:v 2 -start_number 1 plates24/$n/%04d.jpg && echo "$n $(ls plates24/$n | wc -l)"
done
