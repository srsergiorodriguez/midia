import { writable } from 'svelte/store';

export let notes = writable([]);
export let envelopes = writable([]);
export let samples = writable([]);
export let effects = writable([]);
