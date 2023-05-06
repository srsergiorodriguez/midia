<script>
  import * as Tone from 'tone';
  import { onMount } from 'svelte';
  import { composeSamplerCode, effectsChain } from '../stores/helpers';
  import { samples } from '../stores/msgs';
  import Cell from './Cell.svelte';

  let samplePaths = [];
  let ready = false;
  const samplerChannels = [];
  const samplerNr = 16;

  $: { playSamples($samples) }

  function playSamples(samples_) {
    if (!ready) return
    for (let sample of samples_) {
      if (samplerChannels[sample.channel].unmuted === 0 || sample.velocity === 0) continue
      samplerChannels[sample.channel].sampler.triggerAttackRelease(["C3"], sample.length, "+0", sample.velocity);
      samplerChannels[sample.channel].code = $composeSamplerCode(samplerChannels[sample.channel]);
      samplerChannels[sample.channel].active = true;
      setTimeout(() => { samplerChannels[sample.channel].active = false }, sample.length * 1000);
    }
    $samples = [];
  }

  onMount(async () => {
    samplePaths = await loadSamples();
    await startSamplers(samplePaths);
    ready = true;
	});

  async function loadSamples() {
    const importGlob = Object.values(import.meta.glob('@/assets/samples/sk5/*.wav', { import: 'default', eager: true }));
    const paths = [];
    for (let mod of importGlob) {
      const url = (await mod()).default;
      paths.push(url);
    }
    return paths
  }

  async function startSamplers(samplePaths) {
    for (let i = 0; i < samplerNr; i++) {
      const name = samplePaths[i].split("/").reduce((a, c) => c).split(".")[0].substring(0, 5).padEnd(5, '.').toUpperCase();

      const samplerPromise = new Promise((r, e) => {
        const samplerObj = {
          channel: i, velocity: 0.5, length: 1, start: 0, end: 15, active: false, unmuted: 1,
          name,
          sampler: new Tone.Sampler({
            urls: { C3: samplePaths[i] },
            onload: () => {
              r(samplerObj);
            }
          })
        }
      })

      samplerChannels[i] = await samplerPromise;
      samplerChannels[i].code = $composeSamplerCode(samplerChannels[i]);

      samplerChannels[i].sampler.connect($effectsChain[0].effect);
    }
  }
</script>

<div class="container-samples">
  <!-- <span>SAMPLER</span> -->
  {#each samplerChannels as s, i}
    <div class="container-cells {i % 2 ? "hrow" : "not-hrow"} {s.active ? "active" : ""}">
      <span class='cell'>{s.code}</span>
      <Cell bind:value={s.unmuted} options={["0","1"]}/>
    </div>
  {/each}
</div>