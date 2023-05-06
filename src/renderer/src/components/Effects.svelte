<script>
  import { onMount } from 'svelte';
  import { effectsChain, effectsLookup, validHex } from '../stores/helpers';
  import { effects } from '../stores/msgs';
  import Cell from './Cell.svelte';

  let ready = false;
  const effectCodes = [];

  $: { adjustEffects($effects) }

  function adjustEffects(effects_) {
    if (!ready) return
    for (let e of effects_) {
      const { name, w, v } = e;
      const i = $effectsLookup[name.toLowerCase()];
      $effectsChain[i].set(v, w);
      effectCodes[i] = {...effectCodes[i], code: $effectsChain[i].code, active: true, v, w};
      setTimeout(() => { effectCodes[i].active = false }, 300 );
    }
    $effects = [];
  }

  onMount(() => {
		startEffects();
    ready = true;
	});

  function startEffects() {

    // SET EFFECTS
    for (let i = 1; i < $effectsChain.length; i++ ) {
      $effectsChain[i - 1].effect.connect($effectsChain[i].effect);
    }
    $effectsChain[$effectsChain.length - 1].effect.toDestination();

    for (let i = 0; i < $effectsChain.length; i++ ) {
      effectCodes[i] = {code: $effectsChain[i].code, name: $effectsChain[i].name, v: $effectsChain[i].v, w: $effectsChain[i].w, active: false, type: "effect" };
    }
  }

  function effectChange(e) {
    $effects = [...$effects, e]
  }
</script>

<div class="container-effects">
  <!-- <span>EFFECTS</span> -->
  {#each effectCodes as e, i}
    <div class="container-cells {i % 2 ? "hrow" : "not-hrow"} {e.active ? "active" : ""}">
      <span class='cell'>{e.code}</span>
      <Cell bind:value={e.w} callback={() => {effectChange(e)}} options={$validHex}/>
      <Cell bind:value={e.v} callback={() => {effectChange(e)}} options={$validHex}/>
    </div>
  {/each}
</div>