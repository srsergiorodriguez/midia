<script>
  import { WebMidi, Note} from 'webmidi';

  let inputs = [];
  let outputs = [];
  let ch;

  startMidi();

  async function startMidi() {
    await WebMidi.enable();
    refreshMidi();
  }

  function refreshMidi() {
    inputs = WebMidi.inputs;
    outputs = WebMidi.outputs;
    setMidi();
  }

  function setMidi() {
    if (inputs.length > 0) {
      inputs[0].addListener('noteon', 0, e => {
        console.log(e);
      });
    }

    const output = outputs[0];
    
    // ch = output.channels[1];
    
  }

  function sendNote() {
    if (ch === undefined) return
    const note = new Note("C3", {duration: 200});
    console.log(note);
    ch.playNote(note);
  }

  // WebMidi.enable(function (err) {
  //   if (err) { console.log("WebMidi could not be enabled.", err) }
  //   console.log(WebMidi.inputs);
  //   // console.log(WebMidi.outputs);
  //   // let input = WebMidi.getInputByName(inputName);

  //   // for (let index = 0; index < instruments; index++) {
  //   //   input.addListener('noteon', index+1,
  //   //     function (e) {
  //   //       colorControl[index] = e.data[1]%12;
  //   //       //console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
  //   //       //console.log(e.velocity, e.data);
  //   //     }
  //   //   );

  //   //   input.addListener('controlchange', index+1,
        
  //   //     function (e) {
  //   //       if (e.controller.number === 0) {
  //   //         sizeControl[index] = e.value;
  //   //       }
  //   //       if (e.controller.number === 1) {
  //   //         rotationControl[index] = e.value;
  //   //       }
  //   //       if (e.controller.number === 2) {
  //   //         positionXControl[index] = e.value;
  //   //       }
  //   //       if (e.controller.number === 3) {
  //   //         positionYControl[index] = e.value;
  //   //       }
  //   //       if (e.controller.number === 4) {
  //   //         stepControl[index] = ceil(e.value/8)%(res*res);
  //   //         p.html(stepControl[index]);
  //   //       }
  //   //     }
  //   //   );
  //   // }
  // });

</script>
<div class="container">
  <button on:click={refreshMidi}>Refresh</button>
  <button on:click={sendNote}>Send Note</button>
  MIDI
</div>

<style>
  .container {
    border: solid 1px var(--underline);
  }
</style>