<script>
  import { udpParser } from '../stores/parsers';
  import { notes, envelopes, effects, samples } from '../stores/msgs';

  let msg = '';
  window.api.onUdpReceive(formatMessage);

  // console.log($udpParser("0sam45;43dff;lim0e"));

  function formatMessage(m) {
    const parsed = $udpParser(m);
    if (parsed.isError) return
    
    const newNotes = [];
    const newEnvelopes = [];
    const newEffects = [];
    const newSamples = [];
    for (let p of parsed.result) {
      if (p.type === 'note') { newNotes.push(p) }
      if (p.type === 'envelope') { newEnvelopes.push(p) }
      if (p.type === 'effect') { newEffects.push(p) }
      if (p.type === 'sample') { newSamples.push(p) }
      msg = m;
    }
    $notes = [...$notes, ...newNotes];
    $envelopes = [...$envelopes, ...newEnvelopes];
    $effects = [...$effects, ...newEffects];
    $samples = [...$samples, ...newSamples];
  }
</script>
<div class="container">
  UDP: {msg}
</div>

<style>
  .container {
    border: solid 1px var(--underline);
  }
</style>