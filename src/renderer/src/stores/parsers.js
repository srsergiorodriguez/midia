import { readable } from 'svelte/store';
import { choice, sequenceOf, possibly, char, regex, sepBy1 } from 'arcsecond';

const b36 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const b16 = b36.slice(0, 16);
const int36 = str => b36.indexOf(`${str.toLowerCase()}`);
const int16 = str => { const p36 = int36(str); return p36 < 0 ? 0 : p36 > 15 ? 15 : p36 }
const notes = ['C','c','D','d','E','F','f','G','g','A','a','B'];
const effects = ["dis","wah","che","fee","del","rev","pha","vib","com","vol","lim"]; // hip lop

const b16Choice = choice(b16.map(d => regex(new RegExp(`^${d}`, "i"))));
const noteChoice = choice(notes.map(d => char(d)));
const effectChoice = choice(effects.map(d => regex(new RegExp(`^${d}`, "i"))));
const binary = choice([char("0"), char("1")]);

const parser = sepBy1(char(';'))(choice([
  // EFFECT
  sequenceOf([
    effectChoice, // effect
    b16Choice, // wet
    b16Choice // depth
  ]).map(r => ({
    type: "effect",
    name: r[0],
    w: int16(r[1]),
    v: int16(r[2])
  })),
  // ENVELOPE
  sequenceOf([
    b16Choice, // channel
    regex(/^env/i), // keyword
    b16Choice, // attack
    b16Choice, // decay
    b16Choice, // sustain
    b16Choice, // release
  ]).map(r => ({
    type: "envelope",
    channel: int16(r[0]),
    attack: int16(r[2]),
    decay: int16(r[3]),
    sustain: int16(r[4]),
    release: int16(r[5])
  })),
  // NOTE
  sequenceOf([
    b16Choice, // channel
    b16Choice, // octave
    noteChoice, // note
    possibly(b16Choice), // velocity
    possibly(b16Choice) // length
  ]).map(r => ({
    type: "note",
    channel: int16(r[0]),
    octave: int16(r[1]),
    note: r[2],
    sharp: r[2] == r[2].toLowerCase() ? "#" : "",
    velocity: r[3] !== null ? int16(r[3]) / 15 : 1,
    length: r[4] !== null ? int16(r[4]) / 15 : 0.2
  })),
  // SAMPLE
  sequenceOf([
    b16Choice, // channel
    regex(/^s/i), // keyword
    possibly(b16Choice), // velocity
    possibly(b16Choice), // length
  ]).map(r => ({
    type: "sample",
    channel: int16(r[0]),
    velocity: r[2] !== null ? int16(r[2]) / 15 : 1,
    length: r[3] !== null ? int16(r[3]) / 15 : 0.2,
  }))
]));

export const udpParser = readable(str => parser.run(str));