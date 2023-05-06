import { readable } from 'svelte/store';
import * as Tone from 'tone';

export const int36 = readable(str => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str.toLowerCase()}`));

function clamp(v, min, max) { return v < min ? min : v > max ? max : v }
function map(v, source, target) {return (target * v) / source}
function mapClamp(v, source, target, min = 0) {return clamp(map(v, source, target), min, target)}
function mapClamp16(v, target, min = 0) {return mapClamp(v, 16, target, min)};
function toHex(x) { return x.toString(16).toUpperCase() }

export const hex = readable(toHex);
export const validHex = readable(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);

export const composeSynthCode = readable(s => {
  return `${toHex(s.channel)} ${s.type.toUpperCase()}${s.modulation ? s.modulation.toUpperCase() : ".."}`
  // return `${toHex(s.channel)}${s.type.toUpperCase()}${s.modulation ? s.modulation.toUpperCase() : ".."}${toHex(s.attack)}${toHex(s.decay)}${toHex(s.sustain)}${toHex(s.release)}`
});

// export const composeEnvCode = readable(s => {
//   return `${s.name.toUpperCase()}${toHex(s.w)}${toHex(s.v)}`
//   // return `${s.name.toUpperCase()}${toHex(s.w)}${toHex(s.v)}`
// });

export const composeSamplerCode = readable(s => {
  return `${toHex(s.channel)} ${toHex(s.name)}`
});

export const waveCodes = readable({
  'si': 'sine', 'tr': 'triangle', 'sq': 'square', 'sw': 'sawtooth',
  '2i': 'sine2', '2r': 'triangle2', '2q': 'square2', '2w': 'sawtooth2',
  '4i': 'sine4', '4r': 'triangle4', '4q': 'square4', '4w': 'sawtooth4',
  '8i': 'sine8', '8r': 'triangle8', '8q': 'square8', '8w': 'sawtooth8'
});

export const synthModels = readable({
  am: (opts) => new Tone.AMSynth(opts),
  fm: (opts) => new Tone.FMSynth(opts),
  mo: (opts) => new Tone.MonoSynth(opts),
  me: (opts) => new Tone.MembraneSynth(opts)
});

export const setEnvelope = readable(obj => {
  const { attack, decay, sustain, release } = obj;
  return {
    attack: mapClamp16(attack, 0.5, 0.01),
    decay: mapClamp16(decay,0.5),
    sustain: mapClamp16(sustain, 1),
    release: mapClamp16(release, 1)
  }
})

// EFFECTS (saved in the store for access in any other component)

const chain = [
  // { name: 'bit', v: 0, w: 0, effect: new Tone.BitCrusher(4),update: function(v, w) {this.effect.bits = parseInt(mapClamp16(v, 8)); this.effect.wet.value = mapClamp16(w, 1)} },
  { name: 'dis', v: 0, w: 0, effect: new Tone.Distortion(0.05), update: function(v, w) {this.effect.distortion = mapClamp16(v, 10); this.effect.wet.value = mapClamp16(w, 1)} },
  { name: 'wah', v: 0, w: 0, effect: new Tone.AutoWah(100, 6, 0), update: function(v, w) {this.effect.octaves = parseInt(mapClamp16(v, 8)); this.effect.wet.value = mapClamp16(w, 1)} },
  { name: 'che', v: 0, w: 0, effect: new Tone.Chebyshev(1), update: function(v, w) { this.effect.order = parseInt(mapClamp16(v, 100, 1)); this.effect.wet.value = mapClamp16(w, 1)} },
  { name: 'fee', v: 0, w: 0, effect: new Tone.FeedbackDelay(0), update: function(v, w) {this.effect.delayTime.value = mapClamp16(v, 1); this.effect.wet.value = mapClamp16(w, 1)} },
  { name: 'del', v: 0, w: 0, effect: new Tone.PingPongDelay('4n', 0.2), update: function(v, w) {this.effect.delayTime.value = mapClamp16(v, 1); this.effect.wet.value = mapClamp16(w, 1)} },
  // { name: 'tre', v: 0, w: 0, effect: new Tone.Tremolo(), update: function(v, w) {this.effect.depth.value = mapClamp16(v, 1); this.effect.wet.value = mapClamp16(w, 1)} },
  { name: 'rev', v: 0, w: 0, effect: new Tone.JCReverb(0), update: function(v, w) {this.effect.roomSize.value = mapClamp16(v, 1); this.effect.wet.value = mapClamp16(w, 0.15)} },
  { name: 'pha', v: 0, w: 0, effect: new Tone.Phaser(0.5, 3, 350), update: function(v, w) {this.effect.octaves = mapClamp16(v, 4); this.effect.wet.value = mapClamp16(w, 1)} },
  { name: 'vib', v: 0, w: 0, effect: new Tone.Vibrato(), update: function(v, w) {this.effect.depth.value = mapClamp16(v, 1); this.effect.wet.value = mapClamp16(w, 1)} },
  // { name: 'cho', v: 0, w: 0, effect: new Tone.Chorus(4, 2.5, 0.5), update: function(v, w) {this.effect.depth = mapClamp16(v, 100); this.effect.wet.value = mapClamp16(w, 1)} },
  // { name: 'ste', v: 8, w: 0, effect: new Tone.StereoWidener(0.5), update: function(v, w) {this.effect.width.value = mapClamp16(v, 1) }},
  // { name: 'equ', v: 0, w: 0, effect: new Tone.EQ3(5, 0, 5), update: function(v, w) { this.effect.low.value = mapClamp16(v, 10); this.effect.high.value = mapClamp16(w, 10) } },
  { name: 'com', v: 15, w: 15, effect: new Tone.Compressor(-10, 10), update: function(v, w) {} },
  { name: 'vol', v: 8, w: 15, effect: new Tone.Volume(4), update: function(v, w) {this.effect.volume.value = mapClamp16(v, 8); this.effect.mute = w < 1 }},
  { name: 'lim', v: 15, w: 15, effect: new Tone.Limiter(-20), update: function(v, w) {} }
]

const effectsDef = [];
const effectsLook = {};
for (let i = 0; i < chain.length; i++) {
  chain[i].set = function(v, w) {
    chain[i].v = v;
    chain[i].w = w;
    this.update(v, w); // update actual tone effect
    this.code = `${this.name.toUpperCase()}`; // change code representation
    // this.code = `${this.name.toUpperCase()}${toHex(this.w)}${toHex(this.v)}`; // change code representation
  }
  chain[i].set(chain[i].v, chain[i].w); // initialize
  effectsDef[i] = {name: chain[i].name, v: chain[i].v, w: chain[i].w};
  effectsLook[chain[i].name] = i;
}
export const effectsDefaults = readable(effectsDef); // for reseting defaults
export const effectsLookup = readable(effectsLook); // for finding exact effect index
export const effectsChain = readable(chain);

// SYNTHS

let synthDef = [
  { model: 'am', type: '8i', modulation: 'si', harmonicity: 1.25 },
  { model: 'am', type: '8r', modulation: 'sw', harmonicity: 1.5 },
  { model: 'am', type: '8w', modulation: 'tr', harmonicity: 1.75 },
  { model: 'am', type: '8q', modulation: 'sq', armonicity: 2 },
  { model: 'am', type: '4i', modulation: '8q', harmonicity: 1.25 },
  { model: 'am', type: '8r', modulation: '8w', harmonicity: 1.5 },
  { model: 'fm', type: '4w', modulation: '8r', harmonicity: 1.75, modulationIndex: 10 },
  { model: 'fm', type: '4q', modulation: '8i', harmonicity: 1.2, modulationIndex: 20 },
  { model: 'fm', type: 'si', modulation: '4w', harmonicity: 0.5, modulationIndex: 30 },
  { model: 'fm', type: 'si', modulation: '8r', harmonicity: 2.5, modulationIndex: 40 },
  { model: 'mo', type: '4w', volume: -10 },
  { model: 'mo', type: '4i', volume: -10 },
  { model: 'me', type: 'si', octaves: 5, volume: -15 },
  { model: 'me', type: 'sw', octaves: 10, volume: -15 },
  { model: 'me', type: 'tr', octaves: 15, volume: -15 },
  { model: 'me', type: 'sq', octaves: 20, volume: -20 }
]
for (let i = 0; i < synthDef.length; i++) {
  synthDef[i] = {...synthDef[i], attack: 1, decay: 1, sustain: 8, release: 8 }  
}
export const synthDefaults = readable(synthDef);

// Samplers