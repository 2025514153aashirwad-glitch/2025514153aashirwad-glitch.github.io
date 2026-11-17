#!/bin/sh
# Renders every plate the film needs. Safe to re-run: finished frames are skipped.
cd "$(dirname "$0")"; P=../plates
run() { blender -b --factory-startup -P soul_shots.py -- "$@" 2>&1 | grep -E "FRAMETIME|Traceback|Error|DONE"; }
run reform thermal $P/reform-thermal --frames 1-66
run build thermal $P/build-thermal --frames 1-44
run gen thermal $P/gen-thermal --frames 1-44
for s in reform build gen loop finale; do run $s metal $P/$s-metal; done
echo QUEUE_DONE
