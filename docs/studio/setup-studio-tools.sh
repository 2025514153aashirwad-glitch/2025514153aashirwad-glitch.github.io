# Samatwam studio tools (all free). Each step is skipped if present and never stops the session.
T=/home/user/tools; mkdir -p $T/assets/hdri $T/assets/tex $T/web $T/esrgan
export PATH=/root/.local/bin:$PATH
P="libcairo2-dev libpango1.0-dev pkg-config libgl1 libxi6 libxkbcommon0 libsm6 libxrender1 libxfixes3"
(apt-get update -q && apt-get install -y -q $P) >/dev/null 2>&1 || true
B=$T/blender-4.5.16-linux-x64
BU=https://download.blender.org/release/Blender4.5/blender-4.5.16-linux-x64.tar.xz
[ -x $B/blender ] || (curl -sSL $BU | tar xJ -C $T) || true
[ -x $B/blender ] && ln -sf $B/blender /usr/local/bin/blender
EU=https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0
EZ=realesrgan-ncnn-vulkan-20220424-ubuntu.zip
if [ ! -x $T/esrgan/realesrgan-ncnn-vulkan ]; then
  (cd $T/esrgan && curl -sSL -o r.zip $EU/$EZ && unzip -qo r.zip && rm r.zip) || true
  chmod +x $T/esrgan/realesrgan-ncnn-vulkan 2>/dev/null || true
fi
W="three postprocessing three-gpu-pathtracer @theatre/core lottie-web"
[ -d $T/web/node_modules/three ] || (cd $T/web && npm init -y >/dev/null && npm install -s --no-audit --no-fund --legacy-peer-deps $W) || true
[ -x $T/py/bin/python ] || uv venv -q -p 3.11 $T/py || true
uv pip install -q --python $T/py/bin/python manim opencolorio faster-whisper || true
[ -x $T/parler/bin/python ] || uv venv -q -p 3.11 $T/parler || true
uv pip install -q --python $T/parler/bin/python torch soundfile || true
uv pip install -q --python $T/parler/bin/python "git+https://github.com/huggingface/parler-tts.git" || true
H=https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k
for h in studio_small_09 brown_photostudio_02 kiara_1_dawn; do
  [ -s $T/assets/hdri/$h.hdr ] || curl -sSL -o $T/assets/hdri/$h.hdr $H/${h}_2k.hdr || true
done
for m in wood_table_001 marble_01 rusty_metal_02; do
  [ -s $T/assets/tex/$m.blend ] && continue
  U=$(curl -s https://api.polyhaven.com/files/$m | python3 -c "import sys,json;print(json.load(sys.stdin)['blend']['1k']['blend']['url'])") || continue
  curl -sSL -o $T/assets/tex/$m.blend "$U" || true
done
true
