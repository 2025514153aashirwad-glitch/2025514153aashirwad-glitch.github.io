#!/bin/bash
# Final W1 Ring renders for the 2-minute film. CPU here; add --gpu on Kaggle or Colab.
cd "$(dirname "$0")"; mkdir -p out/final/stills out/final/black_sweep out/final/white_turn
for s in white_macro black_hero black_inner black_led white_profile white_flat; do
  blender -b -P ring_film.py -- --shot $s --out out/final/stills/$s.png --samples 112 --res 1920x1080 >/dev/null 2>&1 && echo "still $s $(date +%H:%M)"; done
blender -b -P ring_film.py -- --shot black_sweep --anim 90 --out out/final/black_sweep/#### --samples 28 --res 1280x720 >/dev/null 2>&1 && echo "anim black_sweep $(date +%H:%M)"
blender -b -P ring_film.py -- --shot white_turn --anim 90 --out out/final/white_turn/#### --samples 28 --res 1280x720 >/dev/null 2>&1 && echo "anim white_turn $(date +%H:%M)"
