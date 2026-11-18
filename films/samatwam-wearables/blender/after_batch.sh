cd "$(dirname "$0")"
blender -b -P ring_film.py -- --shot black_led --out out/final/stills/black_led.png --samples 112 --res 1920x1080 >/dev/null 2>&1 && echo "still black_led $(date +%H:%M)"
