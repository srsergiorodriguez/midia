<script>
  import Sampler from './components/Sampler.svelte';
  import Synth from './components/Synth.svelte';
  import Effects from './components/Effects.svelte';
  import StatusBar from './components/StatusBar.svelte';

  let colormode = "light";
  // let colormode = "dark";

</script>

<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Mono&display=swap');
  </style>
</svelte:head>

<main class="{colormode}">
  <div class="general">
    <div class="container-modules">
      <Sampler />
      <Synth />
      <Effects />
    </div>
    <StatusBar />
  </div>
</main>

<style>
  
  :global(:root){
    font-family: 'Red Hat Mono', monospace;
  }

  .light {
    --stroke: black;
    --fill: white;
    --underline: rgb(3, 182, 54);
    --active: rgb(0, 183, 255);
  }

  .dark {
    --stroke: white;
    --fill: black;
    --underline: rgb(177, 66, 194);
    --active: rgb(226, 42, 91);
  }

  :global(button,input,select){
    font-family: 'Red Hat Mono', monospace;
  }

  :global(*) {
    box-sizing: border-box;
    background: var(--fill);
    color: var(--stroke);
  }

  :global(body) {
    margin: 0px;
  }

  :global(.container-cells) {
    display: flex;
  }

  :global(.cell:focus) {
    outline: solid 1px var(--stroke);
    /* background: red; */
  }

  :global(.cell) {
    background: none;
    margin: 0px;
    padding: 2px;
    user-select: none;
    border-bottom: 1px var(--underline) solid;
  }

  :global(.active) {
    background: var(--active);
  }

  :global(.hrow) {
    /* background: var(--highlight); */
  }

  .general {
    display: grid;
    grid-template-rows: 1fr 50px;
    height: 100vh;
  }

  .container-modules {
    display: flex;
    gap: 10px;
    padding: 10px;
  }
</style>
