// Theatre.js (timeline) + three.js (render), bundled for the headless renderer.
import { getProject, types } from '@theatre/core';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
window.THEATRE = { getProject, types }; window.THREE = THREE; window.RoundedBoxGeometry = RoundedBoxGeometry; window.RoomEnvironment = RoomEnvironment;
// Build a Theatre project state from plain keyframe lists: { object: { prop: [[seconds, value], ...] } }, eased in and out.
window.theatreState = (sheetId, length, tracks) => {
  const tracksByObject = {}; let n = 0;
  for (const [obj, props] of Object.entries(tracks)) { const trackData = {}, trackIdByPropPath = {};
    for (const [prop, kfs] of Object.entries(props)) { const id = 'tr' + (n++); trackIdByPropPath[JSON.stringify([prop])] = id;
      trackData[id] = { type: 'BasicKeyframedTrack', keyframes: kfs.map(([position, value, h], k) => ({ id: id + 'k' + k, position, value, connectedRight: true, type: 'bezier', handles: h || [.58, 1, .42, 0] })) }; }
    tracksByObject[obj] = { trackData, trackIdByPropPath }; }
  return { sheetsById: { [sheetId]: { staticOverrides: { byObject: {} }, sequence: { type: 'PositionalSequence', length, subUnitsPerUnit: 60, tracksByObject } } }, definitionVersion: '0.4.0', revisionHistory: [] };
};
