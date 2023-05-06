<script>
  import Midi from './Midi.svelte';
  import Udp from './Udp.svelte';
</script>

<div class=container>
  <Udp />
  <Midi />
</div>

<style>
  .container {
    padding: 0.5em;
    border: solid 1px var(--underline);
    display: flex;
    justify-content: space-around;
    gap: 0.5em;
  }
</style>