<script>
  import { onMount } from 'svelte';
  import { synthDefaults, waveCodes, synthModels, setEnvelope, composeSynthCode, effectsChain, validHex } from '../stores/helpers';
  import { notes, envelopes } from '../stores/msgs';
  import Cell from './Cell.svelte';

  let ready = false;
  const synthChannels = [];

  $: { playNotes($notes) }
  $: { adjustEnvelopes($envelopes) }

  function playNotes(notes_) {
    if (!ready) return
    for (let note of notes_) {
      if (synthChannels[note.channel].unmuted === 0 || note.velocity === 0) continue
      const name = `${note.note}${note.sharp}${note.octave}`;
      synthChannels[note.channel].synth.triggerAttackRelease(name, note.length, "+0", note.velocity)
      synthChannels[note.channel].active = true;
      setTimeout(() => { synthChannels[note.channel].active = false }, note.length * 1000);
    }
    $notes = [];
  }

  function adjustEnvelopes(envelopes_) {
    if (!ready) return
    for (let env of envelopes_) {
      Object.assign(synthChannels[env.channel].synth.envelope, $setEnvelope(env)); // set envelope in tone js
      Object.assign(synthChannels[env.channel], {attack: env.attack, decay: env.decay, sustain: env.sustain, release: env.release}); // set envelope in synth params
      synthChannels[env.channel].code = $composeSynthCode(synthChannels[env.channel]);
      synthChannels[env.channel].active = true;
      setTimeout(() => { synthChannels[env.channel].active = false }, 300);
    }
    $envelopes = [];
  }

  onMount(() => {
		startSynth();
    ready = true;
	});

  // // Tone.start();
  // Tone.Transport.start();

  function startSynth() {

    // SET SYNTHS
    for (let i = 0; i < $synthDefaults.length; i++) {
      synthChannels[i] = { channel: i, active: false, unmuted: 1, ...$synthDefaults[i] }

      const opts = {
        oscillator:  { type: $waveCodes[synthChannels[i].type] },
        modulation: { type: $waveCodes[synthChannels[i].modulation] },
        envelope : $setEnvelope(synthChannels[i])
      }

      if ( $synthDefaults[i].harmonicity !== undefined ) opts.harmonicity = $synthDefaults[i].harmonicity;
      if ( $synthDefaults[i].modulationIndex !== undefined ) opts.modulationIndex = $synthDefaults[i].modulationIndex;
      if ( $synthDefaults[i].volume !== undefined ) opts.volume = $synthDefaults[i].volume;
      if ( $synthDefaults[i].octaves !== undefined ) opts.octaves = $synthDefaults[i].octaves;

      synthChannels[i].code = $composeSynthCode(synthChannels[i]); // shorthand code of the synth params

      synthChannels[i].synth = $synthModels[synthChannels[i].model](opts)
      synthChannels[i].synth.connect($effectsChain[0].effect);
    }
  }

  function envChange(s) {
    $envelopes = [...$envelopes, s];
  }
</script>

<div class="container-synths">
  <!-- <span>SYNTH</span> -->
  {#each synthChannels as s, i}
    <div class="container-cells {i % 2 ? "hrow" : "not-hrow"} {s.active ? "active" : ""}">
      <span class='cell'>{s.code}</span>
      <Cell bind:value={s.attack} callback={() => {envChange(s)}} options={$validHex}/>
      <Cell bind:value={s.decay} callback={() => {envChange(s)}} options={$validHex}/>
      <Cell bind:value={s.sustain} callback={() => {envChange(s)}} options={$validHex}/>
      <Cell bind:value={s.release} callback={() => {envChange(s)}} options={$validHex}/>
      <Cell bind:value={s.unmuted} options={["0","1"]}/>
    </div>
  {/each}
</div>